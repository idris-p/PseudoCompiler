// Types of Tokens

export enum TokenType {
    // Keywords
    IF = "IF",
    THEN = "THEN",
    ELSE_IF = "ELSE_IF",
    ELIF = "ELIF",
    ELSE = "ELSE",
    END_IF = "END_IF",

    SWITCH = "SWITCH",
    CASE = "CASE",
    DEFAULT = "DEFAULT",
    END_SWITCH = "END_SWITCH",
    BREAK = "BREAK",

    FOR = "FOR",
    TO = "TO",
    STEP = "STEP",
    END_FOR = "END_FOR",
    CONTINUE = "CONTINUE",

    WHILE = "WHILE",
    END_WHILE = "END_WHILE",

    DO = "DO",
    UNTIL = "UNTIL",
    LOOP = "LOOP",

    END = "END",
    
    PRINT = "PRINT",
    INPUT = "INPUT",
    PASS = "PASS",
    // Identifiers and Literals
    IDENTIFIER = "IDENTIFIER",
    NUMBER = "NUMBER",
    STRING = "STRING",
    BOOLEAN = "BOOLEAN",

    // Variables and Constants
    VAR = "VAR",
    CONST = "CONST",
    // Types
    INT_TYPE = "INT_TYPE",
    FLOAT_TYPE = "FLOAT_TYPE",
    CHAR_TYPE = "CHAR_TYPE",
    STRING_TYPE = "STRING_TYPE",
    BOOL_TYPE = "BOOL_TYPE",

    // Operators
    EQUALS = "EQUALS",
    PLUS = "PLUS",
    MINUS = "MINUS",
    TIMES = "TIMES",
    DIVIDE = "DIVIDE",
    STAR = "STAR",
    SLASH = "SLASH",
    PERCENT = "PERCENT",
    MOD = "MOD",
    DIV = "DIV",
    CARET = "CARET",
    PLUS_EQUALS = "PLUS_EQUALS",
    DOUBLE_PLUS = "DOUBLE_PLUS",
    MINUS_EQUALS = "MINUS_EQUALS",
    DOUBLE_MINUS = "DOUBLE_MINUS",
    STAR_EQUALS = "STAR_EQUALS",
    DOUBLE_STAR = "DOUBLE_STAR",
    DOUBLE_SLASH = "DOUBLE_SLASH",
    DOUBLE_EQUALS = "DOUBLE_EQUALS",
    SLASH_EQUALS = "SLASH_EQUALS",
    NOT_EQUALS = "NOT_EQUALS",
    LESS = "LESS",
    GREATER = "GREATER",
    LESS_EQUAL = "LESS_EQUAL",
    GREATER_EQUAL = "GREATER_EQUAL",
    LEFT_ARROW = "LEFT_ARROW",
    COLON_EQUALS = "COLON_EQUALS",

    // Boolean Operators
    AND = "AND",
    OR = "OR",
    NOT = "NOT",

    // Symbols
    LEFT_PAREN = "LEFT_PAREN",
    RIGHT_PAREN = "RIGHT_PAREN",
    LEFT_CURLY = "LEFT_CURLY",
    RIGHT_CURLY = "RIGHT_CURLY",
    LEFT_SQUARE = "LEFT_SQUARE",
    RIGHT_SQUARE = "RIGHT_SQUARE",
    DOT = "DOT",
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