import { TokenType } from "./token.js";
import { CodeStyle } from "../CodeStyle.js";
const KEYWORDS = {
    "if": TokenType.IF,
    "then": TokenType.THEN,
    "elseif": TokenType.ELSE_IF,
    "else": TokenType.ELSE,
    "endif": TokenType.END_IF,
    "switch": TokenType.SWITCH,
    "case": TokenType.CASE,
    "default": TokenType.DEFAULT,
    "endswitch": TokenType.END_SWITCH,
    "break": TokenType.BREAK,
    "while": TokenType.WHILE,
    "endwhile": TokenType.END_WHILE,
    "print": TokenType.PRINT,
    "pass": TokenType.PASS,
};
const BLOCK_OPENERS = new Set([
    TokenType.IF,
    TokenType.ELSE_IF,
    TokenType.ELSE,
    TokenType.SWITCH,
    TokenType.CASE,
    TokenType.DEFAULT,
    TokenType.WHILE,
]);
// Lexer Class - converts source code into tokens
export class Lexer {
    constructor(sourceCode, codeStyle) {
        this.position = 0;
        this.line = 1;
        this.column = 1;
        this.indentStack = [0];
        this.expectedIndent = false;
        this.sourceCode = sourceCode;
        this.codeStyle = codeStyle;
    }
    tokenize() {
        const tokens = [];
        while (!this.isAtEnd()) {
            const char = this.peek();
            // Skip whitespace
            if (char === ' ') {
                this.advance();
                continue;
            }
            // Newline
            if (char === '\n') {
                this.advanceLine();
                if (this.isCommentLine()) {
                    this.skipLine();
                    continue;
                }
                if (tokens.length > 0 && tokens[tokens.length - 1].type !== TokenType.NEWLINE) {
                    tokens.push(this.makeToken(TokenType.NEWLINE, "new line"));
                }
                if (this.codeStyle === CodeStyle.INDENT && !this.isLineEmpty()) {
                    tokens.push(...this.indent());
                }
                continue;
            }
            // Numbers
            if (this.isDigit(char)) {
                tokens.push(this.number());
                continue;
            }
            // Strings
            if (char === '"' || char === "'") {
                tokens.push(this.string(char));
                continue;
            }
            // Identifiers and Keywords
            if (this.isAlpha(char)) {
                tokens.push(this.identifier());
                continue;
            }
            // Comments
            if (char === '#') {
                // Skip comments
                while (!this.isAtEnd() && this.peek() !== '\n') {
                    this.advance();
                }
                continue;
            }
            // Operators and Symbols
            tokens.push(this.operator());
        }
        tokens.push(this.makeToken(TokenType.EOF, "end of file"));
        return tokens;
    }
    // Peak method gets the current character without advancing the position
    peek() {
        return this.sourceCode[this.position];
    }
    // Advance method moves the position forward and returns the new current character
    advance() {
        const char = this.sourceCode[this.position++];
        this.column++;
        return char;
    }
    // Advance line method moves to the next line
    advanceLine() {
        this.advance();
        this.line++;
        this.column = 1;
    }
    skipLine() {
        if (this.codeStyle === CodeStyle.INDENT) {
            while (!this.isAtEnd() && this.peek() !== '\n') {
                this.advance();
            }
        }
        else if (this.codeStyle === CodeStyle.CURLY_BRACES) {
            while (!this.isAtEnd() && this.peek() !== '\n' && this.peek() !== '}' && this.peek() !== ';') {
                this.advance();
            }
        }
    }
    // Is at end method checks if we've reached the end of the source code
    isAtEnd() {
        return this.position >= this.sourceCode.length;
    }
    isDigit(c) {
        return c >= "0" && c <= "9";
    }
    isAlpha(c) {
        return /[a-zA-Z_]/.test(c);
    }
    // Check if line is empty
    isLineEmpty() {
        let pos = this.position;
        while (pos < this.sourceCode.length) {
            const char = this.sourceCode[pos];
            if (char === '\n')
                break;
            if (char !== ' ' && char !== '\t')
                return false;
            pos++;
        }
        return true;
    }
    isCommentLine() {
        let pos = this.position;
        while (pos < this.sourceCode.length) {
            const char = this.sourceCode[pos];
            if (char === ' ') {
                pos++;
                continue;
            }
            if (char === '#')
                return true;
            if (char === '\n')
                return false;
            return false;
        }
        return false;
    }
    // Make token method creates a new token
    makeToken(type, value) {
        return {
            type,
            value,
            line: this.line,
            column: this.column
        };
    }
    indent() {
        let value = "";
        while (!this.isAtEnd() && this.peek() === ' ') {
            value += this.advance();
        }
        let prevIndentLevel = this.indentStack[this.indentStack.length - 1];
        let indentLevel = Math.floor(value.length / 4); // Assuming 4 spaces per indent
        let result = [];
        if (indentLevel > prevIndentLevel) {
            for (let i = 0; i < indentLevel - prevIndentLevel; i++) {
                result.push(this.makeToken(TokenType.INDENT, "indent"));
            }
        }
        else if (indentLevel < prevIndentLevel) {
            for (let i = 0; i < prevIndentLevel - indentLevel; i++) {
                result.push(this.makeToken(TokenType.DEDENT, "dedent"));
            }
        }
        this.indentStack.push(indentLevel);
        if (this.expectedIndent) {
            if (indentLevel <= prevIndentLevel) {
                throw new Error(`Formatting Error: Expected an indent at line ${this.line}, column ${this.column}`);
            }
            else if (indentLevel - prevIndentLevel > 1) {
                throw new Error(`Formatting Error: Indentation too deep at line ${this.line}, column ${this.column}`);
            }
            this.expectedIndent = false;
        }
        else {
            if (indentLevel > prevIndentLevel) {
                throw new Error(`Formatting Error: Unexpected indent at line ${this.line}, column ${this.column}`);
            }
        }
        return result;
    }
    number() {
        let value = "";
        while (!this.isAtEnd() && this.isDigit(this.peek())) {
            value += this.advance();
        }
        // Handle fractional part
        if (this.peek() === ".") {
            value += this.advance();
            while (this.isDigit(this.peek())) {
                value += this.advance();
            }
        }
        return this.makeToken(TokenType.NUMBER, value);
    }
    string(quote_mark) {
        let value = "";
        this.advance(); // Skip opening quote
        while (!this.isAtEnd() && this.peek() !== quote_mark) {
            value += this.advance();
        }
        if (this.isAtEnd()) {
            throw new Error(`Syntax Error: Unterminated string at line ${this.line}, column ${this.column}`);
        }
        this.advance(); // Skip closing quote
        return this.makeToken(TokenType.STRING, value);
    }
    identifier() {
        let value = "";
        while (!this.isAtEnd() && (this.isAlpha(this.peek()) || this.isDigit(this.peek()))) {
            value += this.advance();
        }
        const lower = value.toLowerCase();
        if (lower === "true" || lower === "false") {
            return this.makeToken(TokenType.BOOLEAN, lower);
        }
        const type = KEYWORDS[lower] || TokenType.IDENTIFIER; // Either a keyword or an identifier
        if (this.codeStyle === CodeStyle.INDENT && BLOCK_OPENERS.has(type)) {
            this.expectedIndent = true;
        }
        return this.makeToken(type, value);
    }
    operator() {
        const char = this.advance();
        switch (char) {
            case "=":
                if (this.peek() === "=") {
                    this.advance();
                    return this.makeToken(TokenType.DOUBLE_EQUALS, "==");
                }
                return this.makeToken(TokenType.EQUALS, "=");
            case "+":
                return this.makeToken(TokenType.PLUS, "+");
            case "-":
                return this.makeToken(TokenType.MINUS, "-");
            case "*":
                return this.makeToken(TokenType.STAR, "*");
            case "/":
                if (this.peek() === "/") {
                    this.advance();
                    return this.makeToken(TokenType.DOUBLE_SLASH, "//");
                }
                return this.makeToken(TokenType.SLASH, "/");
            case "(":
                return this.makeToken(TokenType.LEFT_PAREN, "(");
            case ")":
                return this.makeToken(TokenType.RIGHT_PAREN, ")");
            case "{":
                return this.makeToken(TokenType.LEFT_CURLY, "{");
            case "}":
                return this.makeToken(TokenType.RIGHT_CURLY, "}");
            case ",":
                return this.makeToken(TokenType.COMMA, ",");
            case ":":
                return this.makeToken(TokenType.COLON, ":");
            case ";":
                return this.makeToken(TokenType.SEMI_COLON, ";");
            case "!":
                if (this.peek() === "=") {
                    this.advance();
                    return this.makeToken(TokenType.NOT_EQUALS, "!=");
                }
            case "<":
                if (this.peek() === "=") {
                    this.advance();
                    return this.makeToken(TokenType.LESS_EQUAL, "<=");
                }
                return this.makeToken(TokenType.LESS, "<");
            case ">":
                if (this.peek() === "=") {
                    this.advance();
                    return this.makeToken(TokenType.GREATER_EQUAL, ">=");
                }
                return this.makeToken(TokenType.GREATER, ">");
            // case "#":
            //     // return this.makeToken(TokenType.HASH, "#")
            //     // Skip comments
            //     while (!this.isAtEnd() && this.peek() !== '\n') {
            //         this.advance()
            //     }
            //     return this.makeToken(TokenType.NEWLINE, "new line")
            default:
                throw new Error(`Syntax Error: Unexpected character '${char}' at line ${this.line}, column ${this.column - 1}`);
        }
    }
}
