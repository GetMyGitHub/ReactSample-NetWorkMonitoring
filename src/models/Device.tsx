import { GetDevice, GetDevices, UpdateDevice } from "../api/ComApiDevice";

export enum EnumTypeDevice {
    Computer,
    Phone,
    Tablet
}

export class Device {    

    static prefixId : string = "device-"

    id!: number;
    type: string
    name: string;
    ip: string;
    reachable: boolean = false;
    monitored: boolean = false;
    log : String = "";

    constructor(
        type: string,
        name: string,
        ip: string,
        reachable: boolean,
        monitored: boolean) {
        this.type = type;
        this.name = name;
        this.ip = ip;
        this.reachable = reachable;
        this.monitored = monitored;
    }

    static getTypes() {
        let members = []
        for (let i: number = 0; true; i++) {
            if (EnumTypeDevice[i] === undefined) break
            members.push(EnumTypeDevice[i])
        }
        return members;
    }

    static TryConvertData(data: any) {

        const device = new Device("", "", "", false, false);

        if (data.id !== undefined) device.id = data.id;
        if (data.type !== undefined) device.type = data.type;
        if (data.name !== undefined) device.name = data.name;
        if (data.ip !== undefined) device.ip = data.ip;
        if (data.reachable !== undefined) device.reachable = data.reachable;
        if (data.monitored !== undefined) device.monitored = data.monitored;
        if (data.log !== undefined) device.log = data.log;

        // console.log(device);

        return device;
    }


    static GetTypeNameValueFromEnum(enumTypeDevice: EnumTypeDevice) {
        switch (enumTypeDevice) {
            case EnumTypeDevice.Computer:
                return "Computer";
            case EnumTypeDevice.Phone:
                return "Phone";
            case EnumTypeDevice.Tablet:
                return "Tablet";
            default:
                return "";
        }

    }



    // SetMonitored (deviceId: string, monitored:boolean, callbackSuccess: Function, callbackError: Function ) {
    //     GetDevice(Device.GetUnPrefixedId(deviceId),
    //     (response: Device) => {
    //       response.monitored = monitored;
    //       UpdateDevice(response,
    //         (response: Device) => {
    //           GetDevices(
    //             (response: Device[]) => {
    //                 callbackSuccess(response);
    //             }
    //             ,
    //             (error: any) => {
    //                 callbackError(error);
    //             }
    //           )
    //         }
    //         ,
    //         (error: any) => {
    //             callbackError(error);
    //         }
    //       );
  
    //     }
    //     ,
    //     (error: any) => {
    //         callbackError(error);
    //     }
    // )}




}


