import express from 'express';
const router = express.Router();
import sql from 'mssql';
import config from '../../server/dbConfig.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads/clubs/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.get('/all', async (req, res) => {
    try {
        let pool = await sql.connect(config);

        const result = await pool.request().query(`
            SELECT 
                ClubID,
                AdminID,
                Name,
                Category,
                Description,
                ImagePath,
                CreatedAt
            FROM Clubs
            ORDER BY CreatedAt DESC
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error("Get Clubs Error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/user-status/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {
        let pool = await sql.connect(config);

        const result = await pool.request()
            .input('StudentID', sql.Int, studentId)
            .query(`
                SELECT 
                    c.Name AS ClubName,
                    cr.Status
                FROM ClubRequests cr
                INNER JOIN Clubs c ON cr.ClubID = c.ClubID
                WHERE cr.StudentID = @StudentID
            `);

        const statusMap = {};

        result.recordset.forEach(row => {
            statusMap[row.ClubName.trim()] = row.Status.toLowerCase();
        });

        res.json(statusMap);
    } catch (err) {
        console.error("User Status Error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/join', async (req, res) => {
    const { studentId, clubId } = req.body;

    if (!studentId || !clubId) {
        return res.status(400).json({ error: "StudentID and ClubID are required" });
    }

    try {
        let pool = await sql.connect(config);

        const check = await pool.request()
            .input('StudentID', sql.Int, studentId)
            .input('ClubID', sql.Int, clubId)
            .query(`
                SELECT RequestID, Status
                FROM ClubRequests 
                WHERE StudentID = @StudentID
                AND ClubID = @ClubID
                AND Status IN ('pending', 'approved')
            `);

        if (check.recordset.length > 0) {
            return res.status(400).json({ error: "Already requested!" });
        }

        await pool.request()
            .input('StudentID', sql.Int, studentId)
            .input('ClubID', sql.Int, clubId)
            .query(`
                INSERT INTO ClubRequests (StudentID, ClubID, Status, CreatedAt)
                VALUES (@StudentID, @ClubID, 'pending', GETDATE())
            `);

        res.json({ message: "Request sent!" });
    } catch (err) {
        console.error("Join Club Error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/create', upload.single('image'), async (req, res) => {
    const { name, category, description, adminId } = req.body;
    const imagePath = req.file ? `uploads/clubs/${req.file.filename}` : null;

    try {
        let pool = await sql.connect(config);

        await pool.request()
            .input('AdminID', sql.Int, adminId || 1)
            .input('Name', sql.NVarChar, name)
            .input('Category', sql.NVarChar, category)
            .input('Description', sql.NVarChar, description)
            .input('ImagePath', sql.NVarChar, imagePath)
            .query(`
                INSERT INTO Clubs (AdminID, Name, Category, Description, ImagePath, CreatedAt)
                VALUES (@AdminID, @Name, @Category, @Description, @ImagePath, GETDATE())
            `);

        res.json({ message: "Club created!" });
    } catch (err) {
        console.error("Create Club Error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/edit/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, category, description } = req.body;

    try {
        let pool = await sql.connect(config);

        let query = `
            UPDATE Clubs 
            SET Name = @Name,
                Category = @Category,
                Description = @Description
        `;

        const request = pool.request()
            .input('ClubID', sql.Int, id)
            .input('Name', sql.NVarChar, name)
            .input('Category', sql.NVarChar, category)
            .input('Description', sql.NVarChar, description);

        if (req.file) {
            query += `, ImagePath = @ImagePath`;
            request.input('ImagePath', sql.NVarChar, `uploads/clubs/${req.file.filename}`);
        }

        query += ` WHERE ClubID = @ClubID`;

        await request.query(query);

        res.json({ message: "Club updated!" });
    } catch (err) {
        console.error("Edit Club Error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        let pool = await sql.connect(config);

        await pool.request()
            .input('ClubID', sql.Int, id)
            .query(`
                DELETE FROM ClubRequests WHERE ClubID = @ClubID;
                DELETE FROM Clubs WHERE ClubID = @ClubID;
            `);

        res.json({ message: "Club deleted!" });
    } catch (err) {
        console.error("Delete Club Error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/requests/pending', async (req, res) => {
    try {
        let pool = await sql.connect(config);

        const result = await pool.request().query(`
            SELECT 
                cr.RequestID AS _id,
                s.FullName AS StudentName,
                c.Name AS ClubName,
                cr.Status,
                cr.CreatedAt
            FROM ClubRequests cr
            INNER JOIN Students s ON cr.StudentID = s.StudentID
            INNER JOIN Clubs c ON cr.ClubID = c.ClubID
            WHERE cr.Status = 'pending'
            ORDER BY cr.CreatedAt DESC
        `);

        res.json(result.recordset);
    } catch (err) {
        console.error("Pending Requests Error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/requests/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        let pool = await sql.connect(config);

        await pool.request()
            .input('RequestID', sql.Int, id)
            .input('Status', sql.NVarChar, status)
            .query(`
                UPDATE ClubRequests 
                SET Status = @Status 
                WHERE RequestID = @RequestID
            `);

        res.json({ message: "Request updated!" });
    } catch (err) {
        console.error("Update Request Error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;