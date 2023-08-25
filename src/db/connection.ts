import { Sequelize } from "sequelize";

// const db = new Sequelize('sgpi_db', 'root', 'password', {
//     host: '127.0.0.1',
//     port: 3306,
//     dialect: 'mysql',
//     logging: false,
//     define: {
//         timestamps: false
//     }
// });
const db = new Sequelize('ingusb_sgpi_bd', 'ingusb_sgpi_user', 'SGPI2023Rep_TG', {
    host: '162.214.153.39',
    port: 3306,
    dialect: 'mysql',
    logging: false,
    define: {
        timestamps: false
    }
});

export default db;