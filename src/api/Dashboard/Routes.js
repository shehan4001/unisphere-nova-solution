import express from 'express';
const router = express.Router();

import sql from 'mssql';
import config from '../../server/dbConfig.js';

router.get('/stats', async (req, res) => {
    try {
        let pool = await sql.connect(config);

        const stats = await pool.request().query(`
            SELECT 
                (SELECT COUNT(*) FROM Clubs) as totalClubs,
                (SELECT COUNT(*) FROM ClubRequests WHERE Status = 'Pending') as pendingRequests,
                (SELECT COUNT(*) FROM Events WHERE EventDate >= GETDATE()) as activeEvents,
                (SELECT COUNT(*) FROM Students) as totalStudents
        `);

        const notifications = await pool.request().query(`
            SELECT TOP 5 * FROM (

                SELECT 
                    'New club added: ' + Name AS message,
                    'blue' AS type,
                    CreatedAt
                FROM Clubs

                UNION ALL

                SELECT 
                    'New event scheduled: ' + EventTitle AS message,
                    'green' AS type,
                    CreatedAt
                FROM Events

                UNION ALL

                SELECT 
                    CASE 
                        WHEN Status = 'approved' THEN 'Club request approved'
                        WHEN Status = 'rejected' THEN 'Club request rejected'
                        ELSE 'New club request pending approval'
                    END AS message,
                    CASE 
                        WHEN Status = 'approved' THEN 'green'
                        WHEN Status = 'rejected' THEN 'red'
                        ELSE 'orange'
                    END AS type,
                    CreatedAt
                FROM ClubRequests

            ) AS Notifications
            ORDER BY CreatedAt DESC
        `);

        res.status(200).json({
            ...stats.recordset[0],
            notifications: notifications.recordset
        });

    } catch (err) {
        console.error("Dashboard stats error:", err);

        res.status(500).json({
            error: "Failed to fetch dashboard statistics",
            details: err.message
        });
    }
});

export default router;