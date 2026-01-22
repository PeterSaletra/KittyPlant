import api from "./api"

export interface Device {
    id: number;
    device_id: string;
    name: string;
    waterLevel: number;
    moistureLevel: number;
    plant: string;
    lastTimeWatered?: string;
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
        console.log("Adding device:", device);
        const response = await api.post("/v1/devices", device);
        return response.data;
    } catch (error) {
        console.error("Failed to add device:", error);
        throw error;
    }
}

export async function getDevicesNames() {
    try {
        const response = await api.get("/v1/devices/names");
        return response.data;
    } catch (error) {
        console.error("Failed to update device names:", error);
        throw error;
    }
}

export async function deleteDevice(deviceID: string) {
    try {
        const response = await api.delete(`/v1/devices/${deviceID}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete device:", error);
        throw error;
    }
}

export async function getDeviceData(deviceID: string, from: string, to: string , range: string) {
    try {
        const response = await api.get(`/v1/devices/history`, {
            params: { device_id: deviceID, start: from, end: to, range: range}
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch device data:", error);
        throw error;
    }
}

export async function sendCommands(command: string, deviceID: string) {
    try {
        const response = await api.post(`/v1/devices/commands`, {
            command: command,
            device_id: deviceID
        });
        return response.data;
    } catch (error) {
        console.error("Failed to send command to device:", error);
        throw error;
    }
}