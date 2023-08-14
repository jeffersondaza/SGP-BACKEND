import { Sequelize } from "sequelize";

const db = new Sequelize('sgpi_db', 'root', 'password', {
    host: 'mysql',
    port: 3306,
    dialect: 'mysql',
    logging: true,
    define: {
        timestamps: false
    }
});

export default db;