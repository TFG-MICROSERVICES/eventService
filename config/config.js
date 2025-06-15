import dotenv from 'dotenv';

dotenv.config();

export default {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
    test: {
        username: process.env.CI_DB_USERNAME,
        password: process.env.CI_DB_PASSWORD,
        database: process.env.CI_DB_NAME,
        host: process.env.CI_DB_HOSTNAME,
        port: process.env.CI_DB_PORT,
        dialect: process.env.CI_DB_DIALECT,
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
    production: {
        username: process.env.PROD_DB_USERNAME,
        password: process.env.PROD_DB_PASSWORD,
        database: process.env.PROD_DB_NAME,
        host: process.env.PROD_DB_HOSTNAME,
        port: process.env.PROD_DB_PORT,
        dialect: 'postgresql',
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
};
