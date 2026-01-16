import { Token, TokenType } from "../lexer/token.js"
import { CodeStyle } from "../index.js"
import * as AST from "../ast/nodes.js"

// Parser Class - converts tokens into AST
export class Parser {
    private tokens: Token[];
    private position = 0;
    private codeStyle: CodeStyle;

    constructor(tokens: Token[], codeStyle: CodeStyle) {
        this.tokens = tokens;
        this.codeStyle = codeStyle;
    }

    parse(): AST.ProgramNode {
        const statements: AST.StatementNode[] = [];

        while (!this.isAtEnd()) {
            statements.push(this.parseStatement());
        }

        return {
            type: "Program",
            body: statements
        };
    }

    private peek(): Token {
        return this.tokens[this.position];
    }

    private previous(): Token {
        return this.tokens[this.position - 1];
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.position++;
        return this.previous();
    }

    private checkType(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    // Check if current token matches any of the given types and advance if so
    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.checkType(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    
    // Ensure the current token is of the expected type, otherwise throw an error
    private consume(type: TokenType, errorMessage: string): Token {
        if (this.checkType(type)) return this.advance();
        throw new Error(errorMessage);
    }

    private isAtEnd(): boolean {
        return this.peek().type === TokenType.EOF;
    }

    private parseStatement(): AST.StatementNode {
        console.log("Parsing statement at token:", this.peek());
        if (this.match(TokenType.PRINT)) {
            console.log("Parsing PRINT statement");
            return this.parsePrintStatement();
        }
        if (this.match(TokenType.IF)) {
            console.log("Parsing IF statement");
            return this.parseIfStatement();
        }
        if (this.match(TokenType.WHILE)) {
            console.log("Parsing WHILE statement");
            return this.parseWhileStatement();
        }

        console.log("Parsing ASSIGNMENT");
        return this.parseAssignment();
    }

    private parseAssignment(): AST.StatementNode {
        const name = this.consume(TokenType.IDENTIFIER, "Expected variable name. Got '" + this.peek().value + "' instead. Line " + this.peek().line + ", Column " + this.peek().column);
        this.consume(TokenType.EQUALS, "Expected '=' after variable name. Line " + this.peek().line + ", Column " + this.peek().column);

        const value = this.parseExpression();
        if (!this.isAtEnd()) {
            this.consume(TokenType.NEWLINE, "Expected newline after variable assignment. Line " + this.peek().line + ", Column " + this.peek().column);
        }

        return {
            type: "VariableAssignment",
            name: name.value!,
            value
        };
    }

    private parsePrintStatement(): AST.PrintNode {
        const expression = this.parseExpression();
        if (!this.isAtEnd()) {
            this.consume(TokenType.NEWLINE, "Expected newline after print statement. Line " + this.peek().line + ", Column " + this.peek().column);
        }

        return {
            type: "Print",
            expression
        };
    }

    private parseIfStatement(): AST.IfNode {
        const condition = this.parseExpression();
        this.consume(TokenType.NEWLINE, "Expected newline after if condition. Line " + this.peek().line + ", Column " + this.peek().column);
        this.consume(TokenType.INDENT, "Expected indent after if statement. Line " + this.peek().line + ", Column " + this.peek().column);

        const thenBody: AST.StatementNode[] = [];
        while (!this.checkType(TokenType.DEDENT) && !this.isAtEnd()) {
            thenBody.push(this.parseStatement());
        }
        if (!this.isAtEnd()) {
            this.consume(TokenType.DEDENT, "Expected dedent after if body. Line " + this.peek().line + ", Column " + this.peek().column);
        }

        // Handle optional else clause
        let elseBody: AST.StatementNode[] | undefined;
        if (this.match(TokenType.ELSE)) {
            this.consume(TokenType.NEWLINE, "Expected newline after else. Line " + this.peek().line + ", Column " + this.peek().column);
            this.consume(TokenType.INDENT, "Expected indent after else statement. Line " + this.peek().line + ", Column " + this.peek().column);

            elseBody = [];
            while (!this.checkType(TokenType.DEDENT) && !this.isAtEnd()) {
                elseBody.push(this.parseStatement());
            }
            if (!this.isAtEnd()) {
                this.consume(TokenType.DEDENT, "Expected dedent after else body. Line " + this.peek().line + ", Column " + this.peek().column);
            }
        }

        return {
            type: "If",
            condition,
            thenBody,
            elseBody
        };
    }

    private parseWhileStatement(): AST.WhileNode {
        const condition = this.parseExpression();
        this.consume(TokenType.NEWLINE, "Expected newline after while condition. Line " + this.peek().line + ", Column " + this.peek().column);
        this.consume(TokenType.INDENT, "Expected indent after while statement. Line " + this.peek().line + ", Column " + this.peek().column);

        const body: AST.StatementNode[] = [];
        while (!this.checkType(TokenType.DEDENT) && !this.isAtEnd()) {
            body.push(this.parseStatement());
        }
        if (!this.isAtEnd()) {
            this.consume(TokenType.DEDENT, "Expected dedent after while body. Line " + this.peek().line + ", Column " + this.peek().column);
        }

        return {
            type: "While",
            condition,
            body
        };
    }


    private parseExpression(): AST.ExpressionNode {
        return this.parseEquality();
    }

    private parseEquality(): AST.ExpressionNode {
        let expr = this.parseComparison();

        while (this.match(TokenType.DOUBLE_EQUALS, TokenType.NOT_EQUALS)) {
            const operator = this.previous().type;
            const right = this.parseComparison();
            expr = {
                type: "BinaryExpression",
                operator,
                left: expr,
                right
            };
        }
        return expr;
    }

    private parseComparison(): AST.ExpressionNode {
        let expr = this.parseTerm();

        while (this.match(TokenType.LESS, TokenType.LESS_EQUAL, TokenType.GREATER, TokenType.GREATER_EQUAL)) {
            const operator = this.previous().type;
            const right = this.parseTerm();
            expr = {
                type: "BinaryExpression",
                operator,
                left: expr,
                right
            };
        }
        return expr;
    }

    private parseTerm(): AST.ExpressionNode {
        let expr = this.parseFactor();

        while (this.match(TokenType.PLUS, TokenType.MINUS)) {
            const operator = this.previous().type;
            const right = this.parseFactor();
            expr = {
                type: "BinaryExpression",
                operator,
                left: expr,
                right
            };
        }
        return expr;
    }

    private parseFactor(): AST.ExpressionNode {
        let expr = this.parsePrimary();

        while (this.match(TokenType.STAR, TokenType.SLASH)) {
            const operator = this.previous().type;
            const right = this.parsePrimary();
            expr = {
                type: "BinaryExpression",
                operator,
                left: expr,
                right
            };
        }
        return expr;
    }

    private parsePrimary(): AST.ExpressionNode {
        if (this.match(TokenType.NUMBER)) {
            return {
                type: "Number",
                value: Number(this.previous().value!)
            };
        }
        if (this.match(TokenType.STRING)) {
            return {
                type: "String",
                value: this.previous().value!
            };
        }
        if (this.match(TokenType.IDENTIFIER)) {
            return {
                type: "Identifier",
                name: this.previous().value!
            };
        }
        if (this.match(TokenType.BOOLEAN)) {
            return {
                type: "Boolean",
                value: this.previous().value!.toLowerCase() === "true"
            };
        }
        if (this.match(TokenType.LEFT_PAREN)) {
            const expr = this.parseExpression();
            this.consume(TokenType.RIGHT_PAREN, "Expected ')' after expression. Line " + this.peek().line + ", Column " + this.peek().column);
            return expr;
        }

        throw new Error("Expected expression. Line " + this.peek().line + ", Column " + this.peek().column);
    }
}