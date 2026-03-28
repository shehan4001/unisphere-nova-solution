import express from 'express';
const router = express.Router();
import sql from 'mssql';
import config from '../../server/dbConfig.js'; // dbConfig එක තියෙන තැනට අනුව path එක බලන්න

// --- Dashboard සංඛ්‍යාලේඛන ලබා ගැනීම ---
router.get('/stats', async (req, res) => {
    try {
        let pool = await sql.connect(config);

        // එකවර Queries කිහිපයක් ක්‍රියාත්මක කර දත්ත ලබා ගැනීම
        const stats = await pool.request().query(`
            SELECT 
                (SELECT COUNT(*) FROM Clubs) as totalClubs,
                (SELECT COUNT(*) FROM ClubRequests WHERE Status = 'Pending') as pendingRequests,
                (SELECT COUNT(*) FROM Events WHERE EventDate >= GETDATE()) as activeEvents,
                (SELECT COUNT(*) FROM Students) as totalStudents
        `);

        // දත්ත සාර්ථකව ලැබුණොත් JSON එකක් ලෙස යවනවා
        res.status(200).json(stats.recordset[0]);
        
    } catch (err) {
        console.error("Dashboard stats error:", err);
        res.status(500).json({ 
            error: "Failed to fetch dashboard statistics",
            details: err.message 
        });
    }
});

export default router;