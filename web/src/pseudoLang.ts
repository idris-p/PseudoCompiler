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
    "to",
    "step",
    "endfor",
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
    "min",
    "max",
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
}

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ---------------- Tokenizer ---------------- */

function setTokenizer(monacoInstance: typeof Monaco) {
    const KEYWORDS = [...STATIC_KEYWORDS, config.varSyntax, config.constSyntax, config.intSyntax, config.floatSyntax, config.charSyntax, config.stringSyntax, config.boolSyntax, config.switchSyntax, "end" + config.switchSyntax, config.breakSyntax, config.continueSyntax, config.passSyntax];
    const FUNCTIONS = [...STATIC_FUNCTIONS, config.inputSyntax, config.printSyntax, config.lengthSyntax, config.substringSyntax, config.includesSyntax, config.meanSyntax];

    monacoInstance.languages.setMonarchTokensProvider("pseudo", {
        ignoreCase: true,

        tokenizer: {
            root: [
                // Comments
                [new RegExp(`${escapeRegex(config.commentSyntax)}.*$`), "comment"],

                // Keywords
                [new RegExp(`\\b(${KEYWORDS.join("|")})\\b`), "keyword"],

                // Functions (dynamic)
                [new RegExp(`\\b(${FUNCTIONS.join("|")})\\b`), "type.identifier"],

                // Booleans
                [new RegExp(`\\b(${BOOLEANS.join("|")})\\b`), "keyword"],

                // Strings (stateful, supports escapes + highlight them)
                [/"/, "string.quote", "@string_double"],
                [/'/, "string.quote", "@string_single"],

                // Numbers
                [/\d+(?:\.\d+)?f?\b/, "number"],

                // Constants
                [new RegExp(`\\b(${CONSTANTS.join("|")})\\b`), "number"],

                // Identifiers
                [/[a-zA-Z_]\w*/, "variable"],

                // Operators
                [/==|!=|<=|>=|<|>/, "operator"],
                [/[+\-*/]/, "operator"],
            ],
            string_double: [
                // Escape sequences (different colour)
                [/\\[nt"\\']/, "constant.character.escape"],

                // Anything except backslash or quote
                [/[^\\"]+/, "string"],

                // Closing quote
                [/"/, "string.quote", "@pop"],

                // Stray backslash (invalid escape) — still highlight it as escape-ish
                [/\\/, "invalid"],
            ],

            string_single: [
                [/\\[nt"\\']/,"constant.character.escape"],
                [/[^\\']+/, "string"],
                [/'/, "string.quote", "@pop"],
                [/\\/, "invalid"],
            ],
        },
    });
}

/* ---------------- Language Config ---------------- */

function setLanguageConfig(monacoInstance: typeof Monaco) {
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
            increaseIndentPattern: new RegExp(`^\\s*(${Array.from(BLOCK_OPENERS_STRINGS).join("|")}).*$`),
            decreaseIndentPattern: new RegExp(`^\\s*(${Array.from(BLOCK_CLOSERS_STRINGS).join("|")}).*$`),
        },
        onEnterRules: [
            {
                beforeText: new RegExp(`^\\s*(${Array.from(BLOCK_OPENERS_STRINGS).join("|")}).*$`),
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
    // Prevent duplicate providers
    if (completionDisposable) {
        completionDisposable.dispose();
    }

    completionDisposable =
        monacoInstance.languages.registerCompletionItemProvider("pseudo", {
            provideCompletionItems: (model, position) => {
                const FUNCTIONS = [...STATIC_FUNCTIONS, config.inputSyntax, config.printSyntax, config.lengthSyntax, config.substringSyntax, config.includesSyntax, config.meanSyntax];

                const word = model.getWordUntilPosition(position);
                const code = model.getValue();

                const variableMatches =
                    code.match(/\b([a-zA-Z_]\w*)\s*=/g) || [];

                const variables = Array.from(
                    new Set(
                        variableMatches.map((v) =>
                            v.replace(/\s*=$/, "")
                        )
                    )
                );

                const range = {
                    startLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endLineNumber: position.lineNumber,
                    endColumn: word.endColumn,
                };

                const KEYWORDS = [...STATIC_KEYWORDS, config.varSyntax, config.constSyntax, config.intSyntax, config.floatSyntax, config.charSyntax, config.stringSyntax, config.boolSyntax, config.switchSyntax, "end" + config.switchSyntax, config.breakSyntax, config.continueSyntax, config.passSyntax];

                const functionSuggestions = FUNCTIONS.map((fn) => {
                    // Special-case: input() with cursor inside brackets
                    if (fn.toLowerCase() === config.inputSyntax.toLowerCase() || FUNCTIONS.includes(fn)) {
                        return {
                        label: fn,
                        kind: monacoInstance.languages.CompletionItemKind.Function,
                        insertText: `${fn}($0)`,
                        insertTextRules:
                            monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        range,
                        };
                    }

                    // Normal functions
                    return {
                        label: fn,
                        kind: monacoInstance.languages.CompletionItemKind.Function,
                        insertText: fn,
                        range,
                    };
                });

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

                // Deduplicate by label
                const unique = Array.from(
                    new Map(allSuggestions.map(s => [s.label, s])).values()
                );

                return { suggestions: unique };
            },
        });
}