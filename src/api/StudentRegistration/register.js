import express from 'express';
import sql from 'mssql';

const router = express.Router();

const config = {
    user: 'unisphere_user', 
    password: 'User@123', 
    server: 'localhost', 
    port: 1433,
    database: 'UniSphereDB',
    options: {
        encrypt: true,
        trustServerCertificate: true, 
    }
};

// --- 1. ශිෂ්‍යයන් ලියාපදිංචි කිරීම (POST) ---
router.post('/', async (req, res) => {
    const { studentId, fullName, faculty, email, password } = req.body;

    if (!studentId || !fullName || !email || !password) {
        return res.status(400).json({ success: false, message: "සියලුම තොරතුරු ඇතුළත් කරන්න!" });
    }

    try {
        let pool = await sql.connect(config);

        const checkUser = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('cId', sql.NVarChar, studentId)
            .query('SELECT StudentID FROM Students WHERE Email = @email OR CustomID = @cId');

        if (checkUser.recordset.length > 0) {
            return res.status(400).json({ success: false, message: "මෙම Email එක හෝ ID එක දැනටමත් පවතී!" });
        }

        await pool.request()
            .input('cId', sql.NVarChar, studentId)
            .input('name', sql.NVarChar, fullName)
            .input('fac', sql.NVarChar, faculty)
            .input('mail', sql.NVarChar, email)
            .input('pwd', sql.NVarChar, password)
            .query(`INSERT INTO Students (CustomID, FullName, Faculty, Email, Password, Role) 
                    VALUES (@cId, @name, @fac, @mail, @pwd, 'Student')`);

        res.status(201).json({ success: true, message: "ශිෂ්‍යයා සාර්ථකව ලියාපදිංචි කළා!" });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error: " + err.message });
    }
});

// --- 2. සියලුම ශිෂ්‍යයන් ලබා ගැනීම (GET) ---
router.get('/all', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query("SELECT * FROM Students ORDER BY CreatedAt DESC");
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ success: false, message: "දත්ත ලබා ගැනීමට නොහැකි විය: " + err.message });
    }
});

// --- 3. ශිෂ්‍යයෙකු ඉවත් කිරීම (DELETE) ---
router.delete('/:id', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.NVarChar, req.params.id)
            .query("DELETE FROM Students WHERE CustomID = @id");
        res.status(200).json({ success: true, message: "ශිෂ්‍යයා ඉවත් කළා!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "ඉවත් කිරීමට නොහැකි විය: " + err.message });
    }
});

// --- 4. ශිෂ්‍ය තොරතුරු යාවත්කාලීන කිරීම (PUT) ---
// මෙය නොමැති වීම නිසා තමයි Edit වැඩ නොකළේ
router.put('/:id', async (req, res) => {
    const { fullName, faculty, email, password } = req.body;
    const { id } = req.params; // මෙතැනට එන්නේ ST-0001 වැනි CustomID එකයි

    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('cId', sql.NVarChar, id)
            .input('name', sql.NVarChar, fullName)
            .input('fac', sql.NVarChar, faculty)
            .input('mail', sql.NVarChar, email)
            .input('pwd', sql.NVarChar, password)
            .query(`UPDATE Students 
                    SET FullName = @name, Faculty = @fac, Email = @mail, Password = @pwd 
                    WHERE CustomID = @cId`);

        res.status(200).json({ success: true, message: "ශිෂ්‍ය තොරතුරු යාවත්කාලීන කළා!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "යාවත්කාලීන කිරීමට නොහැකි විය: " + err.message });
    }
});

export default router;