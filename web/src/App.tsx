import Container from './components/Container'
import ConfigButton from './components/ConfigButton'
import PlayButton from './components/PlayButton'

function App() {

  return (
    <div className='h-screen p-10 flex'>
      <Container />
      <div>
        <PlayButton />
        <ConfigButton />
      </div>
    </div>
  )
}

export default App
