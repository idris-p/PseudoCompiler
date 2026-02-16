import { useState } from 'react'
import Container from './components/Container'
import SideButtons from './components/SideButtons'

function App() {
  const [showConfig, setShowConfig] = useState(false)
  const [code, setCode] = useState<string>(localStorage.getItem("pseudoCode") || "# Write some pseudocode here\n\n");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [pendingInput, setPendingInput] = useState<{prompt?: string; resolve: (value: string) => void;} | null>(null);

  return (
    <div className='h-screen p-10 flex'>
      <Container showConfig={showConfig} code={code} setCode={setCode} terminalOutput={terminalOutput} setTerminalOutput={setTerminalOutput} pendingInput={pendingInput} setPendingInput={setPendingInput} />
      <SideButtons showConfig={showConfig} setShowConfig={setShowConfig} code={code} setTerminalOutput={setTerminalOutput} setPendingInput={setPendingInput} />
    </div>
  )
}

export default App
