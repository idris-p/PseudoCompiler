import { TokenType, type Token } from "./token.js"
import { CodeStyle } from "../CodeStyle.js"
import { config } from "../loader.js";

function getKeywords(): Record<string, TokenType> {
    return {
        "if": TokenType.IF,
        "then": TokenType.THEN,
        "elseif": TokenType.ELSE_IF,
        "else": TokenType.ELSE,
        "endif": TokenType.END_IF,
        "switch": TokenType.SWITCH,
        "case": TokenType.CASE,
        "default": TokenType.DEFAULT,
        "endswitch": TokenType.END_SWITCH,
        "for": TokenType.FOR,
        "to": TokenType.TO,
        "step": TokenType.STEP,
        "endfor": TokenType.END_FOR,
        [config.breakSyntax]: TokenType.BREAK,
        "while": TokenType.WHILE,
        "endwhile": TokenType.END_WHILE,
        "end": TokenType.END,
        [config.printSyntax]: TokenType.PRINT,
        [config.inputSyntax]: TokenType.INPUT,
        [config.passSyntax]: TokenType.PASS,
        "mod": TokenType.MOD,
        "div": TokenType.DIV,
    }
}

// const KEYWORDS: Record<string, TokenType> = getKeywords();

const BLOCK_OPENERS: Set<TokenType> = new Set([
    TokenType.IF,
    TokenType.ELSE_IF,
    TokenType.ELSE,
    TokenType.SWITCH,
    TokenType.CASE,
    TokenType.DEFAULT,
    TokenType.FOR,
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
            if (char === '\n' || char === '\r') {
                this.advanceLine();

                if (this.isCommentLine()) {
                    this.skipLine()
                    continue
                }

                if (tokens.length > 0 && tokens[tokens.length - 1].type !== TokenType.NEWLINE) {
                    tokens.push(this.makeToken(TokenType.NEWLINE, "new line"))
                }
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
            if (char === '"' || char === "'") {
                tokens.push(this.string(char))
                continue
            }

            // Identifiers and Keywords
            if (this.isAlpha(char)) {
                tokens.push(this.identifier())
                continue
            }

            // Comments
            if (char === config.commentSyntax || char + this.peek() === config.commentSyntax) {
                // Skip comments
                while (!this.isAtEnd() && this.peek() !== '\n') {
                    this.advance()
                }
                continue
            }

            // Operators and Symbols
            tokens.push(this.operator())
        }

        tokens.push(this.makeToken(TokenType.EOF, "end of file"))
        return tokens
    }


    // Peak method gets the current character without advancing the position
    private peek(): string {
        return this.sourceCode[this.position]
    }

    // Peek next method looks ahead one character without advancing the position
    private peekNext(): string {
        if (this.position + 1 >= this.sourceCode.length) return "\0";
        return this.sourceCode[this.position + 1];
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

    private skipLine() {
        if (this.codeStyle === CodeStyle.INDENT) {
            while (!this.isAtEnd() && this.peek() !== '\n') {
                this.advance()
            }
        }
        else if (this.codeStyle === CodeStyle.CURLY_BRACES) {
            while (!this.isAtEnd() && this.peek() !== '\n' && this.peek() !== '}' && this.peek() !== ';') {
                this.advance()
            }
        }
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

    private isCommentLine(): boolean {
        let pos = this.position;
        while (pos < this.sourceCode.length) {
            const char = this.sourceCode[pos];
            if (char === ' ') {
                pos++;
                continue;
            }

            if (char === config.commentSyntax) return true;
            if (char === '\n') return false;
            return false;
        }
        return false;
    }


    // Make token method creates a new token
    private makeToken(type: TokenType, value: string): Token {
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
        let result: Token[] = [];

        if (indentLevel > prevIndentLevel) {
            for (let i = 0; i < indentLevel - prevIndentLevel; i++) {
                result.push(this.makeToken(TokenType.INDENT, "indent"))
            }
        } else if (indentLevel < prevIndentLevel) {
            for (let i = 0; i < prevIndentLevel - indentLevel; i++) {
                result.push(this.makeToken(TokenType.DEDENT, "dedent"))
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

    private string(quote_mark: string): Token {
        let value = ""
        this.advance() // Skip opening quote

        while (!this.isAtEnd() && this.peek() !== quote_mark) {
            if (this.peek() === "\\") {
                this.advance(); // consume '\'

                if (this.isAtEnd()) {
                    throw new Error(`Syntax Error: Unterminated escape sequence at line ${this.line}, column ${this.column}`);
                }

                const esc = this.advance(); // the escaped char

                switch (esc) {
                    case "n":  value += "\n"; break;
                    case "t":  value += "\t"; break;
                    case "'":  value += "'";  break;
                    case "\"": value += "\""; break;
                    case "\\": value += "\\"; break;
                    default:
                        throw new Error(`Syntax Error: Invalid escape sequence '\\${esc}' at line ${this.line}, column ${this.column}`);
                }
            }
            else {
                value += this.advance();
            }
        }

        if (this.isAtEnd()) {
            throw new Error(`Syntax Error: Unterminated string at line ${this.line}, column ${this.column}`)
        }

        this.advance() // Skip closing quote
        return this.makeToken(TokenType.STRING, value)
    }

    private identifier(): Token {
        const keywords = getKeywords();

        let core = "";
        while (!this.isAtEnd() && (this.isAlpha(this.peek()) || this.isDigit(this.peek()))) {
            core += this.advance();
        }

        // Probe ahead for a longer keyword that includes '.' / '-'
        let bestKeywordType: TokenType | null = null;
        let bestKeywordText: string | null = null;
        let bestKeywordEndPos = -1;

        let probePos = this.position;
        let probeText = core;

        while (probePos < this.sourceCode.length) {
            const sep = this.sourceCode[probePos];
            if (sep !== "." && sep !== "-") break;

            const after = this.sourceCode[probePos + 1];
            if (!after || !(this.isAlpha(after) || this.isDigit(after))) break;

            // Extend probeText with separator
            probeText += sep;
            probePos++;

            // Extend with following [a-zA-Z0-9_]+
            while (probePos < this.sourceCode.length) {
                const c = this.sourceCode[probePos];
                if (!(this.isAlpha(c) || this.isDigit(c))) break;
                probeText += c;
                probePos++;
            }

            const lowerProbe = probeText.toLowerCase();
            const keywordType = keywords[lowerProbe];

            if (keywordType) {
                bestKeywordType = keywordType;
                bestKeywordText = probeText;
                bestKeywordEndPos = probePos;
            }
        }

        // If we found an extended keyword, commit it by advancing to bestKeywordEndPos
        if (bestKeywordType !== null && bestKeywordText !== null) {
            while (this.position < bestKeywordEndPos) {
                this.advance();
            }

            if (this.codeStyle === CodeStyle.INDENT && BLOCK_OPENERS.has(bestKeywordType)) {
                this.expectedIndent = true;
            }

            return this.makeToken(bestKeywordType, bestKeywordText);
        }

        // Otherwise: treat as identifier/normal keyword/bool based on core only
        const lower = core.toLowerCase();

        if (lower === "true" || lower === "false") {
            return this.makeToken(TokenType.BOOLEAN, lower);
        }

        const type = keywords[lower] || TokenType.IDENTIFIER;

        if (this.codeStyle === CodeStyle.INDENT && BLOCK_OPENERS.has(type)) {
            this.expectedIndent = true;
        }

        return this.makeToken(type, core);
    }

    private operator(): Token {
        const char = this.advance()

        switch (char) {
            case "=":
                if (this.peek() === "=") {
                    this.advance()
                    return this.makeToken(TokenType.DOUBLE_EQUALS, "==")
                }
                return this.makeToken(TokenType.EQUALS, "=")
            case "+":
                if (this.peek() === "=") {
                    this.advance()
                    return this.makeToken(TokenType.PLUS_EQUALS, "+=")
                }
                if (this.peek() === "+") {
                    this.advance()
                    return this.makeToken(TokenType.DOUBLE_PLUS, "++")
                }
                return this.makeToken(TokenType.PLUS, "+")
            case "-":
                if (this.peek() === "=") {
                    this.advance()
                    return this.makeToken(TokenType.MINUS_EQUALS, "-=")
                }
                if (this.peek() === "-") {
                    this.advance()
                    return this.makeToken(TokenType.DOUBLE_MINUS, "--")
                }
                return this.makeToken(TokenType.MINUS, "-")
            case "*":
                if (this.peek() === "=") {
                    this.advance()
                    return this.makeToken(TokenType.STAR_EQUALS, "*=")
                }
                return this.makeToken(TokenType.STAR, "*")
            case "/":
                if (this.peek() === "=") {
                    this.advance()
                    return this.makeToken(TokenType.SLASH_EQUALS, "/=")
                }
                if (this.peek() === "/") {
                    this.advance()
                    return this.makeToken(TokenType.DOUBLE_SLASH, "//")
                }
                return this.makeToken(TokenType.SLASH, "/")
            case "%":
                return this.makeToken(TokenType.PERCENT, "%")
            case "(":
                return this.makeToken(TokenType.LEFT_PAREN, "(")
            case ")":
                return this.makeToken(TokenType.RIGHT_PAREN, ")")
            case "{":
                return this.makeToken(TokenType.LEFT_CURLY, "{")
            case "}":
                return this.makeToken(TokenType.RIGHT_CURLY, "}")
            case "[":
                return this.makeToken(TokenType.LEFT_SQUARE, "[")
            case "]":
                return this.makeToken(TokenType.RIGHT_SQUARE, "]")
            case ",":
                return this.makeToken(TokenType.COMMA, ",")
            case ":":
                if (this.peek() === "=") {
                    this.advance()
                    return this.makeToken(TokenType.COLON_EQUALS, ":=")
                }
                return this.makeToken(TokenType.COLON, ":")
            case ";":
                return this.makeToken(TokenType.SEMI_COLON, ";")
            case "!":
                if (this.peek() === "=") {
                    this.advance()
                    return this.makeToken(TokenType.NOT_EQUALS, "!=")
                }
            case "<":
                if (this.peek() === "=") {
                    this.advance()
                    return this.makeToken(TokenType.LESS_EQUAL, "<=")
                }
                if (this.peek() === "-" && config.assignmentSyntax === "<-") {
                    this.advance()
                    return this.makeToken(TokenType.LEFT_ARROW, "<-")
                }
                return this.makeToken(TokenType.LESS, "<")
            case ">":
                if (this.peek() === "=") {
                    this.advance()
                    return this.makeToken(TokenType.GREATER_EQUAL, ">=")
                }
                return this.makeToken(TokenType.GREATER, ">")
            default:
                throw new Error(`Syntax Error: Unexpected character '${char}' at line ${this.line}, column ${this.column - 1}`)
        }
    }
}