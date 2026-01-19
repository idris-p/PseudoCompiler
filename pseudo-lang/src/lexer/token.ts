// Types of Tokens

export enum TokenType {
    // Keywords
    IF = "IF",
    ELSE = "ELSE",
    WHILE = "WHILE",
    PRINT = "PRINT",
    // Identifiers and Literals
    IDENTIFIER = "IDENTIFIER",
    NUMBER = "NUMBER",
    STRING = "STRING",
    BOOLEAN = "BOOLEAN",

    // Operators
    EQUALS = "EQUALS",
    PLUS = "PLUS",
    MINUS = "MINUS",
    STAR = "STAR",
    SLASH = "SLASH",
    DOUBLE_EQUALS = "DOUBLE_EQUALS",
    NOT_EQUALS = "NOT_EQUALS",
    LESS = "LESS",
    GREATER = "GREATER",
    LESS_EQUAL = "LESS_EQUAL",
    GREATER_EQUAL = "GREATER_EQUAL",

    // Symbols
    LEFT_PAREN = "LEFT_PAREN",
    RIGHT_PAREN = "RIGHT_PAREN",
    LEFT_CURLY = "LEFT_CURLY",
    RIGHT_CURLY = "RIGHT_CURLY",
    COMMA = "COMMA",
    COLON = "COLON",
    SEMI_COLON = "SEMI_COLON",

    // Structural
    NEWLINE = "NEWLINE",
    INDENT = "INDENT",
    DEDENT = "DEDENT",
    EOF = "EOF" // End of File
}

export type Token = {
    type: TokenType;
    value?: string;
    line: number;
    column: number;
};