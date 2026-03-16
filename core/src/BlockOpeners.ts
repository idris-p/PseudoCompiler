import { TokenType } from "./lexer/token"

export const BLOCK_OPENERS: Set<TokenType> = new Set([
    TokenType.IF,
    TokenType.ELSE_IF,
    TokenType.ELIF,
    TokenType.ELSE,
    TokenType.SWITCH,
    TokenType.CASE,
    TokenType.DEFAULT,
    TokenType.FOR,
    TokenType.FOREACH,
    TokenType.WHILE,
    TokenType.DO,
    TokenType.FUNCTION
])

export const BLOCK_CLOSERS: Set<TokenType> = new Set([
    TokenType.END_IF,
    TokenType.END_SWITCH,
    TokenType.END_FOR,
    TokenType.END_WHILE,
    TokenType.END,
    TokenType.LOOP,
    TokenType.END_FUNCTION
])

export const BLOCK_OPENERS_STRINGS: Set<string> = new Set(Array.from(BLOCK_OPENERS).map(tokenType => tokenType.toLowerCase()))
export const BLOCK_CLOSERS_STRINGS: Set<string> = new Set(Array.from(BLOCK_CLOSERS).map(tokenType => tokenType.toLowerCase()))