import { config } from "../../../core/src/loader.js";
import { CodeStyle } from "../../../core/src/CodeStyle.js";
import { refreshPseudoLanguage } from "../pseudoLang.js";
import { validateConfigKeyword, type ConfigKeyField } from "../keywordValidator.js";
import KeywordField from "./KeywordField";
import React, { useState } from "react";
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

    const sections = [
        { id: "general", label: "General" },
        { id: "variables", label: "Variables" },
        { id: "data-types", label: "Data Types" },
        { id: "input-statement", label: "Input Statement" },
        { id: "print-statement", label: "Print Statement" },
        { id: "switch-case", label: "Switch-Case" },
        { id: "for-loops", label: "For Loops" },
        { id: "control-flow", label: "Control Flow" },
        { id: "functions", label: "Functions" },
        { id: "string-operations", label: "String Operations" },
        { id: "arrays", label: "Arrays" },
    ];

    const selectClass =
        "w-full md:w-2/3 mb-6 p-2 border border-gray-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800";
    const sectionClass =
        "mb-6 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/20 p-5";

    function persistConfig() {
        localStorage.setItem("pseudoCodeConfig", JSON.stringify(config));
    }

    function trySetKeywordField(field: ConfigKeyField, value: string): boolean {
        const result = validateConfigKeyword(field, value);

        if (!result.valid) {
            alert(result.error);
            return false;
        }

        config[field] = value as never;
        persistConfig();
        if (monaco) refreshPseudoLanguage(monaco);
        return true;
    }

    const handleCodeStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        config.codeStyle =
            e.target.value === "indent"
                ? CodeStyle.INDENT
                : CodeStyle.CURLY_BRACES;

        persistConfig();
    };

    const handleCommentSymbolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        config.commentSyntax = e.target.value as typeof config.commentSyntax;
        persistConfig();
    };

    const handleAssignmentSymbolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        config.assignmentSyntax = e.target.value as typeof config.assignmentSyntax;
        persistConfig();
    };

    const handleSwitchFallthroughChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        config.switchFallthrough = e.target.checked;
        setSwitchFallthrough(e.target.checked);
        persistConfig();
    };

    const handleArrayBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newBase = e.target.checked ? 0 : 1;
        config.arrayBase = newBase;
        setArrayBase(newBase);
        persistConfig();
    };

    return (
        <div className="h-full bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 overflow-hidden">
            <div className="h-full max-w-7xl mx-auto p-4 md:p-6 flex gap-6">
                <aside className="hidden md:block w-64 shrink-0">
                    <div className="sticky top-4 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900/30 p-4">
                        <h2 className="text-lg font-bold mb-3">Contents</h2>
                        <nav className="space-y-1">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="block px-2 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    {section.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto pr-1 md:pr-3">
                    <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
                        Configure Syntax
                    </h1>

                    <section id="general" className={sectionClass}>
                        <h2 className="text-xl font-bold mb-4">General</h2>

                        <label className="text-lg block mb-2 font-semibold">
                            Code Style
                        </label>
                        <select
                            className={selectClass}
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
                            className={selectClass}
                            defaultValue={config.commentSyntax}
                            onChange={handleCommentSymbolChange}
                        >
                            <option value="#">#</option>
                            <option value="//">//</option>
                            <option value="%">%</option>
                            <option value="--">--</option>
                        </select>
                    </section>

                    <section id="variables" className={sectionClass}>
                        <h2 className="text-xl font-bold mb-4">Variables</h2>

                        <label className="text-md block mb-2 font-semibold">
                            Assignment Symbol
                        </label>
                        <select
                            className={selectClass}
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
                            className={selectClass}
                            defaultValue={config.varSyntax}
                            onChange={(e) => {
                                trySetKeywordField("varSyntax", e.target.value);
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
                            className={selectClass}
                            defaultValue={config.constSyntax}
                            onChange={(e) => {
                                trySetKeywordField("constSyntax", e.target.value);
                            }}
                        >
                            <option value="const">const</option>
                            <option value="constant">constant</option>
                            <option value="final">final</option>
                        </select>
                    </section>

                    <section id="data-types" className={sectionClass}>
                        <h2 className="text-xl font-bold mb-4">Data Types</h2>

                        <label className="text-md block mb-2 font-semibold">
                            Integer Keyword
                        </label>
                        <select
                            className={selectClass}
                            defaultValue={config.intSyntax}
                            onChange={(e) => {
                                trySetKeywordField("intSyntax", e.target.value);
                            }}
                        >
                            <option value="int">int</option>
                            <option value="integer">integer</option>
                        </select>

                        <label className="text-md block mb-2 font-semibold">
                            Float Keyword
                        </label>
                        <select
                            className={selectClass}
                            defaultValue={config.floatSyntax}
                            onChange={(e) => {
                                trySetKeywordField("floatSyntax", e.target.value);
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
                            className={selectClass}
                            defaultValue={config.charSyntax}
                            onChange={(e) => {
                                trySetKeywordField("charSyntax", e.target.value);
                            }}
                        >
                            <option value="char">char</option>
                            <option value="character">character</option>
                        </select>

                        <label className="text-md block mb-2 font-semibold">
                            String Keyword
                        </label>
                        <select
                            className={selectClass}
                            defaultValue={config.stringSyntax}
                            onChange={(e) => {
                                trySetKeywordField("stringSyntax", e.target.value);
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
                            className={selectClass}
                            defaultValue={config.boolSyntax}
                            onChange={(e) => {
                                trySetKeywordField("boolSyntax", e.target.value);
                            }}
                        >
                            <option value="bool">bool</option>
                            <option value="boolean">boolean</option>
                            <option value="flag">flag</option>
                        </select>
                    </section>

                    <section id="input-statement" className={sectionClass}>
                        <h2 className="text-xl font-bold mb-4">Input Statement</h2>
                        <KeywordField
                            field="inputSyntax"
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
                    </section>

                    <section id="print-statement" className={sectionClass}>
                        <h2 className="text-xl font-bold mb-4">Print Statement</h2>
                        <KeywordField
                            field="printSyntax"
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
                    </section>

                    <section id="switch-case" className={sectionClass}>
                        <h2 className="text-xl font-bold mb-4">Switch-Case</h2>

                        <label className="text-md block mb-2 font-semibold">
                            Switch Keyword
                        </label>
                        <select
                            className={selectClass}
                            defaultValue={config.switchSyntax}
                            onChange={(e) => {
                                trySetKeywordField("switchSyntax", e.target.value);
                            }}
                        >
                            <option value="switch">switch</option>
                            <option value="match">match</option>
                        </select>

                        <label className="text-md block mb-2 font-semibold">
                            Switch Fallthrough
                            <input
                                type="checkbox"
                                className="ml-2"
                                checked={switchFallthrough}
                                onChange={handleSwitchFallthroughChange}
                            />
                        </label>
                    </section>

                    <section id="for-loops" className={sectionClass}>
                        <h2 className="text-xl font-bold mb-4">For Loops</h2>

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
                            className={selectClass}
                            defaultValue={config.foreachSyntax}
                            onChange={(e) => {
                                trySetKeywordField("foreachSyntax", e.target.value);
                            }}
                        >
                            <option value="foreach">foreach</option>
                            <option value="for-each">for-each</option>
                        </select>
                    </section>

                    <section id="control-flow" className={sectionClass}>
                        <h2 className="text-xl font-bold mb-4">Control Flow Statements</h2>

                        <KeywordField
                            field="breakSyntax"
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
                            field="continueSyntax"
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
                            field="passSyntax"
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
                    </section>

                    <section id="functions" className={sectionClass}>
                        <h2 className="text-xl font-bold mb-4">Functions</h2>

                        <label className="text-md block mb-2 font-semibold">
                            Function Keyword
                        </label>
                        <select
                            className={selectClass}
                            defaultValue={config.functionSyntax}
                            onChange={(e) => {
                                trySetKeywordField("functionSyntax", e.target.value);
                            }}
                        >
                            <option value="function">function</option>
                            <option value="def">def</option>
                            <option value="func">func</option>
                        </select>
                    </section>

                    <section id="string-operations" className={sectionClass}>
                        <h2 className="text-xl font-bold mb-4">String Operations</h2>

                        <KeywordField
                            field="lengthSyntax"
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
                            field="substringSyntax"
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
                    </section>

                    <section id="arrays" className={sectionClass}>
                        <h2 className="text-xl font-bold mb-4">Arrays</h2>

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
                            className={selectClass}
                            defaultValue={config.includesSyntax}
                            onChange={(e) => {
                                trySetKeywordField("includesSyntax", e.target.value);
                            }}
                        >
                            <option value="includes">includes</option>
                            <option value="contains">contains</option>
                        </select>

                        <label className="text-md block mb-2 font-semibold">
                            Mean Keyword
                        </label>
                        <select
                            className={selectClass}
                            defaultValue={config.meanSyntax}
                            onChange={(e) => {
                                trySetKeywordField("meanSyntax", e.target.value);
                            }}
                        >
                            <option value="mean">mean</option>
                            <option value="average">average</option>
                        </select>
                    </section>
                </main>
            </div>
        </div>
    );
}