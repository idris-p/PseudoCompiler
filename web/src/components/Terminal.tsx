import { useEffect, useRef, useState } from "react"
import type { TerminalLine } from "../App";

export default function Terminal( { terminalOutput, setTerminalOutput, pendingInput, setPendingInput }: { terminalOutput: TerminalLine[], setTerminalOutput: React.Dispatch<React.SetStateAction<TerminalLine[]>>, pendingInput: {prompt?: string; resolve: (value: string) => void;} | null, setPendingInput: (pendingInput: {prompt?: string; resolve: (value: string) => void;} | null) => void } ) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);
    const [currentInput, setCurrentInput] = useState("");

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalOutput, pendingInput]);

    useEffect(() => {
        if (pendingInput) focusInput();
    }, [pendingInput]);

    const handleSubmit = () => {
        if (!pendingInput) return;

        const prompt = pendingInput.prompt ?? "";
        const value = currentInput;

        setTerminalOutput(prev => [...prev, { text: `${prompt}${value}`, type: "normal" }]);

        pendingInput.resolve(value);

        setCurrentInput("");
        setPendingInput(null);
    };

    const focusInput = () => {
        if (!inputRef.current) return;

        inputRef.current.focus();

        const range = document.createRange();
        const sel = window.getSelection();

        range.selectNodeContents(inputRef.current);
        range.collapse(false);

        sel?.removeAllRanges();
        sel?.addRange(range);
    };


    return (
        <div
            ref={terminalRef}
            onClick={() => {
                if (pendingInput) focusInput();
            }}
            className="h-full bg-gray-100 dark:bg-neutral-900 text-gray-500 font-mono text-md p-2 overflow-auto"
        >
            <pre>PseudoCompiler v0.1.0</pre>
            <br />

            {terminalOutput.map((line, i) => (
                <div
                    key={i}
                    className={`ml-2 text-left whitespace-pre-wrap ${
            line.type === "error"
                ? "text-red-600 dark:text-red-400"
                : "text-black dark:text-gray-100"
        }`}
                >
                    {line.text}
                </div>
            ))}

            {pendingInput && (
                <div className="ml-2 text-black dark:text-gray-100 text-left whitespace-pre-wrap">
                    {pendingInput.prompt && (
                        <span>
                            {pendingInput.prompt}
                        </span>
                    )}
                    <div
                        ref={inputRef}
                        contentEditable
                        className="inline outline-none"
                        onPaste={(e) => {
                            e.preventDefault();
                            const text = e.clipboardData.getData("text/plain");
                            document.execCommand("insertText", false, text);
                        }}
                        onInput={(e) => setCurrentInput(e.currentTarget.textContent || "")}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                            e.preventDefault();
                            handleSubmit();
                            }
                        }}
                        />
                </div>
            )}
        </div>
    );
}