import { FaPlay } from "react-icons/fa";

export default function PlayButton() {
    return (
        <div className="border-4 border-l-0 rounded-r-xl border-gray-500 hover:border-gray-400 h-10 w-10 mt-3 flex justify-center items-center text-green-600 hover:text-green-500 bg-white dark:bg-neutral-800 cursor-pointer">
            <button className="cursor-pointer">
                <FaPlay size={20} />
            </button>
        </div>
    )
}