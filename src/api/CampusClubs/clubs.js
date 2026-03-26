import express from 'express';
import sql from 'mssql';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// පින්තූර save කිරීමට අවශ්‍ය config
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, 'club-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Database Config
const config = {
    user: 'unisphere_user', 
    password: 'User@123', 
    server: 'localhost', 
    port: 1433, 
    database: 'UniSphereDB',
    options: { encrypt: true, trustServerCertificate: true }
};

// --- 1. සියලුම Clubs ලබා ගැනීම ---
router.get('/all', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .query("SELECT ClubID, Name, Category, Description, ImagePath FROM Clubs ORDER BY CreatedAt DESC");
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. ශිෂ්‍යයාගේ නම අනුව Status ලබා ගැනීම (FIXED FOR DATA CONSISTENCY) ---
router.get('/user-status/:studentName', async (req, res) => {
    const { studentName } = req.params;
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('sName', sql.NVarChar, studentName.trim())
            .query("SELECT LTRIM(RTRIM(ClubName)) as ClubName, LTRIM(RTRIM(Status)) as Status FROM ClubRequests WHERE LTRIM(RTRIM(StudentName)) = @sName");

        const statusMap = {};
        result.recordset.forEach(row => {
            // Backend එකෙන්ම දත්ත clean කරලා statusMap එක හදනවා
            const clubName = row.ClubName ? row.ClubName.trim() : "";
            const status = row.Status ? row.Status.trim().toLowerCase() : "";
            
            if (clubName) {
                statusMap[clubName] = status;
            }
        });

        res.status(200).json(statusMap);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 3. අලුත් Club එකක් නිර්මාණය කිරීම ---
router.post('/create', upload.single('image'), async (req, res) => {
    const { name, category, description } = req.body;
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('name', sql.NVarChar, name.trim())
            .input('cat', sql.NVarChar, category)
            .input('desc', sql.NVarChar, description)
            .input('img', sql.NVarChar, imagePath)
            .query("INSERT INTO Clubs (Name, Category, Description, ImagePath) VALUES (@name, @cat, @desc, @img)");
        res.status(201).json({ success: true, message: "Club Created!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 4. පවතින Club එකක් Edit කිරීම ---
router.put('/edit/:id', upload.single('image'), async (req, res) => {
    const { name, category, description } = req.body;
    const { id } = req.params;
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    try {
        let pool = await sql.connect(config);
        let query = "UPDATE Clubs SET Name=@name, Category=@cat, Description=@desc";
        if (imagePath) query += ", ImagePath=@img";
        query += " WHERE ClubID=@id";

        let request = pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name.trim())
            .input('cat', sql.NVarChar, category)
            .input('desc', sql.NVarChar, description);

        if (imagePath) request.input('img', sql.NVarChar, imagePath);

        await request.query(query);
        res.status(200).json({ success: true, message: "Club Updated!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 5. Club එකක් Delete කිරීම ---
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM Clubs WHERE ClubID = @id");
        res.status(200).json({ success: true, message: "Club Deleted!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 6. Join Request එකක් ඇතුළත් කිරීම (FIXED FIELD NAMES) ---
router.post('/join', async (req, res) => {
    const { studentName, clubName } = req.body;
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('sName', sql.NVarChar, studentName.trim())
            .input('cName', sql.NVarChar, clubName.trim())
            .query("INSERT INTO ClubRequests (StudentName, ClubName, Status) VALUES (@sName, @cName, 'pending')");
        res.status(201).json({ success: true, message: "Join request sent!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 7. Pending Requests ලබා ගැනීම (FIXED KEY NAMES) ---
router.get('/requests/pending', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .query("SELECT RequestID as _id, StudentName, ClubName FROM ClubRequests WHERE Status = 'pending'");
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 8. Request එක Approve/Reject කිරීම (TOTAL FIX FOR CASE & SPACES) ---
router.put('/requests/:id', async (req, res) => {
    const { status } = req.body; 
    const { id } = req.params;

    try {
        let pool = await sql.connect(config);
        // මෙහිදී status එක lowercase කරලාම save කරනවා (උදා: 'approved')
        await pool.request()
            .input('status', sql.NVarChar, status.trim().toLowerCase()) 
            .input('id', sql.Int, id)
            .query("UPDATE ClubRequests SET Status = @status WHERE RequestID = @id");
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;