import PlayButton from './PlayButton'
import ConfigButton from './ConfigButton'
import DoneButton from './DoneButton'

export default function SideButtons({ showConfig, setShowConfig, code }: { showConfig: boolean, setShowConfig: (show: boolean) => void, code: string }) {
    return (
        <div>
            { !showConfig && (
            <>
            <PlayButton code={code} />
            <ConfigButton showConfig={showConfig} setShowConfig={setShowConfig} />
            </>
            )}
            { showConfig && (
            <DoneButton showConfig={showConfig} setShowConfig={setShowConfig} />
            )}
        </div>
    )
}