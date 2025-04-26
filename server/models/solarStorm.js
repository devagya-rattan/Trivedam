import { sequelize } from "../Postgres-connect/index.js";
import { DataTypes } from "sequelize";

const Storm = sequelize.define('Storm', {
    storm: {
        type: DataTypes.BOOLEAN,
    },
    timeStorm:{
        type: DataTypes.INTEGER,
    }
}, {
    tableName: "storm", // 👈 THIS LINE FIXES THE ISSUE
}
)
export default Storm;

