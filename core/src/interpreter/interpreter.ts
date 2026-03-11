import { config } from "../loader.js";
import * as AST from "../ast/nodes.js";
import { TokenType } from "../lexer/token.js";

export type ExecutionResult = {
    output: any[];
    environment: Map<string, RuntimeVariable>;
}

class BreakSignal {}
class ContinueSignal {}

export type RuntimeIO = {
    write: (value: string) => void;                 // stream output immediately
    read: (prompt?: string) => Promise<string>;     // request user input (pauses program)
};

type RuntimeVariable = {
    value: any;
    declaredType?: AST.PseudoType;
    initialized: boolean;
    isConstant: boolean;
};


// Interpreter Class - executes the AST
export class Interpreter {
    private environment: Map<string, RuntimeVariable> = new Map();
    private io: RuntimeIO;

    constructor(io: RuntimeIO) {
        this.io = io;
    }

    async run(program: AST.ProgramNode): Promise<ExecutionResult> {
        this.environment.clear();
        for (const statement of program.body) {
            await this.executeStatement(statement);
        }
        return { output: [], environment: this.environment };
    }

    private async executeStatement(node: AST.StatementNode): Promise<void> {
        switch (node.type) {
            case "Program":
                for (const stmt of node.body) {
                    await this.executeStatement(stmt);
                }
                break;
            case "VariableDeclaration":
                await this.executeDeclaration(node);
                break;
            case "VariableAssignment":
                await this.executeAssignment(node);
                break;
            case "ExpressionStatement":
                await this.evaluateExpression(node.expression);
                break;
            case "UpdateStatement":
                await this.executeUpdateStatement(node);
                break;
            case "Print":
                await this.executePrint(node);
                break;
            case "InputStatement":
                await this.evaluateExpression(node.input);
                break;
            case "If":
                await this.executeIf(node);
                break;
            case "Switch":
                await this.executeSwitch(node);
                break;
            case "For":
                await this.executeFor(node);
                break;
            case "While":
                await this.executeWhile(node);
                break;
            case "DoWhile":
                await this.executeDoWhile(node);
                break;
            case "DoUntil":
                await this.executeDoUntil(node);
                break;
            case "Pass":
                // Do nothing
                break;
            case "Break":
                throw new BreakSignal();
            case "Continue":
                throw new ContinueSignal();
            default:
                throw new Error(`Runtime Error: Unknown statement type: ${(node as any).type}`);
        }
    }

    private coerceToType(value: any, declaredType: AST.PseudoType | undefined, variableName: string): any {
        if (!declaredType) return value;

        // Array types
        if (typeof declaredType === "object" && declaredType.type === "array") {
            if (!Array.isArray(value)) {
                throw new Error(`Type Error: Cannot assign non-array value '${value}' to array variable '${variableName}'`);
            }

            // Untyped array: accept as-is
            if (!declaredType.elementType) {
                return value;
            }

            // Typed array: coerce every element
            return value.map((element, index) =>
                this.coerceToType(element, declaredType.elementType, `${variableName}[${index}]`)
            );
        }

        // Scalar types
        switch (declaredType) {
            case "int": {
                if (typeof value === "number" && Number.isInteger(value)) return value;

                if (typeof value === "string" && /^-?\d+$/.test(value.trim())) {
                    return parseInt(value.trim(), 10);
                }

                throw new Error(`Type Error: Cannot assign value '${value}' to int variable '${variableName}'`);
            }

            case "float": {
                if (typeof value === "number") return value;

                if (typeof value === "string") {
                    const trimmed = value.trim();

                    if (trimmed.length === 0) {
                        throw new Error(`Type Error: Cannot assign empty string to float variable '${variableName}'`);
                    }

                    const num = Number(trimmed);

                    if (!Number.isNaN(num)) {
                        return num;
                    }
                }

                throw new Error(`Type Error: Cannot assign value '${value}' to float variable '${variableName}'`);
            }

            case "char": {
                if (typeof value === "string" && value.length === 1) return value;
                throw new Error(`Type Error: Cannot assign value '${value}' to char variable '${variableName}'`);
            }

            case "string":
                return String(value);

            case "bool": {
                if (typeof value === "boolean") return value;

                if (typeof value === "string") {
                    const lower = value.trim().toLowerCase();
                    if (lower === "true") return true;
                    if (lower === "false") return false;
                }

                throw new Error(`Type Error: Cannot assign value '${value}' to bool variable '${variableName}'`);
            }

            default:
                return value;
        }
    }

    private expressionContainsFSuffix(expr: AST.ExpressionNode): boolean {
        switch (expr.type) {
            case "Number":
                return expr.hasFSuffix === true;

            case "UnaryExpression":
                return this.expressionContainsFSuffix(expr.operand);

            case "BinaryExpression":
                return (this.expressionContainsFSuffix(expr.left) || this.expressionContainsFSuffix(expr.right));

            case "IndexExpression":
                return (this.expressionContainsFSuffix(expr.object) || this.expressionContainsFSuffix(expr.index));

            // case "FunctionCall":
            //     return expr.args.some(arg => this.expressionContainsFSuffix(arg));

            case "UpdateExpression":
                return this.expressionContainsFSuffix(expr.argument);

            default:
                return false;
        }
    }

    private assertValidFSuffix(expr: AST.ExpressionNode, declaredType: AST.PseudoType | undefined, variableName: string): void {
        if (!this.expressionContainsFSuffix(expr)) {
            return;
        }

        if (declaredType !== undefined && declaredType !== config.floatSyntax) {
            throw new Error(
                `Type Error: Cannot assign float-suffixed literal to ${declaredType} variable '${variableName}'`
            );
        }
    }

    private async executeDeclaration(node: AST.VariableDeclarationNode) {
        if (this.environment.has(node.name)) {
            throw new Error(`Runtime Error: Variable '${node.name}' is already declared`);
        }
        if (node.name.toLowerCase() === "pi") {
            throw new Error("Runtime Error: Cannot declare variable 'pi' because it is a reserved constant");
        }

        if (node.initializer) {
            this.assertValidFSuffix(node.initializer, node.declaredType, node.name);

            const rawValue = await this.evaluateExpression(node.initializer);
            const coercedValue = this.coerceToType(rawValue, node.declaredType, node.name);

            this.environment.set(node.name, {
                value: coercedValue,
                declaredType: node.declaredType,
                initialized: true,
                isConstant: node.isConstant
            });
        }
        else {
            this.assertValidFSuffix(node.initializer!, node.declaredType, node.name);

            this.environment.set(node.name, {
                value: undefined,
                declaredType: node.declaredType,
                initialized: false,
                isConstant: node.isConstant
            });
        }
    }

