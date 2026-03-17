import { FaPlay, FaStop } from "react-icons/fa";
import { useRef, useState } from "react";
import { runPseudoCode } from "../../../core/src/index.js";
import type { RuntimeIO } from "../../../core/src/interpreter/interpreter.js";
import { StopSignal } from "../../../core/src/interpreter/interpreter.js";
import type { TerminalLine } from "../App";

type PendingInput = {
    prompt?: string;
    resolve: (value: string) => void;
} | null;

export default function PlayButton({
    code,
    setTerminalOutput,
    setPendingInput
}: {
    code: string,
    setTerminalOutput: React.Dispatch<React.SetStateAction<TerminalLine[]>>;
    setPendingInput: React.Dispatch<React.SetStateAction<PendingInput>>;
}) {
    const [isRunning, setIsRunning] = useState(false);
    const cancelTokenRef = useRef({ cancelled: false });

    const handleRun = async () => {
        setTerminalOutput([]);
        setPendingInput(null);

        cancelTokenRef.current = { cancelled: false };
        setIsRunning(true);

        const io: RuntimeIO = {
            write: (text: string) => {
                setTerminalOutput(prev => [...prev, { text, type: "normal" }]);
            },
            read: (prompt?: string) => {
                return new Promise<string>((resolve) => {
                    setPendingInput({ prompt, resolve });
                });
            }
        };

        try {
            await runPseudoCode(code, io, cancelTokenRef.current);
        } catch (error) {
            if (!(error instanceof StopSignal)) {
                console.error("Error running pseudo code:", error);
                setTerminalOutput(prev => [
                    ...prev,
                    { text: (error as Error).message, type: "error" }
                ]);
            }
        } finally {
            setPendingInput(null);
            setIsRunning(false);
        }
    };

    const handleStop = () => {
        cancelTokenRef.current.cancelled = true;

        setPendingInput(prev => {
            prev?.resolve("");
            return null;
        });
    };

    return (
        <div
            className={`border-4 border-l-0 rounded-r-xl border-gray-500 hover:border-gray-400 h-10 w-10 mt-3 flex justify-center items-center bg-white dark:bg-neutral-800 cursor-pointer ${
                isRunning
                    ? "text-red-500 hover:text-red-400"
                    : "text-green-600 hover:text-green-500"
            }`}
            onClick={isRunning ? handleStop : handleRun}
        >
            {isRunning ? <FaStop size={20} /> : <FaPlay size={20} />}
        </div>
    );
}