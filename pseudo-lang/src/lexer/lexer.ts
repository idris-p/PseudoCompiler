import { TokenType, type Token } from "./token.js"
import { CodeStyle } from "../index.js"

const KEYWORDS: Record<string, TokenType> = {
    "if": TokenType.IF,
    "else": TokenType.ELSE,
    "while": TokenType.WHILE,
    "print": TokenType.PRINT
}

const BLOCK_OPENERS: Set<TokenType> = new Set([
    TokenType.IF,
    TokenType.ELSE,
    TokenType.WHILE,
])

// Lexer Class - converts source code into tokens
export class Lexer {
    private sourceCode: string;
    private codeStyle: CodeStyle;
    private position = 0
    private line = 1
    private column = 1
    private indentStack: number[] = [0];
    private expectedIndent = false

    constructor(sourceCode: string, codeStyle: CodeStyle) {
        this.sourceCode = sourceCode
        this.codeStyle = codeStyle
    }

    tokenize(): Token[] {
        const tokens: Token[] = []

        while (!this.isAtEnd()) {
            const char = this.peek()

            // Skip whitespace
            if (char === ' ') {
                this.advance()
                continue
            }

            // Newline
            if (char === '\n') {
                if (tokens.length > 0 && tokens[tokens.length - 1].type !== TokenType.NEWLINE) {
                    tokens.push(this.makeToken(TokenType.NEWLINE))
                }
                this.advanceLine()
                if (this.codeStyle === CodeStyle.INDENT && !this.isLineEmpty()) {
                    tokens.push(...this.indent())
                }
                continue
            }

            // Numbers
            if (this.isDigit(char)) {
                tokens.push(this.number())
                continue
            }

            // Strings
            if (char === '"') {
                tokens.push(this.string())
                continue
            }

            // Identifiers and Keywords
            if (this.isAlpha(char)) {
                tokens.push(this.identifier())
                continue
            }

            // Operators and Symbols
            tokens.push(this.operator())
        }

        tokens.push(this.makeToken(TokenType.EOF))
        return tokens
    }


    // Peak method gets the current character without advancing the position
    private peek(): string {
        return this.sourceCode[this.position]
    }

    // Advance method moves the position forward and returns the new current character
    private advance(): string {
        const char = this.sourceCode[this.position++]
        this.column++
        return char
    }

    // Advance line method moves to the next line
    private advanceLine() {
        this.advance()
        this.line++
        this.column = 1
    }

    // Is at end method checks if we've reached the end of the source code
    private isAtEnd(): boolean {
        return this.position >= this.sourceCode.length
    }

    private isDigit(c: string): boolean {
        return c >= "0" && c <= "9"
    }

    private isAlpha(c: string): boolean {
        return /[a-zA-Z_]/.test(c)
    }

    // Check if line is empty
    private isLineEmpty(): boolean {
        let pos = this.position;
        while (pos < this.sourceCode.length) {
            const char = this.sourceCode[pos];
            if (char === '\n') break;
            if (char !== ' ' && char !== '\t') return false;
            pos++;
        }
        return true;
    }


    // Make token method creates a new token
    private makeToken(type: TokenType, value?: string): Token {
        return {
            type,
            value,
            line: this.line,
            column: this.column
        }
    }

