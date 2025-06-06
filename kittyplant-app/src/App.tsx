import {BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PlantsPage from './pages/PlantsPage'
import Register from './pages/RegisterPage'

const ProtectedRoute = () => {
  const isLoggedIn = document.cookie.includes('session');
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register/>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/plants" element={<PlantsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App;