    private async executeAssignment(node: AST.VariableAssignmentNode) {
        const rawValue = await this.evaluateExpression(node.value);

        // Identifier assignment
        if (node.target.type === "Identifier") {
            const name = node.target.name;

            if (name.toLowerCase() === "pi") {
                throw new Error("Runtime Error: Cannot assign to reserved constant 'pi'");
            }

            const existing = this.environment.get(name);

            if (existing) {
                if (existing.isConstant) {
                    throw new Error(`Runtime Error: Cannot reassign constant '${name}'`);
                }

                this.assertValidFSuffix(node.value, existing.declaredType, name);

                const coercedValue = this.coerceToType(rawValue, existing.declaredType, name);

                this.environment.set(name, {
                    value: coercedValue,
                    declaredType: existing.declaredType,
                    initialized: true,
                    isConstant: existing.isConstant
                });

                return;
            }

            this.assertValidFSuffix(node.value, undefined, name);

            // Implicit variable creation
            this.environment.set(name, {
                value: rawValue,
                initialized: true,
                isConstant: false
            });

            return;
        }

        // Indexed assignment: nums[2] = 4
        if (node.target.type === "IndexExpression") {
            if (node.target.object.type !== "Identifier") {
                throw new Error("Runtime Error: Invalid assignment target");
            }

            const arrayName = node.target.object.name;

            if (arrayName.toLowerCase() === "pi") {
                throw new Error("Runtime Error: Cannot assign to reserved constant 'pi'");
            }

            const variable = this.environment.get(arrayName);

            if (!variable) {
                throw new Error(`Runtime Error: Variable '${arrayName}' is not defined`);
            }

            if (variable.isConstant) {
                throw new Error(`Runtime Error: Cannot modify constant '${arrayName}'`);
            }

            if (!variable.initialized) {
                throw new Error(`Runtime Error: Variable '${arrayName}' has been declared but not initialised`);
            }

            if (!Array.isArray(variable.value)) {
                throw new Error(`Runtime Error: Variable '${arrayName}' is not an array`);
            }

            const indexRaw = await this.evaluateExpression(node.target.index);
            const arr = variable.value;
            const resolvedIndex = this.normalizeIndexedAccess(indexRaw, arr.length, "Array index");

            if (resolvedIndex < 0 || resolvedIndex >= arr.length) {
                throw new Error("Runtime Error: Array index out of range");
            }

            let valueToStore = rawValue;

            // Enforce typed-array element types
            if (variable.declaredType && typeof variable.declaredType === "object" && variable.declaredType.type === "array" &&variable.declaredType.elementType) {
                this.assertValidFSuffix(node.value, variable.declaredType.elementType, `${arrayName}[${resolvedIndex}]`);
                valueToStore = this.coerceToType(
                    rawValue,
                    variable.declaredType.elementType,
                    `${arrayName}[${resolvedIndex}]`
                );
            }

            arr[resolvedIndex] = valueToStore;
            return;
        }

        throw new Error("Runtime Error: Invalid assignment target");
    }

    private async executeUpdateStatement(node: AST.UpdateStatementNode) {
        const name = node.argument.name;

        if (!this.environment.has(name)) {
            throw new Error(`Runtime Error: Variable '${name}' is not defined`);
        }

        const currentVar = this.environment.get(name)!;

        if (currentVar.isConstant) {
            throw new Error(`Runtime Error: Cannot update constant '${name}'`);
        }

        const currentValue = currentVar.value;

        if (!Number.isInteger(currentValue)) {
            throw new Error(`Runtime Error: '${node.operator === TokenType.DOUBLE_PLUS ? "++" : "--"}' can only be used on integers, but '${name}' is ${typeof currentValue}`);
        }

        const newValue = node.operator === TokenType.DOUBLE_PLUS ? currentValue + 1 : currentValue - 1;

        this.environment.set(name, {
            value: newValue,
            declaredType: currentVar.declaredType,
            initialized: true,
            isConstant: currentVar.isConstant
        });
    }

    private stringifyValue(value: any, insideArray: boolean = false): string {
        if (Array.isArray(value)) {
            return "[" + value.map(v => this.stringifyValue(v, true)).join(", ") + "]";
        }
        if (typeof value === "string") {
            return insideArray ? `"${value}"` : value;
        }
        return String(value);
    }

    private async executePrint(node: AST.PrintNode) {
        const values = [];
        for (const arg of node.args) {
            values.push(this.stringifyValue(await this.evaluateExpression(arg)));
        }

        const out = values.join(" ");
        console.log(out);
        this.io.write(out);
    }

    private async executeIf(node: AST.IfNode) {
        const condition = await this.evaluateExpression(node.condition);

        if (condition) {
            for (const stmt of node.thenBody) {
                await this.executeStatement(stmt);
            }
        } else if (node.elseBody) {
            for (const stmt of node.elseBody) {
                await this.executeStatement(stmt);
            }
        }
    }

    private async executeSwitch(node: AST.SwitchNode) {
        const switchValue = await this.evaluateExpression(node.expression);
        let caseMatched = false;

        try {
            for (const caseNode of node.cases) {
                const caseValue = await this.evaluateExpression(caseNode.caseExpression);

                if (switchValue === caseValue || caseMatched) {
                    caseMatched = true;
                    for (const stmt of caseNode.body) {
                        await this.executeStatement(stmt);
                    }
                    if (!config.switchFallthrough)
                    return;
                }
            }

            if (node.defaultBody && (!caseMatched || config.switchFallthrough)) {
                for (const stmt of node.defaultBody) {
                    await this.executeStatement(stmt);
                }
            }
        } catch (e) {
            if (e instanceof BreakSignal) {
                // Exit switch on break
                return;
            }
            else {
                throw e;
            }
        }
    }

