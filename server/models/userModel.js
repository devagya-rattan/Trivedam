import { sequelize } from "../Postgres-connect/index.js";
import { DataTypes } from "sequelize";

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: "users", // 👈 THIS LINE FIXES THE ISSUE
}
)
export default User;

