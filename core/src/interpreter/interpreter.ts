import { config } from "../loader.js";
import * as AST from "../ast/nodes.js";

export type ExecutionResult = {
    output: any[];
    environment: Map<string, any>;
}

class BreakSignal {}

// Interpreter Class - executes the AST
export class Interpreter {
    private environment: Map<string, any> = new Map();
    private output: any[] = [];

    run(program: AST.ProgramNode): ExecutionResult {
        this.environment.clear();
        this.output = [];
        for (const statement of program.body) {
            this.executeStatement(statement);
        }
        return { output: this.output, environment: this.environment };
    }

    private executeStatement(node: AST.StatementNode): void {
        switch (node.type) {
            case "Program":
                node.body.forEach(stmt => this.executeStatement(stmt));
                break;
            case "VariableAssignment":
                this.executeAssignment(node);
                break;
            case "Print":
                this.executePrint(node);
                break;
            case "If":
                this.executeIf(node);
                break;
            case "Switch":
                this.executeSwitch(node);
                break;
            case "For":
                this.executeFor(node);
                break;
            case "While":
                this.executeWhile(node);
                break;
            case "Pass":
                // Do nothing
                break;
            case "Break":
                throw new BreakSignal();
            default:
                throw new Error(`Unknown statement type: ${(node as any).type}`);
        }
    }

    private executeAssignment(node: AST.VariableAssignmentNode) {
        const value = this.evaluateExpression(node.value);
        this.environment.set(node.name, value);
    }

    private executePrint(node: AST.PrintNode) {
        const value = this.evaluateExpression(node.expression);
        console.log(value);
        this.output.push(value);
    }

    private executeIf(node: AST.IfNode) {
        const condition = this.evaluateExpression(node.condition);

        if (condition) {
            node.thenBody.forEach(stmt => this.executeStatement(stmt));
        } else if (node.elseBody) {
            node.elseBody.forEach(stmt => this.executeStatement(stmt));
        }
    }

    private executeSwitch(node: AST.SwitchNode) {
        const switchValue = this.evaluateExpression(node.expression);
        let caseMatched = false;

        try {
            for (const caseNode of node.cases) {
                const caseValue = this.evaluateExpression(caseNode.caseExpression);

                if (switchValue === caseValue || caseMatched) {
                    caseMatched = true;
                    caseNode.body.forEach(stmt => this.executeStatement(stmt));
                    if (!config.switchFallthrough)
                    return;
                }
            }

            if (node.defaultBody && (!caseMatched || config.switchFallthrough)) {
                node.defaultBody.forEach(stmt => this.executeStatement(stmt));
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

    private executeFor(node: AST.ForNode) {
        if (node.initializer) {
            this.executeStatement(node.initializer);
        }

        while (!node.condition || this.evaluateExpression(node.condition)) {
            try {
                node.body.forEach(stmt => this.executeStatement(stmt));
            }
            catch (e) {
                if (e instanceof BreakSignal) {
                    break;
                } else {
                    throw e;
                }
            }
            if (node.update) {
                this.executeStatement(node.update);
            }
        }
    }

    private executeWhile(node: AST.WhileNode) {
        while (this.evaluateExpression(node.condition)) {
            try {
                node.body.forEach(stmt => this.executeStatement(stmt));
            } catch (e) {
                if (e instanceof BreakSignal) {
                    break;
                } else {
                    throw e;
                }
            }
        }
    }

    private evaluateExpression(node: AST.ExpressionNode): any {
        switch (node.type) {
            case "Number":
                return node.value;
            case "String":
                return node.value;
            case "Boolean":
                return node.value;
            case "Identifier":
                if (!this.environment.has(node.name)) {
                    throw new Error(`Undefined variable: ${node.name}`);
                }
                return this.environment.get(node.name);
            case "UnaryExpression":
                return this.evaluateUnaryExpression(node);
            case "BinaryExpression":
                return this.evaluateBinaryExpression(node);
            default:
                throw new Error(`Unknown expression type: ${(node as any).type}`);
        }
    }

    private evaluateUnaryExpression(node: AST.UnaryExpressionNode): any {
        const operand = this.evaluateExpression(node.operand);

        switch (node.operator) {
            case "MINUS":
                return -operand;
            default:
                throw new Error(`Unknown unary operator: ${node.operator}`);
        }
    };

    private evaluateBinaryExpression(node: AST.BinaryExpressionNode): any {
        const left = this.evaluateExpression(node.left);
        const right = this.evaluateExpression(node.right);

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

            case "DOUBLE_EQUALS":
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
                throw new Error(`Unknown binary operator: ${node.operator}`);
        }
    }
}