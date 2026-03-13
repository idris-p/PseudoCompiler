import { config } from "../../../core/src/loader.js";
import { CodeStyle } from "../../../core/src/CodeStyle.js";
import { refreshPseudoLanguage } from "../pseudoLang.js";
import { validateKeyword } from "../keywordValidator.js";
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
    const [arrayBase, setArrayBase] = useState(config.arrayBase);
    const [sliceUpperInclusive, setSliceUpperInclusive] = useState(config.sliceUpperInclusive);

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

    /* ---------------- Assignment Symbol ---------------- */

    const handleAssignmentSymbolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        config.assignmentSyntax = e.target.value as typeof config.assignmentSyntax;
        persistConfig();
    };

    /* ---------------- Switch Fallthrough ---------------- */

    const handleSwitchFallthroughChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        config.switchFallthrough = e.target.checked;
        setSwitchFallthrough(e.target.checked);
        persistConfig();
    };

    /* ---------------- Array Base ---------------- */

    const handleArrayBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newBase = e.target.checked ? 0 : 1;
        config.arrayBase = newBase;
        setArrayBase(newBase);
        persistConfig();
    }


    return (
        <div className="h-full bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 p-8 overflow-y-scroll text-left">
            <h1 className="text-2xl font-bold mb-6 text-center">
                Configure Syntax
            </h1>

            <label className="text-lg block mb-2 font-semibold">
                Code Style
            </label>

            <select
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded dark:bg-neutral-800"
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
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded dark:bg-neutral-800"
                defaultValue={config.commentSyntax}
                onChange={handleCommentSymbolChange}
            >
                <option value="#">#</option>
                <option value="//">//</option>
                <option value="%">%</option>
                <option value="--">--</option>
            </select>

            <h2 className="text-xl font-bold mb-2 mt-4">
                Variables
            </h2>

            <label className="text-md block mb-2 font-semibold">
                Assignment Symbol
            </label>

            <select
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded dark:bg-neutral-800"
                defaultValue={config.assignmentSyntax}
                onChange={handleAssignmentSymbolChange}
            >
                <option value="=">=</option>
                <option value="<-">&lt;-</option>
                <option value=":=">:=</option>
            </select>

            <label className="text-md block mb-2 font-semibold">
                Variable Keyword
            </label>
            <select
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded dark:bg-neutral-800"
                defaultValue={config.varSyntax}
                onChange={(e) => {
                    config.varSyntax = e.target.value as typeof config.varSyntax;
                    persistConfig();
                    if (monaco) refreshPseudoLanguage(monaco);
                }}
            >
                <option value="var">var</option>
                <option value="variable">variable</option>
                <option value="let">let</option>
                <option value="dim">dim</option>
            </select>

            <label className="text-md block mb-2 font-semibold">
                Constant Keyword
            </label>
            <select
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded dark:bg-neutral-800"
                defaultValue={config.constSyntax}
                onChange={(e) => {
                    config.constSyntax = e.target.value as typeof config.constSyntax;
                    persistConfig();
                    if (monaco) refreshPseudoLanguage(monaco);
                }}
            >
                <option value="const">const</option>
                <option value="constant">constant</option>
                <option value="final">final</option>
            </select>

            <h2 className="text-xl font-bold mb-2 mt-4">
                Data Types
            </h2>

            <label className="text-md block mb-2 font-semibold">
                Integer Keyword
            </label>
            <select
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded dark:bg-neutral-800"
                defaultValue={config.intSyntax}
                onChange={(e) => {
                    config.intSyntax = e.target.value as typeof config.intSyntax;
                    persistConfig();
                    if (monaco) refreshPseudoLanguage(monaco);
                }}
            >
                <option value="int">int</option>
                <option value="integer">integer</option>
            </select>

            <label className="text-md block mb-2 font-semibold">
                Float Keyword
            </label>
            <select
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded dark:bg-neutral-800"
                defaultValue={config.floatSyntax}
                onChange={(e) => {
                    config.floatSyntax = e.target.value as typeof config.floatSyntax;
                    persistConfig();
                    if (monaco) refreshPseudoLanguage(monaco);
                }}
            >
                <option value="float">float</option>
                <option value="decimal">decimal</option>
                <option value="real">real</option>
            </select>

            <label className="text-md block mb-2 font-semibold">
                Character Keyword
            </label>
            <select
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded dark:bg-neutral-800"
                defaultValue={config.charSyntax}
                onChange={(e) => {
                    config.charSyntax = e.target.value as typeof config.charSyntax;
                    persistConfig();
                    if (monaco) refreshPseudoLanguage(monaco);
                }}
            >
                <option value="char">char</option>
                <option value="character">character</option>
            </select>

            <label className="text-md block mb-2 font-semibold">
                String Keyword
            </label>
            <select
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded dark:bg-neutral-800"
                defaultValue={config.stringSyntax}
                onChange={(e) => {
                    config.stringSyntax = e.target.value as typeof config.stringSyntax;
                    persistConfig();
                    if (monaco) refreshPseudoLanguage(monaco);
                }}
            >
                <option value="str">str</option>
                <option value="string">string</option>
                <option value="text">text</option>
            </select>

            <label className="text-md block mb-2 font-semibold">
                Boolean Keyword
            </label>
            <select
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded dark:bg-neutral-800"
                defaultValue={config.boolSyntax}
                onChange={(e) => {
                    config.boolSyntax = e.target.value as typeof config.boolSyntax;
                    persistConfig();
                    if (monaco) refreshPseudoLanguage(monaco);
                }}
            >
                <option value="bool">bool</option>
                <option value="boolean">boolean</option>
                <option value="flag">flag</option>
            </select>


            <h2 className="text-xl font-bold mb-2 mt-4">
                Input Statement
            </h2>

            <KeywordField
                label="Input Keyword"
                value={config.inputSyntax}
                placeholder="input"
                onValidChange={(value) => {
                    config.inputSyntax = value;
                    persistConfig();
                }}
                onAfterChange={() => {
                    if (monaco) refreshPseudoLanguage(monaco);
                }}
            />

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

            <label className="text-md block mb-2 font-semibold">
                Switch Keyword
            </label>
            <select
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded dark:bg-neutral-800"
                defaultValue={config.switchSyntax}
                onChange={(e) => {
                    config.switchSyntax = e.target.value as typeof config.switchSyntax;
                    persistConfig();
                    if (monaco) refreshPseudoLanguage(monaco);
                }}
            >
                <option value="switch">switch</option>
                <option value="match">match</option>
            </select>

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

            <label className="text-md block mb-2 font-semibold">
                For Each Keyword
            </label>
            <select
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded dark:bg-neutral-800"
                defaultValue={config.foreachSyntax}
                onChange={(e) => {
                    const value = e.target.value as typeof config.foreachSyntax;
                    if (validateKeyword(value)) {
                        config.foreachSyntax = value;
                        persistConfig();
                        if (monaco) refreshPseudoLanguage(monaco);
                    }
                }}
            >
                <option value="foreach">foreach</option>
                <option value="for-each">for-each</option>
            </select>

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
                label="Continue Keyword"
                value={config.continueSyntax}
                placeholder="continue"
                onValidChange={(value) => {
                    config.continueSyntax = value;
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

            <h2 className="text-xl font-bold mb-2 mt-4">
                String Operations
            </h2>

            <KeywordField
                label="Length Keyword"
                value={config.lengthSyntax}
                placeholder="len"
                onValidChange={(value) => {
                    config.lengthSyntax = value;
                    persistConfig();
                }}
                onAfterChange={() => {
                    if (monaco) refreshPseudoLanguage(monaco);
                }}
            />

            <KeywordField
                label="Substring Keyword"
                value={config.substringSyntax}
                placeholder="substring"
                onValidChange={(value) => {
                    config.substringSyntax = value;
                    persistConfig();
                }}
                onAfterChange={() => {
                    if (monaco) refreshPseudoLanguage(monaco);
                }}
            />

            <h2 className="text-xl font-bold mb-2 mt-4">
                Arrays
            </h2>

            <label className="text-md block mb-4 font-semibold">
                Zero-based
                <input
                    type="checkbox"
                    className="ml-2"
                    checked={arrayBase === 0}
                    onChange={handleArrayBaseChange}
                />
            </label>

            <label className="text-md block mb-4 font-semibold">
                Slice Upper Inclusive
                <input
                    type="checkbox"
                    className="ml-2"
                    checked={sliceUpperInclusive}
                    onChange={(e) => {
                        setSliceUpperInclusive(e.target.checked);
                        config.sliceUpperInclusive = e.target.checked;
                        persistConfig();
                    }}
                />
            </label>

            <label className="text-md block mb-2 font-semibold">
                Includes Keyword
            </label>
            <select
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded dark:bg-neutral-800"
                defaultValue={config.includesSyntax}
                onChange={(e) => {
                    config.includesSyntax = e.target.value as typeof config.includesSyntax;
                    persistConfig();
                    if (monaco) refreshPseudoLanguage(monaco);
                }}
            >
                <option value="includes">includes</option>
                <option value="contains">contains</option>
            </select>

            <label className="text-md block mb-2 font-semibold">
                Mean Keyword
            </label>
            <select
                className="w-1/2 mb-6 p-2 border border-gray-300 rounded dark:bg-neutral-800"
                defaultValue={config.meanSyntax}
                onChange={(e) => {
                    config.meanSyntax = e.target.value as typeof config.meanSyntax;
                    persistConfig();
                    if (monaco) refreshPseudoLanguage(monaco);
                }}
            >
                <option value="mean">mean</option>
                <option value="average">average</option>
            </select>
        </div>
    );
}