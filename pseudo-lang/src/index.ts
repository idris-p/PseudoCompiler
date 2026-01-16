import { Lexer } from "./lexer/lexer.js"
import { Parser } from "./parser/parser.js"

export enum CodeStyle {
    INDENT = "INDENT",
    CURLY_BRACES = "CURLY_BRACES"
}

const source = `
x = 0
while x < 3
    if x == 1
        print "one"
    else
        print "not one"
    x = x + 1
print "done"

`;

const lexer = new Lexer(source, CodeStyle.INDENT)
const tokens = lexer.tokenize()

console.log("Tokens:")
console.log(tokens)

const parser = new Parser(tokens, CodeStyle.INDENT)
const ast = parser.parse()

console.log("AST:")
console.log(JSON.stringify(ast, null, 2))