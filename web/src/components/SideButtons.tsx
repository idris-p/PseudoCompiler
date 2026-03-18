import type { Dispatch, SetStateAction } from 'react'
import type { TerminalLine } from '../App'
import PlayButton from './PlayButton'
import ConfigButton from './ConfigButton'
import DocsButton from './DocsButton'
import DoneButton from './DoneButton'

type PendingInput = {prompt?: string; resolve: (value: string) => void;} | null

export default function SideButtons({ showConfig, setShowConfig, showDocs, setShowDocs, code, setTerminalOutput, setPendingInput }: { showConfig: boolean, setShowConfig: (show: boolean) => void, showDocs: boolean, setShowDocs: (show: boolean) => void, code: string, setTerminalOutput: Dispatch<SetStateAction<TerminalLine[]>>, setPendingInput: Dispatch<SetStateAction<PendingInput>> }) {
    return (
        <div>
            { !showConfig && !showDocs && (
            <>
            <PlayButton code={code} setTerminalOutput={setTerminalOutput} setPendingInput={setPendingInput} />
            <ConfigButton showConfig={showConfig} setShowConfig={setShowConfig} />
            </>
            )}
            { !showConfig && (
            <DocsButton showDocs={showDocs} setShowDocs={setShowDocs} />
            )}
            { showConfig && (
            <DoneButton showConfig={showConfig} setShowConfig={setShowConfig} />
            )}
        </div>
    )
}