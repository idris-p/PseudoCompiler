import { config } from "../loader.js";
import * as AST from "../ast/nodes.js";

export type ExecutionResult = {
    output: any[];
    environment: Map<string, any>;
}

class BreakSignal {}
class ContinueSignal {}

export type RuntimeIO = {
    write: (value: string) => void;                 // stream output immediately
    read: (prompt?: string) => Promise<string>;     // request user input (pauses program)
};


// Interpreter Class - executes the AST
export class Interpreter {
    private environment: Map<string, any> = new Map();
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
            case "VariableAssignment":
                await this.executeAssignment(node);
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

    private async executeAssignment(node: AST.VariableAssignmentNode) {
        if (node.name.toLowerCase() === "pi") {
            throw new Error("Runtime Error: Cannot assign to constant 'pi'");
        }

        const value = await this.evaluateExpression(node.value);
        this.environment.set(node.name, value);
    }

    private async executePrint(node: AST.PrintNode) {
        const value = await this.evaluateExpression(node.expression);
        console.log(value);
        this.io.write(String(value));
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
            this.environment.set(variable, start);

            const withinBounds = (i: number) => {
                if (step > 0) {
                    return node.range!.endInclusive ? i <= end : i < end;
                } else {
                    return node.range!.endInclusive ? i >= end : i > end;
                }
            };

            let iter = 0;

            while (withinBounds(this.environment.get(variable))) {
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
                const current = this.environment.get(variable);
                this.environment.set(variable, current + step);

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

    private async executeDoUntil(node: AST.DoUntilNode) {
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

        let start = toIntOrUndef(startVal, "Slice start");
        let end = toIntOrUndef(endVal, "Slice end");

        // Defaults depend on step direction (Python-ish)
        if (step > 0) {
            if (start === undefined) start = 0;
            if (end === undefined) end = len;
        } else {
            if (start === undefined) start = len - 1;
            if (end === undefined) end = -1; // IMPORTANT sentinel for reverse slicing
        }

        if (step > 0) {
            // Normalize negatives: -1 means last index etc.
            if (start < 0) start = len + start;
            if (end < 0) end = len + end;

            // Clamp into [0, len]
            start = Math.max(0, Math.min(len, start));
            end = Math.max(0, Math.min(len, end));

            if (typeof seq === "string") {
                let out = "";
                for (let i = start; i < end; i += step) out += (seq as string)[i] ?? "";
                return out as T;
            } else {
                const out: any[] = [];
                for (let i = start; i < end; i += step) {
                    if (i >= 0 && i < len) out.push((seq as any[])[i]);
                }
                return out as T;
            }
        } else {
            // step < 0
            // Normalize start normally (-1 => last index)
            if (start < 0) start = len + start;

            // Normalize end EXCEPT keep -1 as sentinel
            // If end is -1, we want to stop when i > -1 (includes index 0).
            if (end < -1) end = len + end;
            // If end === -1, keep it as -1
            // If end >= 0, keep as-is

            // Clamp start into valid index range [-1, len-1]
            if (start >= len) start = len - 1;
            if (start < -1) start = -1;

            // Clamp end into [-1, len-1]
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
            case "Concat": {
                const parts = await Promise.all(node.parts.map(async (p) => String(await this.evaluateExpression(p))));
                return parts.join(" ");
            }
            case "Boolean":
                return node.value;
            case "Identifier":
                if (node.name.toLowerCase() === "pi") {
                    return Math.PI;
                }
                if (!this.environment.has(node.name)) {
                    throw new Error(`Runtime Error: Variable '${node.name}' is not defined`);
                }
                return this.environment.get(node.name);
            case "UnaryExpression":
                return this.evaluateUnaryExpression(node);
            case "BinaryExpression":
                return this.evaluateBinaryExpression(node);
            case "IndexExpression":
                return await this.evaluateIndexExpression(node);
            case "SliceExpression":
                return await this.evaluateSliceExpression(node);
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

    private async evaluateIndexExpression(node: AST.IndexExpressionNode): Promise<any> {
        const obj = await this.evaluateExpression(node.object);
        const indexRaw = await this.evaluateExpression(node.index);
        const index = this.requireInteger(indexRaw, "Index");

        // Strings
        if (typeof obj === "string") {
            const i = index < 0 ? obj.length + index : index;
            if (i < 0 || i >= obj.length) {
                throw new Error(`Runtime Error: String index out of range`);
            }
            return obj[i]; // returns a 1-char string
        }

        // Arrays
        // if (Array.isArray(obj)) {
        //     const i = index < 0 ? obj.length + index : index;
        //     if (i < 0 || i >= obj.length) {
        //         throw new Error(`Runtime Error: Array index out of range`);
        //     }
        //     return obj[i];
        // }

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
        // if (Array.isArray(obj)) {
        //     return this.sliceSequence(obj, startVal, endVal, step);
        // }

        throw new Error(`Runtime Error: Cannot slice type '${typeof obj}'`);
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
                const str = finalArgs[0];
                if (typeof str !== "string") {
                    throw new Error(`Runtime Error: ${config.lengthSyntax}() argument must be a string, not a '${typeof str}'`);
                }
                return str.length;
            },
            },

            [config.substringSyntax.toLowerCase()]: {
            params: [3],
            allowMember: true,
            displayName: () => config.substringSyntax,
            fn: (finalArgs: any[]) => {
                const [str, start, end] = finalArgs;

                if (typeof str !== "string") {
                    throw new Error(`Runtime Error: ${config.substringSyntax}() first argument must be a string, not a '${typeof str}'`);
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
                params: [2],
                allowMember: false,
                displayName: () => "max",
                fn: (a) => Math.max(num(a[0], "max(a)"), num(a[1], "max(b)"))
            },
            ["min"]: {
                params: [2],
                allowMember: false,
                displayName: () => "min",
                fn: (a) => Math.min(num(a[0], "min(a)"), num(a[1], "min(b)"))
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
                fn: (a) => Math.tan(num(a[0], "tan()"))
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
            }
        };

        const builtin = builtins[nameLower];
        if (!builtin) {
            throw new Error(`Runtime Error: Unknown function '${nameLower}'`);
        }

        const expectedUserArgs = receiver === undefined 
            ? builtin.params[0] 
            : builtin.params[0] - 1;

        if (!builtin.params.includes(args.length + (receiver === undefined ? 0 : 1))) {
            const paramList = builtin.params.map(p => receiver === undefined ? p : p - 1).join(" or ");
            throw new Error(`Runtime Error: ${nameLower}() takes ${paramList} argument(s) but ${args.length} were given`);
        }

        // Build the internal arg list used by builtin implementations
        const finalArgs = receiver === undefined ? evaledArgs : [receiver, ...evaledArgs];

        return builtin.fn(finalArgs);
    }

    private async evaluateCallExpression(node: AST.CallExpressionNode): Promise<any> {
        // Global call: substring(str,2,5)
        if (node.callee.type === "Identifier") {
            const funcName = node.callee.name.toLowerCase();
            return await this.callBuiltin(funcName, undefined, node.args);
        }

        // Method call: str.substring(2,5)
        if (node.callee.type === "MemberExpression") {
            const receiver = await this.evaluateExpression(node.callee.object);
            const methodName = node.callee.property.toLowerCase();
            return await this.callBuiltin(methodName, receiver, node.args);
        }

        throw new Error(`Runtime Error: Invalid function call`);
    }

    private async evaluateMemberExpression(node: AST.MemberExpressionNode): Promise<any> {
        const obj = await this.evaluateExpression(node.object);
        const prop = node.property.toLowerCase();

        if (prop === config.lengthSyntax.toLowerCase()) {
            if (typeof obj !== "string") {
                throw new Error(`Runtime Error: ${config.lengthSyntax} works on strings only`);
            }
            return obj.length;
        }

        // If you later add more unary builtins, put them here.

        throw new Error(`Runtime Error: Unknown property '${node.property}'`);
    }
}