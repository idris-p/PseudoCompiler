// Types of Tokens
export var TokenType;
(function (TokenType) {
    // Keywords
    TokenType["IF"] = "IF";
    TokenType["THEN"] = "THEN";
    TokenType["ELSE_IF"] = "ELSE_IF";
    TokenType["ELSE"] = "ELSE";
    TokenType["END_IF"] = "END_IF";
    TokenType["SWITCH"] = "SWITCH";
    TokenType["CASE"] = "CASE";
    TokenType["DEFAULT"] = "DEFAULT";
    TokenType["END_SWITCH"] = "END_SWITCH";
    TokenType["BREAK"] = "BREAK";
    TokenType["FOR"] = "FOR";
    TokenType["TO"] = "TO";
    TokenType["STEP"] = "STEP";
    TokenType["END_FOR"] = "END_FOR";
    TokenType["WHILE"] = "WHILE";
    TokenType["END_WHILE"] = "END_WHILE";
    TokenType["PRINT"] = "PRINT";
    TokenType["PASS"] = "PASS";
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
    TokenType["PLUS_EQUALS"] = "PLUS_EQUALS";
    TokenType["DOUBLE_PLUS"] = "DOUBLE_PLUS";
    TokenType["MINUS_EQUALS"] = "MINUS_EQUALS";
    TokenType["DOUBLE_MINUS"] = "DOUBLE_MINUS";
    TokenType["STAR_EQUALS"] = "STAR_EQUALS";
    TokenType["DOUBLE_SLASH"] = "DOUBLE_SLASH";
    TokenType["DOUBLE_EQUALS"] = "DOUBLE_EQUALS";
    TokenType["SLASH_EQUALS"] = "SLASH_EQUALS";
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