    private async executeFor(node: AST.ForNode) {
        // NEW: range-based for (Python-style)
        if (node.range) {
            const variable = node.range.variable;

            if (this.environment.has(variable) && this.environment.get(variable)!.isConstant) {
                throw new Error(`Runtime Error: Cannot use constant '${variable}' as a for-loop variable`);
            }

            let start = await this.evaluateExpression(node.range.start);
            const end = await this.evaluateExpression(node.range.end);
            const step = await this.evaluateExpression(node.range.step);

            if (typeof start !== "number" || typeof end !== "number" || typeof step !== "number") {
                throw new Error("Type Error: for-range start/end/step must be numbers");
            }
            if (step === 0) {
                throw new Error("Math Error: for-range step cannot be 0");
            }

            // Adjust start if start is EXCLUSIVE (move one step in the step direction)
            if (!node.range.startInclusive) {
                start = start + (step > 0 ? 1 : -1);
            }

            // Set initial loop variable
            this.environment.set(variable, {
                value: start,
                declaredType: "int",
                initialized: true,
                isConstant: false
            });

            const withinBounds = (i: number) => {
                if (step > 0) {
                    return node.range!.endInclusive ? i <= end : i < end;
                } else {
                    return node.range!.endInclusive ? i >= end : i > end;
                }
            };

            let iter = 0;

            while (withinBounds(this.environment.get(variable)!.value)) {
                try {
                    for (const stmt of node.body) {
                        await this.executeStatement(stmt);
                    }
                } catch (e) {
                    if (e instanceof ContinueSignal) {
                    }
                    else if (e instanceof BreakSignal) {
                        break;
                    }
                    else {
                        throw e;
                    }
                }

                // i = i + step
                const current = this.environment.get(variable)!.value;
                this.environment.set(variable, {
                    value: current + step,
                    declaredType: "int",
                    initialized: true,
                    isConstant: false 
                });

                iter++;
                if (iter % 200 === 0) {
                    await this.yieldToBrowser();
                }
            }

            return;
        }

        // Existing C-style for loop
        if (node.initializer) {
            await this.executeStatement(node.initializer);
        }

        let iter = 0;

        while (!node.condition || await this.evaluateExpression(node.condition)) {
            try {
                for (const stmt of node.body) {
                    await this.executeStatement(stmt);
                }
            } catch (e) {
                if (e instanceof ContinueSignal) {
                }
                else if (e instanceof BreakSignal) {
                    break;
                }
                else {
                    throw e;
                }
            }

            if (node.update) {
                await this.executeStatement(node.update);
            }

            iter++;
            if (iter % 200 === 0) {
                await this.yieldToBrowser();
            }       
        }
    }

    private async executeWhile(node: AST.WhileNode) {
        let iter = 0;
        while (await this.evaluateExpression(node.condition)) {
            try {
                for (const stmt of node.body) {
                    await this.executeStatement(stmt);
                }
            } catch (e) {
                if (e instanceof ContinueSignal) {
                }
                else if (e instanceof BreakSignal) {
                    break;
                }
                else {
                    throw e;
                }
            }

            iter++;
            if (iter % 200 === 0) {
                await this.yieldToBrowser();
            }
        }
    }

    private async executeDoWhile(node: AST.DoWhileNode) {
        let iter = 0;
        while (true) {
            try {
                for (const stmt of node.body) {
                    await this.executeStatement(stmt);
                }
            } catch (e) {
                if (e instanceof ContinueSignal) {
                } else if (e instanceof BreakSignal) {
                    break;
                } else {
                    throw e;
                }
            }

            if (!(await this.evaluateExpression(node.condition))) {
                break;
            }

            iter++;
            if (iter % 200 === 0) {
                await this.yieldToBrowser();
            }
        }
    }

    private async executeDoUntil(node: AST.DoUntilNode) {
        let iter = 0;
        while (true) {
            try {
                for (const stmt of node.body) {
                    await this.executeStatement(stmt);
                }
            } catch (e) {
                if (e instanceof ContinueSignal) {
                }
                else if (e instanceof BreakSignal) {
                    break;
                }
                else {
                    throw e;
                }
            }

            // stop when condition becomes true
            if (await this.evaluateExpression(node.condition)) break;

            iter++;
            if (iter % 200 === 0) {
                await this.yieldToBrowser();
            }
        }
    }

    private async yieldToBrowser() {
        await new Promise<void>(resolve => setTimeout(resolve, 0));
    }

