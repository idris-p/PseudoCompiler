import { TiDocumentText } from "react-icons/ti";

export default function DocsButton( { showDocs, setShowDocs }: { showDocs: boolean, setShowDocs: (show: boolean) => void }) {
    return (
        <div onClick={() => setShowDocs(!showDocs)} className="border-4 border-l-0 rounded-r-xl border-gray-500 hover:border-gray-400 h-10 w-10 mt-3 pr-0.5 flex justify-center items-center text-neutral-400 hover:text-neutral-300 bg-white dark:bg-neutral-800 cursor-pointer">
            <button className="cursor-pointer">
                <TiDocumentText size={30} />
            </button>
        </div>
    )
}