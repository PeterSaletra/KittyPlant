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
    const [error, setError] = useState<string | null>(null);
    const [username_form, setUsername_form] = useState<string>('');
    const [password_form, setPassword_form] = useState<string>('');

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
                                    <Input id="tabs-demo-name" className='bg-(--kitty-white)' placeholder="example@example.com" />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-username">Password</Label>
                                    <Input id="tabs-demo-username" className='bg-(--kitty-white)' type='password' placeholder="password" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => handleSubmit} className='bg-(--kitty-dark-pink)'>Save changes</Button>
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
                                    <Input id="tabs-demo-name" className='bg-(--kitty-white)' placeholder='example@example.com' />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-username">Password</Label>
                                    <Input id="tabs-demo-username" className='bg-(--kitty-white)' type='password' placeholder='Password' />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-username">Confirm Password</Label>
                                    <Input type='password' id="tabs-demo-username" className='bg-(--kitty-white)' placeholder='Confirm password'/>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className='bg-(--kitty-dark-pink)'>Save changes</Button>
                            </CardFooter>
                        </Card>   
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default Login;