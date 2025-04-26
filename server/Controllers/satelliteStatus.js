import SatalliteData from "../models/satelliteModel.js";
// import Storm from "../models/solarStorm.js";
const ESP32_BASE_URL = 'http://192.168.101.10'
import axios from "axios";
export const initialsatelliteStatus = async (req, res) => {
    try {
        const { inclination, powerLevel, temperature, radiationLevel, communicationStatus, solarPanelStatus, lastCheckIn, uplinkFreq, downlinkFreq, dataRate } = req.body;
        const satelliteStatus = {
            inclination,
            powerLevel,
            temperature,
            radiationLevel,
            communicationStatus,
            solarPanelStatus,
            lastCheckIn,
            uplinkFreq,
            downlinkFreq,
            dataRate
        };
        const newSatelliteStatus = await SatalliteData.create(satelliteStatus);
        res.status(201).json({ message: "Satellite status initialized successfully", satelliteStatus: newSatelliteStatus });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching satellite status.", error });
    }
}

export const getsatelliteStatus = async (req, res) => {
    try {
        const satelliteStatus = await SatalliteData.findAll();
        if (!satelliteStatus) {
            return res.status(404).json({ message: "No satellite status found." });
        }
        res.status(200).json(satelliteStatus);
    } catch (error) {
        res.status(500).json({ message: "An error occurred while fetching satellite status.", error });
    }
}

export const solarStormStatus = async (req, res) => {
    try {
        const { storm } = req.body;
        const message = storm ? "Solar storm initiated" : "Solar storm terminated";

        console.log("📡 Sending to ESP32:", storm);

        await axios.post(`${ESP32_BASE_URL}/status`, `${storm}`, {
            headers: {
                "Content-Type": "text/plain"
            }
        });

        res.status(200).json({ message });
    } catch (error) {
        console.error("🔥 Error in solarStormStatus:", error.message);
        res.status(500).json({ message: "An error occurred while updating storm status.", error });
    }
}

export const updateSatelliteStatus = async (req, res) => {
    try {
        const { timeStorm } = req.body;

        // Fetch the first satellite status from the database
        const satelliteStatus = await SatalliteData.findOne();

        if (!satelliteStatus) {
            return res.status(404).json({ message: "No satellite status found." });
        }

        // If timeStorm is greater than 5, update the satellite status
        if (timeStorm > 5) {
            const lowsatelliteStatus = {
                inclination: satelliteStatus.inclination - 1,
                powerLevel: satelliteStatus.powerLevel - 1,
                temperature: satelliteStatus.temperature - 1,
                radiationLevel: satelliteStatus.radiationLevel - 1,
                uplinkFreq: satelliteStatus.uplinkFreq - 1,
                downlinkFreq: satelliteStatus.downlinkFreq - 1,
                dataRate: satelliteStatus.dataRate - 1,
                // lastCheckIn: new Date() // Update the last check-in time
            };

            // Update the satellite status
            await SatalliteData.update(lowsatelliteStatus, {
                where: {} // No condition here, as there's only one satellite
            });

            return res.status(200).json({
                message: "Satellite status updated successfully",
                satelliteStatus: lowsatelliteStatus
            });
        } else {
            return res.status(200).json({ message: "NO Updation" });
        }
        
    } catch (error) {
        // Handle any errors that occur during the process
        return res.status(500).json({ message: "An error occurred while updating satellite status.", error });
    }
};
