import api from "./api"

export interface Device {
    id: number;
    device_id: string;
    name: string;
    waterLevel: number;
    plant: string;
}

export interface NewDevice {
    device_id: string;
    name: string;
    plant: string;
    water_level_min?: number;
    water_level_max?: number;
}

export async function getDevices() {
    try {
        const response = await api.get("/v1/devices");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch devices:", error);
        throw error;
    }
}

export async function addDevice(device: NewDevice) {
    try {
        const response = await api.post("/v1/devices", device);
        return response.data;
    } catch (error) {
        console.error("Failed to add device:", error);
        throw error;
    }
}
