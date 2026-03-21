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
                            name {config.assignmentSyntax} "Idris"
                            <br />
                            {config.printSyntax}(name)
                        </code>
                        <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                            name {config.assignmentSyntax} "Idris"; {config.printSyntax}(name);
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
                {config.printSyntax} "Hello, World!"
                <br />
                {config.printSyntax}("Hello, World!")
            </code>
            <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block">
                {config.stringSyntax} greeting {config.assignmentSyntax} "Hello"
                <br />
                {config.stringSyntax} name {config.assignmentSyntax} "Idris"
                <br />
                <br />
                {config.commentSyntax} Equivalent statements:
                <br />
                {config.printSyntax}(greeting, name)
                <br />
                {config.printSyntax}(greeting + " " + name)
            </code>
            <br />

            <label className="text-lg block mb-2 font-semibold">
                Input Statements
            </label>
            <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block">
                name {config.assignmentSyntax} {config.inputSyntax}("Enter your name: ")
            </code>
            <p className="mb-4">This will make a prompt appear for the user to enter their name in the terminal. Input is submitted when the user presses the Enter key.</p>
            <br />

            <label className="text-lg block mb-2 font-semibold">
                If Statements
            </label>
            <p className="mb-4">The <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">then</code>, <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">:</code> and <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">endif</code> syntax is entirely optional.</p>
            <p className="mb-4">Either <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">else if</code>, <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">elseif</code>, or <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">elif</code> can be used interchangeably.</p>
            
            { config.codeStyle === CodeStyle.INDENT &&
                <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block">
                    x {config.assignmentSyntax} 5
                    <br />
                    if x &gt; 0 then:
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}("x is positive")
                    <br />
                    elseif x &lt; 0 then:
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}("x is negative")
                    <br />
                    else:
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}("x is zero")
                    <br />
                    endif
                </code>
            }
            { config.codeStyle === CodeStyle.CURLY_BRACES &&
                <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block">
                    x {config.assignmentSyntax} 5
                    <br />
                    if x &gt; 0 then {"{"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}("x is positive")
                    <br />
                    {"}"}
                    <br />
                    elseif x &lt; 0 then {"{"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}("x is negative")
                    <br />
                    {"}"}
                    <br />
                    else {"{"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}("x is zero")
                    <br />
                    {"}"}
                    <br />
                    endif
                </code>
            }
            <br />

            <label className="text-lg block mb-2 font-semibold">
                Switch Statements
            </label>
            <p className="mb-4">You can configure whether cases break automatically in settings. <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">{"end" + config.switchSyntax}</code> syntax is optional.</p>
            { config.codeStyle === CodeStyle.INDENT &&
                <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block">
                    day {config.assignmentSyntax} "Monday"
                    <br />
                    <br />
                    {config.switchSyntax} day:
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;case "Monday":
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}("Start of the week")
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{config.breakSyntax}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;case "Sunday":
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}("End of the week")
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{config.breakSyntax}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;default:
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}("Midweek")
                    <br />
                    {"end" + config.switchSyntax}
                </code>
            }
            { config.codeStyle === CodeStyle.CURLY_BRACES &&
                <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block">
                    day {config.assignmentSyntax} "Monday"
                    <br />
                    <br />
                    {config.switchSyntax} day {"{"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;case "Monday" {"{"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}("Start of the week")
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{config.breakSyntax}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;case "Sunday" {"{"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}("End of the week")
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{config.breakSyntax}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;default {"{"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}("Midweek")
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                    <br />
                    {"}"}
                    <br />
                    endswitch
                </code>
            }
            <br />

            <label className="text-lg block mb-2 font-semibold">
                For Loops
            </label>

            <p className="mb-4">The <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">step</code>, <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">:</code> and <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">endfor</code> syntax is entirely optional. The inclusion of the lower and upper bounds is configurable in settings.</p>
            <p className="mb-4">There are two equivalent types of for loops available:</p>
            { config.codeStyle === CodeStyle.INDENT && (
                <div className="flex flex-row gap-4">
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                        for i {config.assignmentSyntax} 0 to 4 step 1:
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(i)
                        <br />
                    endfor
                </code>
                <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                    for (i {config.assignmentSyntax} 0; i &lt; 4; i++):
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(i)
                    <br />
                    endfor
                </code>
            </div>
            )}
            { config.codeStyle === CodeStyle.CURLY_BRACES && (
                <div className="flex flex-row gap-4">
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                        for i {config.assignmentSyntax} 0 to 4 step 1 {"{"}
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(i)
                        <br />
                        {"}"}
                        <br />
                        endfor
                    </code>
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                        for (i {config.assignmentSyntax} 0; i &lt; 4; i++) {"{"}
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(i)
                        <br />
                        {"}"}
                        <br />
                        endfor
                    </code>
                </div>
            )}
            <br />
            <p className="mb-4">There also two types of for each loops available:</p>
            { config.codeStyle === CodeStyle.INDENT && (
                <div className="flex flex-row gap-4">
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                        nums {config.assignmentSyntax} [1, 2, 3, 4]
                        <br />
                        <br />
                        {config.foreachSyntax} num in nums:
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(num)
                        <br />
                        endfor
                    </code>
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                        nums {config.assignmentSyntax} [1, 2, 3, 4]
                        <br />
                        <br />
                        {config.foreachSyntax} (num : nums):
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(num)
                        <br />
                        endfor
                    </code>
                </div>
            )}
            { config.codeStyle === CodeStyle.CURLY_BRACES && (
                <div className="flex flex-row gap-4">
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                        nums {config.assignmentSyntax} [1, 2, 3, 4]
                        <br />
                        <br />
                        {config.foreachSyntax} num in nums {"{"}
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(num)
                        <br />
                        {"}"}
                        <br />
                        endfor
                    </code>
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                        nums {config.assignmentSyntax} [1, 2, 3, 4]
                        <br />
                        <br />
                        {config.foreachSyntax} (num : nums) {"{"}
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(num)
                        <br />
                        {"}"}
                        <br />
                        endfor
                    </code>
                </div>
            )}
            <p className="mb-4">Either <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">for each</code>, <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">{config.foreachSyntax}</code> or <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">for</code> can be used to iterate over collections.</p>
            <br />

            <label className="text-lg block mb-2 font-semibold">
                While Loops
            </label>

            { config.codeStyle === CodeStyle.INDENT && (
                <div className="flex flex-row gap-4">
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/3">
                        i {config.assignmentSyntax} 0
                        <br />
                        <br />
                        while i &lt; 5:
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(i)
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;i++
                        <br />
                        endwhile
                    </code>
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/3">
                        i {config.assignmentSyntax} 0
                        <br />
                        <br />
                        do while i &lt; 5:
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(i)
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;i++
                        <br />
                        loop
                    </code>
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/3">
                        i {config.assignmentSyntax} 0
                        <br />
                        <br />
                        do:
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(i)
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;i++
                        <br />
                        while i &lt; 5
                    </code>
                </div>
            )}
            { config.codeStyle === CodeStyle.CURLY_BRACES && (
                <div className="flex flex-row gap-4">
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/3">
                        i {config.assignmentSyntax} 0
                        <br />
                        <br />
                        while i &lt; 5 {"{"}
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(i)
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;i++
                        <br />
                        {"}"}
                        <br />
                        endwhile
                    </code>
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/3">
                        i {config.assignmentSyntax} 0
                        <br />
                        <br />
                        do while i &lt; 5 {"{"}
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(i)
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;i++
                        <br />
                        {"}"}
                        <br />
                        loop
                    </code>
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/3">
                        i {config.assignmentSyntax} 0
                        <br />
                        <br />
                        do {"{"}
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(i)
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;i++
                        <br />
                        {"}"}
                        <br />
                        while i &lt; 5
                    </code>
                </div>
            )}
            <br />

            <label className="text-lg block mb-2 font-semibold">
                Do Until Loops
            </label>

            { config.codeStyle === CodeStyle.INDENT && (
                <div className="flex flex-row gap-4">
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                        i {config.assignmentSyntax} 0
                        <br />
                        <br />
                        do until i &gt; 5:
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(i)
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;i++
                        <br />
                        loop
                    </code>
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                        i {config.assignmentSyntax} 0
                        <br />
                        <br />
                        do:
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(i)
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;i++
                        <br />
                        until i &gt; 5
                    </code>
                </div>
            )}
            { config.codeStyle === CodeStyle.CURLY_BRACES && (
                <div className="flex flex-row gap-4">
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                        i {config.assignmentSyntax} 0
                        <br />
                        <br />
                        do until i &gt; 5 {"{"}
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(i)
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;i++
                        <br />
                        {"}"}
                        <br />
                        loop
                    </code>
                    <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                        i {config.assignmentSyntax} 0
                        <br />
                        <br />
                        do {"{"}
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;{config.printSyntax}(i)
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;i++
                        <br />
                        {"}"}
                        <br />
                        until i &gt; 5
                    </code>
                </div>
            )}
            <br />

            <label className="text-lg block mb-2 font-semibold">
                Control Flow Statements
            </label>
            <p className="mb-4"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">{config.breakSyntax}</code> - exits loop at the current iteration. <br/><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">{config.continueSyntax}</code> - skips the current iteration and continues to the next one. <br/><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">{config.passSyntax}</code> - does nothing and continues to the next statement.</p>
            <br/>

            <label className="text-lg block mb-2 font-semibold">
                Boolean Operators
            </label>
            <p className="mb-4">AND - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">&&</code>, <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">&</code> or <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">and</code><br/>OR - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">||</code>, <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">|</code> or <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">or</code><br/>NOT - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">!</code>, <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">¬</code> or <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">not</code></p>

            <label className="text-lg block mb-2 font-semibold">
                Comparison Operators
            </label>
            <p className="mb-4">Equal to - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">==</code> or <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">=</code><br/>Not equal to - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded" style={{ fontVariantLigatures: "none" }}>!=</code> or <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">&lt;&gt;</code><br/>Greater than - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">&gt;</code><br/>Less than - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">&lt;</code><br/>Greater than or equal to - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded" style={{ fontVariantLigatures: "none" }}>&gt;=</code><br/>Less than or equal to - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded" style={{ fontVariantLigatures: "none" }}>&lt;=</code></p>

            <label className="text-lg block mb-2 font-semibold">
                Maths Operators and Functions
            </label>
            <p className="mb-4">Addition - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">+</code><br/>Subtraction - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">-</code><br/>Multiplication - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">*</code> or <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">×</code><br/>Precise Division - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">/</code> or <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">÷</code><br/>Integer Division - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">//</code> or <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">div</code><br/>Modulus - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">%</code> or <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">mod</code><br/>Exponentiation - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">**</code>, <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">^</code> or use <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">pow()</code><br/><br/>Pi constant - <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">pi</code> or <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">π</code></p>
            <table className="w-full border border-gray-400 dark:border-neutral-600 mb-4 rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-300 dark:bg-neutral-700">
                        <th className="border border-gray-400 dark:border-neutral-600 p-2 text-left">Function</th>
                        <th className="border border-gray-400 dark:border-neutral-600 p-2 text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">abs(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the absolute value of x.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">ceil(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the value of x rounded up to the nearest integer.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">cos(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the cosine of x in radians.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">cosec(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the cosecant of x in radians.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">cot(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the cotangent of x in radians.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">cosh(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the hyperbolic cosine of x.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">exp(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the exponential of x.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">floor(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the value of x rounded down to the nearest integer.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">ln(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the natural logarithm of x.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">log(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the base-10 logarithm of x.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">max(a, b)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the maximum of a and b.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">min(a, b)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the minimum of a and b.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">pow(a, b)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns a raised to the power of b.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">round(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the value of x rounded to the nearest integer.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">round(x, n)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the value of x rounded to n decimal places.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">sec(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the secant of x in radians.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">sin(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the sine of x in radians.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">sinh(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the hyperbolic sine of x.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">sqrt(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the square root of x.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">tan(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the tangent of x in radians.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">tanh(x)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the hyperbolic tangent of x.</td>
                    </tr>
                </tbody>
            </table>
            <br />

            <label className="text-lg block mb-2 font-semibold">
                Strings
            </label>
            <p className="mb-4">Strings can be defined using either <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">'</code> or <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">"</code>. They can also be concatenated using the <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">+</code> operator.</p>
            <p className="mb-4">The length of a string can be obtained using <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">{config.lengthSyntax}(str)</code> or <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">str.{config.lengthSyntax}</code>.</p>
            <p className="mb-4">Strings can be accessed by index, i.e. <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">str[i]</code>, <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">str.index(i)</code> or <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">index(str, i)</code>.</p>
            <p className="mb-4">Substrings can be extracted using <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">str.substring(start, end)</code> or <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">substring(str, start, end)</code>.</p>
            <p className="mb-4">Alternatively, you can use Python-style slicing: <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">str[start:end:step]</code>.</p>
            <br />
        
            <label className="text-lg block mb-2 font-semibold">
                Arrays
            </label>
            <p className="mb-4">Arrays can be declared with or without assignation, similar to other variable types.</p>
            <div className="flex flex-row gap-4">
                <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                    
                    <br />
                    array nums
                    <br />
                    var array nums
                    <br />
                    int[] nums
                    <br />
                    int[3] nums {config.commentSyntax} Array length is immutable
                </code>
                <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                    nums {config.assignmentSyntax} [1, 2, 3]
                    <br />
                    array nums {config.assignmentSyntax} [1, 2, 3]
                    <br />
                    var array nums {config.assignmentSyntax} [1, 2, 3]
                    <br />
                    int[] nums {config.assignmentSyntax} [1, 2, 3]
                    <br />
                    int[3] nums {config.assignmentSyntax} [1, 2, 3] {config.commentSyntax} Array length is immutable
                </code>
            </div>
            <p className="mb-4">There are also various functions available for working with arrays.</p>
            <table className="w-full border border-gray-400 dark:border-neutral-600 mb-4 rounded-lg overflow-hidden">
                <thead>
                    <tr className="bg-gray-300 dark:bg-neutral-700">
                        <th className="border border-gray-400 dark:border-neutral-600 p-2 text-left">Member Syntax</th>
                        <th className="border border-gray-400 dark:border-neutral-600 p-2 text-left">Function Syntax</th>
                        <th className="border border-gray-400 dark:border-neutral-600 p-2 text-left">Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.append(value)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">append(arr, value)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Adds value to the end of the array.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.count(value)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">count(arr, value)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the number of occurrences of value in the array.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.{config.includesSyntax}(value)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">{config.includesSyntax}(arr, value)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns True if the array contains the specified value, otherwise False.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.indexOf(value)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">indexOf(arr, value)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the index of the first occurrence of value in the array.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.insert(index, value)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">insert(arr, index, value)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Inserts value at the specified index in the array.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.isEmpty</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">isEmpty(arr)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns True if arr is empty, False otherwise.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.join</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">join(arr)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns a string containing all elements from the array.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.join(separator)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">join(arr, separator)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns a string containing all elements from the array, separated by the specified separator.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.{config.lengthSyntax}</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">{config.lengthSyntax}(arr)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the length of the array.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.{config.meanSyntax}</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">{config.meanSyntax}(arr)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the mean value of the elements in the array of numbers.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.median</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">median(arr)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the median value of the elements in the array of numbers. The median value may not be a value in the array.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.mode</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">mode(arr)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the mode value of the elements in the array of numbers. In the case of a tie, an array of all modes is returned.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.pop()</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">pop(arr)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Removes and returns the last element from the array.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.product</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">product(arr)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the product of the elements in the array of numbers.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.reverse</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">reverse(arr)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the array with its elements in reverse order.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.sort</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">sort(arr)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the sorted array of values in ascending alphabetical or numerical order. Array must exclusively contain strings or numbers.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.subarray(start, end)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">subarray(arr, start, end)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns a new array containing the elements from the specified start index to the end index.</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr.sum</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2"><code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">sum(arr)</code></td>
                        <td className="border border-gray-400 dark:border-neutral-600 p-2">Returns the sum of the elements in the array of numbers.</td>
                    </tr>
                </tbody>
            </table>
            <br />
            <p className="mb-4">You can use Python-style slicing on arrays: <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">arr[start:end:step]</code>.</p>
            <p className="mb-4">The <code className="bg-gray-200 dark:bg-neutral-700 p-1 rounded">range(start, end, step)</code> function returns an array of numbers from the start value to the end value with the specified step size. The inclusion of the start and end values depends on what is configured in the for loop settings.</p>
            <br />

            <label className="text-lg block mb-2 font-semibold">
                Functions
            </label>
            <p className="mb-4">Functions must be defined before they can be called.</p>
            <p className="mb-4">Functions can be defined either by specifying the type of the parameters or by inferring the type from the context.</p>
            { config.codeStyle === CodeStyle.INDENT && (
                <div className="flex flex-row gap-4">
                <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                    {config.functionSyntax} add(a, b):
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;return a + b
                    <br />
                    end{config.functionSyntax}
                </code>
                <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                    {config.functionSyntax} add({config.intSyntax} a, {config.intSyntax} b):
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;return a + b
                    <br />
                    end{config.functionSyntax}
                </code>
            </div>
            )}
            { config.codeStyle === CodeStyle.CURLY_BRACES && (
                <div className="flex flex-row gap-4">
                <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                    {config.functionSyntax} add(a, b) {"{"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;return a + b
                    <br />
                    {"}"}
                    <br />
                    end{config.functionSyntax}
                </code>
                <code className="bg-gray-200 dark:bg-neutral-700 p-4 rounded text-sm mb-4 block w-1/2">
                    {config.functionSyntax} add({config.intSyntax} a, {config.intSyntax} b) {"{"}
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;return a + b
                    <br />
                    {"}"}
                    <br />
                    end{config.functionSyntax}
                </code>
            </div>
            )}
            <br />
            <p className="mb-4">Variables defined within a function are local to that function and cannot be accessed from outside the function. Variables defined outside any function are global and can be accessed from anywhere in the program.</p>
        </div>
    );
}