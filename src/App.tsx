import { BrowserRouter, Routes, Route } from 'react-router'
import './App.css'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './components/UserDashboard'
import { AuthProvider } from './context/globalAuthContext'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userDashboard" element={<UserDashboard  />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
