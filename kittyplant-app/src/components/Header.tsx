import { Link } from 'react-router-dom';
import '../styles/Header.css';


const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <Link to="/"  className="nav-item">Home</Link>
          <Link to="/plants" className="nav-item">Plants</Link>
          <Link to="/login" className="nav-item">Login</Link>
        </ul>
      </nav>
    </header>
  )
}

export default Header