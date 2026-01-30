import { TokenType } from "../lexer/token.js";
import { CodeStyle } from "../CodeStyle.js";
var BlockType;
(function (BlockType) {
    BlockType[BlockType["IF"] = 0] = "IF";
    BlockType[BlockType["ELSE"] = 1] = "ELSE";
    BlockType[BlockType["ELSE_IF"] = 2] = "ELSE_IF";
    BlockType[BlockType["SWITCH"] = 3] = "SWITCH";
    BlockType[BlockType["CASE"] = 4] = "CASE";
    BlockType[BlockType["DEFAULT"] = 5] = "DEFAULT";
    BlockType[BlockType["WHILE"] = 6] = "WHILE";
})(BlockType || (BlockType = {}));
// Parser Class - converts tokens into AST
export class Parser {
    constructor(tokens, codeStyle) {
        this.position = 0;
        this.tokens = tokens;
        this.codeStyle = codeStyle;
    }
    parse() {
        const statements = [];
        while (!this.isAtEnd()) {
            this.skipNewlinesAndSemicolons();
            if (this.isAtEnd())
                break;
            statements.push(this.parseStatement());
            this.skipNewlinesAndSemicolons();
        }
        return {
            type: "Program",
            body: statements
        };
    }
    peek() {
        return this.tokens[this.position];
    }
    previous() {
        return this.tokens[this.position - 1];
    }
    advance() {
        if (!this.isAtEnd())
            this.position++;
        return this.previous();
    }
    checkType(type) {
        if (this.isAtEnd())
            return false;
        return this.peek().type === type;
    }
    // Check if current token matches any of the given types and advance if so
    match(...types) {
        for (const type of types) {
            if (this.checkType(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    // Ensure the current token is of the expected type, otherwise throw an error
    consume(type, errorMessage) {
        if (this.checkType(type))
            return this.advance();
        throw new Error(errorMessage);
    }
    isAtEnd() {
        return this.peek().type === TokenType.EOF;
    }
    consumeStatementTerminator() {
        if (this.isAtEnd())
            return;
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
    consumeBlockTerminator(blockType) {
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
    beginBlock(blockType, line, column) {
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
    endBlock() {
        if (this.codeStyle === CodeStyle.INDENT) {
            if (!this.isAtEnd()) {
                this.consume(TokenType.DEDENT, "Formatting Error: Expected dedent to end block at line " + this.peek().line + ", column " + this.peek().column);
            }
        }
        else {
            this.consume(TokenType.RIGHT_CURLY, "Syntax Error: Expected '}' to end block at line " + this.peek().line + ", column " + this.peek().column);
        }
    }
    parseBlock(blockType) {
        this.beginBlock(blockType, this.peek().line, this.peek().column);
        const statements = [];
        while (!this.isAtBlockEnd() && !this.isAtEnd()) {
            this.skipNewlinesAndSemicolons();
            if (this.isAtBlockEnd())
                break;
            statements.push(this.parseStatement());
        }
        this.endBlock();
        return statements;
    }
    isAtBlockEnd() {
        if (this.codeStyle === CodeStyle.INDENT) {
            return this.checkType(TokenType.DEDENT);
        }
        else {
            while (this.checkType(TokenType.SEMI_COLON)) {
                this.advance();
            }
            return this.checkType(TokenType.RIGHT_CURLY);
        }
    }
    skipNewlines() {
        if (this.codeStyle === CodeStyle.CURLY_BRACES) {
            while (this.checkType(TokenType.NEWLINE)) {
                this.advance();
            }
        }
    }
    skipSemicolons() {
        if (this.codeStyle === CodeStyle.CURLY_BRACES) {
            while (this.checkType(TokenType.SEMI_COLON)) {
                this.advance();
            }
        }
    }
    skipNewlinesAndSemicolons() {
        if (this.codeStyle === CodeStyle.CURLY_BRACES) {
            while (this.checkType(TokenType.NEWLINE) || this.checkType(TokenType.SEMI_COLON)) {
                this.advance();
            }
        }
    }
    parseStatement() {
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
            return this.parseAssignment();
        }
        if (this.match(TokenType.PASS)) {
            return this.parsePassStatement();
        }
        throw new Error("Syntax Error: Unexpected '" + this.peek().value + "' at line " + this.peek().line + ", column " + (this.peek().column - this.peek().value.length));
    }
    parseAssignment() {
        const name = this.consume(TokenType.IDENTIFIER, "Expected variable name. Got '" + this.peek().value + "' instead. Line " + this.peek().line + ", Column " + this.peek().column);
        this.consume(TokenType.EQUALS, "Syntax Error: Expected '=' after variable name at line " + this.peek().line + ", column " + (this.peek().column - 1));
        const value = this.parseExpression();
        this.consumeStatementTerminator();
        return {
            type: "VariableAssignment",
            name: name.value,
            value
        };
    }
    parsePrintStatement() {
        const expression = this.parseExpression();
        this.consumeStatementTerminator();
        return {
            type: "Print",
            expression
        };
    }
    parseIfStatement() {
        const condition = this.parseExpression();
        const thenBody = this.parseBlock(BlockType.IF);
        // Handle optional else clause
        this.skipNewlines();
        let elseBody;
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
    parseSwitchStatement() {
        const expression = this.parseExpression();
        this.beginBlock(BlockType.SWITCH, this.peek().line, this.peek().column);
        const cases = [];
        let defaultCase;
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
        this.endBlock();
        this.consumeBlockTerminator(BlockType.SWITCH);
        return {
            type: "Switch",
            expression,
            cases,
            defaultBody: defaultCase
        };
    }
    parseWhileStatement() {
        const condition = this.parseExpression();
        const body = this.parseBlock(BlockType.WHILE);
        this.consumeBlockTerminator(BlockType.WHILE);
        return {
            type: "While",
            condition,
            body
        };
    }
    parsePassStatement() {
        this.consumeStatementTerminator();
        return {
            type: "Pass"
        };
    }
    parseExpression() {
        return this.parseEquality();
    }
    parseEquality() {
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
    parseComparison() {
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
    parseTerm() {
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
    parseFactor() {
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
    parsePrimary() {
        if (this.match(TokenType.NUMBER)) {
            return {
                type: "Number",
                value: Number(this.previous().value)
            };
        }
        if (this.match(TokenType.STRING)) {
            return {
                type: "String",
                value: this.previous().value
            };
        }
        if (this.match(TokenType.IDENTIFIER)) {
            return {
                type: "Identifier",
                name: this.previous().value
            };
        }
        if (this.match(TokenType.BOOLEAN)) {
            return {
                type: "Boolean",
                value: this.previous().value.toLowerCase() === "true"
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
