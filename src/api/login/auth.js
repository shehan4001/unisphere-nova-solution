import express from 'express';
import sql from 'mssql';
import config from '../../server/dbConfig.js'; // Extension එක .js ලෙස දැමීමට අමතක කරන්න එපා

const router = express.Router();

// මෙතන path එක '/' ලෙස තබන්න (මොකද server.js එකේ දැනටමත් /api/login ලෙස ඇති නිසා)
router.post('/', async (req, res) => {
    const { customID, password } = req.body;

    try {
        let pool = await sql.connect(config);

        // 1. Students table එක පරීක්ෂා කිරීම
        let studentResult = await pool.request()
            .input('id', sql.NVarChar, customID)
            .input('pass', sql.NVarChar, password)
            .query("SELECT StudentID as ID, FullName, Role, Email FROM Students WHERE CustomID = @id AND Password = @pass");

        if (studentResult.recordset.length > 0) {
            return res.status(200).json({
                success: true,
                user: studentResult.recordset[0]
            });
        }

        // 2. Admins table එක පරීක්ෂා කිරීම
        let adminResult = await pool.request()
            .input('id', sql.NVarChar, customID)
            .input('pass', sql.NVarChar, password)
            .query("SELECT AdminID as ID, FullName, Role, Email, ContactNumber FROM Admins WHERE CustomID = @id AND Password = @pass");

        if (adminResult.recordset.length > 0) {
            return res.status(200).json({
                success: true,
                user: adminResult.recordset[0]
            });
        }

        // 3. වැරදි දත්ත නම්
        res.status(401).json({ success: false, message: "Invalid ID or Password" });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// වැදගත්ම කොටස: ES Modules වලදී export කරන්නේ මෙහෙමයි
export default router;