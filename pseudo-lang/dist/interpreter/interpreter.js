// Interpreter Class - executes the AST
export class Interpreter {
    constructor() {
        this.environment = new Map();
    }
    run(program) {
        for (const statement of program.body) {
            this.executeStatement(statement);
        }
    }
    executeStatement(node) {
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
            case "While":
                this.executeWhile(node);
                break;
            default:
                throw new Error(`Unknown statement type: ${node.type}`);
        }
    }
    executeAssignment(node) {
        const value = this.evaluateExpression(node.value);
        this.environment.set(node.name, value);
    }
    executePrint(node) {
        const value = this.evaluateExpression(node.expression);
        console.log(value);
    }
    executeIf(node) {
        const condition = this.evaluateExpression(node.condition);
        if (condition) {
            node.thenBody.forEach(stmt => this.executeStatement(stmt));
        }
        else if (node.elseBody) {
            node.elseBody.forEach(stmt => this.executeStatement(stmt));
        }
    }
    executeWhile(node) {
        while (this.evaluateExpression(node.condition)) {
            node.body.forEach(stmt => this.executeStatement(stmt));
        }
    }
    evaluateExpression(node) {
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
            case "BinaryExpression":
                return this.evaluateBinaryExpression(node);
            default:
                throw new Error(`Unknown expression type: ${node.type}`);
        }
    }
    evaluateBinaryExpression(node) {
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
