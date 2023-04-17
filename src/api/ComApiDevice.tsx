import axios, { AxiosError } from "axios";
import { Device } from "../models/Device";
import { API_URL } from "./ComApi";

export async function GetDevices(callbackSuccess?: Function, callbackError?: Function) {
    try {

        axios.get(`${API_URL}devices`
        ).then(
            (response) => {
                const deviceList: Device[] = [];
                response.data.forEach((element: any) => {                    
                    const device: Device = new Device(
                        element.type,
                        element.name,
                        element.ip,
                        element.reachable,
                        element.monitored);
                    device.id = element.id;
                    device.log = element.log;
                    deviceList.push(device);
                });
                if(callbackSuccess !== undefined) callbackSuccess(deviceList);
                
            }
            , (error: AxiosError) => {
                if(callbackError !== undefined) callbackError(error);
            }
        );
    } catch (error) {
        if(callbackError !== undefined) callbackError(error);
    }
}

export async function GetDevice(deviceId: number, callbackSuccess?: Function, callbackError?: Function) {
    try {
        axios.get(`${API_URL}devices\\${deviceId}`
        ).then(
            (response) => {
                if(callbackSuccess !== undefined) callbackSuccess(Device.TryConvertData(response.data));
            }
            , (error) => {
                if(callbackError !== undefined) callbackError(error);
            }
        );
    } catch (error) {
        if(callbackError !== undefined) callbackError(error);
    }
}

export async function AddDevice(device: Device, callbackSuccess?: Function, callbackError?: Function) {
    try {
        axios.post(`${API_URL}devices`,
            {
                name: device.name,
                type: device.type,
                ip: device.ip,
                reachable: device.reachable,
                monitored: device.monitored,
                log: device.log,
            }
        ).then(
            (response) => {
                if(callbackSuccess !== undefined) callbackSuccess(Device.TryConvertData(response.data));
                
            }
            , (error) => {
                if(callbackError !== undefined) callbackError(error);
            }
        );

    } catch (error) {
        if(callbackError !== undefined) callbackError(error);
    }
}

export async function UpdateDevice(device: Device, callbackSuccess: Function, callbackError: Function) {
    try {
        axios.put(`${API_URL}devices\\${device.id}`,
            {
                id: device.id,
                name: device.name,
                type: device.type,
                ip: device.ip,
                reachable: device.reachable,
                monitored: device.monitored,
                log: device.log,
            }
        ).then(
            (response) => {
                callbackSuccess(Device.TryConvertData(response.data));
            }
            , (error) => {
                callbackError(error);
            }
        );

    } catch (error) {
        callbackError(error);
    }
}

export async function DeleteDevice(deviceId: number, callbackSuccess?: Function, callbackError?: Function) {
    try {
        axios.delete(`${API_URL}devices\\${deviceId}`,
        ).then(
            (response) => {
                if(callbackSuccess !== undefined) callbackSuccess(response);             
            }
            , (error) => {
                if(callbackError !== undefined) callbackError(error); 
            }
        );

    } catch (error) {
        if(callbackError !== undefined) callbackError(error); 
    }
}