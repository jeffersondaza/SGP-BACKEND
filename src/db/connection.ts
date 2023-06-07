import { Sequelize } from "sequelize";

const db = new Sequelize('sgpi_db', 'root', 'password', {
    host: '127.0.0.1',
    port: 3307,
    dialect: 'mysql',
    logging: true,
    define: {
        timestamps: false
    }
});

export default db;