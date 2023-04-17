import { AddDevice, DeleteDevice, GetDevice, UpdateDevice } from "../api/ComApiDevice";
import { Device } from "./Device";

export class DeviceController {

    static GetUnPrefixedId(prefixedId: String) {
        const unprefixedId: String = prefixedId.replace(Device.prefixId, '');
        let id: number = 0;
        try {
            id = Number(unprefixedId);
        } catch (error) {
            console.log(error);
        }
        return id
    }

    static Get(deviceId: string, callbackSuccess?: Function, callbackError?: Function) {
        GetDevice(DeviceController.GetUnPrefixedId(deviceId)
            , (response: Device) => {if (callbackSuccess !== undefined) callbackSuccess(response)}
        );
    }

    static Create(device: Device, callbackSuccess?: Function, callbackError?: Function) {

        AddDevice(
            device,
            (response: Device) => { if (callbackSuccess !== undefined) callbackSuccess(response); }
        );
    }

    static Delete(deviceId: string, callbackSuccess?: Function, callbackError?: Function) {
        GetDevice(DeviceController.GetUnPrefixedId(deviceId)
            , (response: Device) => {
                DeleteDevice(response.id, () => { if (callbackSuccess !== undefined) callbackSuccess(response) });
            }
        );
    }

    static SetMonitored(deviceId: string, monitored: boolean, callbackSuccess?: Function, callbackError?: Function) {
        GetDevice(DeviceController.GetUnPrefixedId(deviceId),
            (response: Device) => {
                response.monitored = monitored;
                UpdateDevice(response,
                    (response: Device) => {
                        if (callbackSuccess !== undefined) callbackSuccess(response);
                    }
                    ,
                    (error: any) => {
                        if (callbackError !== undefined) callbackError(error);
                    }
                );
            }
            ,
            (error: any) => {
                if (callbackError !== undefined) callbackError(error);
            }
        )
    } 
}