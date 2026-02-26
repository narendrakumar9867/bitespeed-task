import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log("PostgresSQL is connectd");
        client.release();
    } catch (error) {
        console.log("error in postgresSQL connection", error);
        process.exit(1);
    }
};

export default pool;
