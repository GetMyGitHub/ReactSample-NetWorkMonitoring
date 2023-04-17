import axios from "axios";
import { Device } from "../models/Device";
import { EnumTypeDevice } from "../models/Device";
import { error } from "console";



export enum ApiResponseStatus {
    CHECKING,
    SUCCESS,
    ERROR
}

//const API_URL = 'https://jsonplaceholder.typicode.com/';
export const API_URL = 'http://192.168.1.133:8080/api/';

export async function getTodos() {
    try {
        const {data} = await axios.get(`${API_URL}devices`);
        data.forEach((element: any) => {
            console.log(element);
        });
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }
    
}

export async function getDevices() {
    try {
        const {data} = await axios.get(`${API_URL}devices`);
        const deviceList : Device[] = [];
        data.forEach((element: any) => {
            const device:Device = new Device( element.type, element.name, element.ip, false, false);
            device.id = element.id;
            deviceList.push(device);            
        });
        return deviceList;
    } catch (error) {
        console.log(error);
    }    
}


export async function AddDevice(device : Device, callback : Function) {
    try {
        await axios.post(`${API_URL}devices`, 
            {
                name : device.name,
                type : device.type,
                ip : device.ip
            }
        ).then(
            (response) => {
                console.log(response);
                callback(true, response);
            }
            , (error) => {
                console.log(error);
                callback(false, error);
            }
        );
        
        // const deviceList : Device[] = [];
        // data.forEach((element: any) => {
        //     const device:Device = new Device( element.type, element.name, element.ip, false, false);
        //     device.id = element.id;
        //     deviceList.push(device);            
        // });
        // return deviceList;
    } catch (error) {
        console.log(error);
    }    
}

export async function DeleteDevice(id : Number) {
    try {
        await axios.delete(`${API_URL}devices\\${id}`
        ).then(
            (response) => {
                console.log(response)
            }, (error) => {
                console.log(error);
            }
        );
    } catch (error) {
        console.log(error);
    }    
}