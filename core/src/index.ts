import { Lexer } from "./lexer/lexer.js"
import { Parser } from "./parser/parser.js"
import { Interpreter } from "./interpreter/interpreter.js"

export enum CodeStyle {
    INDENT = "INDENT",
    CURLY_BRACES = "CURLY_BRACES"
}

const source = `
x = 1
if x > 3 then {
    print "x is greater than 3"
}
elseif x == 3 then {
    print "x is equal to 3"
}
else {
    print "x is not greater than 3"
}
endif

while x < 5 {
    print x
    x = x + 1
}
endwhile
`;

// const style = CodeStyle.INDENT
const style = CodeStyle.CURLY_BRACES

const lexer = new Lexer(source, style)
const tokens = lexer.tokenize()

// console.log("Tokens:")
// console.log(tokens)

const parser = new Parser(tokens, style)
const ast = parser.parse()

// console.log("AST:")
// console.log(JSON.stringify(ast, null, 2))

const interpreter = new Interpreter()
interpreter.run(ast)