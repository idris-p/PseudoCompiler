import { useEffect, useRef } from "react"

export default function Terminal( { terminalOutput }: { terminalOutput: string[] } ) {
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalOutput]);

    return (
        <div ref={terminalRef} className="h-full bg-gray-100 dark:bg-neutral-900 text-gray-500 font-mono text-md p-2 overflow-auto">
            <pre>
                {`PseudoCompiler v0.1.0`}
            </pre>
            <br/>
            <pre className="text-left text-black dark:text-gray-100 ml-2 max-w-full whitespace-pre-wrap">
                {terminalOutput.length === 0 ? "" : terminalOutput.join("\n")}
            </pre>
        </div>
    )
}