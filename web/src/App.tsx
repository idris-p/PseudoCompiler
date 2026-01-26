import { useState } from 'react'
import Container from './components/Container'
import SideButtons from './components/SideButtons'

function App() {
  const [showConfig, setShowConfig] = useState(false)

  return (
    <div className='h-screen p-10 flex'>
      <Container showConfig={showConfig} />
      <SideButtons showConfig={showConfig} setShowConfig={setShowConfig} />
    </div>
  )
}

export default App
