import { config } from "../../../core/src/loader.js";
import { CodeStyle } from "../../../core/src/CodeStyle";
import { useState } from 'react';

export default function Docs() {
    const [codeStyle, setCodeStyle] = useState(config.codeStyle);

    return (
         <div className="h-full bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 p-8 overflow-y-scroll text-left">
            <h1 className="text-2xl font-bold mb-6 text-center">
                Documentation
            </h1>

            <p className="mb-4">All keywords are case-insensitive. This does not apply to variable and identifier names.</p>
            { codeStyle === CodeStyle.CURLY_BRACES && (
                <>
                    <p className="mb-4">Lines of code may be ended with a <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">;</code> instead of a newline.</p>
                    <p className="mb-4">The following code snippets are equivalent:</p>
                    <div className="flex flex-row gap-4">
                        <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                            name {config.assignmentSyntax} "Joe"
                            <br />
                            {config.printSyntax}(name)
                        </code>
                        <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                            name {config.assignmentSyntax} "Joe"; {config.printSyntax}(name);
                        </code>
                    </div>
                    <br />
                </>
            )}

            <label className="text-lg block mb-2 font-semibold">
                Comments
            </label>
            <p className="mb-4">To write a comment, use the <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">{config.commentSyntax}</code> symbol followed by your comment text.</p>
            <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block">
                {config.commentSyntax} This is a comment
            </code>
            <br />

            <label className="text-lg block mb-2 font-semibold">
                Variable Declaration and Assignment
            </label>
            <p className="mb-4">To assign a value to a variable, use the <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">{config.assignmentSyntax}</code> symbol.</p>
            <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block">
                num {config.assignmentSyntax} 5
                <br />
                greeting {config.assignmentSyntax} "Hello, World!"
            </code>
            <br />

            <p className="mb-4">You can use the <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">{config.varSyntax}</code> and <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">{config.constSyntax}</code> keywords to specify the mutability of the variable.</p>
            <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block">
                {config.varSyntax} greeting {config.assignmentSyntax} "Hello, World!"
                <br />
                {config.constSyntax} greeting {config.assignmentSyntax} "Hello, World!"
            </code>
            <br />

            <p className="mb-4">Optionally, you can declare a variable without assigning it a value, and also restrict the type of the variable.</p>
            <div className="flex flex-row gap-4">
                <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                    {config.varSyntax} x
                    <br />
                    <br />
                    {config.intSyntax} num
                    <br />
                    {config.floatSyntax} num
                    <br />
                    {config.stringSyntax} greeting
                    <br />
                    {config.charSyntax} letter
                    <br />
                    {config.boolSyntax} isActive
                </code>
                <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                    {config.varSyntax} x {config.assignmentSyntax} 5
                    <br />
                    <br />
                    {config.intSyntax} num {config.assignmentSyntax} 5
                    <br />
                    {config.floatSyntax} num {config.assignmentSyntax} 3.14
                    <br />
                    {config.stringSyntax} greeting {config.assignmentSyntax} "Hello, World!"
                    <br />
                    {config.charSyntax} letter {config.assignmentSyntax} 'A'
                    <br />
                    {config.boolSyntax} isActive {config.assignmentSyntax} true
                </code>
            </div>
            <br />
            <p className="mb-4">You can both specify mutability and type when declaring variables.</p>
            <div className="flex flex-row gap-4">
                <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                    {config.varSyntax} {config.intSyntax} num
                    <br />
                    {config.varSyntax} {config.floatSyntax} num
                    <br />
                    {config.varSyntax} {config.stringSyntax} greeting
                    <br />
                    {config.varSyntax} {config.charSyntax} letter
                    <br />
                    {config.varSyntax} {config.boolSyntax} isActive
                </code>
                <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                    {config.varSyntax} {config.intSyntax} num {config.assignmentSyntax} 5
                    <br />
                    {config.varSyntax} {config.floatSyntax} num {config.assignmentSyntax} 3.14
                    <br />
                    {config.varSyntax} {config.stringSyntax} greeting {config.assignmentSyntax} "Hello, World!"
                    <br />
                    {config.varSyntax} {config.charSyntax} letter {config.assignmentSyntax} 'A'
                    <br />
                    {config.varSyntax} {config.boolSyntax} isActive {config.assignmentSyntax} true
                </code>
            </div>
            <br />

            <label className="text-lg block mb-2 font-semibold">
                Print Statements
            </label>
            <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block">
                {config.printSyntax}("Hello, World!")
            </code>
            <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block">
                {config.stringSyntax} greeting {config.assignmentSyntax} "Hello"
                <br />
                {config.stringSyntax} name {config.assignmentSyntax} "Joe"
                <br />
                {config.printSyntax}(greeting, name)
                <br />
                {config.printSyntax}(greeting + " " + name)
            </code>
        </div>
    )
}