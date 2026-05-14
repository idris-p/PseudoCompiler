import { FaArrowRight, FaCode, FaTerminal } from "react-icons/fa";

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
    return (
        <main className="min-h-screen p-6 md:p-10 text-gray-700 dark:text-gray-300">
            <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col justify-center gap-8 md:min-h-[calc(100vh-5rem)]">
                <section className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr]">
                    <div className="text-left">
                        <div className="mb-3 flex items-center gap-4">
                            <img
                                src="/Icon.png"
                                alt="PseudoCompiler"
                                className="h-16 w-16 rounded-xl border-4 border-gray-400 bg-white p-1 dark:bg-neutral-800"
                            />
                            <h1 className="self-center text-4xl font-bold text-gray-500 dark:text-gray-100">PseudoCompiler</h1>
                        </div>
                        <p className="mb-3 font-mono text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Pseudocode Interpreter
                        </p>
                        <h1 className="mb-5 text-5xl font-bold leading-tight text-gray-900 dark:text-gray-100">
                            Edit and run pseudocode in one workspace.
                        </h1>
                        <ul className="mb-8 max-w-2xl list-disc space-y-2 pl-5 text-lg text-gray-600 dark:text-gray-400">
                            <li>PseudoCompiler is a browser-based interpreter for experimenting with pseudocode.</li>
                            <li>Explore core programming concepts without the overhead of strict language syntax.</li>
                            <li>Adjust syntax rules to match your preferred style.</li>
                        </ul>
                        <button
                            type="button"
                            onClick={onEnter}
                            className="inline-flex min-h-14 items-center gap-3 rounded-xl border-4 border-gray-500 bg-white px-6 text-lg font-bold text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-100 dark:bg-neutral-800 dark:text-gray-100 dark:hover:bg-neutral-700"
                        >
                            Open Coding Environment
                            <FaArrowRight aria-hidden="true" />
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-xl border-4 border-gray-400 bg-white text-left shadow-sm dark:bg-neutral-800">
                        <div className="grid min-h-[360px] grid-rows-[1fr_0.75fr] md:min-h-[460px]">
                            <div className="bg-white dark:bg-neutral-800 p-5 font-mono text-sm text-gray-700 dark:text-gray-100">
                                <div className="mb-4 flex items-center gap-2 border-b border-neutral-700 pb-3 text-gray-700 dark:text-gray-400">
                                    <FaCode aria-hidden="true" />
                                    <span>main.pseudo</span>
                                </div>
                                <pre className="whitespace-pre-wrap leading-7 text-gray-700 dark:text-gray-100">
                                    <span className="text-[#608B4E]"># Try ideas quickly</span>
{`
int num = 10

for i = 1 to 5
    print num * i
endfor`}
                                </pre>
                            </div>

                            <div className="bg-gray-100 p-5 font-mono text-sm text-gray-700 dark:bg-neutral-900 dark:text-gray-100">
                                <div className="mb-4 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <FaTerminal aria-hidden="true" />
                                    <span>Terminal</span>
                                </div>
                                <pre className="whitespace-pre-wrap leading-7">
{`10
20
30
40
50`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-3 text-left text-sm text-gray-600 dark:text-gray-400 md:grid-cols-3">
                    <p className="rounded-lg border border-gray-200 bg-white/70 p-4 dark:border-neutral-700 dark:bg-neutral-900/20">
                        Monaco-powered editor with pseudocode highlighting.
                    </p>
                    <p className="rounded-lg border border-gray-200 bg-white/70 p-4 dark:border-neutral-700 dark:bg-neutral-900/20">
                        Built-in terminal output and interactive input prompts.
                    </p>
                    <p className="rounded-lg border border-gray-200 bg-white/70 p-4 dark:border-neutral-700 dark:bg-neutral-900/20">
                        Configurable syntax for different conventions.
                    </p>
                </section>
            </div>
        </main>
    );
}
