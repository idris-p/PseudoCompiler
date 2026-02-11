import { config } from "../../../core/src/loader.js";
import { validateKeyword } from "../keywordValidator.js";
import { CodeStyle } from "../../../core/src/CodeStyle.js";
import { refreshPseudoLanguage } from "../pseudoLang.js";
import { useState } from "react";
import type Monaco from "monaco-editor";

interface ConfigMenuProps {
    monaco: typeof Monaco | null;
}

export default function ConfigMenu({ monaco }: ConfigMenuProps) {
    const [switchFallthrough, setSwitchFallthrough] = useState(config.switchFallthrough);
    const [printValue, setPrintValue] = useState(config.printSyntax);
    const [printError, setPrintError] = useState(false);

    function persistConfig() {
        localStorage.setItem("pseudoCodeConfig", JSON.stringify(config));
    }

    /* ---------------- Code Style ---------------- */

    const handleCodeStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        config.codeStyle =
            e.target.value === "indent"
                ? CodeStyle.INDENT
                : CodeStyle.CURLY_BRACES;

        persistConfig();
    };

    /* ---------------- Switch Fallthrough ---------------- */

    const handleSwitchFallthroughChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        config.switchFallthrough = e.target.checked;
        setSwitchFallthrough(e.target.checked);
        persistConfig();
    };

    /* ---------------- Print Keyword ---------------- */

    const handlePrintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPrintValue(value);

        const result = validateKeyword(value);

        if (!result.valid) {
            setPrintError(true);
            return;
        }

        setPrintError(false);

        config.printSyntax = value.trim().toLowerCase();
        persistConfig();

        // 🔥 Refresh Monaco tokenizer
        if (monaco) {
            refreshPseudoLanguage(monaco);
        }
    };

    return (
        <div className="h-full bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 p-8 overflow-y-scroll text-left">
            <h1 className="text-2xl font-bold mb-6 text-center">
                Configure Syntax
            </h1>

            {/* ---------------- Code Style ---------------- */}

            <label className="text-lg block mb-2 font-semibold">
                Code Style
            </label>

            <select
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded"
                value={config.codeStyle === CodeStyle.INDENT ? "indent" : "curly braces"}
                onChange={handleCodeStyleChange}
            >
                <option value="indent">Indentation Based</option>
                <option value="curly braces">Braces Based</option>
            </select>

            {/* ---------------- Print ---------------- */}

            <h2 className="text-xl font-bold mb-2 mt-4">
                Print Statement
            </h2>

            <label className="text-md block mb-2 font-semibold">
                Print Keyword
            </label>

            <input
                type="text"
                value={printValue}
                placeholder="print"
                onChange={handlePrintChange}
                className={`w-1/2 mb-4 p-2 border rounded ${
                    printError
                        ? "border-red-500"
                        : "border-gray-300"
                }`}
            />

            {printError && (
                <p className="text-red-500 text-sm mb-4">
                    Invalid keyword format.
                </p>
            )}

            {/* ---------------- Switch ---------------- */}

            <h2 className="text-xl font-bold mb-2 mt-6">
                Switch-Case
            </h2>

            <label className="text-md block mb-2 font-semibold">
                Switch Fallthrough
                <input
                    type="checkbox"
                    className="ml-2"
                    checked={switchFallthrough}
                    onChange={handleSwitchFallthroughChange}
                />
            </label>
        </div>
    );
}