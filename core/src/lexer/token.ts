// Types of Tokens

export enum TokenType {
    // Keywords
    IF = "IF",
    THEN = "THEN",
    ELSE_IF = "ELSE_IF",
    ELSE = "ELSE",
    END_IF = "END_IF",

    SWITCH = "SWITCH",
    CASE = "CASE",
    DEFAULT = "DEFAULT",
    END_SWITCH = "END_SWITCH",
    BREAK = "BREAK",

    FOR = "FOR",
    END_FOR = "END_FOR",

    WHILE = "WHILE",
    END_WHILE = "END_WHILE",
    
    PRINT = "PRINT",
    PASS = "PASS",
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
    PLUS_EQUALS = "PLUS_EQUALS",
    DOUBLE_PLUS = "DOUBLE_PLUS",
    MINUS_EQUALS = "MINUS_EQUALS",
    DOUBLE_MINUS = "DOUBLE_MINUS",
    STAR_EQUALS = "STAR_EQUALS",
    DOUBLE_SLASH = "DOUBLE_SLASH",
    DOUBLE_EQUALS = "DOUBLE_EQUALS",
    SLASH_EQUALS = "SLASH_EQUALS",
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