import { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


function Login(){
    const navigate = useNavigate();
    const [usernameLogin, setUsernameLogin] = useState<string>('');
    const [passwordLogin, setPasswordLogin] = useState<string>('');

    const [usernameRegister, setUsernameRegister] = useState<string>('');
    const [passwordRegister, setPasswordRegister] = useState<string>('');
    const [confirmPasswordRegister, setConfirmPasswordRegister] = useState<string>('');


    const handleLogin = async () => {
        try {

            const response = await axios.post(
                'http://localhost:8080/api/auth/login',
                { user: usernameLogin, password: passwordLogin }
            );

            if (response.status === 200) {
                navigate("/plants");
            } 
        } catch (err: any) {
            console.log(err);
        }
    }

    const handleRegister = async () => {
        if (passwordRegister !== confirmPasswordRegister) {
            console.log("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/api/auth/register',
                { user: usernameRegister, password: passwordRegister }
            );

            if (response.status === 201) {
                navigate("/plants");
            }
        } catch (err: any) {
            console.log(err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="h-full flex flex-col items-center justify-center m-auto">
               <Tabs defaultValue="login" className="w-[400px] h-[400px]">
                    <TabsList className='grid w-full grid-cols-2'>
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <Card>
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>
                                    Enter your credentials to access your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-name">email</Label>
                                    <Input id="tabs-demo-name" className='bg-(--kitty-white)' placeholder="username" 
                                    value={usernameLogin} onChange={(e) => setUsernameLogin(e.target.value)} />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-username">Password</Label>
                                    <Input id="tabs-demo-username" className='bg-(--kitty-white)' type='password' placeholder="password" 
                                    value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleLogin} className='bg-(--kitty-dark-pink)'>Save changes</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="register">
                        <Card>
                            <CardHeader>
                                <CardTitle>Register</CardTitle>
                                <CardDescription>
                                    Create a new account by filling in the details below.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-name">Email</Label>
                                    <Input id="tabs-demo-name" className='bg-(--kitty-white)' placeholder='username' 
                                    value={usernameRegister} onChange={(e) => setUsernameRegister(e.target.value)} />

                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-username">Password</Label>
                                    <Input id="tabs-demo-username" className='bg-(--kitty-white)' type='password' placeholder='Password' 
                                    value={passwordRegister} onChange={(e) => setPasswordRegister(e.target.value)} />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-username">Confirm Password</Label>
                                    <Input type='password' id="tabs-demo-username" className='bg-(--kitty-white)' placeholder='Confirm password'
                                    value={confirmPasswordRegister} onChange={(e) => setConfirmPasswordRegister(e.target.value)} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className='bg-(--kitty-dark-pink)' onClick={handleRegister}>Save changes</Button>
                            </CardFooter>
                        </Card>   
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default Login;