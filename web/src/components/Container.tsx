import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import Split from "react-split";

export default function Container() {
    const getInitialTheme = () => 
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "vs-dark" : "vs-light";
    

    const [theme, setTheme] = useState(getInitialTheme());

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? "vs-dark" : "vs-light");
        }
        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
    }, []);

    return (
        <div className="border-4 rounded-xl h-full w-full overflow-hidden">
            <Split className="flex h-full" sizes={[50, 50]} minSize={200} gutterSize={8}>
                <div className="h-full">
                    <Editor
                        height="100%"
                        defaultValue="// some comment"
                        theme={theme}
                        options={{
                            fontSize: 18,
                            fontFamily: 'Cascadia Code, monospace',
                            padding: { top: 20, bottom: 20 },
                            }}
                    />
                </div>
                <div className="h-full bg-black text-green-400 font-mono text-sm p-2 overflow-auto">
                    <pre>
                        {`Pseudo Compiler v0.1.0`}
                    </pre>
                </div>
            </Split>
        </div>
    )
}