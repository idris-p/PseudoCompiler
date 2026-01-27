import PlayButton from './PlayButton'
import ConfigButton from './ConfigButton'
import DoneButton from './DoneButton'

export default function SideButtons({ showConfig, setShowConfig, code, setTerminalOutput }: { showConfig: boolean, setShowConfig: (show: boolean) => void, code: string, setTerminalOutput: (output: string[]) => void }) {
    return (
        <div>
            { !showConfig && (
            <>
            <PlayButton code={code} setTerminalOutput={setTerminalOutput} />
            <ConfigButton showConfig={showConfig} setShowConfig={setShowConfig} />
            </>
            )}
            { showConfig && (
            <DoneButton showConfig={showConfig} setShowConfig={setShowConfig} />
            )}
        </div>
    )
}