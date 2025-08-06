import { BrowserRouter, Routes, Route } from 'react-router'
import './App.css'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './components/UserDashboard'
import { AuthProvider } from './context/globalAuthContext'
import ProfilePage from './components/UserProfile'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userHome/:username" element={<UserDashboard  />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/userProfile" element={<ProfilePage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
