import pool from "../config/db.js";

export const createContactTable = async () => {
    const query=`
        CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            phone_number VARCHAR(20),
            email VARCHAR(255),
            linked_id INT REFERENCES contacts(id) ON DELETE SET NULL,
            link_precedence VARCHAR(10) CHECK (link_precedence IN ('primary', 'secondary')) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            deleted_at TIMESTAMP DEFAULT NULL
        );
    `;
    try {
        await pool.query(query);
        console.log("contact table is ready");
    } catch (error) {
        console.log("error creating contact table", error);
    }
};
