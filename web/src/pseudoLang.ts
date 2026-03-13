import type Monaco from "monaco-editor";
import { config } from "../../core/src/loader.js";
import { BLOCK_OPENERS_STRINGS, BLOCK_CLOSERS_STRINGS } from "../../core/src/BlockOpeners.js";

const STATIC_KEYWORDS = [
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
    "not"
];

const STATIC_FUNCTIONS = [
    "index",

    "pow",
    "sqrt",
    "max",
    "min",
    "floor",
    "ceil",
    "round",
    "sin",
    "cos",
    "tan",
    "sec",
    "cosec",
    "cot",
    "sinh",
    "cosh",
    "tanh",
    "exp",
    "ln",
    "log",
    "abs",

    "append",
    "pop",
    "insert",
    "remove",
    "subarray",
    "isEmpty",
    "indexOf",
    "count",
    "sort",
    "reverse",
    "join",
    "sum",
    "median",
    "mode",
    "product"
];

const CONSTANTS = ["pi"];
const BOOLEANS = ["true", "false"];

export function registerPseudoLanguage(monacoInstance: typeof Monaco) {
    monacoInstance.languages.register({ id: "pseudo" });

    setTokenizer(monacoInstance);
    setLanguageConfig(monacoInstance);
    registerCompletionProvider(monacoInstance);
}

export function refreshPseudoLanguage(monacoInstance: typeof Monaco) {
    setTokenizer(monacoInstance);
    setLanguageConfig(monacoInstance);
}

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function uniqueCaseInsensitive(values: string[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const value of values) {
        const key = value.toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            result.push(value);
        }
    }

    return result;
}

function buildAlternationPattern(values: string[]): string {
    return uniqueCaseInsensitive(values)
        .slice()
        .sort((a, b) => b.length - a.length)
        .map(escapeRegex)
        .join("|");
}

function buildWordRegex(values: string[]): RegExp {
    const pattern = buildAlternationPattern(values);

    if (!pattern) {
        return /$a/;
    }

    return new RegExp(`\\b(?:${pattern})\\b`);
}

function buildLineStartRegex(values: Iterable<string>): RegExp {
    const pattern = buildAlternationPattern(Array.from(values));

    if (!pattern) {
        return /^$/;
    }

    return new RegExp(`^\\s*(?:${pattern})\\b.*$`, "i");
}

function getDynamicKeywords(): string[] {
    return [
        ...STATIC_KEYWORDS,
        config.varSyntax,
        config.constSyntax,
        config.intSyntax,
        config.floatSyntax,
        config.charSyntax,
        config.stringSyntax,
        config.boolSyntax,
        config.switchSyntax,
        "end" + config.switchSyntax,
        config.foreachSyntax,
        config.breakSyntax,
        config.continueSyntax,
        config.passSyntax
    ];
}

function getDynamicFunctions(): string[] {
    return [
        ...STATIC_FUNCTIONS,
        config.inputSyntax,
        config.printSyntax,
        config.lengthSyntax,
        config.substringSyntax,
        config.includesSyntax,
        config.meanSyntax
    ];
}

/* ---------------- Tokenizer ---------------- */

