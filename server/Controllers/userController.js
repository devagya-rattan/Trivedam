import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import axios from "axios";

export const testApi = (res) => {
    res.send("Hello Esp32!");
};
const ESP32_BASE_URL = 'http://192.168.101.10'
export const registerUser = async (req, res) => {
    try {
        const data = req.body;
        const email = data.email;
        const password = data.password;

        if (!email || !password)
            return res.status(400).json({ message: "Email and Password required" });

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword });
        return res.status(201).json({ message: "User registered successfully", user: newUser });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Registration error" });
    }
}
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Email and Password required" });
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Access Denied Only IOT-Enabled Accounts Acceptable" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed || Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.TOKEN_SECRET, {});
        const esp32Token = await axios.post(`${ESP32_BASE_URL}/token`, `"${token}"`, {
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        console.log("Request Accnowlodged", esp32Token);
        res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
        return res.status(500).json({ message: "Login error" });
    }
}
export const deployment = async (req, res) => {
    res.status(201).json({ message: "Deployment received" });
}
