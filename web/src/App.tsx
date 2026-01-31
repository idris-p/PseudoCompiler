import { useState } from 'react'
import Container from './components/Container'
import SideButtons from './components/SideButtons'

function App() {
  const [showConfig, setShowConfig] = useState(false)
  const [code, setCode] = useState<string>(localStorage.getItem("pseudoCode") || "# Write some pseudocode here\n\n");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  return (
    <div className='h-screen p-10 flex'>
      <Container showConfig={showConfig} code={code} setCode={setCode} terminalOutput={terminalOutput} />
      <SideButtons showConfig={showConfig} setShowConfig={setShowConfig} code={code} setTerminalOutput={setTerminalOutput} />
    </div>
  )
}

export default App
