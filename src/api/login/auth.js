import express from 'express';
import sql from 'mssql';
import config from '../../server/dbConfig.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { customID, password } = req.body;

    try {
        let pool = await sql.connect(config);

        // Student Check - CustomID එක SELECT කිරීමට එක් කළා
        let studentResult = await pool.request()
            .input('id', sql.NVarChar, customID)
            .input('pass', sql.NVarChar, password)
            .query("SELECT StudentID as ID, CustomID, FullName, Role, Email FROM Students WHERE CustomID = @id AND Password = @pass");

        if (studentResult.recordset.length > 0) {
            return res.status(200).json({
                success: true,
                user: studentResult.recordset[0]
            });
        }

        // Admin Check - CustomID එක SELECT කිරීමට එක් කළා
        let adminResult = await pool.request()
            .input('id', sql.NVarChar, customID)
            .input('pass', sql.NVarChar, password)
            .query("SELECT AdminID as ID, CustomID, FullName, Role, Email, ContactNumber FROM Admins WHERE CustomID = @id AND Password = @pass");

        if (adminResult.recordset.length > 0) {
            return res.status(200).json({
                success: true,
                user: adminResult.recordset[0]
            });
        }

        res.status(401).json({ success: false, message: "Invalid ID or Password" });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;