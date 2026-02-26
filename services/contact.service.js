import pool from "../config/db.js";

export const findContactByEmailorPhone = async (email, phoneNumber) => {
    const query=`
        SELECT * FROM contacts
        WHERE deleted_at IS NULL
        AND (
            ($1::text IS NOT NULL AND email = $1)
            OR
            ($2::text IS NOT NULL AND phone_number = $2)
        );
    `;
    const res = await pool.query(
        query, [email || null, phoneNumber || null]
    );
    return res.rows;
};

export const createPrimaryContact = async (email, phoneNumber) => {
    const query=`
        INSERT INTO contacts (email, phone_number, link_precedence)
        VALUES ($1, $2, 'primary')
        RETURNING *;
    `;
    const res = await pool.query(
        query, [email || null, phoneNumber || null]
    );
    return res.rows[0];
};

export const createSecondaryContact = async (email, phoneNumber, linkedId) => {
    const query=`
        INSERT INTO contacts (email, phone_number, linked_id, link_precedence)
        VALUES ($1, $2, $3, 'secondary')
        RETURNING *;
    `;
    const res = await pool.query(
        query, [email || null, phoneNumber || null, linkedId]
    );
    return res.rows[0];
};


export const updateContactToSecondary = async (id, linkedId) => {
    const query=`
        UPDATE contacts
        SET linked_id = $2, link_precedence = 'secondary', updated_at = NOW()
        WHERE id = $1
        RETURNING *;
    `;
    const res = await pool.query(
        query, [id, linkedId]
    );
    return res.rows[0];
};

export const getAllLinkedContacts = async (primaryId) => {
    const query=`
        SELECT * FROM contacts
        WHERE deleted_at IS NULL
        AND (id = $1 OR linked_id = $1);
    `;
    const res = await pool.query(
        query, [primaryId]
    );
    return res.rows;
};

