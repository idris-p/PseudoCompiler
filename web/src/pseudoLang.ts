import type Monaco from "monaco-editor";
import { config } from "../../core/src/loader.js";

const KEYWORDS = [
    "if",
    "then",
    "else",
    "endif",
    "switch",
    "case",
    "default",
    "endswitch",
    "while",
    "endwhile",
    "pass",
    "break",
];

const BOOLEANS = ["true", "false"];

export function registerPseudoLanguage(monacoInstance: typeof Monaco) {
    monacoInstance.languages.register({ id: "pseudo" });

    setTokenizer(monacoInstance);
    setLanguageConfig(monacoInstance);
    registerCompletionProvider(monacoInstance);
}

/**
 * Call this whenever config.printSyntax changes.
 */
export function refreshPseudoLanguage(monacoInstance: typeof Monaco) {
    setTokenizer(monacoInstance);
}

/* ---------------- Tokenizer ---------------- */

function setTokenizer(monacoInstance: typeof Monaco) {
    const FUNCTIONS = [config.printSyntax];

    monacoInstance.languages.setMonarchTokensProvider("pseudo", {
        ignoreCase: true,

        tokenizer: {
            root: [
                // Comments
                [/#.*$/, "comment"],

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
            lineComment: "#",
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

function registerCompletionProvider(monacoInstance: typeof Monaco) {
    monacoInstance.languages.registerCompletionItemProvider("pseudo", {
        provideCompletionItems: (model, position) => {
            const FUNCTIONS = [config.printSyntax]; // dynamic

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

            const keywordSuggestions = KEYWORDS.map((kw) => ({
                label: kw,
                kind: monacoInstance.languages.CompletionItemKind.Keyword,
                insertText: kw,
                range,
            }));

            const functionSuggestions = FUNCTIONS.map((fn) => ({
                label: fn,
                kind: monacoInstance.languages.CompletionItemKind.Function,
                insertText: fn,
                range,
            }));

            const booleanSuggestions = BOOLEANS.map((bool) => ({
                label: bool,
                kind: monacoInstance.languages.CompletionItemKind.Constant,
                insertText: bool,
                range,
            }));

            const variableSuggestions = variables.map((v) => ({
                label: v,
                kind: monacoInstance.languages.CompletionItemKind.Variable,
                insertText: v,
                range,
            }));

            return {
                suggestions: [
                    ...keywordSuggestions,
                    ...functionSuggestions,
                    ...booleanSuggestions,
                    ...variableSuggestions,
                ],
            };
        },
    });
}