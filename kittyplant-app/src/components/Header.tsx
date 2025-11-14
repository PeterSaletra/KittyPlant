import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="font-antonio font-medium text-lg flex justify-center p-6 bg-(--kitty-light-pink) w-[70%] h-8 rounded-[5.625rem] mx-auto mt-4 md:flex-col md:gap-4">
      <div>
        <ul className="flex gap-70 justify-center">
          <Link to="/" className="uppercase">Home</Link>
          <Link to="/plants" className="uppercase">Plants</Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="uppercase">Logout</button>
          ) : (
            <Link to="/login" className="uppercase">Login</Link>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Header