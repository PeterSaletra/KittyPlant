import { Link } from 'react-router-dom';
import axios from 'axios'

const Header = () => {

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <header className="font-antonio font-medium text-lg flex justify-center p-6 bg-(--kitty-light-pink) w-[70%] h-8 rounded-[5.625rem] mx-auto mt-4 md:flex-col md:gap-4">
      <nav>
        <ul className="flex gap-70 justify-center">
          <Link to="/" className="uppercase">Home</Link>
          <Link to="/plants" className="uppercase">Plants</Link>
          {
            document.cookie.split(';').some(cookie => cookie.trim().startsWith('session=')) ? (
              <Link to="/" className="uppercase " onClick={handleLogout}>Logout</Link>
            ) : (
              <Link to="/login" className="uppercase">Login</Link>
            )
          }
        </ul>
      </nav>
    </header>
  )
}

export default Header