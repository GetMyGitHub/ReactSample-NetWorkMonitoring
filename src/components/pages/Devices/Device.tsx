import React from 'react'
import {useParams} from "react-router-dom"

export default function Device() {

    const params = useParams();
    const deviceId = params.id;

    console.log(params);

    return (
        <div>
            <h1>Device {deviceId}</h1>
        </div>
    )
}
