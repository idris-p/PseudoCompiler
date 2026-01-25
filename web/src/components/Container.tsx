import { useEffect, useState } from "react";
import Split from "react-split";
import CodeEditor from "./CodeEditor";
import Terminal from "./Terminal";

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
        <div className="border-4 rounded-xl border-gray-400 h-full w-full overflow-hidden">
            <Split className="flex h-full" sizes={[60, 40]} minSize={200} gutterSize={8}>
                <CodeEditor theme={theme} />
                <Terminal />
            </Split>
        </div>
    )
}