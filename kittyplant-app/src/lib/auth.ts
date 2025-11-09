import api from './api';

export async function login(username: string, password: string) {
    try{
        const response =  await api.post(
            "/auth/login",
            {
                "user": username,
                "password": password 
            },
        )
        return response.data
    }catch (error){
        console.error('Login failed:', error);
        throw error;
    }
}

export async function register(username: string, password: string) {
    try{
        const response = await api.post(
            "/auth/register",
            {
                "user": username,
                "password": password
            },
            { withCredentials: true }
        )

        return response.data;
    }catch (error){
        console.error('Register failed:', error);
        throw error;
    }
}

export async function logout() {
    try{
        const response = await api.post(
            "/auth/logout",
            {},
            { withCredentials: true }
        )

        return response.data;
    }catch(error){
        console.error("Logout failed:", error);
        throw error
    }
}