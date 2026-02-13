import { CodeStyle } from "./CodeStyle.js";
import { COMMENT_SYMBOLS } from "./CommentSymbols.js";
;
const DEFAULT_CONFIG = {
    codeStyle: CodeStyle.INDENT,
    commentSyntax: "#",
    printSyntax: "print",
    breakSyntax: "break",
    passSyntax: "pass",
    switchFallthrough: false,
};
function sanitizeCommentSymbol(value, fallback) {
    if (typeof value !== "string")
        return fallback;
    return COMMENT_SYMBOLS.includes(value)
        ? value
        : fallback;
}
function sanitizeString(value, fallback) {
    if (typeof value !== "string")
        return fallback;
    const trimmed = value.trim().toLowerCase();
    return trimmed.length > 0 ? trimmed : fallback;
}
function sanitizeKeywordFields(parsed, defaults) {
    return {
        printSyntax: sanitizeString(parsed.printSyntax, defaults.printSyntax),
        breakSyntax: sanitizeString(parsed.breakSyntax, defaults.breakSyntax),
        passSyntax: sanitizeString(parsed.passSyntax, defaults.passSyntax),
    };
}
function loadConfig() {
    try {
        const raw = localStorage.getItem("pseudoCodeConfig");
        if (!raw) {
            return { ...DEFAULT_CONFIG };
        }
        const parsed = JSON.parse(raw);
        return {
            codeStyle: parsed.codeStyle === CodeStyle.CURLY_BRACES ? CodeStyle.CURLY_BRACES : CodeStyle.INDENT,
            commentSyntax: sanitizeCommentSymbol(parsed.commentSyntax, DEFAULT_CONFIG.commentSyntax),
            ...sanitizeKeywordFields(parsed, DEFAULT_CONFIG),
            switchFallthrough: Boolean(parsed.switchFallthrough),
        };
    }
    catch {
        return { ...DEFAULT_CONFIG };
    }
}
export const config = loadConfig();
