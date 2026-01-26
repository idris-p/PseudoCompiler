import Editor from "@monaco-editor/react";

export default function CodeEditor({ theme, code, setCode }: { theme: string, code: string, setCode: React.Dispatch<React.SetStateAction<string>> }) {
    return (
        <div className="h-full">
            <Editor
                height="100%"
                value={code}
                onChange={(value) => setCode(value || "")}
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