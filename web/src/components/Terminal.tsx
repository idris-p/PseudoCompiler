import { useEffect, useRef, useState } from "react"

export default function Terminal( { terminalOutput, setTerminalOutput, pendingInput, setPendingInput }: { terminalOutput: string[], setTerminalOutput: React.Dispatch<React.SetStateAction<string[]>>, pendingInput: {prompt?: string; resolve: (value: string) => void;} | null, setPendingInput: (pendingInput: {prompt?: string; resolve: (value: string) => void;} | null) => void } ) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const [currentInput, setCurrentInput] = useState("");

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalOutput, pendingInput]);

    const handleSubmit = () => {
        if (!pendingInput) return;

        const prompt = pendingInput.prompt ?? "";
        const value = currentInput;

        setTerminalOutput(prev => [...prev, `${prompt}${prompt ? " " : ""}${value}`]);

        pendingInput.resolve(value);

        setCurrentInput("");
        setPendingInput(null);
        };


    return (
        <div
            ref={terminalRef}
            className="h-full bg-gray-100 dark:bg-neutral-900 text-gray-500 font-mono text-md p-2 overflow-auto"
        >
            <pre>PseudoCompiler v0.1.0</pre>
            <br />

            {terminalOutput.map((line, i) => (
                <div
                    key={i}
                    className="text-left text-black dark:text-gray-100 ml-2 whitespace-pre-wrap"
                >
                    {line}
                </div>
            ))}

            {pendingInput && (
                <div className="ml-2 flex text-black dark:text-gray-100">
                    {pendingInput.prompt && (
                        <span className="mr-2">
                            {pendingInput.prompt}
                        </span>
                    )}
                    <input
                        autoFocus
                        className="bg-transparent outline-none flex-1"
                        value={currentInput}
                        onChange={(e) =>
                            setCurrentInput(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}