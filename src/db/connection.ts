import { Sequelize } from "sequelize";

const db = new Sequelize('sgpi_db', 'sgpi_db', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    logging: true,
    define: {
        timestamps: false
    }
});

export default db;