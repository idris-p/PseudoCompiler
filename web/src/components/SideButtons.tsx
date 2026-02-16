import type { Dispatch, SetStateAction } from 'react'
import PlayButton from './PlayButton'
import ConfigButton from './ConfigButton'
import DoneButton from './DoneButton'

export default function SideButtons({ showConfig, setShowConfig, code, setTerminalOutput, setPendingInput }: { showConfig: boolean, setShowConfig: (show: boolean) => void, code: string, setTerminalOutput: Dispatch<SetStateAction<string[]>>, setPendingInput: (pendingInput: {prompt?: string; resolve: (value: string) => void;} | null) => void }) {
    return (
        <div>
            { !showConfig && (
            <>
            <PlayButton code={code} setTerminalOutput={setTerminalOutput} setPendingInput={setPendingInput} />
            <ConfigButton showConfig={showConfig} setShowConfig={setShowConfig} />
            </>
            )}
            { showConfig && (
            <DoneButton showConfig={showConfig} setShowConfig={setShowConfig} />
            )}
        </div>
    )
}