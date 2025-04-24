// import SatalliteData from "../models/satelliteModel";

export const ContorlsatelliteMovement = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        const updatedLatitude = latitude + 0.0007;
        const updatedLongitude = longitude + 0.0007;

        return res.status(200).json({
            latitude: updatedLatitude,
            longitude: updatedLongitude
        });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while updating satellite movement.", error });
    }
}