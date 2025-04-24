import { sequelize } from "../Postgres-connect/index.js";
import { DataTypes } from "sequelize";

const SatelliteData = sequelize.define(
  "SatelliteData",
  {
    latitude: {
      type: DataTypes.FLOAT,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
    inclination: {
      type: DataTypes.FLOAT,
    },
    powerLevel: {
      type: DataTypes.FLOAT,
    },
    temperature: {
      type: DataTypes.FLOAT,
    },
    radiationLevel: {
      type: DataTypes.FLOAT,
    },
    communicationStatus: {
      type: DataTypes.STRING,
    },
    solarPanelStatus: {
      type: DataTypes.STRING,
    },
    lastCheckIn: {
      type: DataTypes.STRING,
    },
    uplinkFreq: {
      type: DataTypes.FLOAT,
    },
    downlinkFreq: {
      type: DataTypes.FLOAT,
    },
    dataRate: {
      type: DataTypes.FLOAT,
    },
  },
  {
    tableName: "SatelliteDate", // Ensure table name matches what's in your DB
    timestamps: true,           // Adds createdAt and updatedAt automatically
  }
);

export default SatelliteData;
