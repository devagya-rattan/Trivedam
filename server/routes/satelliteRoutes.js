import express from "express"
import { ContorlsatelliteMovement } from "../Controllers/satelliteMovement.js";
import { initialsatelliteStatus, getsatelliteStatus, solarStormStatus, updateSatelliteStatus } from "../Controllers/satelliteStatus.js";
const router = express.Router();
router.post("/move", ContorlsatelliteMovement);
router.post("/status", initialsatelliteStatus);
router.post("/status/storm", solarStormStatus);
router.get("/status/data", getsatelliteStatus);
router.put("/status/update", updateSatelliteStatus);


export default router;
