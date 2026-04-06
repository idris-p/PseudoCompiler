import { useState } from "react";
import { validateConfigKeyword, type ConfigKeyField } from "../keywordValidator.js";

interface KeywordFieldProps {
    field: ConfigKeyField;
    label: string;
    value: string;
    placeholder?: string;
    onValidChange: (value: string) => void;
    onAfterChange?: () => void;
}

export default function KeywordField({
    field,
    label,
    value,
    placeholder,
    onValidChange,
    onAfterChange,
}: KeywordFieldProps) {
    const [inputValue, setInputValue] = useState(value);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        const result = validateConfigKeyword(field, newValue);

        if (!result.valid) {
            setError(result.error ?? "Invalid keyword");
            return;
        }

        setError(null);

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
                    error ? "border-red-500" : "border-gray-300 dark:border-neutral-700"
                }`}
            />
    
            {error && (
                <p className="text-red-500 text-sm mt-2">
                    {error}
                </p>
            )}
        </div>
    );
}