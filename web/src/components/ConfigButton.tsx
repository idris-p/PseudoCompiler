import { IoMdSettings } from "react-icons/io";

export default function ConfigButton( { showConfig, setShowConfig }: { showConfig: boolean, setShowConfig: (show: boolean) => void }) {
    return (
        <div onClick={() => setShowConfig(!showConfig)} className="border-4 border-l-0 rounded-r-xl border-gray-500 hover:border-gray-400 h-10 w-10 mt-1 pr-0.5 flex justify-center items-center text-gray-500 hover:text-gray-400 bg-white dark:bg-neutral-800 cursor-pointer">
            <button className="cursor-pointer">
                <IoMdSettings size={26} />
            </button>
        </div>
    )
}