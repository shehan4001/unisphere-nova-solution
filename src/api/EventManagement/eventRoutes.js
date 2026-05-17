import express from 'express';
const router = express.Router();
import sql from 'mssql';
import config from '../../server/dbConfig.js';

router.get('/get-all', async (req, res) => {
    try {
        let pool = await sql.connect(config);

        const result = await pool.request().query(`
            SELECT 
                e.EventID,
                e.AdminID,
                e.EventTitle,
                e.EventDate,
                FORMAT(CAST(e.EventTime AS DATETIME), 'hh:mm tt') AS EventTime,
                e.Category,
                e.Location,
                a.FullName AS PublishedBy,
                e.CreatedAt
            FROM Events e
            INNER JOIN Admins a ON e.AdminID = a.AdminID
            WHERE e.EventDate >= CAST(GETDATE() AS DATE)
            ORDER BY e.EventDate ASC
        `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Get Events Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

router.post('/add', async (req, res) => {
    const { title, date, time, category, location, adminId } = req.body;

    if (!title || !date || !time || !category || !location) {
        return res.status(400).json({ 
            error: "All fields are required" 
        });
    }

    try {
        let pool = await sql.connect(config);

        await pool.request()
            .input('AdminID', sql.Int, adminId || 1)
            .input('Title', sql.NVarChar, title)
            .input('Date', sql.Date, date)
            .input('Time', sql.NVarChar, time)
            .input('Category', sql.NVarChar, category)
            .input('Location', sql.NVarChar, location)
            .query(`
                INSERT INTO Events 
                (AdminID, EventTitle, EventDate, EventTime, Category, Location, CreatedAt)
                VALUES 
                (@AdminID, @Title, @Date, CAST(@Time AS TIME), @Category, @Location, GETDATE())
            `);

        res.status(200).json({ message: "Event added successfully!" });
    } catch (err) {
        console.error("Add Event Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        let pool = await sql.connect(config);

        await pool.request()
            .input('EventID', sql.Int, id)
            .query("DELETE FROM Events WHERE EventID = @EventID");

        res.status(200).json({ message: "Event deleted!" });
    } catch (err) {
        console.error("Delete Event Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

export default router;