    private indent(): Token[] {
        let value = ""

        while (!this.isAtEnd() && this.peek() === ' ') {
            value += this.advance()
        }

        let prevIndentLevel = this.indentStack[this.indentStack.length - 1];
        let indentLevel = Math.floor(value.length / 4) // Assuming 4 spaces per indent
        console.log(`Indent level: ${indentLevel}, Previous indent level: ${prevIndentLevel}`);
        let result: Token[] = [];

        if (indentLevel > prevIndentLevel) {
            for (let i = 0; i < indentLevel - prevIndentLevel; i++) {
                result.push(this.makeToken(TokenType.INDENT))
            }
        } else if (indentLevel < prevIndentLevel) {
            for (let i = 0; i < prevIndentLevel - indentLevel; i++) {
                result.push(this.makeToken(TokenType.DEDENT))
            }
        }

        this.indentStack.push(indentLevel);

        if (this.expectedIndent) {
            if (indentLevel <= prevIndentLevel) {
                throw new Error(`Expected an indented block at line ${this.line}, column ${this.column}`);
            }
            else if (indentLevel - prevIndentLevel > 1) {
                throw new Error(`Indentation too deep at line ${this.line}, column ${this.column}`);
            }
            this.expectedIndent = false;
        }
        else {
            if (indentLevel > prevIndentLevel) {
                throw new Error(`Unexpected indent at line ${this.line}, column ${this.column}`);
            }
        }
        return result;
    }


    private number(): Token {
        let value = ""

        while (!this.isAtEnd() && this.isDigit(this.peek())) {
            value += this.advance()
        }

        // Handle fractional part
        if (this.peek() === ".") {
            value += this.advance()
            while (this.isDigit(this.peek())) {
                value += this.advance()
            }
        }

        return this.makeToken(TokenType.NUMBER, value)
    }

    private string(): Token {
        let value = ""
        this.advance() // Skip opening quote

        while (!this.isAtEnd() && this.peek() !== '"') {
            value += this.advance()
        }

        if (this.isAtEnd()) {
            throw new Error(`Unterminated string at line ${this.line}, column ${this.column}`)
        }

        this.advance() // Skip closing quote
        return this.makeToken(TokenType.STRING, value)
    }

    private identifier(): Token {
        let value = ""

        while (!this.isAtEnd() && (this.isAlpha(this.peek()) || this.isDigit(this.peek()))) {
            value += this.advance()
        }

        const lower = value.toLowerCase();

        if (lower === "true" || lower === "false") {
            return this.makeToken(TokenType.BOOLEAN, lower)
        }
        const type = KEYWORDS[lower] || TokenType.IDENTIFIER // Either a keyword or an identifier

        if (this.codeStyle === CodeStyle.INDENT && BLOCK_OPENERS.has(type)) {
            this.expectedIndent = true;
        }

        return this.makeToken(type, value)
    }

    private operator(): Token {
        const char = this.advance()

        switch (char) {
            case "=":
                if (this.peek() === "=") {
                    this.advance()
                    return this.makeToken(TokenType.DOUBLE_EQUALS)
                }
                return this.makeToken(TokenType.EQUALS)
            case "+":
                return this.makeToken(TokenType.PLUS)
            case "-":
                return this.makeToken(TokenType.MINUS)
            case "*":
                return this.makeToken(TokenType.STAR)
            case "/":
                return this.makeToken(TokenType.SLASH)
            case "(":
                return this.makeToken(TokenType.LEFT_PAREN)
            case ")":
                return this.makeToken(TokenType.RIGHT_PAREN)
            case "{":
                return this.makeToken(TokenType.LEFT_CURLY)
            case "}":
                return this.makeToken(TokenType.RIGHT_CURLY)
            case ",":
                return this.makeToken(TokenType.COMMA)
            case ":":
                return this.makeToken(TokenType.COLON)
            case "!":
                if (this.peek() === "=") {
                    this.advance()
                    return this.makeToken(TokenType.NOT_EQUALS)
                }
            case "<":
                if (this.peek() === "=") {
                    this.advance()
                    return this.makeToken(TokenType.LESS_EQUAL)
                }
                return this.makeToken(TokenType.LESS)
            case ">":
                if (this.peek() === "=") {
                    this.advance()
                    return this.makeToken(TokenType.GREATER_EQUAL)
                }
                return this.makeToken(TokenType.GREATER)
            default:
                throw new Error(`Unexpected character: ${char} at line ${this.line}, column ${this.column}`)
        }
    }
}