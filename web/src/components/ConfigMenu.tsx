import { config } from "../../../core/src/loader.js";
import { CodeStyle } from "../../../core/src/CodeStyle.js";
import { refreshPseudoLanguage } from "../pseudoLang.js";
import KeywordField from "./KeywordField";
import { useState } from "react";
import type Monaco from "monaco-editor";

interface ConfigMenuProps {
    monaco: typeof Monaco | null;
}

export default function ConfigMenu({ monaco }: ConfigMenuProps) {
    const [switchFallthrough, setSwitchFallthrough] = useState(config.switchFallthrough);
    const [forInclusiveLower, setForInclusiveLower] = useState(config.forInclusive[0]);
    const [forInclusiveUpper, setForInclusiveUpper] = useState(config.forInclusive[1]);

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

    /* ---------------- Comment Symbol ---------------- */

    const handleCommentSymbolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        config.commentSyntax = e.target.value as typeof config.commentSyntax;
        persistConfig();
    };

    /* ---------------- Switch Fallthrough ---------------- */

    const handleSwitchFallthroughChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        config.switchFallthrough = e.target.checked;
        setSwitchFallthrough(e.target.checked);
        persistConfig();
    };


    return (
        <div className="h-full bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 p-8 overflow-y-scroll text-left">
            <h1 className="text-2xl font-bold mb-6 text-center">
                Configure Syntax
            </h1>

            <label className="text-lg block mb-2 font-semibold">
                Code Style
            </label>

            <select
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded"
                defaultValue={config.codeStyle === CodeStyle.INDENT ? "indent" : "curly braces"}
                onChange={handleCodeStyleChange}
            >
                <option value="indent">Indentation Based</option>
                <option value="curly braces">Braces Based</option>
            </select>

            <label className="text-lg block mb-2 font-semibold">
                Comment Symbol
            </label>

            <select
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded"
                defaultValue={config.commentSyntax}
                onChange={handleCommentSymbolChange}
            >
                <option value="#">#</option>
                <option value="//">//</option>
                <option value="%">%</option>
                <option value="--">--</option>
            </select>

            <h2 className="text-xl font-bold mb-2 mt-4">
                Print Statement
            </h2>

            <KeywordField
                label="Print Keyword"
                value={config.printSyntax}
                placeholder="print"
                onValidChange={(value) => {
                    config.printSyntax = value;
                    persistConfig();
                }}
                onAfterChange={() => {
                    if (monaco) refreshPseudoLanguage(monaco);
                }}
            />

            <h2 className="text-xl font-bold mb-2 mt-6">
                Switch-Case
            </h2>

            <label className="text-md block mb-4 font-semibold">
                Switch Fallthrough
                <input
                    type="checkbox"
                    className="ml-2"
                    checked={switchFallthrough}
                    onChange={handleSwitchFallthroughChange}
                />
            </label>

            <h2 className="text-xl font-bold mb-2 mt-4">
                For Loops
            </h2>

            <label className="text-md block mb-4 font-semibold">
                Lower Bound Inclusive
                <input
                    type="checkbox"
                    className="ml-2"
                    checked={forInclusiveLower}
                    onChange={(e) => {
                        setForInclusiveLower(e.target.checked);
                        config.forInclusive[0] = e.target.checked;
                        persistConfig();
                    }}
                />
            </label>

            <label className="text-md block mb-4 font-semibold">
                Upper Bound Inclusive
                <input
                    type="checkbox"
                    className="ml-2"
                    checked={forInclusiveUpper}
                    onChange={(e) => {
                        setForInclusiveUpper(e.target.checked);
                        config.forInclusive[1] = e.target.checked;
                        persistConfig();
                    }}
                />
            </label>

            <h2 className="text-xl font-bold mb-2 mt-4">
                Control Flow Statements
            </h2>

            <KeywordField
                label="Break Keyword"
                value={config.breakSyntax}
                placeholder="break"
                onValidChange={(value) => {
                    config.breakSyntax = value;
                    persistConfig();
                }}
                onAfterChange={() => {
                    if (monaco) refreshPseudoLanguage(monaco);
                }}
            />

            <KeywordField
                label="Pass Keyword"
                value={config.passSyntax}
                placeholder="pass"
                onValidChange={(value) => {
                    config.passSyntax = value;
                    persistConfig();
                }}
                onAfterChange={() => {
                    if (monaco) refreshPseudoLanguage(monaco);
                }}
            />
        </div>
    );
}