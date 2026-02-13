import { CodeStyle } from "./CodeStyle.js";
import { CommentSymbol, COMMENT_SYMBOLS } from "./CommentSymbols.js";

export interface UserConfig {
    codeStyle: CodeStyle;
    commentSyntax: CommentSymbol;
    printSyntax: string;
    breakSyntax: string;
    passSyntax: string;
    forInclusive: boolean[];
    switchFallthrough: boolean;
};

const DEFAULT_CONFIG: UserConfig = {
    codeStyle: CodeStyle.INDENT,
    commentSyntax: "#",
    printSyntax: "print",
    breakSyntax: "break",
    passSyntax: "pass",
    forInclusive: [true, false],
    switchFallthrough: false,
};


function sanitizeCommentSymbol(value: unknown, fallback: CommentSymbol): CommentSymbol {
    if (typeof value !== "string") return fallback;

    return COMMENT_SYMBOLS.includes(value as CommentSymbol)
        ? (value as CommentSymbol)
        : fallback;
}

function sanitizeString(value: unknown, fallback: string): string {
    if (typeof value !== "string") return fallback;

    const trimmed = value.trim().toLowerCase();
    return trimmed.length > 0 ? trimmed : fallback;
}

function sanitizeKeywordFields( parsed: any, defaults: UserConfig): Pick<UserConfig, "printSyntax" | "breakSyntax" | "passSyntax"> {
    return {
        printSyntax: sanitizeString(parsed.printSyntax, defaults.printSyntax),
        breakSyntax: sanitizeString(parsed.breakSyntax, defaults.breakSyntax),
        passSyntax: sanitizeString(parsed.passSyntax, defaults.passSyntax),
    };
}

function loadConfig(): UserConfig {
    try {
        const raw = localStorage.getItem("pseudoCodeConfig");
        if (!raw) {
            return { ... DEFAULT_CONFIG };
        }

        const parsed = JSON.parse(raw);
        return {
            codeStyle: parsed.codeStyle === CodeStyle.CURLY_BRACES ? CodeStyle.CURLY_BRACES : CodeStyle.INDENT,
            commentSyntax: sanitizeCommentSymbol(parsed.commentSyntax, DEFAULT_CONFIG.commentSyntax),
            ...sanitizeKeywordFields(parsed, DEFAULT_CONFIG),
            forInclusive: Array.isArray(parsed.forInclusive) && parsed.forInclusive.length === 2
                ? parsed.forInclusive.map((val: unknown, index: number) => typeof val === "boolean" ? val : DEFAULT_CONFIG.forInclusive[index])
                : DEFAULT_CONFIG.forInclusive,
            switchFallthrough: Boolean(parsed.switchFallthrough),
        };
    }
    catch {
        return { ... DEFAULT_CONFIG };
    }
}

export const config: UserConfig = loadConfig();