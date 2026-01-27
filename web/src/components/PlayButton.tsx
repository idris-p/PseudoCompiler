import { FaPlay } from "react-icons/fa";
import { CodeStyle, runPseudoCode } from "../../../core/src/index.js";

export default function PlayButton( { code, setTerminalOutput }: { code: string, setTerminalOutput: (output: string[]) => void } ) {

    const handleRun = () => {
        try {
            const result = runPseudoCode(code, CodeStyle.INDENT);
            setTerminalOutput(result.output);
        } catch (error) {
            console.error("Error running pseudo code:", error);
            setTerminalOutput([`${(error as Error).message}`]);
        }
    }

    return (
        <div className="border-4 border-l-0 rounded-r-xl border-gray-500 hover:border-gray-400 h-10 w-10 mt-3 flex justify-center items-center text-green-600 hover:text-green-500 bg-white dark:bg-neutral-800 cursor-pointer">
            <button onClick={handleRun} className="cursor-pointer">
                <FaPlay size={20} />
            </button>
        </div>
    )
}