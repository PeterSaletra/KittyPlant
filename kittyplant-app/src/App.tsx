import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PlantsPage from './pages/PlantsPage'
import Register from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import ChartsPage from './pages/ChartsPage'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/plants" element={<ProtectedRoute><PlantsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/charts" element={<ProtectedRoute><ChartsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster position="top-right" richColors closeButton/>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;