import { config } from "../../core/src/loader.js";

export type KeywordValidationResult = {
    valid: boolean;
    error?: string;
};

export const CONFIG_KEY_FIELDS = [
    "varSyntax",
    "constSyntax",
    "intSyntax",
    "floatSyntax",
    "charSyntax",
    "stringSyntax",
    "boolSyntax",
    "inputSyntax",
    "printSyntax",
    "switchSyntax",
    "foreachSyntax",
    "breakSyntax",
    "continueSyntax",
    "passSyntax",
    "lengthSyntax",
    "substringSyntax",
    "includesSyntax",
    "meanSyntax",
] as const;

export type ConfigKeyField = typeof CONFIG_KEY_FIELDS[number];

const FIELD_LABELS: Record<ConfigKeyField, string> = {
    varSyntax: "Variable Keyword",
    constSyntax: "Constant Keyword",
    intSyntax: "Integer Keyword",
    floatSyntax: "Float Keyword",
    charSyntax: "Character Keyword",
    stringSyntax: "String Keyword",
    boolSyntax: "Boolean Keyword",
    inputSyntax: "Input Keyword",
    printSyntax: "Print Keyword",
    switchSyntax: "Switch Keyword",
    foreachSyntax: "For Each Keyword",
    breakSyntax: "Break Keyword",
    continueSyntax: "Continue Keyword",
    passSyntax: "Pass Keyword",
    lengthSyntax: "Length Keyword",
    substringSyntax: "Substring Keyword",
    includesSyntax: "Includes Keyword",
    meanSyntax: "Mean Keyword",
};

const NON_CONFIGURABLE_RESERVED_WORDS = [
    "array",
    "if",
    "then",
    "elseif",
    "elif",
    "else",
    "endif",
    "case",
    "default",
    "for",
    "each",
    "to",
    "step",
    "endfor",
    "in",
    "while",
    "endwhile",
    "do",
    "until",
    "loop",
    "end",
    "mod",
    "div",
    "and",
    "or",
    "not",
    "true",
    "false",
    "pi"
];

export function validateKeyword(keyword: string): KeywordValidationResult {
    const trimmed = keyword.trim();

    if (trimmed.length === 0) {
        return { valid: false, error: "Keyword cannot be empty" };
    }

    if (!/^[a-zA-Z][a-zA-Z_.-]*$/.test(trimmed)) {
        return {
            valid: false,
            error: "Keyword must start with a letter and contain only letters, '_', '.' or '-'"
        };
    }

    return { valid: true };
}

export function validateConfigKeyword(
    field: ConfigKeyField,
    keyword: string
): KeywordValidationResult {
    const baseResult = validateKeyword(keyword);
    if (!baseResult.valid) {
        return baseResult;
    }

    const normalized = keyword.trim().toLowerCase();

    if (NON_CONFIGURABLE_RESERVED_WORDS.includes(normalized)) {
        return {
            valid: false,
            error: `'${normalized}' is a reserved keyword`
        };
    }

    for (const otherField of CONFIG_KEY_FIELDS) {
        if (otherField === field) continue;

        const otherValue = String(config[otherField]).trim().toLowerCase();

        if (normalized === otherValue) {
            return {
                valid: false,
                error: `'${normalized}' is already used by ${FIELD_LABELS[otherField]}`
            };
        }
    }

    return { valid: true };
}
