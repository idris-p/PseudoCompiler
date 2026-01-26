export default function ConfigMenu() {
    return (
        <div className="h-full bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 p-8 overflow-y-scroll text-left">
            <h1 className="text-2xl font-bold mb-4 text-center">Configure Syntax</h1>

            <label className="text-lg block mb-2 font-semibold text-left">Code Style</label>
            <select className="w-1/2 mb-4 p-2 border border-gray-300 rounded">
                <option>Indentation Based</option>
                <option>Braces Based</option>
            </select>
        </div>
    )
}