import { Sequelize } from "sequelize";

const db = new Sequelize('sgpi_db', 'root', 'Soyfriki123@', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: true,
    define: {
        timestamps: false
    }
});

export default db;