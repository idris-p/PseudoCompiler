import type Monaco from "monaco-editor";
import { config } from "../../core/src/loader.js";

export function registerPseudoLanguage(monacoInstance: typeof Monaco) {
    const KEYWORDS = ["if", "then", "else", "endif", "switch", "case", "default", "endswitch", "while", "endwhile", "pass", "break"];
    const FUNCTIONS = [config.printSyntax]
    const BOOLEANS = ["true", "false"];

    monacoInstance.languages.register({ id: "pseudo" });

    monacoInstance.languages.setMonarchTokensProvider("pseudo", {
        ignoreCase: true,

        tokenizer: {
            root: [
                // Comments
                [/#.*$/, "comment"],

                // Keywords
                [new RegExp(`\\b(${KEYWORDS.join("|")})\\b`), "keyword"],

                // Functions
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

    monacoInstance.languages.registerCompletionItemProvider("pseudo", {
        provideCompletionItems: (model, position) => {
            const word = model.getWordUntilPosition(position);
            const code = model.getValue();
            const variableMatches = code.match(/\b([a-zA-Z_]\w*)\s*=/g) || [];
            const variables = Array.from(new Set(variableMatches.map(v => v.replace(/\s*=$/, ""))));


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
                insertTextRules:
                    monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range,
            }));

            const functionSuggestions = FUNCTIONS.map((fn) => ({
                label: fn,
                kind: monacoInstance.languages.CompletionItemKind.Function,
                insertText: fn,
                insertTextRules:
                    monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range,
            }));

            const booleanSuggestions = BOOLEANS.map((bool) => ({
                label: bool,
                kind: monacoInstance.languages.CompletionItemKind.Constant,
                insertText: bool,
                insertTextRules:
                    monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range,
            }));

            const variableSuggestions = variables.map(v => ({
                label: v,
                kind: monacoInstance.languages.CompletionItemKind.Variable,
                insertText: v,
                range,
            }));

            return {
            suggestions: [...keywordSuggestions, ...functionSuggestions, ...booleanSuggestions, ...variableSuggestions],
            };
        },
    });
}