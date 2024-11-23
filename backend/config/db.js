import pkg from 'pg';
import { config as configDotenv } from "dotenv";

const { Pool } = pkg;
configDotenv();

const db = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

db.connect()
    .then(() => console.log('Database connected'))
    .catch((err) => console.log('Error connecting to database',err.stack))

export default db;