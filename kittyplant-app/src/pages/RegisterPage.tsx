import { useState } from 'react';
import axios from 'axios';
import '../styles/LoginPage.css'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom';

function Register(){
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleLogin = () => {
        navigate("/login")
    }   

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        } 
        
        try {
            const response = await axios.post('/api/auth/register', { "user": username, "password": password}, { withCredentials: true });
            if(response.status === 200) {
                navigate("/login");
            }
        } catch (err: any) {
            setError("Username already exists!");
        }

        setError(null);
    }   

    return (
        <div className='tmp'>
            <Header />
            <div className="login-page">
                <div className="form-container">
                    <h1>Login into your account</h1>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" name="username" required placeholder='TYPE' pattern='[a-zA-Z]{5,20}'/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" required placeholder='TYPE'/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" required placeholder='TYPE'/>
                        </div>
                        {
                            error && (
                                <div className='alert'>{error}</div>
                            )
                        }
                        <div className='button-group'>
                            <button type="submit">REGISTER</button>
                            <button onClick={handleLogin}>LOG IN</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;