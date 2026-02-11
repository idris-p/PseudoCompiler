import Editor from "@monaco-editor/react";
import { registerPseudoLanguage } from "../pseudoLang";
import type Monaco from "monaco-editor";

export default function CodeEditor({
    theme,
    code,
    setCode,
    setMonacoInstance
}: {
    theme: string,
    code: string,
    setCode: React.Dispatch<React.SetStateAction<string>>,
    setMonacoInstance: React.Dispatch<React.SetStateAction<typeof Monaco | null>>
}) {

    const handleChange = (value: string | undefined) => {
        const newValue = value || "";
        setCode(newValue);
        localStorage.setItem("pseudoCode", newValue);
    };

    return (
        <div className="h-full">
            <Editor
                language="pseudo"
                height="100%"
                value={code}
                onChange={handleChange}
                onMount={(_, monaco) => {
                    registerPseudoLanguage(monaco);
                    setMonacoInstance(monaco);
                }}
                theme={theme}
                options={{
                    fontSize: 16,
                    fontFamily: 'Cascadia Code, monospace',
                    padding: { top: 20, bottom: 20 },
                    minimap: { enabled: false }
                }}
            />
        </div>
    );
}