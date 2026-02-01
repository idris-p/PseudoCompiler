import { CodeStyle } from "./CodeStyle.js";

export interface UserConfig {
    codeStyle: CodeStyle;
    printSyntax: string;
    switchFallthrough: boolean;
};

const DEFAULT_CONFIG: UserConfig = {
    codeStyle: CodeStyle.INDENT,
    printSyntax: "print",
    switchFallthrough: false,
};

function loadConfig(): UserConfig {
    try {
        const raw = localStorage.getItem("pseudoCodeConfig");
        if (!raw) {
            return { ... DEFAULT_CONFIG };
        }

        const parsed = JSON.parse(raw);
        return {
            codeStyle: parsed.codeStyle === CodeStyle.CURLY_BRACES ? CodeStyle.CURLY_BRACES : CodeStyle.INDENT,
            printSyntax: typeof parsed.printSyntax.toLowerCase() === "string" && parsed.printSyntax.trim().length > 0 ? parsed.printSyntax.trim() : DEFAULT_CONFIG.printSyntax,
            switchFallthrough: Boolean(parsed.switchFallthrough),
        };
    }
    catch {
        return { ... DEFAULT_CONFIG };
    }
}

export const config: UserConfig = loadConfig();