    private requireInteger(value: any, context: string): number {
        if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value)) {
            throw new Error(`Runtime Error: ${context} must be an integer`);
        }
        return value;
    }

    private isTruthy(value: any): boolean {
        return !!value;
    }

    private sliceSequence<T extends string | any[]>(seq: T, startVal: any, endVal: any, step: number): T {
        const len = seq.length;

        const toIntOrUndef = (v: any, label: string): number | undefined => {
            if (v === undefined) return undefined;
            return this.requireInteger(v, label);
        };

        const userProvidedStart = startVal !== undefined;
        const userProvidedEnd = endVal !== undefined;

        let start = toIntOrUndef(startVal, "Slice start");
        let end = toIntOrUndef(endVal, "Slice end");

        // Defaults are INTERNAL indices, so they must not be base-adjusted later
        if (step > 0) {
            if (start === undefined) start = 0;
            if (end === undefined) end = len;
        } else {
            if (start === undefined) start = len - 1;
            if (end === undefined) end = -1; // reverse sentinel
        }

        const toInternalUserSliceIndex = (value: number, isEnd: boolean, isNegativeStep: boolean): number => {
            // Negative indices always mean from the end
            if (value < 0) {
                // Preserve reverse-slice sentinel
                if (isNegativeStep && isEnd && value === -1) {
                    return -1;
                }
                return len + value;
            }

            // Non-negative user-provided bounds respect configured base
            if (config.arrayBase === 1) {
                return value - 1;
            }

            return value;
        };

        if (step > 0) {
            if (userProvidedStart) {
                start = toInternalUserSliceIndex(start, false, false);
            }
            if (userProvidedEnd) {
                end = toInternalUserSliceIndex(end, true, false);
            }

            // Clamp into [0, len]
            start = Math.max(0, Math.min(len, start));
            end = Math.max(0, Math.min(len, end));

            if (typeof seq === "string") {
                let out = "";
                for (let i = start; i < end; i += step) {
                    out += (seq as string)[i] ?? "";
                }
                return out as T;
            } else {
                const out: any[] = [];
                for (let i = start; i < end; i += step) {
                    if (i >= 0 && i < len) out.push((seq as any[])[i]);
                }
                return out as T;
            }
        } else {
            if (userProvidedStart) {
                start = toInternalUserSliceIndex(start, false, true);
            }
            if (userProvidedEnd) {
                end = toInternalUserSliceIndex(end, true, true);
            }

            // Clamp into [-1, len - 1]
            if (start >= len) start = len - 1;
            if (start < -1) start = -1;

            if (end >= len) end = len - 1;
            if (end < -1) end = -1;

            if (typeof seq === "string") {
                let out = "";
                for (let i = start; i > end; i += step) {
                    if (i >= 0 && i < len) out += (seq as string)[i];
                }
                return out as T;
            } else {
                const out: any[] = [];
                for (let i = start; i > end; i += step) {
                    if (i >= 0 && i < len) out.push((seq as any[])[i]);
                }
                return out as T;
            }
        }
    }

    private async evaluateExpression(node: AST.ExpressionNode): Promise<any> {
        switch (node.type) {
            case "Input": {
                let prompt: string | undefined;

                if (node.prompt) {
                    prompt = String(await this.evaluateExpression(node.prompt));
                }

                return await this.io.read(prompt);
            }
            case "Number":
                return node.value;
            case "String":
                return node.value;
            case "Boolean":
                return node.value;
            case "ArrayLiteral":
                return await Promise.all(node.elements.map(element => this.evaluateExpression(element)));
            case "Identifier":
                if (node.name.toLowerCase() === "pi") {
                    return Math.PI;
                }
                if (!this.environment.has(node.name)) {
                    throw new Error(`Runtime Error: Variable '${node.name}' is not defined`);
                }

                const variable = this.environment.get(node.name)!;
                if (!variable.initialized) {
                    throw new Error(`Runtime Error: Variable '${node.name}' has been declared but not initialised`);
                }
                return variable.value;
            case "UnaryExpression":
                return this.evaluateUnaryExpression(node);
            case "BinaryExpression":
                return this.evaluateBinaryExpression(node);
            case "IndexExpression":
                return await this.evaluateIndexExpression(node);
            case "SliceExpression":
                return await this.evaluateSliceExpression(node);
            case "UpdateExpression":
                return await this.evaluateUpdateExpression(node);
            case "CallExpression":
                return await this.evaluateCallExpression(node);
            case "MemberExpression":
                return await this.evaluateMemberExpression(node);
            default:
                throw new Error(`Runtime Error: Unknown expression type: ${(node as any).type}`);
        }
    }

    private async evaluateUnaryExpression(node: AST.UnaryExpressionNode): Promise<any> {
        const operand = await this.evaluateExpression(node.operand);

        switch (node.operator) {
            case "MINUS":
                return -operand;
            case "PLUS":
                return +operand;
            case "NOT":
                return !this.isTruthy(operand);
            default:
                throw new Error(`Runtime Error: Unknown unary operator: ${node.operator}`);
        }
    };

    private async evaluateBinaryExpression(node: AST.BinaryExpressionNode): Promise<any> {
        if (node.operator === "AND") {
            const left = await this.evaluateExpression(node.left);
            if (!this.isTruthy(left)) {
                return false;
            }
            const right = await this.evaluateExpression(node.right);
            return this.isTruthy(right);
        }

        if (node.operator === "OR") {
            const left = await this.evaluateExpression(node.left);
            if (this.isTruthy(left)) {
                return true;
            }
            const right = await this.evaluateExpression(node.right);
            return this.isTruthy(right);
        }

        const left = await this.evaluateExpression(node.left);
        const right = await this.evaluateExpression(node.right);
        switch (node.operator) {
            case "PLUS":
                return left + right;
            case "MINUS":
                return left - right;
            case "TIMES":
            case "STAR":
                return left * right;
            case "DIVIDE":
            case "SLASH":
                if (right === 0) {
                    throw new Error("Math Error: Division by zero");
                }
                return left / right;
            case "PERCENT":
            case "MOD":
                if (right === 0) {
                    throw new Error("Math Error: Modulo by zero");
                }
                return left % right;
            case "CARET":
            case "DOUBLE_STAR":
                return left ** right;
            case "DOUBLE_SLASH":
            case "DIV":
                if (right === 0) {
                    throw new Error("Math Error: Division by zero");
                }
                return Math.floor(left / right);

            case "DOUBLE_EQUALS":
            case "EQUALS":
                return left === right;
            case "NOT_EQUALS":
                return left !== right;
            case "LESS":
                return left < right;
            case "LESS_EQUAL":
                return left <= right;
            case "GREATER":
                return left > right;
            case "GREATER_EQUAL":
                return left >= right;

            default:
                throw new Error(`Runtime Error: Unknown binary operator: ${node.operator}`);
        }
    }

    private toInternalIndex(index: number, length: number, context: string): number {
        // Negative indices keep Python-style meaning from the end
        if (index < 0) {
            return length + index;
        }

        // Non-negative indices follow configured base
        return config.arrayBase === 1 ? index - 1 : index;
    }

    private toInternalSliceBoundary(index: number, length: number): number {
        if (index < 0) {
            return length + index;
        }

        return config.arrayBase === 1 ? index - 1 : index;
    }

    private normalizeIndexedAccess(indexRaw: any, length: number, context: string): number {
        const index = this.requireInteger(indexRaw, context);
        const resolved = this.toInternalIndex(index, length, context);

        if (resolved < 0 || resolved >= length) {
            throw new Error(`Runtime Error: ${context} out of range`);
        }

        return resolved;
    }

    private async evaluateIndexExpression(node: AST.IndexExpressionNode): Promise<any> {
        const obj = await this.evaluateExpression(node.object);
        const indexRaw = await this.evaluateExpression(node.index);

        // Strings
        if (typeof obj === "string") {
            const i = this.normalizeIndexedAccess(indexRaw, obj.length, "String Index");
            return obj[i]; // returns a 1-char string
        }

        // Arrays
        if (Array.isArray(obj)) {
            const i = this.normalizeIndexedAccess(indexRaw, obj.length, "Array Index");
            return obj[i];
        }

        throw new Error(`Runtime Error: Cannot index type '${typeof obj}'`);
    }

    private async evaluateSliceExpression(node: AST.SliceExpressionNode): Promise<any> {
        const obj = await this.evaluateExpression(node.object);

        // Evaluate slice parts if present
        const startVal = node.start ? await this.evaluateExpression(node.start) : undefined;
        const endVal = node.end ? await this.evaluateExpression(node.end) : undefined;
        const stepVal = node.step ? await this.evaluateExpression(node.step) : undefined;

        const step = stepVal === undefined ? 1 : this.requireInteger(stepVal, "Slice step");
        if (step === 0) {
            throw new Error("Runtime Error: Slice step cannot be 0");
        }

        // Strings
        if (typeof obj === "string") {
            return this.sliceSequence(obj, startVal, endVal, step);
        }

        // Arrays
        if (Array.isArray(obj)) {
            return this.sliceSequence(obj, startVal, endVal, step);
        }

        throw new Error(`Runtime Error: Cannot slice type '${typeof obj}'`);
    }

    private isNumberValue(value: any): boolean {
        return typeof value === "number" && Number.isFinite(value);
    }

    private getArrayLike(value: any, fnName: string): any[] {
        if (!Array.isArray(value)) {
            throw new Error(`Runtime Error: ${fnName}() argument must be an array`);
        }
        return value;
    }

    private requireNonEmptyArray(array: any[], fnName: string): any[] {
        if (array.length === 0) {
            throw new Error(`Runtime Error: ${fnName}() cannot be used on an empty array`);
        }
        return array;
    }

    private requireAllNumbers(array: any[], fnName: string): number[] {
        if (!array.every(v => this.isNumberValue(v))) {
            throw new Error(`Type Error: ${fnName}() requires an array of numbers`);
        }
        return array as number[];
    }

    private requireAllStrings(array: any[], fnName: string): string[] {
        if (!array.every(v => typeof v === "string")) {
            throw new Error(`Type Error: ${fnName}() requires an array of strings`);
        }
        return array as string[];
    }

    private requireSortableArray(array: any[], fnName: string): any[] {
        const allNumbers = array.every(v => this.isNumberValue(v));
        const allStrings = array.every(v => typeof v === "string");

        if (!allNumbers && !allStrings) {
            throw new Error(`Type Error: ${fnName}() requires an array of only numbers or only strings`);
        }

        return array;
    }

    private compareArrayValues(a: any, b: any, fnName: string): number {
        const aIsNum = this.isNumberValue(a);
        const bIsNum = this.isNumberValue(b);
        const aIsStr = typeof a === "string";
        const bIsStr = typeof b === "string";

        if (aIsNum && bIsNum) {
            return a - b;
        }

        if (aIsStr && bIsStr) {
            return a.localeCompare(b);
        }

        throw new Error(`Type Error: ${fnName}() requires comparable values of the same type`);
    }

    private toUserIndex(internalIndex: number): number {
        return config.arrayBase === 1 ? internalIndex + 1 : internalIndex;
    }

    // Built-in functions that can be called in global form (e.g. substring(str,2,5)) or method form (e.g. str.substring(2,5))
    private async callBuiltin(nameLower: string, receiver: any | undefined, args: AST.ExpressionNode[]): Promise<any> {
        // Evaluate arguments given
        const evaledArgs = await Promise.all(args.map(a => this.evaluateExpression(a)));

        type BuiltinSpec = {
            params: number[];                 // global form parameter count
            allowMember: boolean;                // whether obj.f(...) form is allowed
            displayName: () => string;           // for error messages (uses current config)
            fn: (finalArgs: any[]) => any;       // receives normalized args
        };

        const num = (v: any, label: string): number => {
            if (typeof v !== "number" || !Number.isFinite(v)) {
                throw new Error(`Runtime Error: ${label} must be a finite number`);
            }
            return v;
        };

        // totalParams = how many parameters global form takes
        const builtins: Record<string, BuiltinSpec> = {
            [config.lengthSyntax.toLowerCase()]: {
            params: [1],
            allowMember: true,
            displayName: () => config.lengthSyntax,
            fn: (finalArgs: any[]) => {
                const value = finalArgs[0];
                if (typeof value !== "string" && !Array.isArray(value)) {
                    throw new Error(`Runtime Error: ${config.lengthSyntax}() argument must be a string or array, not a '${typeof value}'`);
                }
                return value.length;
            },
            },

            ["index"]: {
            params: [2],
            allowMember: true,
            displayName: () => "index",
            fn: (finalArgs: any[]) => {
                const value = finalArgs[0];
                const index = finalArgs[1];
                if (typeof index !== "number" || !Number.isInteger(index)) {
                    throw new Error(`Runtime Error: index() argument must be an integer, not a '${typeof index}'`);
                }
                if (typeof value === "string") {
                    const i = this.normalizeArrayIndex(index, value.length, "index()", false);
                    return value[i];
                }
                if (Array.isArray(value)) {
                    const i = this.normalizeArrayIndex(index, value.length, "index()", false);
                    return value[i];
                }
                return value[index];
            },
            },

            [config.substringSyntax.toLowerCase()]: {
            params: [3],
            allowMember: true,
            displayName: () => config.substringSyntax,
            fn: (finalArgs: any[]) => {
                const [str, start, end] = finalArgs;

                if (typeof str !== "string") {
                    throw new Error(`Runtime Error: ${config.substringSyntax}() argument must be a string, not a '${typeof str}'`);
                }
                return this.sliceSequence(str, start, end, 1);
            },
            },

            // Maths Builtins
            ["pow"]: {
                params: [2],
                allowMember: false,
                displayName: () => "pow",
                fn: (a) => Math.pow(num(a[0], "pow(a)"), num(a[1], "pow(b)"))
            },
            ["sqrt"]: {
                params: [1],
                allowMember: false,
                displayName: () => "sqrt",
                fn: (a) => {
                    const val = num(a[0], "sqrt()");
                    if (val < 0) {
                        throw new Error("Math Error: sqrt() argument must be non-negative");
                    }
                    return Math.sqrt(val);
                }
            },
            ["max"]: {
                params: [1, 2],
                allowMember: true,
                displayName: () => "max",
                fn: (a) => {
                    // Array/member form: max(arr) or arr.max()
                    if (a.length === 1) {
                        const arr = this.getArrayLike(a[0], "max");
                        this.requireNonEmptyArray(arr, "max");
                        this.requireSortableArray(arr, "max");

                        let best = arr[0];
                        for (let i = 1; i < arr.length; i++) {
                            if (this.compareArrayValues(arr[i], best, "max") > 0) {
                                best = arr[i];
                            }
                        }
                        return best;
                    }

                    // Numeric form: max(a, b)
                    return Math.max(num(a[0], "max(a)"), num(a[1], "max(b)"));
                }
            },
            ["min"]: {
                params: [1, 2],
                allowMember: true,
                displayName: () => "min",
                fn: (a) => {
                    // Array/member form: min(arr) or arr.min()
                    if (a.length === 1) {
                        const arr = this.getArrayLike(a[0], "min");
                        this.requireNonEmptyArray(arr, "min");
                        this.requireSortableArray(arr, "min");

                        let best = arr[0];
                        for (let i = 1; i < arr.length; i++) {
                            if (this.compareArrayValues(arr[i], best, "min") < 0) {
                                best = arr[i];
                            }
                        }
                        return best;
                    }

                    // Numeric form: min(a, b)
                    return Math.min(num(a[0], "min(a)"), num(a[1], "min(b)"));
                }
            },
            ["floor"]: {
                params: [1],
                allowMember: false,
                displayName: () => "floor",
                fn: (a) => Math.floor(num(a[0], "floor()"))
            },
            ["ceil"]: {
                params: [1],
                allowMember: false,
                displayName: () => "ceil",
                fn: (a) => Math.ceil(num(a[0], "ceil()"))
            },
            ["round"]: {
                params: [1, 2], // To be made optional between 1 or 2 params based on config
                allowMember: false,
                displayName: () => "round",
                fn: (a) => {
                    const value = num(a[0], "round(value)");

                    // round(value) -> nearest whole number
                    if (a.length === 1) return Math.round(value);

                    // round(value, precision)
                    const precision = num(a[1], "round(precision)");
                    // optional: require integer precision
                    if (!Number.isInteger(precision)) {
                    throw new Error("Math Error: round() precision argument must be an integer");
                    }

                    const factor = Math.pow(10, precision);
                    return Math.round(value * factor) / factor;
                },
            },
            ["sin"]: {
                params: [1],
                allowMember: false,
                displayName: () => "sin",
                fn: (a) => Math.sin(num(a[0], "sin()"))
            },
            ["cos"]: {
                params: [1],
                allowMember: false,
                displayName: () => "cos",
                fn: (a) => Math.cos(num(a[0], "cos()"))
            },
            ["tan"]: {
                params: [1],
                allowMember: false,
                displayName: () => "tan",
                fn: (a) => { 
                    let angle = num(a[0], "tan()");
                    // Check for angles where tan is undefined (odd multiples of π/2)
                    const halfPi = Math.PI / 2;
                    if (Math.abs(angle % Math.PI) === halfPi) {
                        throw new Error("Math Error: tan() argument is undefined");
                    }
                    return Math.tan(angle);
                }
            },
            ["sec"]: {
                params: [1],
                allowMember: false,
                displayName: () => "sec",
                fn: (a) => 1 / Math.cos(num(a[0], "sec()"))
            },
            ["cosec"]: {
                params: [1],
                allowMember: false,
                displayName: () => "cosec",
                fn: (a) => 1 / Math.sin(num(a[0], "cosec()"))
            },
            ["cot"]: {
                params: [1],
                allowMember: false,
                displayName: () => "cot",
                fn: (a) => 1 / Math.tan(num(a[0], "cot()"))
            },
            ["sinh"]: {
                params: [1],
                allowMember: false,
                displayName: () => "sinh",
                fn: (a) => Math.sinh(num(a[0], "sinh()"))
            },
            ["cosh"]: {
                params: [1],
                allowMember: false,
                displayName: () => "cosh",
                fn: (a) => Math.cosh(num(a[0], "cosh()"))
            },
            ["tanh"]: {
                params: [1],
                allowMember: false,
                displayName: () => "tanh",
                fn: (a) => Math.tanh(num(a[0], "tanh()"))
            },
            ["exp"]: {
                params: [1],
                allowMember: false,
                displayName: () => "exp",
                fn: (a) => Math.exp(num(a[0], "exp()"))
            },
            ["ln"]: {
                params: [1],
                allowMember: false,
                displayName: () => "ln",
                fn: (a) => {
                    const val = num(a[0], "ln()");
                    if (val <= 0) {
                        throw new Error("Math Error: ln() argument must be positive");
                    }
                    return Math.log(val);
                }
            },
            ["log"]: {
                params: [1, 2], // To be made optional between 1 or 2 params based on config
                allowMember: false,
                displayName: () => "log",
                fn: (a) => {
                    const val = num(a[0], "log(value)");
                    if (val <= 0) {
                    throw new Error("Math Error: log() value argument must be positive");
                    }

                    // log(value) -> base 10
                    if (a.length === 1) {
                    // Prefer Math.log10 if available; fallback keeps it safe
                    return (Math as any).log10 ? (Math as any).log10(val) : Math.log(val) / Math.log(10);
                    }

                    // log(value, base)
                    const base = num(a[1], "log(base)");
                    if (base <= 0 || base === 1) {
                    throw new Error("Math Error: log() base argument must be positive and not equal to 1");
                    }

                    return Math.log(val) / Math.log(base);
                }
            },
            ["abs"]: {
                params: [1],
                allowMember: false,
                displayName: () => "abs",
                fn: (a) => Math.abs(num(a[0], "abs()"))
            },
            ["isempty"]: {
                params: [1],
                allowMember: true,
                displayName: () => "isEmpty",
                fn: (a) => {
                    const arr = this.getArrayLike(a[0], "isEmpty");
                    return arr.length === 0;
                }
            },
            ["includes"]: {
                params: [2],
                allowMember: true,
                displayName: () => "includes",
                fn: (a) => {
                    const arr = this.getArrayLike(a[0], "includes");
                    return arr.includes(a[1]);
                }
            },
            ["indexof"]: {
                params: [2],
                allowMember: true,
                displayName: () => "indexOf",
                fn: (a) => {
                    const arr = this.getArrayLike(a[0], "indexOf");
                    const idx = arr.findIndex(v => v === a[1]);
                    return idx === -1 ? -1 : this.toUserIndex(idx);
                }
            },
            ["count"]: {
                params: [2],
                allowMember: true,
                displayName: () => "count",
                fn: (a) => {
                    const arr = this.getArrayLike(a[0], "count");
                    const target = a[1];
                    return arr.reduce((total, v) => total + (v === target ? 1 : 0), 0);
                }
            },
            ["sort"]: {
                params: [1],
                allowMember: true,
                displayName: () => "sort",
                fn: (a) => {
                    const arr = this.getArrayLike(a[0], "sort");
                    this.requireSortableArray(arr, "sort");
                    return [...arr].sort((x, y) => this.compareArrayValues(x, y, "sort"));
                }
            },
            ["reverse"]: {
                params: [1],
                allowMember: true,
                displayName: () => "reverse",
                fn: (a) => {
                    const arr = this.getArrayLike(a[0], "reverse");
                    return [...arr].reverse();
                }
            },
            ["join"]: {
                params: [1, 2],
                allowMember: true,
                displayName: () => "join",
                fn: (a) => {
                    const arr = this.getArrayLike(a[0], "join");
                    const separator = a[1] !== undefined ? String(a[1]) : "";
                    return arr.join(separator);
                }
            },
            ["sum"]: {
                params: [1],
                allowMember: true,
                displayName: () => "sum",
                fn: (a) => {
                    const arr = this.getArrayLike(a[0], "sum");
                    const nums = this.requireAllNumbers(arr, "sum");
                    return nums.reduce((total, v) => total + v, 0);
                }
            },
            ["mean"]: {
                params: [1],
                allowMember: true,
                displayName: () => "mean",
                fn: (a) => {
                    const arr = this.getArrayLike(a[0], "mean");
                    this.requireNonEmptyArray(arr, "mean");
                    const nums = this.requireAllNumbers(arr, "mean");
                    return nums.reduce((total, v) => total + v, 0) / nums.length;
                }
            },
            ["median"]: {
                params: [1],
                allowMember: true,
                displayName: () => "median",
                fn: (a) => {
                    const arr = this.getArrayLike(a[0], "median");
                    this.requireNonEmptyArray(arr, "median");
                    const nums = [...this.requireAllNumbers(arr, "median")].sort((x, y) => x - y);

                    const mid = Math.floor(nums.length / 2);

                    if (nums.length % 2 === 1) {
                        return nums[mid];
                    }

                    return (nums[mid - 1] + nums[mid]) / 2;
                }
            },
            ["mode"]: {
                params: [1],
                allowMember: true,
                displayName: () => "mode",
                fn: (a) => {
                    const arr = this.getArrayLike(a[0], "mode");
                    this.requireNonEmptyArray(arr, "mode");

                    const counts = new Map<any, number>();

                    for (const value of arr) {
                        counts.set(value, (counts.get(value) ?? 0) + 1);
                    }

                    let maxCount = 0;
                    for (const count of counts.values()) {
                        if (count > maxCount) maxCount = count;
                    }

                    const modes: any[] = [];
                    for (const value of arr) {
                        if ((counts.get(value) ?? 0) === maxCount && !modes.includes(value)) {
                            modes.push(value);
                        }
                    }

                    return modes.length === 1 ? modes[0] : modes;
                }
            },
            ["product"]: {
                params: [1],
                allowMember: true,
                displayName: () => "product",
                fn: (a) => {
                    const arr = this.getArrayLike(a[0], "product");
                    const nums = this.requireAllNumbers(arr, "product");
                    return nums.reduce((total, v) => total * v, 1);
                }
            },
        };

        const builtin = builtins[nameLower];
        if (!builtin) {
            throw new Error(`Runtime Error: Unknown function '${nameLower}'`);
        }

        // Total parameters including receiver
        const totalPassed = receiver === undefined
            ? args.length
            : args.length + 1;

        // Validate total parameters
        if (!builtin.params.includes(totalPassed)) {

            const validUserCounts = builtin.params.map(p => receiver === undefined ? p : p - 1);

            const paramList = validUserCounts.join(" or ");

            throw new Error(`Runtime Error: ${nameLower}() takes ${paramList} argument(s) but ${args.length} were given`);
        }

        // Build the internal arg list used by builtin implementations
        const finalArgs = receiver === undefined ? evaledArgs : [receiver, ...evaledArgs];

        return builtin.fn(finalArgs);
    }

    private async evaluateUpdateExpression(node: AST.UpdateExpressionNode): Promise<any> {
        if (node.argument.type !== "Identifier") {
            throw new Error("Runtime Error: Update expressions can only be applied to variables");
        }

        const name = node.argument.name;

        if (name.toLowerCase() === "pi") {
            throw new Error("Runtime Error: Cannot update constant 'pi'");
        }

        if (!this.environment.has(name)) {
            throw new Error(`Runtime Error: Variable '${name}' is not defined`);
        }

        const currentVar = this.environment.get(name)!;

        if (currentVar.isConstant) {
            throw new Error(`Runtime Error: Cannot update constant '${name}'`);
        }

        if (!currentVar.initialized) {
            throw new Error(`Runtime Error: Variable '${name}' has been declared but not initialized`);
        }

        const current = currentVar.value;
        if (typeof current !== "number" || !Number.isFinite(current)) {
            throw new Error(`Runtime Error: Update expressions can only be applied to numbers, but '${name}' is a '${typeof current}'`);
        }

        const delta = node.operator === "DOUBLE_PLUS" ? 1 : -1;
        const newValue = current + delta;

        this.environment.set(name, {
            value: newValue,
            declaredType: currentVar.declaredType,
            initialized: true,
            isConstant: currentVar.isConstant
        });

        return node.prefix ? newValue : current;
    }

    private async evaluateCallExpression(node: AST.CallExpressionNode): Promise<any> {
        // Global call: substring(str,2,5)
        if (node.callee.type === "Identifier") {
            const funcName = node.callee.name.toLowerCase();

            if (["append", "pop", "insert", "remove", "subarray"].includes(funcName)) {
                return await this.callArrayBuiltinGlobal(funcName, node.args);
            }
            return await this.callBuiltin(funcName, undefined, node.args);
        }

        // Method call: str.substring(2,5)
        if (node.callee.type === "MemberExpression") {
            const methodName = node.callee.property.toLowerCase();

            if (["append", "pop", "insert", "remove", "subarray"].includes(methodName)) {
                return await this.callArrayBuiltinMethod(methodName, node.callee.object, node.args);
            }
            const receiver = await this.evaluateExpression(node.callee.object);
            return await this.callBuiltin(methodName, receiver, node.args);
        }

        throw new Error(`Runtime Error: Invalid function call`);
    }

    private callZeroArgMemberBuiltin(nameLower: string, receiver: any): any {
        const getArray = (fnName: string) => {
            if (!Array.isArray(receiver)) {
                throw new Error(`Runtime Error: ${fnName} works on arrays only`);
            }
            return receiver;
        };

        switch (nameLower) {
            case "isempty": {
                const arr = getArray("isEmpty");
                return arr.length === 0;
            }

            case "sort": {
                const arr = getArray("sort");
                this.requireSortableArray(arr, "sort");
                return [...arr].sort((x, y) => this.compareArrayValues(x, y, "sort"));
            }

            case "reverse": {
                const arr = getArray("reverse");
                return [...arr].reverse();
            }

            case "join": {
                const arr = getArray("join");
                const separator = "";
                return arr.join(separator);
            }

            case "sum": {
                const arr = getArray("sum");
                const nums = this.requireAllNumbers(arr, "sum");
                return nums.reduce((total, v) => total + v, 0);
            }

            case "min": {
                const arr = getArray("min");
                this.requireNonEmptyArray(arr, "min");
                this.requireSortableArray(arr, "min");

                let best = arr[0];
                for (let i = 1; i < arr.length; i++) {
                    if (this.compareArrayValues(arr[i], best, "min") < 0) {
                        best = arr[i];
                    }
                }
                return best;
            }

            case "max": {
                const arr = getArray("max");
                this.requireNonEmptyArray(arr, "max");
                this.requireSortableArray(arr, "max");

                let best = arr[0];
                for (let i = 1; i < arr.length; i++) {
                    if (this.compareArrayValues(arr[i], best, "max") > 0) {
                        best = arr[i];
                    }
                }
                return best;
            }

            case "mean": {
                const arr = getArray("mean");
                this.requireNonEmptyArray(arr, "mean");
                const nums = this.requireAllNumbers(arr, "mean");
                return nums.reduce((total, v) => total + v, 0) / nums.length;
            }

            case "median": {
                const arr = getArray("median");
                this.requireNonEmptyArray(arr, "median");
                const nums = [...this.requireAllNumbers(arr, "median")].sort((x, y) => x - y);

                const mid = Math.floor(nums.length / 2);
                return nums.length % 2 === 1
                    ? nums[mid]
                    : (nums[mid - 1] + nums[mid]) / 2;
            }

            case "mode": {
                const arr = getArray("mode");
                this.requireNonEmptyArray(arr, "mode");

                const counts = new Map<any, number>();

                for (const value of arr) {
                    counts.set(value, (counts.get(value) ?? 0) + 1);
                }

                let maxCount = 0;
                for (const count of counts.values()) {
                    if (count > maxCount) maxCount = count;
                }

                const modes: any[] = [];
                for (const value of arr) {
                    if ((counts.get(value) ?? 0) === maxCount && !modes.includes(value)) {
                        modes.push(value);
                    }
                }

                return modes.length === 1 ? modes[0] : modes;
            }

            case "product": {
                const arr = getArray("product");
                const nums = this.requireAllNumbers(arr, "product");
                return nums.reduce((total, v) => total * v, 1);
            }

            default:
                throw new Error(`Runtime Error: Unknown property '${nameLower}'`);
        }
    }

    private async evaluateMemberExpression(node: AST.MemberExpressionNode): Promise<any> {
        const obj = await this.evaluateExpression(node.object);
        const prop = node.property.toLowerCase();

        if (prop === config.lengthSyntax.toLowerCase()) {
            if (typeof obj !== "string" && !Array.isArray(obj)) {
                throw new Error(`Runtime Error: ${config.lengthSyntax} works on strings and arrays only`);
            }
            return obj.length;
        }

        if ([
            "isempty",
            "sort",
            "reverse",
            "join",
            "sum",
            "min",
            "max",
            "mean",
            "median",
            "mode",
            "product"
        ].includes(prop)) {
            return this.callZeroArgMemberBuiltin(prop, obj);
        }

        throw new Error(`Runtime Error: Unknown property '${node.property}'`);
    }


    private getArrayVariable(expr: AST.ExpressionNode, fnName: string): { name: string; variable: RuntimeVariable } {
        if (expr.type !== "Identifier") {
            throw new Error(`Runtime Error: ${fnName}() requires an array variable`);
        }

        const name = expr.name;

        if (!this.environment.has(name)) {
            throw new Error(`Runtime Error: Variable '${name}' is not defined`);
        }

        const variable = this.environment.get(name)!;

        if (!variable.initialized) {
            throw new Error(`Runtime Error: Variable '${name}' has been declared but not initialised`);
        }

        if (!Array.isArray(variable.value)) {
            throw new Error(`Runtime Error: Variable '${name}' is not an array`);
        }

        return { name, variable };
    }

    private requireMutableArrayVariable(expr: AST.ExpressionNode, fnName: string): { name: string; variable: RuntimeVariable; array: any[] } {
        const { name, variable } = this.getArrayVariable(expr, fnName);

        if (variable.isConstant) {
            throw new Error(`Runtime Error: Cannot modify constant '${name}'`);
        }

        return { name, variable, array: variable.value };
    }

    private coerceArrayElementForVariable(variable: RuntimeVariable, value: any, context: string): any {
        if (variable.declaredType && typeof variable.declaredType === "object" && variable.declaredType.type === "array" && variable.declaredType.elementType) {
            return this.coerceToType(value, variable.declaredType.elementType, context);
        }

        return value;
    }

    private normalizeArrayIndex(index: any, length: number, context: string, allowEnd = false): number {
        const i = this.requireInteger(index, context);

        let resolved: number;
        if (i < 0) {
            resolved = length + i;
        } else {
            resolved = config.arrayBase === 1 ? i - 1 : i;
        }

        const upperBound = allowEnd ? length : length - 1;

        if (resolved < 0 || resolved > upperBound) {
            throw new Error(`Runtime Error: ${context} out of range`);
        }

        return resolved;
    }

    private assertArgCount(fnName: string, actual: number, expected: number[]) {
        if (!expected.includes(actual)) {
            const paramList = expected.join(" or ");
            throw new Error(
                `Runtime Error: ${fnName}() takes ${paramList} argument(s) but ${actual} were given`
            );
        }
    }

    private async callArrayBuiltinGlobal(nameLower: string, args: AST.ExpressionNode[]): Promise<any> {
        switch (nameLower) {
            case "append": {
                this.assertArgCount("append", args.length, [2]);

                const { name, variable, array } = this.requireMutableArrayVariable(args[0], "append");
                const rawValue = await this.evaluateExpression(args[1]);
                const coerced = this.coerceArrayElementForVariable(variable, rawValue, `${name}[${array.length}]`);
                array.push(coerced);
                return null;
            }

            case "pop": {
                this.assertArgCount("pop", args.length, [1]);

                const { array } = this.requireMutableArrayVariable(args[0], "pop");

                if (array.length === 0) {
                    throw new Error("Runtime Error: Cannot pop() from an empty array");
                }

                return array.pop();
            }

            case "insert": {
                this.assertArgCount("insert", args.length, [3]);

                const { name, variable, array } = this.requireMutableArrayVariable(args[0], "insert");
                const indexRaw = await this.evaluateExpression(args[1]);
                const index = this.normalizeArrayIndex(indexRaw, array.length, "Insert index", true);
                const rawValue = await this.evaluateExpression(args[2]);
                const coerced = this.coerceArrayElementForVariable(variable, rawValue, `${name}[${index}]`);

                array.splice(index, 0, coerced);
                return null;
            }

            case "remove": {
                this.assertArgCount("remove", args.length, [2]);

                const { array } = this.requireMutableArrayVariable(args[0], "remove");
                const indexRaw = await this.evaluateExpression(args[1]);
                const index = this.normalizeArrayIndex(indexRaw, array.length, "Remove index");

                return array.splice(index, 1)[0];
            }

            case "subarray": {
                this.assertArgCount("subarray", args.length, [3]);

                const arrayValue = await this.evaluateExpression(args[0]);
                if (!Array.isArray(arrayValue)) {
                    throw new Error("Runtime Error: subarray() first argument must be an array");
                }
                const startRaw = await this.evaluateExpression(args[1]);
                const endRaw = await this.evaluateExpression(args[2]);
                const start = this.normalizeArrayIndex(startRaw, arrayValue.length, "Subarray start", true);
                const end = this.normalizeArrayIndex(endRaw, arrayValue.length, "Subarray end", true);

                if (end < start) {
                    throw new Error("Runtime Error: subarray() end index must be greater than or equal to start index");
                }

                return arrayValue.slice(start, end);
            }

            default:
                throw new Error(`Runtime Error: Unknown function '${nameLower}'`);
        }
    }

    private async callArrayBuiltinMethod(nameLower: string, objectExpr: AST.ExpressionNode, args: AST.ExpressionNode[]): Promise<any> {
        switch (nameLower) {
            case "append":
                this.assertArgCount("append", args.length, [1]);
                return this.callArrayBuiltinGlobal("append", [objectExpr, ...args]);
            case "pop":
                this.assertArgCount("pop", args.length, [0]);
                return this.callArrayBuiltinGlobal("pop", [objectExpr, ...args]);
            case "insert":
                this.assertArgCount("insert", args.length, [2]);
                return this.callArrayBuiltinGlobal("insert", [objectExpr, ...args]);
            case "remove":
                this.assertArgCount("remove", args.length, [1]);
                return this.callArrayBuiltinGlobal("remove", [objectExpr, ...args]);
            case "subarray":
                this.assertArgCount("subarray", args.length, [2]);
                return this.callArrayBuiltinGlobal("subarray", [objectExpr, ...args]);
            default:
                throw new Error(`Runtime Error: Unknown method '${nameLower}'`);
        }
    }
}