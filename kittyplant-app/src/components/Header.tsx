import { Link } from 'react-router-dom';
import { logout } from '@/lib/auth';

const Header = () => {

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="font-antonio font-medium text-lg flex justify-center p-6 bg-(--kitty-light-pink) w-[70%] h-8 rounded-[5.625rem] mx-auto mt-4 md:flex-col md:gap-4">
      <div>
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
      </div>
    </div>
  )
}

export default Header