import express from 'express';
const router = express.Router();
import sql from 'mssql'; 
import config from '../../server/dbConfig.js'; 

// 1. Get current and upcoming events (Time format එකත් එක්කම)
router.get('/get-all', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        
        // FORMAT(EventTime, 'hh:mm tt') මගින් 1970 දිනය අයින් කර වෙලාව පමණක් ලබාදෙයි
        const sqlQuery = `
            SELECT 
                EventID, 
                EventTitle, 
                EventDate, 
                Category, 
                Location, 
                PublishedBy,
                FORMAT(CAST(EventTime AS DATETIME), 'hh:mm tt') AS EventTime
            FROM Events 
            WHERE EventDate >= CAST(GETDATE() AS DATE) 
            ORDER BY EventDate ASC
        `;
        
        let result = await pool.request().query(sqlQuery);
        res.status(200).json(result.recordset); 
    } catch (err) {
        console.error("❌ SQL Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 2. Add event
router.post('/add', async (req, res) => {
    const { title, date, time, category, location, publishedBy } = req.body;
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('title', sql.VarChar, title)
            .input('date', sql.Date, date)
            .input('time', sql.VarChar, time) // String එකක් ලෙස යවන්න (e.g. "14:00")
            .input('category', sql.VarChar, category)
            .input('location', sql.VarChar, location)
            .input('publishedBy', sql.VarChar, publishedBy)
            .query(`INSERT INTO Events (EventTitle, EventDate, EventTime, Category, Location, PublishedBy) 
                    VALUES (@title, @date, @time, @category, @location, @publishedBy)`);

        res.status(200).json({ message: "Success" });
    } catch (err) {
        console.error("❌ Insert Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// 3. Delete event
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('id', sql.Int, id)
            .query("DELETE FROM Events WHERE EventID = @id");
            
        res.status(200).json({ message: "Deleted" });
    } catch (err) {
        console.error("❌ Delete Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

export default router;