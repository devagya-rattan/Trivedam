import React, { useEffect, useState } from 'react';
import './Status.css';
import axios from 'axios';

const Status = () => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const response = await axios.get('http://localhost:3050/satellite/status/data');
      const satelliteData = response.data[0]; 
      setStatus({
        latitude: satelliteData.latitude,
        longitude: satelliteData.longitude,
        inclination: satelliteData.inclination,
        powerLevel: satelliteData.powerLevel,
        temperature: satelliteData.temperature,
        radiationLevel: satelliteData.radiationLevel,
        communicationStatus: satelliteData.communicationStatus,
        solarPanelStatus: satelliteData.solarPanelStatus,
        lastCheckIn: satelliteData.lastCheckIn,
        uplinkFreq: satelliteData.uplinkFreq,
        downlinkFreq: satelliteData.downlinkFreq,
        dataRate: satelliteData.dataRate
      });
    } catch (err) {
      setError('Error fetching satellite status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) return <div className="status-ui">Loading satellite data...</div>;
  if (error) return <div className="status-ui">{error}</div>;
  if (!status) return <div className="status-ui">No data available.</div>;

  return (
    <div className="status-ui">
      <div className="status-data">
        <div className="data"><strong>Latitude:</strong> {status.latitude}</div>
        <div className="data"><strong>Longitude:</strong> {status.longitude}</div>
        <div className="data"><strong>Inclination:</strong> {status.inclination}</div>
        <div className="data"><strong>Power Level:</strong> {status.powerLevel}</div>
        <div className="data"><strong>Temperature:</strong> {status.temperature}</div>
        <div className="data"><strong>Radiation Level:</strong> {status.radiationLevel}</div>
        <div className="data"><strong>Communication Status:</strong> {status.communicationStatus}</div>
        <div className="data"><strong>Solar Panel Status:</strong> {status.solarPanelStatus}</div>
        <div className="data"><strong>Last Check-In:</strong> {status.lastCheckIn}</div>
        <div className="data"><strong>Uplink Frequency:</strong> {status.uplinkFreq}</div>
        <div className="data"><strong>Downlink Frequency:</strong> {status.downlinkFreq}</div>
        <div className="data"><strong>Data Rate:</strong> {status.dataRate}</div>
      </div>
    </div>
  );
};

export default Status;
