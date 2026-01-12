import { Lexer, CodeStyle } from "./lexer/lexer.js"

const source = `
if x > 3
    
    print "still ok"
`

const lexer = new Lexer(source, CodeStyle.INDENT)
const tokens = lexer.tokenize()

console.log(tokens)
