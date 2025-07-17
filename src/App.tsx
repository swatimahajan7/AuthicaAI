import { BrowserRouter, Routes, Route } from 'react-router'
import './App.css'
import Signup from './pages/Signup'
import Signin from './pages/Signin'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
