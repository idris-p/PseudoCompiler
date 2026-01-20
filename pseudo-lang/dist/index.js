import { Lexer } from "./lexer/lexer.js";
import { Parser } from "./parser/parser.js";
import { Interpreter } from "./interpreter/interpreter.js";
export var CodeStyle;
(function (CodeStyle) {
    CodeStyle["INDENT"] = "INDENT";
    CodeStyle["CURLY_BRACES"] = "CURLY_BRACES";
})(CodeStyle || (CodeStyle = {}));
const source = `
x = 3
if x > 8
    print "x is greater than 8"
elseif x > 5
    print "x is greater than 5"
elseif x > 2 
    print "x is greater than 2"
else
    print "x is 2 or less"
`;
const style = CodeStyle.INDENT;
// const style = CodeStyle.CURLY_BRACES
const lexer = new Lexer(source, style);
const tokens = lexer.tokenize();
// console.log("Tokens:")
// console.log(tokens)
const parser = new Parser(tokens, style);
const ast = parser.parse();
// console.log("AST:")
// console.log(JSON.stringify(ast, null, 2))
const interpreter = new Interpreter();
interpreter.run(ast);
