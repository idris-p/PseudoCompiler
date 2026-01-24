import { IoMdSettings } from "react-icons/io";

export default function ConfigButton() {
    return (
        <div className="border-4 border-l-0 rounded-r-xl h-10 w-10 mt-3 flex justify-center items-center">
            <button className=" text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300">
                <IoMdSettings size={26} />
            </button>
        </div>
    )
}