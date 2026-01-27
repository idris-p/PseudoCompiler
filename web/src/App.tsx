import { useState } from 'react'
import Container from './components/Container'
import SideButtons from './components/SideButtons'

function App() {
  const [showConfig, setShowConfig] = useState(false)
  const [code, setCode] = useState<string>(`x = 0\nwhile x < 5\n\tif x == 2\n\t\tprint "two"\n\telse\n\t\tprint x\n\tx = x + 1`);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  return (
    <div className='h-screen p-10 flex'>
      <Container showConfig={showConfig} code={code} setCode={setCode} terminalOutput={terminalOutput} />
      <SideButtons showConfig={showConfig} setShowConfig={setShowConfig} code={code} setTerminalOutput={setTerminalOutput} />
    </div>
  )
}

export default App
