import api from "./api"

export interface Plant {
    id: number;
    name: string;
    water_level_min: number;
    water_level_max: number;
}

export async function getPlants() {
    try {
        const response = await api.get("/v1/plants");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch plants:", error);
        throw error;
    }
}
