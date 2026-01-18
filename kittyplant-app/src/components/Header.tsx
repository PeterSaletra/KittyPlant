import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setIsMobileMenuOpen(false);
    } catch (err) {
      console.error(err);
    }
  }

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      <div className="font-antonio font-medium text-base sm:text-lg flex justify-center items-center p-3 sm:p-6 bg-(--kitty-light-pink) w-[90%] sm:w-[80%] md:w-[70%] h-auto sm:h-8 rounded-[5.625rem] mx-auto mt-4 relative">
        {/* Hamburger button - visible on mobile only */}
        <button 
          className="sm:hidden absolute left-4 text-(--kitty-dark-pink) z-20"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* Desktop menu - hidden on mobile */}
        <div className="hidden sm:block">
          <ul className="flex gap-4 sm:gap-8 md:gap-12 lg:gap-20 xl:gap-70 justify-center items-center">
            <Link to="/" className="uppercase hover:text-(--kitty-dark-pink) transition-colors">Home</Link>
            <Link to="/plants" className="uppercase hover:text-(--kitty-dark-pink) transition-colors">Plants</Link>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="uppercase hover:text-(--kitty-dark-pink) transition-colors">Logout</button>
            ) : (
              <Link to="/login" className="uppercase hover:text-(--kitty-dark-pink) transition-colors">Login</Link>
            )}
          </ul>
        </div>

        {/* Mobile menu text - centered */}
        <span className="sm:hidden uppercase text-sm">Menu</span>
      </div>

      {/* Mobile dropdown menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed top-20 left-1/2 -translate-x-1/2 w-[90%] bg-(--kitty-light-pink) rounded-3xl shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="flex flex-col gap-4 p-6">
            <Link 
              to="/" 
              className="uppercase hover:text-(--kitty-dark-pink) transition-colors text-center py-2 border-b border-(--kitty-pink)"
              onClick={handleLinkClick}
            >
              Home
            </Link>
            <Link 
              to="/plants" 
              className="uppercase hover:text-(--kitty-dark-pink) transition-colors text-center py-2 border-b border-(--kitty-pink)"
              onClick={handleLinkClick}
            >
              Plants
            </Link>
            {isAuthenticated ? (
              <button 
                onClick={handleLogout} 
                className="uppercase hover:text-(--kitty-dark-pink) transition-colors text-center py-2"
              >
                Logout
              </button>
            ) : (
              <Link 
                to="/login" 
                className="uppercase hover:text-(--kitty-dark-pink) transition-colors text-center py-2"
                onClick={handleLinkClick}
              >
                Login
              </Link>
            )}
          </ul>
        </div>
      )}
    </>
  )
}

export default Header