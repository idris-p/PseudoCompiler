import { CodeStyle } from "./CodeStyle.js";
import { CommentSymbol, COMMENT_SYMBOLS, AssignmentSymbol, ASSIGNMENT_SYMBOLS } from "./Symbols.js";

export interface UserConfig {
    codeStyle: CodeStyle;
    commentSyntax: CommentSymbol;
    assignmentSyntax: AssignmentSymbol;
    varSyntax: string;
    constSyntax: string;
    intSyntax: string;
    floatSyntax: string;
    charSyntax: string;
    stringSyntax: string;
    boolSyntax: string;
    inputSyntax: string;
    printSyntax: string;
    switchSyntax: string;
    foreachSyntax: string;
    breakSyntax: string;
    continueSyntax: string;
    passSyntax: string;
    lengthSyntax: string;
    substringSyntax: string;
    includesSyntax: string;
    meanSyntax: string;
    forInclusive: boolean[];
    switchFallthrough: boolean;
    arrayBase: 0 | 1;
    sliceUpperInclusive: boolean;
};

const DEFAULT_CONFIG: UserConfig = {
    codeStyle: CodeStyle.INDENT,
    commentSyntax: "#",
    assignmentSyntax: "=",
    varSyntax: "var",
    constSyntax: "const",
    intSyntax: "int",
    floatSyntax: "float",
    charSyntax: "char",
    stringSyntax: "string",
    boolSyntax: "bool",
    inputSyntax: "input",
    printSyntax: "print",
    switchSyntax: "switch",
    foreachSyntax: "foreach",
    breakSyntax: "break",
    continueSyntax: "continue",
    passSyntax: "pass",
    lengthSyntax: "len",
    substringSyntax: "substring",
    includesSyntax: "includes",
    meanSyntax: "mean",
    forInclusive: [true, false],
    switchFallthrough: false,
    arrayBase: 0,
    sliceUpperInclusive: false
};


function sanitizeCommentSymbol(value: unknown, fallback: CommentSymbol): CommentSymbol {
    if (typeof value !== "string") return fallback;

    return COMMENT_SYMBOLS.includes(value as CommentSymbol)
        ? (value as CommentSymbol)
        : fallback;
}

function sanitizeAssignmentSymbol(value: unknown, fallback: AssignmentSymbol): AssignmentSymbol {
    if (typeof value !== "string") return fallback;

    return ASSIGNMENT_SYMBOLS.includes(value as AssignmentSymbol)
        ? (value as AssignmentSymbol)
        : fallback;
}

function sanitizeString(value: unknown, fallback: string): string {
    if (typeof value !== "string") return fallback;

    const trimmed = value.trim().toLowerCase();
    return trimmed.length > 0 ? trimmed : fallback;
}

function sanitizeKeywordFields( parsed: any, defaults: UserConfig): Pick<UserConfig, "varSyntax" | "constSyntax" | "intSyntax" | "floatSyntax" | "charSyntax" | "stringSyntax" | "boolSyntax" | "inputSyntax" | "printSyntax" | "switchSyntax" | "foreachSyntax" | "breakSyntax" | "continueSyntax" | "passSyntax" | "lengthSyntax" | "substringSyntax" | "includesSyntax" | "meanSyntax"> {
    return {
        varSyntax: sanitizeString(parsed.varSyntax, defaults.varSyntax),
        constSyntax: sanitizeString(parsed.constSyntax, defaults.constSyntax),
        intSyntax: sanitizeString(parsed.intSyntax, defaults.intSyntax),
        floatSyntax: sanitizeString(parsed.floatSyntax, defaults.floatSyntax),
        charSyntax: sanitizeString(parsed.charSyntax, defaults.charSyntax),
        stringSyntax: sanitizeString(parsed.stringSyntax, defaults.stringSyntax),
        boolSyntax: sanitizeString(parsed.boolSyntax, defaults.boolSyntax),
        inputSyntax: sanitizeString(parsed.inputSyntax, defaults.inputSyntax),
        printSyntax: sanitizeString(parsed.printSyntax, defaults.printSyntax),
        switchSyntax: sanitizeString(parsed.switchSyntax, defaults.switchSyntax),
        foreachSyntax: sanitizeString(parsed.foreachSyntax, defaults.foreachSyntax),
        breakSyntax: sanitizeString(parsed.breakSyntax, defaults.breakSyntax),
        continueSyntax: sanitizeString(parsed.continueSyntax, defaults.continueSyntax),
        passSyntax: sanitizeString(parsed.passSyntax, defaults.passSyntax),
        lengthSyntax: sanitizeString(parsed.lengthSyntax, defaults.lengthSyntax),
        substringSyntax: sanitizeString(parsed.substringSyntax, defaults.substringSyntax),
        includesSyntax: sanitizeString(parsed.includesSyntax, defaults.includesSyntax),
        meanSyntax: sanitizeString(parsed.meanSyntax, defaults.meanSyntax)
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
            assignmentSyntax: sanitizeAssignmentSymbol(parsed.assignmentSyntax, DEFAULT_CONFIG.assignmentSyntax),
            ...sanitizeKeywordFields(parsed, DEFAULT_CONFIG),
            forInclusive: Array.isArray(parsed.forInclusive) && parsed.forInclusive.length === 2
                ? parsed.forInclusive.map((val: unknown, index: number) => typeof val === "boolean" ? val : DEFAULT_CONFIG.forInclusive[index])
                : DEFAULT_CONFIG.forInclusive,
            switchFallthrough: Boolean(parsed.switchFallthrough),
            arrayBase: parsed.arrayBase === 1 ? 1 : 0,
            sliceUpperInclusive: Boolean(parsed.sliceUpperInclusive)
        };
    }
    catch {
        return { ... DEFAULT_CONFIG };
    }
}

export const config: UserConfig = loadConfig();