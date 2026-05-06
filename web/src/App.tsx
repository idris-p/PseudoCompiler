import { useEffect, useState } from 'react'
import Container from './components/Container'
import SideButtons from './components/SideButtons'
import { config } from '../../core/src/loader';
import LandingPage from './components/LandingPage';

export type TerminalLine = {
    text: string;
    type?: "normal" | "error";
};

function App() {
  const [showWorkspace, setShowWorkspace] = useState(() => window.location.hash === "#app")
  const [showConfig, setShowConfig] = useState(false)
  const [showDocs, setShowDocs] = useState(false)
  const [code, setCode] = useState<string>(localStorage.getItem("pseudoCode") || config.commentSyntax + " Write some pseudocode here\n\n");
  const [terminalOutput, setTerminalOutput] = useState<TerminalLine[]>([]);
  const [pendingInput, setPendingInput] = useState<{prompt?: string; resolve: (value: string) => void;} | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setShowWorkspace(window.location.hash === "#app");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const openWorkspace = () => {
    window.location.hash = "app";
    setShowWorkspace(true);
  };

  if (!showWorkspace) {
    return <LandingPage onEnter={openWorkspace} />;
  }

  return (
    <div className='h-screen p-10 flex'>
      <Container showConfig={showConfig} showDocs={showDocs} code={code} setCode={setCode} terminalOutput={terminalOutput} setTerminalOutput={setTerminalOutput} pendingInput={pendingInput} setPendingInput={setPendingInput} />
      <SideButtons showConfig={showConfig} setShowConfig={setShowConfig} showDocs={showDocs} setShowDocs={setShowDocs} code={code} setTerminalOutput={setTerminalOutput} setPendingInput={setPendingInput} />
    </div>
  )
}

export default App
