import express from "express";
import http from 'http';
import cors from "cors";
import { configDotenv } from "dotenv";
import { connectToDatabase } from "./Postgres-connect/index.js";
import router from "./routes/userRoute.js";
import satelliteRoute from "./routes/satelliteRoutes.js"
import { Websocket } from "./Websocket/index.js";
configDotenv();
const app = express();
const server = http.createServer(app);
Websocket(server);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use("/satellite", satelliteRoute);


server.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
    connectToDatabase();
}
);



