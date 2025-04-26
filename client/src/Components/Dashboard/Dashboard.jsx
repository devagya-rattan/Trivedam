import React, { useState } from 'react';
import Maps from '../Maps/Maps';
import './Dashboard.css';
import { GrUserAdmin } from "react-icons/gr";
import { MdOutlineSignalWifiStatusbar4Bar } from "react-icons/md";
import { IoStatsChartSharp } from "react-icons/io5";
import { GiSandstorm } from "react-icons/gi";
import { Link } from "react-router-dom";
import axios from 'axios';

const Dashboard = () => {
    const [stormStatus, setStormStatus] = useState(false);
    const [stormIntensity, setStormIntensity] = useState(0); 

    const startSolarStorm = async () => {
        const randomNum = Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
        setStormIntensity(randomNum); // save intensity to state

        await axios.put("http://localhost:3050/satellite/status/update", { timeStorm: randomNum });

        try {
            console.log("🌪 Starting Solar Storm");
            await axios.post("http://localhost:3050/satellite/status/storm", { storm: true });
            setStormStatus(true);

            setTimeout(async () => {
                console.log("☀️ Stopping Solar Storm");
                try {
                    await axios.post("http://localhost:3050/satellite/status/storm", { storm: false });
                    setStormStatus(false);
                } catch (err) {
                    console.error("Failed to stop solar storm:", err);
                }
            }, randomNum);
        } catch (err) {
            console.error("Failed to start solar storm:", err);
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

                <Link to="/dashboard/visuals">
                    <IoStatsChartSharp />
                    Visuals
                </Link>

                <Link onClick={startSolarStorm}>
                    <GiSandstorm />
                    Start Storm
                </Link>
            </div>

            <div className="right-ui">
                <div className="right-ui-map">
                    <Maps storm={stormStatus} />
                </div>
                <div className="live-stats">
                <h3>Solar storm Intensity</h3>
                {stormStatus && (
                   <p>{stormIntensity > 5000 ? "Critical Intensity 🔴" : "Mild Intensity 🟢"}</p>
                )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
