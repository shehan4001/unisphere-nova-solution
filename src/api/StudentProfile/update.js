import express from 'express';
import sql from 'mssql';
import config from '../../server/dbConfig.js';

const router = express.Router();

router.put('/update/:id', async (req, res) => {
    const studentId = req.params.id; 
    const { FullName, Email } = req.body;

    try {
        let pool = await sql.connect(config);
        const result = await pool.request()
            .input('id', sql.Int, studentId)
            .input('name', sql.NVarChar, FullName)
            .input('email', sql.NVarChar, Email)
            .query("UPDATE Students SET FullName = @name, Email = @email WHERE StudentID = @id");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Profile updated successfully!" });

    } catch (err) {
        console.error("Database Update Error:", err);
        res.status(500).json({ error: "Database update failed" });
    }
});

export default router;