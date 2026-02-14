import { config } from "../../../core/src/loader.js";
import { CodeStyle } from "../../../core/src/CodeStyle.js";
import { refreshPseudoLanguage } from "../pseudoLang.js";
import KeywordField from "./KeywordField";
import { useState } from "react";
import type Monaco from "monaco-editor";

interface ConfigMenuProps {
    monaco: typeof Monaco | null;
}

const sectionCardClass = "rounded-xl border border-slate-200 bg-white/90 p-5 shadow-sm ring-1 ring-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:ring-slate-800";
const sectionTitleClass = "text-lg font-semibold text-slate-900 dark:text-slate-100";
const sectionHintClass = "mt-1 text-sm text-slate-500 dark:text-slate-400";
const fieldLabelClass = "mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200";
const selectClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-900";

export default function ConfigMenu({ monaco }: ConfigMenuProps) {
    const [switchFallthrough, setSwitchFallthrough] = useState(config.switchFallthrough);
    const [forInclusiveLower, setForInclusiveLower] = useState(config.forInclusive[0]);
    const [forInclusiveUpper, setForInclusiveUpper] = useState(config.forInclusive[1]);

    function persistConfig() {
        localStorage.setItem("pseudoCodeConfig", JSON.stringify(config));
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

    const handleSwitchFallthroughChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        config.switchFallthrough = e.target.checked;
        setSwitchFallthrough(e.target.checked);
        persistConfig();
    };

    return (
        <div className="h-full overflow-y-auto bg-gradient-to-b from-slate-100 to-slate-200 p-6 text-left text-slate-700 dark:from-slate-950 dark:to-slate-900 dark:text-slate-200">
            <div className="mx-auto flex max-w-3xl flex-col gap-5">
                <header className="rounded-2xl border border-indigo-100 bg-white px-6 py-5 shadow-sm dark:border-indigo-900/40 dark:bg-slate-900/90">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Configure Syntax</h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Fine-tune how your pseudocode looks and behaves. Changes are saved automatically.
                    </p>
                </header>

                <section className={sectionCardClass}>
                    <h2 className={sectionTitleClass}>General style</h2>
                    <p className={sectionHintClass}>Choose the base formatting and comment syntax your language should use.</p>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                            <label className={fieldLabelClass}>Code Style</label>
                            <select
                                className={selectClass}
                                defaultValue={config.codeStyle === CodeStyle.INDENT ? "indent" : "curly braces"}
                                onChange={handleCodeStyleChange}
                            >
                                <option value="indent">Indentation Based</option>
                                <option value="curly braces">Braces Based</option>
                            </select>
                        </div>

                        <div>
                            <label className={fieldLabelClass}>Comment Symbol</label>
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
                        </div>
                    </div>
                </section>

                <section className={sectionCardClass}>
                    <h2 className={sectionTitleClass}>Print statement</h2>
                    <p className={sectionHintClass}>Rename the print keyword to match your preferred pseudocode flavor.</p>

                    <div className="mt-4">
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
                    </div>
                </section>

                <section className={sectionCardClass}>
                    <h2 className={sectionTitleClass}>Control flow</h2>
                    <p className={sectionHintClass}>Set behavior for switch and loop boundaries, and customize flow keywords.</p>

                    <div className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                        <label className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                            <span>Switch Fallthrough</span>
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                checked={switchFallthrough}
                                onChange={handleSwitchFallthroughChange}
                            />
                        </label>

                        <label className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                            <span>Lower Bound Inclusive</span>
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                checked={forInclusiveLower}
                                onChange={(e) => {
                                    setForInclusiveLower(e.target.checked);
                                    config.forInclusive[0] = e.target.checked;
                                    persistConfig();
                                }}
                            />
                        </label>

                        <label className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700 dark:text-slate-200">
                            <span>Upper Bound Inclusive</span>
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                checked={forInclusiveUpper}
                                onChange={(e) => {
                                    setForInclusiveUpper(e.target.checked);
                                    config.forInclusive[1] = e.target.checked;
                                    persistConfig();
                                }}
                            />
                        </label>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
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
                </section>
            </div>
        </div>
    );
}
