import React, { useEffect, useState } from "react";
import "./Visuals.css";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Visuals = () => {
    const [statusHistory, setStatusHistory] = useState({
        latitude: [],
        longitude: [],
        inclination: [],
        powerLevel: [],
        temperature: [],
        radiationLevel: [],
        communicationStatus: [],
        solarPanelStatus: [],
        lastCheckIn: [],
        uplinkFreq: [],
        downlinkFreq: [],
        dataRate: []
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchStatus = async () => {
        try {
            const response = await axios.get('http://localhost:3050/satellite/status/data');
            const satelliteData = response.data[0];

            setStatusHistory(prev => ({
                latitude: [...prev.latitude, satelliteData.latitude],
                longitude: [...prev.longitude, satelliteData.longitude],
                inclination: [...prev.inclination, satelliteData.inclination],
                powerLevel: [...prev.powerLevel, satelliteData.powerLevel],
                temperature: [...prev.temperature, satelliteData.temperature],
                radiationLevel: [...prev.radiationLevel, satelliteData.radiationLevel],
                communicationStatus: [...prev.communicationStatus, satelliteData.communicationStatus],
                solarPanelStatus: [...prev.solarPanelStatus, satelliteData.solarPanelStatus],
                lastCheckIn: [...prev.lastCheckIn, satelliteData.lastCheckIn],
                uplinkFreq: [...prev.uplinkFreq, satelliteData.uplinkFreq],
                downlinkFreq: [...prev.downlinkFreq, satelliteData.downlinkFreq],
                dataRate: [...prev.dataRate, satelliteData.dataRate],
            }));

        } catch (err) {
            setError('Error fetching satellite status');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus(); // Initial fetch

        const interval = setInterval(() => {
            fetchStatus(); // Fetch every 5 seconds
        }, 5000);

        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    const options = {
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    color: "black",
                    font: { family: "Nunito", size: 14 },
                },
            },
            y: {
                grid: { display: false },
                ticks: {
                    stepSize: 10,
                    color: "black",
                    font: { family: "Nunito", size: 14 },
                },
            },
        },
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
    };

    const createChartData = (label, data) => ({
        labels: data.map((_, index) => index + 1), // simple 1,2,3... numbering for x-axis
        datasets: [
            {
                label: label,
                borderColor: "navy",
                backgroundColor: "#2a5298",
                fill: true,
                lineTension: 0.4,
                pointRadius: 0,
                data: data,
                borderWidth: 1,
            },
        ],
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="visuals-ui">
            <div className="top-ui">
                <h1>Satellite Visuals</h1>
                <p>Live Satellite Data Graphs</p>
            </div>
            <div className="bottom-ui">
                <div className="chart"><Line options={options} data={createChartData("Latitude", statusHistory.latitude)} /></div>
                <div className="chart"><Line options={options} data={createChartData("Longitude", statusHistory.longitude)} /></div>
                <div className="chart"><Line options={options} data={createChartData("Inclination", statusHistory.inclination)} /></div>
                <div className="chart"><Line options={options} data={createChartData("Power Level", statusHistory.powerLevel)} /></div>
                <div className="chart"><Line options={options} data={createChartData("Temperature", statusHistory.temperature)} /></div>
                <div className="chart"><Line options={options} data={createChartData("Radiation Level", statusHistory.radiationLevel)} /></div>
                <div className="chart"><Line options={options} data={createChartData("Communication Status", statusHistory.communicationStatus)} /></div>
                <div className="chart"><Line options={options} data={createChartData("Solar Panel Status", statusHistory.solarPanelStatus)} /></div>
                <div className="chart"><Line options={options} data={createChartData("Last Check-In", statusHistory.lastCheckIn)} /></div>
                <div className="chart"><Line options={options} data={createChartData("Uplink Frequency", statusHistory.uplinkFreq)} /></div>
                <div className="chart"><Line options={options} data={createChartData("Downlink Frequency", statusHistory.downlinkFreq)} /></div>
                <div className="chart"><Line options={options} data={createChartData("Data Rate", statusHistory.dataRate)} /></div>
            </div>
        </div>
    );
};

export default Visuals;
