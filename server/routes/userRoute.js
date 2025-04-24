import express from "express"
import { registerUser, deployment, loginUser } from "../Controllers/userController.js";
import { verifyToken } from "../middlewares/Auth.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/deploy", verifyToken, deployment);

export default router;
