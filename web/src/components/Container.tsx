import { useEffect, useState } from "react";
import type { Dispatch } from "react";
import Split from "react-split";
import CodeEditor from "./CodeEditor";
import Terminal from "./Terminal";
import ConfigMenu from "./ConfigMenu";
import type Monaco from "monaco-editor";

export default function Container({
    showConfig,
    code,
    setCode,
    terminalOutput,
    setTerminalOutput,
    pendingInput,
    setPendingInput
}: {
    showConfig: boolean,
    code: string,
    setCode: React.Dispatch<React.SetStateAction<string>>,
    terminalOutput: string[],
    setTerminalOutput: React.Dispatch<React.SetStateAction<string[]>>,
    pendingInput: {prompt?: string; resolve: (value: string) => void;} | null,
    setPendingInput: Dispatch<any>
}) {

    const getInitialTheme = () =>
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? "vs-dark"
            : "vs-light";

    const [theme, setTheme] = useState(getInitialTheme());
    const [monacoInstance, setMonacoInstance] = useState<typeof Monaco | null>(null);

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? "vs-dark" : "vs-light");
        };
        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
    }, []);

    return (
        <div className="border-4 rounded-xl border-gray-400 h-full w-full overflow-hidden">
            {!showConfig &&
                <Split className="flex h-full" sizes={[60, 40]} minSize={200} gutterSize={8}>
                    <CodeEditor
                        theme={theme}
                        code={code}
                        setCode={setCode}
                        setMonacoInstance={setMonacoInstance}
                    />
                    <Terminal terminalOutput={terminalOutput} setTerminalOutput={setTerminalOutput} pendingInput={pendingInput} setPendingInput={setPendingInput} />
                </Split>
            }

            {showConfig &&
                <ConfigMenu monaco={monacoInstance} />
            }
        </div>
    );
}