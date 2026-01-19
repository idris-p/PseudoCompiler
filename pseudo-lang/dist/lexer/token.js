// Types of Tokens
export var TokenType;
(function (TokenType) {
    // Keywords
    TokenType["IF"] = "IF";
    TokenType["ELSE"] = "ELSE";
    TokenType["WHILE"] = "WHILE";
    TokenType["PRINT"] = "PRINT";
    // Identifiers and Literals
    TokenType["IDENTIFIER"] = "IDENTIFIER";
    TokenType["NUMBER"] = "NUMBER";
    TokenType["STRING"] = "STRING";
    TokenType["BOOLEAN"] = "BOOLEAN";
    // Operators
    TokenType["EQUALS"] = "EQUALS";
    TokenType["PLUS"] = "PLUS";
    TokenType["MINUS"] = "MINUS";
    TokenType["STAR"] = "STAR";
    TokenType["SLASH"] = "SLASH";
    TokenType["DOUBLE_EQUALS"] = "DOUBLE_EQUALS";
    TokenType["NOT_EQUALS"] = "NOT_EQUALS";
    TokenType["LESS"] = "LESS";
    TokenType["GREATER"] = "GREATER";
    TokenType["LESS_EQUAL"] = "LESS_EQUAL";
    TokenType["GREATER_EQUAL"] = "GREATER_EQUAL";
    // Symbols
    TokenType["LEFT_PAREN"] = "LEFT_PAREN";
    TokenType["RIGHT_PAREN"] = "RIGHT_PAREN";
    TokenType["LEFT_CURLY"] = "LEFT_CURLY";
    TokenType["RIGHT_CURLY"] = "RIGHT_CURLY";
    TokenType["COMMA"] = "COMMA";
    TokenType["COLON"] = "COLON";
    TokenType["SEMI_COLON"] = "SEMI_COLON";
    // Structural
    TokenType["NEWLINE"] = "NEWLINE";
    TokenType["INDENT"] = "INDENT";
    TokenType["DEDENT"] = "DEDENT";
    TokenType["EOF"] = "EOF"; // End of File
})(TokenType || (TokenType = {}));
