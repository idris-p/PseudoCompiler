import { Lexer } from "./lexer/lexer.js"
import { Parser } from "./parser/parser.js"
import { Interpreter } from "./interpreter/interpreter.js"

export enum CodeStyle {
    INDENT = "INDENT",
    CURLY_BRACES = "CURLY_BRACES"
}

export function runPseudoCode(source: string, codeStyle: CodeStyle) {
    source = source.replace(/\t/g, "    "); // Replace tabs with 4 spaces for consistency

    const lexer = new Lexer(source, codeStyle)
    const tokens = lexer.tokenize()

    // console.log("Tokens:")
    // console.log(tokens)

    const parser = new Parser(tokens, codeStyle)
    const ast = parser.parse()

    // console.log("AST:")
    // console.log(JSON.stringify(ast, null, 2))

    const interpreter = new Interpreter()
    const output = interpreter.run(ast)

    return output;
}