import { Lexer } from "./lexer/lexer.js";
import { Parser } from "./parser/parser.js";
import { Interpreter } from "./interpreter/interpreter.js";
export var CodeStyle;
(function (CodeStyle) {
    CodeStyle["INDENT"] = "INDENT";
    CodeStyle["CURLY_BRACES"] = "CURLY_BRACES";
})(CodeStyle || (CodeStyle = {}));
const source = `
if true:
    print("Hello, World!")
    pass
    # This is a comment
`;
const style = CodeStyle.INDENT;
// const style = CodeStyle.CURLY_BRACES
const lexer = new Lexer(source, style);
const tokens = lexer.tokenize();
console.log("Tokens:");
console.log(tokens);
const parser = new Parser(tokens, style);
const ast = parser.parse();
// console.log("AST:")
// console.log(JSON.stringify(ast, null, 2))
const interpreter = new Interpreter();
interpreter.run(ast);
