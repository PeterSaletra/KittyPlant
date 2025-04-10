import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PlantsPage from './pages/PlantsPage'
import Register from './pages/RegisterPage'

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/plants" element={<PlantsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App;