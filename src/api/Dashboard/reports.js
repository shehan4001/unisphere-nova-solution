import express from 'express';
const router = express.Router();
import sql from 'mssql';
import config from '../../server/dbConfig.js'; 

router.get('/analytics-data', async (req, res) => {
    try {
        let pool = await sql.connect(config);

        // 1. Club Distribution (Donut Chart එකට - value සහ name ලෙස)
        const clubDist = await pool.request().query(`
    SELECT LTRIM(RTRIM(Category)) as name, COUNT(*) as value 
    FROM Clubs 
    GROUP BY Category
`);

        // 2. Monthly Event Growth (Line Chart එකට)
        const eventGrowth = await pool.request().query(`
            SELECT FORMAT(EventDate, 'MMM') as month, COUNT(*) as events
            FROM Events
            WHERE YEAR(EventDate) = YEAR(GETDATE())
            GROUP BY FORMAT(EventDate, 'MMM'), MONTH(EventDate)
            ORDER BY MONTH(EventDate)
        `);

        // 3. Recent Activity Log (Table එකට)
        const activityLog = await pool.request().query(`
            SELECT TOP 10 * FROM (
                SELECT CreatedAt as Date, 'Club' as Category, Name + ' Added' as Action, 'COMPLETED' as Status FROM Clubs
                UNION ALL
                SELECT CreatedAt as Date, 'Event' as Category, EventTitle + ' Scheduled' as Action, 'COMPLETED' as Status FROM Events
                UNION ALL
                SELECT CreatedAt as Date, 'Request' as Category, 'New Request: ' + ClubName as Action, UPPER(Status) as Status FROM ClubRequests
            ) AS CombinedActivity
            ORDER BY Date DESC
        `);

        res.status(200).json({
            clubDistribution: clubDist.recordset,
            eventGrowth: eventGrowth.recordset,
            recentActivity: activityLog.recordset
        });

    } catch (err) {
        console.error("Analytics Error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;