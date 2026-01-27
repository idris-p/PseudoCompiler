import type Monaco from "monaco-editor";

export function registerPseudoLanguage(monacoInstance: typeof Monaco) {
    monacoInstance.languages.register({ id: "pseudo" });

    monacoInstance.languages.setMonarchTokensProvider("pseudo", {
        tokenizer: {
        root: [
            [/\b(print|if|then|else|while|pass)\b/, "keyword"],
            [/\b(true|false)\b/, "boolean"],
            [/"[^"]*"/, "string"],
            [/\d+/, "number"],
            [/[a-zA-Z_]\w*/, "identifier"],
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
        ],
        autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "(", close: ")" },
        { open: `"`, close: `"` },
        ],
    });

    // monacoInstance.languages.registerCompletionItemProvider("pseudo", {
    //     provideCompletionItems: (model, position) => ({
    //         suggestions: [
    //         {
    //             label: "print",
    //             kind: monacoInstance.languages.CompletionItemKind.Function,
    //             insertText: 'print',
    //             insertTextRules:
    //             monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    //             range: new monacoInstance.Range(position.lineNumber, position.column, position.lineNumber, position.column),
    //         },
    //         {
    //             label: "if",
    //             kind: monacoInstance.languages.CompletionItemKind.Keyword,
    //             insertText: "if ($1) {\n\t$0\n}",
    //             insertTextRules:
    //             monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    //             range: new monacoInstance.Range(position.lineNumber, position.column, position.lineNumber, position.column),
    //         },
    //         ],
    //     }),
    // });
}
