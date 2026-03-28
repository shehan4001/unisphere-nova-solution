import express from 'express';
const router = express.Router();
import sql from 'mssql';
import config from '../../server/dbConfig.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// ================= UPLOAD CONFIG =================
const uploadDir = path.join(process.cwd(), 'uploads/clubs/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ================= GET ALL CLUBS =================
router.get('/all', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        const result = await pool.request()
            .query("SELECT * FROM Clubs ORDER BY CreatedAt DESC");

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ================= USER STATUS =================
router.get('/user-status/:studentName', async (req, res) => {
    const { studentName } = req.params;

    try {
        let pool = await sql.connect(config);

        const result = await pool.request()
            .input('sName', sql.VarChar, studentName)
            .query(`
                SELECT ClubName, Status 
                FROM ClubRequests 
                WHERE StudentName = @sName
            `);

        const statusMap = {};
        result.recordset.forEach(row => {
            statusMap[row.ClubName.trim()] = row.Status.toLowerCase();
        });

        res.json(statusMap);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ================= JOIN CLUB =================
router.post('/join', async (req, res) => {
    const { studentName, clubName } = req.body;

    try {
        let pool = await sql.connect(config);

        // prevent duplicate
        const check = await pool.request()
            .input('sName', sql.VarChar, studentName)
            .input('cName', sql.VarChar, clubName)
            .query(`
                SELECT * FROM ClubRequests 
                WHERE StudentName=@sName AND ClubName=@cName
            `);

        if (check.recordset.length > 0) {
            return res.status(400).json({ error: "Already requested!" });
        }

        await pool.request()
            .input('sName', sql.VarChar, studentName)
            .input('cName', sql.VarChar, clubName)
            .query(`
                INSERT INTO ClubRequests 
                (StudentName, ClubName, Status, CreatedAt)
                VALUES (@sName, @cName, 'pending', GETDATE())
            `);

        res.json({ message: "Request sent!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ================= CREATE CLUB =================
router.post('/create', upload.single('image'), async (req, res) => {
    const { name, category, description } = req.body;
    const imagePath = req.file ? `uploads/clubs/${req.file.filename}` : null;

    try {
        let pool = await sql.connect(config);

        await pool.request()
            .input('name', sql.VarChar, name)
            .input('cat', sql.VarChar, category)
            .input('desc', sql.Text, description)
            .input('img', sql.VarChar, imagePath)
            .query(`
                INSERT INTO Clubs 
                (Name, Category, Description, ImagePath, CreatedAt)
                VALUES (@name, @cat, @desc, @img, GETDATE())
            `);

        res.json({ message: "Club created!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ================= EDIT CLUB =================
router.put('/edit/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, category, description } = req.body;

    try {
        let pool = await sql.connect(config);

        let query = `
            UPDATE Clubs 
            SET Name=@name, Category=@cat, Description=@desc
        `;

        const request = pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.VarChar, name)
            .input('cat', sql.VarChar, category)
            .input('desc', sql.Text, description);

        if (req.file) {
            query += `, ImagePath=@img`;
            request.input('img', sql.VarChar, `uploads/clubs/${req.file.filename}`);
        }

        query += ` WHERE ClubID=@id`;

        await request.query(query);

        res.json({ message: "Club updated!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ================= DELETE CLUB =================
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        let pool = await sql.connect(config);

        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM Clubs WHERE ClubID=@id");

        res.json({ message: "Deleted!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ================= PENDING REQUESTS =================
router.get('/requests/pending', async (req, res) => {
    try {
        let pool = await sql.connect(config);

        const result = await pool.request().query(`
            SELECT RequestID as _id, StudentName, ClubName 
            FROM ClubRequests 
            WHERE Status='pending'
        `);

        res.json(result.recordset);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ================= APPROVE / REJECT =================
router.put('/requests/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        let pool = await sql.connect(config);

        await pool.request()
            .input('id', sql.Int, id)
            .input('status', sql.VarChar, status)
            .query(`
                UPDATE ClubRequests 
                SET Status=@status 
                WHERE RequestID=@id
            `);

        res.json({ message: "Updated!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;