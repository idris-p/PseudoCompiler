import Editor from "@monaco-editor/react";

export default function CodeEditor({ theme }: { theme: string }) {
    return (
        <div className="h-full">
            <Editor
                height="100%"
                defaultValue={`x = 0\nwhile x < 5\n\tif x == 2\n\t\tprint "two"\n\telse\n\t\tprint x\n\tx = x + 1`}
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