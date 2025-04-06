import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item"><a href="#contact">Contact Us</a></li>
          <li className="nav-item"><a href="#about">About Us</a></li>
          <li className="nav-item"><a href="#shop">Shop</a></li>
          <li className="nav-item"><a href="#products">Products</a></li>
          <li className="nav-item"><a href="#get-started">Get Started</a></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header