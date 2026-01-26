import PlayButton from './PlayButton'
import ConfigButton from './ConfigButton'
import DoneButton from './DoneButton'

export default function SideButtons({ showConfig, setShowConfig }: { showConfig: boolean, setShowConfig: (show: boolean) => void }) {
    return (
        <div>
            { !showConfig && (
            <>
            <PlayButton />
            <ConfigButton showConfig={showConfig} setShowConfig={setShowConfig} />
            </>
            )}
            { showConfig && (
            <DoneButton showConfig={showConfig} setShowConfig={setShowConfig} />
            )}
        </div>
    )
}