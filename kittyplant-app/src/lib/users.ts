import api from "./api"

export async function getUserDetail() {
    try{
        const response = await api.get("/v1/users/me");

        return response.data;
    }catch(error){
        console.error("Failed to load user data:", error);
        throw error;
    }
}