import { Link } from 'react-router-dom';
import axios from 'axios'
import '../styles/Header.css';


const Header = () => {

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <Link to="/"  className="nav-item">Home</Link>
          <Link to="/plants" className="nav-item">Plants</Link>
            {
            document.cookie.split(';').some(cookie => cookie.trim().startsWith('session=')) ? (
              <Link to="/" className="nav-item" onClick={handleLogout}>Logout</Link>
            ) : (
              <Link to="/login" className="nav-item">Login</Link>
            )
            }
        </ul>
      </nav>
    </header>
  )
}

export default Header