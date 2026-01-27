import Editor from "@monaco-editor/react";
import { registerPseudoLanguage } from "../pseudoLang";

export default function CodeEditor({ theme, code, setCode }: { theme: string, code: string, setCode: React.Dispatch<React.SetStateAction<string>> }) {
    return (
        <div className="h-full">
            <Editor
                language="pseudo"
                height="100%"
                value={code}
                onChange={(value) => setCode(value || "")}
                onMount={(_, monaco) => {
                    registerPseudoLanguage(monaco);
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
    )
}