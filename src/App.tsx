import React from 'react';
import {Routes, Route} from "react-router-dom"
import Home from "./components/pages/Home/Home"
import Devices from './components/pages/Devices/Devices';
import Device from './components/pages/Devices/Device';
import PageNotFound from './components/pages/404/PageNotFound';
import DeviceNotFound from './components/pages/Devices/DeviceNotFound';
import NavBar from './components/pages/navBars/NavBar';


function App() {
  return (
    <div className="App">
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/devices' element={<Devices/>}  />
        <Route path='/device/:id' element={<Device/>} />
        <Route path='/device/*' element={<DeviceNotFound/>} />
        <Route path='/*' element={<PageNotFound/>} />
      </Routes>
    </div>
  );
}

export default App;
