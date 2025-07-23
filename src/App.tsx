import { BrowserRouter, Routes, Route } from 'react-router'
import './App.css'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import { SignupProvider } from './context/signupContext'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <BrowserRouter>
      <SignupProvider>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </SignupProvider>
    </BrowserRouter>
  )
}

export default App
