import { useState } from 'react'
import SplashCursor from './components/SplashCursor'
import './App.css'
import Github from './components/Github'
import Git from './components/Git'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <Github/> */}
    <Git/>
    </>
  )
}

export default App
