import { useState } from "react";
import { validateKeyword } from "../keywordValidator.js";

interface KeywordFieldProps {
    label: string;
    value: string;
    placeholder?: string;
    onValidChange: (value: string) => void;
    onAfterChange?: () => void; // optional hook (e.g. refresh monaco)
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
        <div className="mb-6">
            <label className="text-md block mb-2 font-semibold">
                {label}
            </label>

            <input
                type="text"
                value={inputValue}
                placeholder={placeholder}
                onChange={handleChange}
                className={`w-1/2 p-2 border rounded ${
                    error ? "border-red-500" : "border-gray-300"
                }`}
            />

            {error && (
                <p className="text-red-500 text-sm mt-2">
                    Invalid keyword format.
                </p>
            )}
        </div>
    );
}