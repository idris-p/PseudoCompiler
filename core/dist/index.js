import { Lexer } from "./lexer/lexer.js";
import { Parser } from "./parser/parser.js";
import { Interpreter } from "./interpreter/interpreter.js";
import { config } from "./loader.js";
export function runPseudoCode(source) {
    source = source.replace(/\t/g, "    "); // Replace tabs with 4 spaces for consistency
    // console.log("Source Code:")
    // console.log(source)
    // console.log("Using Switch Fallthrough:", config.switchFallthrough);
    const lexer = new Lexer(source, config.codeStyle);
    const tokens = lexer.tokenize();
    console.log("Tokens:");
    console.log(tokens);
    const parser = new Parser(tokens, config.codeStyle);
    const ast = parser.parse();
    console.log("AST:");
    console.log(JSON.stringify(ast, null, 2));
    const interpreter = new Interpreter();
    const output = interpreter.run(ast);
    return output;
}
runPseudoCode(`
count = 0

while true
	print count
	count = count + 1
	break
`);
