import React, { useState } from 'react';
import Maps from '../Maps/Maps';
import GlobeSimulation from '../Maps/GlobeSimulation';
import './Dashboard.css';
import { GrUserAdmin } from "react-icons/gr";
import { MdOutlineSignalWifiStatusbar4Bar } from "react-icons/md";
import { IoStatsChartSharp } from "react-icons/io5";
import { GiSandstorm } from "react-icons/gi";
import { Link } from "react-router-dom"
import axios from 'axios';
const Dashboard = () => {
    const startSolarStorm = async () => {
        try {
            console.log("🌪 Starting Solar Storm");
            await axios.post("http://localhost:3050/satellite/status/storm", { storm: true });
    
            setTimeout(async () => {
                console.log("☀️ Stopping Solar Storm");
                try {
                    await axios.post("http://localhost:3050/satellite/status/storm", { storm: false });
                } catch (err) {
                    console.error(" Failed to stop solar storm:", err);
                }
            }, 10000);
        } catch (err) {
            console.error(" Failed to start solar storm:", err);
        }
    };
    
    return (
        <div className="main-ui">
            <div className="left-ui">
                <Link to="/dashboard/admin">
                    <GrUserAdmin />
                    Admin
                </Link>

                <Link to="/dashboard/status">
                    <MdOutlineSignalWifiStatusbar4Bar />
                    Status
                </Link>
                <Link>
                    <IoStatsChartSharp />
                    Visuals
                </Link>
                <Link onClick={startSolarStorm}>
                    <GiSandstorm />

                    SolarStorm
                </Link>



            </div>
            <div className="right-ui">
                <div className="right-ui-map">
                    <Maps />
                </div>
                {/* <GlobeSimulation/> */}
            </div>
        </div>
    );
};

export default Dashboard;
