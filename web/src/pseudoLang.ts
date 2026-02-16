import type Monaco from "monaco-editor";
import { config } from "../../core/src/loader.js";

const STATIC_KEYWORDS = [
    "input",
    "if",
    "then",
    "elseif",
    "else",
    "endif",
    "switch",
    "case",
    "default",
    "endswitch",
    "for",
    "to",
    "step",
    "endfor",
    "while",
    "endwhile",
    "end",
    "mod",
    "div",
];

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
    const KEYWORDS = [...STATIC_KEYWORDS, config.breakSyntax, config.passSyntax];
    const FUNCTIONS = [config.printSyntax];

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
                [new RegExp(`\\b(${BOOLEANS.join("|")})\\b`), "constant.boolean"],

                // Strings
                [/"[^"]*"|'[^']*'/, "string"],

                // Numbers
                [/\d+/, "number"],

                // Identifiers
                [/[a-zA-Z_]\w*/, "identifier"],

                // Operators
                [/==|!=|<=|>=|<|>/, "operator"],
                [/[+\-*/]/, "operator"],
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
                const FUNCTIONS = [config.printSyntax];

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

                const KEYWORDS = [...STATIC_KEYWORDS, config.breakSyntax, config.passSyntax];

                const allSuggestions = [
                    ...KEYWORDS.map((kw) => ({
                        label: kw,
                        kind: monacoInstance.languages.CompletionItemKind.Keyword,
                        insertText: kw,
                        range,
                    })),
                    ...FUNCTIONS.map((fn) => ({
                        label: fn,
                        kind: monacoInstance.languages.CompletionItemKind.Function,
                        insertText: fn,
                        range,
                    })),
                    ...BOOLEANS.map((bool) => ({
                        label: bool,
                        kind: monacoInstance.languages.CompletionItemKind.Constant,
                        insertText: bool,
                        range,
                    })),
                    ...variables.map((v) => ({
                        label: v,
                        kind: monacoInstance.languages.CompletionItemKind.Variable,
                        insertText: v,
                        range,
                    })),
                ];

                // 🔥 Deduplicate by label
                const unique = Array.from(
                    new Map(allSuggestions.map(s => [s.label, s])).values()
                );

                return { suggestions: unique };
            },
        });
}