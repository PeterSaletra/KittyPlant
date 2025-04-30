import { useState } from 'react';
import axios from 'axios';
import '../styles/LoginPage.css';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

function Login(){
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [username_form, setUsername_form] = useState<string>('');
    const [password_form, setPassword_form] = useState<string>('');

    const handleRegister = () => {
        navigate("/register")
    }   

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {

            const response = await axios.post(
                '/api/auth/login',
                { user: username_form, password: password_form }, 
                { withCredentials: true }
            );

            if (response.status === 200) {
                navigate("/plants");
            } else {
                setError(`Unexpected response: ${response.status}`);
            }
        } catch (err: any) {
            console.log(err);
            setError("Invalid username or password!");
        }
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
                            <input type="text" id="username" 
                            value={username_form} 
                            onChange={(e) => setUsername_form(e.target.value)} 
                            name="username" required placeholder='TYPE'/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" 
                            value={password_form} 
                            onChange={(e) => setPassword_form(e.target.value)} 
                            name="password" required placeholder='TYPE'/>
                        </div>
                        <div className='button-group'>
                            {
                                error && (
                                    <div className='alert'>{error}</div>
                                )
                            }
                            <button type="submit">LOG IN</button>
                            <button onClick={handleRegister}>REGISTER</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;