import { Token, TokenType } from "../lexer/token.js"
import { CodeStyle } from "../CodeStyle.js"
import * as AST from "../ast/nodes.js"

enum BlockType {
    IF,
    ELSE,
    ELSE_IF,
    SWITCH,
    CASE,
    DEFAULT,
    WHILE
}

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
            this.skipNewlinesAndSemicolons();
            if (this.isAtEnd()) break;
            statements.push(this.parseStatement());
            this.skipNewlinesAndSemicolons();
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

    private consumeStatementTerminator(): void {
        if (this.isAtEnd()) return;
        if (this.codeStyle === CodeStyle.INDENT) {
            this.consume(TokenType.NEWLINE, "Formatting Error: Expected newline after statement but got '" + this.peek().value + "' at line " + this.peek().line);
            return;
        }
        else if (this.codeStyle === CodeStyle.CURLY_BRACES) {
            if (this.checkType(TokenType.SEMI_COLON)) {
                return;
            }
            if (this.checkType(TokenType.NEWLINE)) {
                return;
            }
            if (this.checkType(TokenType.RIGHT_CURLY)) {
                return;
            }
        }

        throw new Error("Syntax Error: Expected ';' or newline after statement but got '" + this.peek().value + "' at line " + this.peek().line);
    }

    private consumeBlockTerminator(blockType: BlockType): void {
        this.skipNewlinesAndSemicolons();

        if (blockType === BlockType.IF) {
            if (this.match(TokenType.END_IF)) {
                this.consumeStatementTerminator();
                return;
            }
        }

        if (blockType === BlockType.SWITCH) {
            if (this.match(TokenType.END_SWITCH)) {
                this.consumeStatementTerminator();
                return;
            }
        }

        if (blockType === BlockType.WHILE) {
            if (this.match(TokenType.END_WHILE)) {
                this.consumeStatementTerminator();
                return;
            }
        }
    }

    private beginBlock(blockType: BlockType, line: number, column: number): void {
        if (blockType === BlockType.IF || blockType === BlockType.ELSE || blockType === BlockType.ELSE_IF) {
            if (this.checkType(TokenType.THEN)) {
                this.advance();
            }
        }
        if (this.codeStyle === CodeStyle.INDENT) {
            if (this.checkType(TokenType.COLON)) {
                this.advance();
            }
            this.consume(TokenType.NEWLINE, "Formatting Error: Expected newline before block but got '" + this.peek().value + "' at line " + line);
            this.consume(TokenType.INDENT, "Formatting Error: Expected an indent at line " + line);
        }
        else {
            this.skipNewlines();
            this.consume(TokenType.LEFT_CURLY, "Syntax Error: Expected '{' to begin block at line " + line + ", column " + (column - 1));
        }
    }

    private endBlock(): void {
        if (this.codeStyle === CodeStyle.INDENT) {
            if (!this.isAtEnd()) {
                this.consume(TokenType.DEDENT, "Formatting Error: Expected dedent to end block at line " + this.peek().line + ", column " + this.peek().column);
            }
        } else {
            this.consume(TokenType.RIGHT_CURLY, "Syntax Error: Expected '}' to end block at line " + this.peek().line + ", column " + this.peek().column);
        }
    }

    private parseBlock(blockType: BlockType): AST.StatementNode[] {
        this.beginBlock(blockType, this.peek().line, this.peek().column);

        const statements: AST.StatementNode[] = [];
        while (!this.isAtBlockEnd() && !this.isAtEnd()) {
            this.skipNewlinesAndSemicolons();
            if (this.isAtBlockEnd()) break;
            statements.push(this.parseStatement());
        }
        this.endBlock();
        return statements;
    }

    private isAtBlockEnd(): boolean {
        if (this.codeStyle === CodeStyle.INDENT) {
            return this.checkType(TokenType.DEDENT);
        } else {
            while (this.checkType(TokenType.SEMI_COLON)) {
                this.advance();
            }
            return this.checkType(TokenType.RIGHT_CURLY);
        }
    }

    private skipNewlines(): void {
        if (this.codeStyle === CodeStyle.CURLY_BRACES) {
            while (this.checkType(TokenType.NEWLINE)) { 
                this.advance();
            }
        }
    }

    private skipSemicolons(): void {
        if (this.codeStyle === CodeStyle.CURLY_BRACES) {
            while (this.checkType(TokenType.SEMI_COLON)) {
                this.advance();
            }
        }
    }

    private skipNewlinesAndSemicolons(): void {
        if (this.codeStyle === CodeStyle.CURLY_BRACES) {
            while (this.checkType(TokenType.NEWLINE) || this.checkType(TokenType.SEMI_COLON)) {
                this.advance();
            }
        }
    }

    private parseStatement(): AST.StatementNode {
        this.skipNewlinesAndSemicolons();
        if (this.match(TokenType.PRINT)) {
            return this.parsePrintStatement();
        }
        if (this.match(TokenType.IF)) {
            return this.parseIfStatement();
        }
        if (this.match(TokenType.SWITCH)) {
            return this.parseSwitchStatement();
        }
        if (this.match(TokenType.WHILE)) {
            return this.parseWhileStatement();
        }
        if (this.checkType(TokenType.IDENTIFIER)) {
            return this.parseAssignmentOrCompound();
        }
        if (this.match(TokenType.PASS)) {
            return this.parsePassStatement();
        }
        if (this.match(TokenType.BREAK)) {
            return this.parseBreakStatement();
        }

        throw new Error("Syntax Error: Unexpected '" + this.peek().value + "' at line " + this.peek().line + ", column " + (this.peek().column - this.peek().value!.length));
    }

    private parseAssignmentOrCompound(): AST.StatementNode {
        const name = this.consume(TokenType.IDENTIFIER, "Expected variable name. Got '" + this.peek().value + "' instead. Line " + this.peek().line + ", Column " + this.peek().column);

        const identifier: AST.ExpressionNode = {
            type: "Identifier",
            name: name.value!
        };

        if (this.match(TokenType.DOUBLE_PLUS, TokenType.DOUBLE_MINUS)) {
            const operatorToken = this.previous().type;

            const operator = operatorToken === TokenType.DOUBLE_PLUS ? TokenType.PLUS : TokenType.MINUS;

            this.consumeStatementTerminator();

            return {
                type: "VariableAssignment",
                name: name.value!,
                value: {
                    type: "BinaryExpression",
                    operator,
                    left: identifier,
                    right: {
                        type: "Number",
                        value: 1
                    }
                }
            };
        }

        if (this.match(TokenType.PLUS_EQUALS, TokenType.MINUS_EQUALS, TokenType.STAR_EQUALS, TokenType.SLASH_EQUALS)) {
            const compoundOp = this.previous().type;
            const right = this.parseExpression();
            this.consumeStatementTerminator();

            let operator: TokenType;

            switch (compoundOp) {
                case TokenType.PLUS_EQUALS:
                    operator = TokenType.PLUS;
                    break;
                case TokenType.MINUS_EQUALS:
                    operator = TokenType.MINUS;
                    break;
                case TokenType.STAR_EQUALS:
                    operator = TokenType.STAR;
                    break;
                case TokenType.SLASH_EQUALS:
                    operator = TokenType.SLASH;
                    break;
                default:
                    throw new Error("Unreachable");
            }

            return {
                type: "VariableAssignment",
                name: name.value!,
                value: {
                    type: "BinaryExpression",
                    operator,
                    left: identifier,
                    right
                }
            };
        }

        // x = y
        if (this.match(TokenType.EQUALS)) {
            const value = this.parseExpression();
            this.consumeStatementTerminator();

            return {
                type: "VariableAssignment",
                name: name.value!,
                value
            };
        }

        throw new Error("Syntax Error: Expected assignment operator after variable name at line " + this.peek().line + ", column " + (this.peek().column - 1));
    }

    private parsePrintStatement(): AST.PrintNode {
        const expression = this.parseExpression();
        this.consumeStatementTerminator();

        return {
            type: "Print",
            expression
        };
    }

    private parseIfStatement(): AST.IfNode {
        const condition = this.parseExpression();
        const thenBody = this.parseBlock(BlockType.IF);

        // Handle optional else clause
        this.skipNewlines();

        let elseBody: AST.StatementNode[] | undefined;

        if (this.match(TokenType.ELSE_IF)) {
            elseBody = [this.parseIfStatement()];
        }
        else if (this.match(TokenType.ELSE)) {
            this.skipNewlines();
            elseBody = this.parseBlock(BlockType.ELSE);
        }

        this.consumeBlockTerminator(BlockType.IF);

        return {
            type: "If",
            condition,
            thenBody,
            elseBody
        };
    }

    private parseSwitchStatement(): AST.SwitchNode {
        const expression = this.parseExpression();

        this.beginBlock(BlockType.SWITCH, this.peek().line, this.peek().column);

        const cases: AST.SwitchCaseNode[] = [];
        let defaultCase: AST.StatementNode[] | undefined;

        while (!this.isAtBlockEnd() && !this.isAtEnd()) {
            this.skipNewlinesAndSemicolons();

            if (this.match(TokenType.CASE)) {
                const value = this.parseExpression();
                if (this.checkType(TokenType.COLON)) {
                    this.advance();
                }

                const body = this.parseBlock(BlockType.CASE);
                cases.push({
                    caseExpression: value,
                    body
                });
            }
            else if (this.match(TokenType.DEFAULT)) {
                if (this.checkType(TokenType.COLON)) {
                    this.advance();
                }
                defaultCase = this.parseBlock(BlockType.DEFAULT);
                break;
            }
            else {
                break;
            }
        }
        this.skipNewlinesAndSemicolons();
        this.endBlock();
        this.consumeBlockTerminator(BlockType.SWITCH);

        return {
            type: "Switch",
            expression,
            cases,
            defaultBody: defaultCase
        };
    }

    private parseWhileStatement(): AST.WhileNode {
        const condition = this.parseExpression();
        const body = this.parseBlock(BlockType.WHILE);

        this.consumeBlockTerminator(BlockType.WHILE);

        return {
            type: "While",
            condition,
            body
        };
    }

    private parsePassStatement(): AST.PassNode {
        this.consumeStatementTerminator();
        return {
            type: "Pass"
        };
    }

    private parseBreakStatement(): AST.BreakNode {
        this.consumeStatementTerminator();
        return {
            type: "Break"
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
        let expr = this.parseUnary();

        while (this.match(TokenType.STAR, TokenType.SLASH)) {
            const operator = this.previous().type;
            const right = this.parseUnary();
            expr = {
                type: "BinaryExpression",
                operator,
                left: expr,
                right
            };
        }
        return expr;
    }

    private parseUnary(): AST.ExpressionNode {
        if (this.match(TokenType.MINUS)) {
            const operator = this.previous().type;
            const right = this.parseUnary();
            
            return {
                type: "UnaryExpression",
                operator,
                operand: right
            };
        }

        return this.parsePrimary();
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
            this.consume(TokenType.RIGHT_PAREN, "Syntax Error: Expected ')' after expression at line " + this.peek().line + ", column " + this.peek().column);
            return expr;
        }

        throw new Error("Syntax Error: Expected expression at line " + this.peek().line + ", column " + (this.peek().column - 1));
    }
}