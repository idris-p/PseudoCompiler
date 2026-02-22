import { config } from "../loader.js";
import * as AST from "../ast/nodes.js";

export type ExecutionResult = {
    output: any[];
    environment: Map<string, any>;
}

class BreakSignal {}

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
            case "Pass":
                // Do nothing
                break;
            case "Break":
                throw new BreakSignal();
            default:
                throw new Error(`Runtime Error: Unknown statement type: ${(node as any).type}`);
        }
    }

    private async executeAssignment(node: AST.VariableAssignmentNode) {
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
            } else {
                throw e;
            }
        }
    }

    private async executeFor(node: AST.ForNode) {
        if (node.initializer) {
            await this.executeStatement(node.initializer);
        }

        let iter = 0;

        while (!node.condition || await this.evaluateExpression(node.condition)) {
            try {
                for (const stmt of node.body) {
                    await this.executeStatement(stmt);
                }
            }
            catch (e) {
                if (e instanceof BreakSignal) {
                    break;
                } else {
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
                if (e instanceof BreakSignal) {
                    break;
                } else {
                    throw e;
                }
            }

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
            default:
                throw new Error(`Runtime Error: Unknown expression type: ${(node as any).type}`);
        }
    }

    private async evaluateUnaryExpression(node: AST.UnaryExpressionNode): Promise<any> {
        const operand = await this.evaluateExpression(node.operand);

        switch (node.operator) {
            case "MINUS":
                return -operand;
            default:
                throw new Error(`Runtime Error: Unknown unary operator: ${node.operator}`);
        }
    };

    private async evaluateBinaryExpression(node: AST.BinaryExpressionNode): Promise<any> {
        const left = await this.evaluateExpression(node.left);
        const right = await this.evaluateExpression(node.right);
        switch (node.operator) {
            case "PLUS":
                return left + right;
            case "MINUS":
                return left - right;
            case "STAR":
                return left * right;
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
}