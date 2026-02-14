import { useState } from "react";
import { validateKeyword } from "../keywordValidator.js";

interface KeywordFieldProps {
    label: string;
    value: string;
    placeholder?: string;
    onValidChange: (value: string) => void;
    onAfterChange?: () => void;
}

export default function KeywordField({
    label,
    value,
    placeholder,
    onValidChange,
    onAfterChange,
}: KeywordFieldProps) {
    const [inputValue, setInputValue] = useState(value);
    const [error, setError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        const result = validateKeyword(newValue);

        if (!result.valid) {
            setError(true);
            return;
        }

        setError(false);

        const normalized = newValue.trim().toLowerCase();
        onValidChange(normalized);

        if (onAfterChange) {
            onAfterChange();
        }
    };

    return (
        <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                {label}
            </label>

            <input
                type="text"
                value={inputValue}
                placeholder={placeholder}
                onChange={handleChange}
                className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:bg-slate-800 dark:text-slate-100 ${
                    error
                        ? "border-red-500 dark:border-red-400"
                        : "border-slate-300 dark:border-slate-600"
                }`}
            />

            {error && (
                <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                    Invalid keyword format.
                </p>
            )}
        </div>
    );
}