function setTokenizer(monacoInstance: typeof Monaco) {
    const KEYWORDS = getDynamicKeywords();
    const FUNCTIONS = getDynamicFunctions();

    const keywordRegex = buildWordRegex(KEYWORDS);
    const functionRegex = buildWordRegex(FUNCTIONS);
    const booleanRegex = buildWordRegex(BOOLEANS);
    const constantRegex = buildWordRegex(CONSTANTS);

    monacoInstance.languages.setMonarchTokensProvider("pseudo", {
        ignoreCase: true,

        tokenizer: {
            root: [
                // Comments
                [new RegExp(`${escapeRegex(config.commentSyntax)}.*$`), "comment"],

                // Keywords
                [keywordRegex, "keyword"],

                // Functions
                [functionRegex, "type.identifier"],

                // Booleans
                [booleanRegex, "keyword"],

                // Strings
                [/"/, "string.quote", "@string_double"],
                [/'/, "string.quote", "@string_single"],

                // Numbers
                [/\d+(?:\.\d+)?f?\b/, "number"],

                // Constants
                [constantRegex, "number"],

                // Identifiers
                [/[a-zA-Z_]\w*/, "variable"],

                // Operators
                [/==|!=|<=|>=|<|>/, "operator"],
                [/[+\-*/]/, "operator"],
            ],

            string_double: [
                [/\\[nt"\\']/, "constant.character.escape"],
                [/[^\\"]+/, "string"],
                [/"/, "string.quote", "@pop"],
                [/\\/, "invalid"],
            ],

            string_single: [
                [/\\[nt"\\']/, "constant.character.escape"],
                [/[^\\']+/, "string"],
                [/'/, "string.quote", "@pop"],
                [/\\/, "invalid"],
            ],
        },
    });
}

/* ---------------- Language Config ---------------- */

function setLanguageConfig(monacoInstance: typeof Monaco) {
    const increaseIndentPattern = buildLineStartRegex(BLOCK_OPENERS_STRINGS);
    const decreaseIndentPattern = buildLineStartRegex(BLOCK_CLOSERS_STRINGS);

    monacoInstance.languages.setLanguageConfiguration("pseudo", {
        comments: {
            lineComment: config.commentSyntax,
        },
        brackets: [
            ["{", "}"],
            ["(", ")"],
            ["[", "]"],
        ],
        autoClosingPairs: [
            { open: "{", close: "}" },
            { open: "(", close: ")" },
            { open: "[", close: "]" },
            { open: `"`, close: `"` },
            { open: "'", close: "'" },
        ],
        indentationRules: {
            increaseIndentPattern,
            decreaseIndentPattern,
        },
        onEnterRules: [
            {
                beforeText: increaseIndentPattern,
                action: {
                    indentAction: monacoInstance.languages.IndentAction.Indent
                }
            }
        ]
    });
}

/* ---------------- Completion Provider ---------------- */

let completionDisposable: Monaco.IDisposable | null = null;

function registerCompletionProvider(monacoInstance: typeof Monaco) {
    if (completionDisposable) {
        completionDisposable.dispose();
    }

    completionDisposable =
        monacoInstance.languages.registerCompletionItemProvider("pseudo", {
            provideCompletionItems: (model, position) => {
                const FUNCTIONS = getDynamicFunctions();
                const KEYWORDS = getDynamicKeywords();

                const word = model.getWordUntilPosition(position);
                const code = model.getValue();

                const variableNames = new Set<string>();

                // Assignments: x = ...
                for (const match of code.matchAll(/\b([a-zA-Z_]\w*)\s*=/gi)) {
                    variableNames.add(match[1]);
                }

                // Declarations: var x, const x, int x, float x, string x, bool x, char x, array x
                const declarationKeywords = [
                    config.varSyntax,
                    config.constSyntax,
                    config.intSyntax,
                    config.floatSyntax,
                    config.charSyntax,
                    config.stringSyntax,
                    config.boolSyntax,
                    "array"
                ]
                    .map(escapeRegex)
                    .join("|");

                for (const match of code.matchAll(
                    new RegExp(`\\b(?:${declarationKeywords})\\b\\s+([a-zA-Z_]\\w*)`, "gi")
                )) {
                    variableNames.add(match[1]);
                }

                // Foreach: for value in array / for each value in array
                for (const match of code.matchAll(/\bfor\b(?:\s+each)?\s+([a-zA-Z_]\w*)\s+\bin\b/gi)) {
                    variableNames.add(match[1]);
                }

                // Foreach with parens: for (value : array) / for each (value : array)
                for (const match of code.matchAll(/\bfor\b(?:\s+each)?\s*\(\s*([a-zA-Z_]\w*)\s*:/gi)) {
                    variableNames.add(match[1]);
                }

                const variables = Array.from(variableNames);

                const range = {
                    startLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endLineNumber: position.lineNumber,
                    endColumn: word.endColumn,
                };

                const functionSuggestions = FUNCTIONS.map((fn) => ({
                    label: fn,
                    kind: monacoInstance.languages.CompletionItemKind.Function,
                    insertText: `${fn}($0)`,
                    insertTextRules:
                        monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range,
                }));

                const allSuggestions = [
                    ...KEYWORDS.map((kw) => ({
                        label: kw,
                        kind: monacoInstance.languages.CompletionItemKind.Keyword,
                        insertText: kw,
                        range,
                    })),
                    ...functionSuggestions,
                    ...BOOLEANS.map((bool) => ({
                        label: bool,
                        kind: monacoInstance.languages.CompletionItemKind.Constant,
                        insertText: bool,
                        range,
                    })),
                    ...CONSTANTS.map((constant) => ({
                        label: constant,
                        kind: monacoInstance.languages.CompletionItemKind.Constant,
                        insertText: constant,
                        range,
                    })),
                    ...variables.map((v) => ({
                        label: v,
                        kind: monacoInstance.languages.CompletionItemKind.Variable,
                        insertText: v,
                        range,
                    })),
                ];

                const unique = Array.from(
                    new Map(allSuggestions.map(s => [s.label.toLowerCase(), s])).values()
                );

                return { suggestions: unique };
            },
        });
}