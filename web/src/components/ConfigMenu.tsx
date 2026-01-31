import { config } from "../../../core/src/loader.js";
import { CodeStyle } from "../../../core/src/CodeStyle.js";
import { useState } from "react";

export default function ConfigMenu() {
    const [switchFallthrough, setSwitchFallthrough] = useState(config.switchFallthrough);

    const handleCodeStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        config.codeStyle = e.target.value === "indent" ? CodeStyle.INDENT : CodeStyle.CURLY_BRACES;
        persistConfig();
    };

    const handleSwitchFallthroughChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        config.switchFallthrough = e.target.checked;
        setSwitchFallthrough(e.target.checked);
        persistConfig();
    };

    function persistConfig() {
        localStorage.setItem("pseudoCodeConfig", JSON.stringify(config));
    }

    return (
        <div className="h-full bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 p-8 overflow-y-scroll text-left">
            <h1 className="text-2xl font-bold mb-4 text-center">Configure Syntax</h1>

            <label className="text-lg block mb-2 font-semibold text-left">Code Style</label>
            <select 
                className="w-1/2 mb-4 p-2 border border-gray-300 rounded" 
                defaultValue={config.codeStyle === CodeStyle.INDENT ? "indent" : "curly braces"}
                onChange={handleCodeStyleChange}
            >
                <option value="indent">Indentation Based</option>
                <option value="curly braces">Braces Based</option>
            </select>

            <label className="text-lg block mb-2 font-semibold text-left">
                Switch Fallthrough
                <input
                    type="checkbox"
                    className="ml-2"
                    checked={switchFallthrough}
                    onChange={handleSwitchFallthroughChange}
                />
            </label>
        </div>
    )
}