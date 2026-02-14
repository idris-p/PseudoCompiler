import { FaPlay } from "react-icons/fa";
import { runPseudoCode } from "../../../core/src/index.js";
import type { RuntimeIO } from "../../../core/src/interpreter/interpreter.js";

export default function PlayButton( { code, setTerminalOutput }: { code: string, setTerminalOutput: React.Dispatch<React.SetStateAction<string[]>> } ) {

    const handleRun = async () => {
        setTerminalOutput([]);

        const io: RuntimeIO = {
            write: (text: string) => {
                // Stream output line by line
                setTerminalOutput(prev => [...prev, text]);
            },
            read: async (prompt?: string) => {
                // Prompt user for input
                return prompt ? window.prompt(prompt) || "" : window.prompt() || "";
            }
        };
        
        try {
            await runPseudoCode(code, io);
        } catch (error) {
            console.error("Error running pseudo code:", error);
            setTerminalOutput(prev => [
                ...prev,
                (error as Error).message
            ]);
        }
    }

    return (
        <div className="border-4 border-l-0 rounded-r-xl border-gray-500 hover:border-gray-400 h-10 w-10 mt-3 flex justify-center items-center text-green-600 hover:text-green-500 bg-white dark:bg-neutral-800 cursor-pointer" onClick={handleRun}>
                <FaPlay size={20} />
        </div>
    )
}