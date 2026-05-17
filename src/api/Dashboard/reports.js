import express from 'express';
const router = express.Router();
import sql from 'mssql';
import config from '../../server/dbConfig.js';

router.get('/analytics-data', async (req, res) => {
  try {
    let pool = await sql.connect(config);

    const clubDist = await pool.request().query(`
      SELECT 
        ISNULL(NULLIF(LTRIM(RTRIM(Category)), ''), 'Other') AS name,
        COUNT(*) AS value
      FROM Clubs
      GROUP BY ISNULL(NULLIF(LTRIM(RTRIM(Category)), ''), 'Other')
    `);

    const eventGrowth = await pool.request().query(`
      SELECT 
        FORMAT(EventDate, 'MMM') AS month,
        MONTH(EventDate) AS monthNumber,
        COUNT(*) AS events
      FROM Events
      WHERE YEAR(EventDate) = YEAR(GETDATE())
      GROUP BY FORMAT(EventDate, 'MMM'), MONTH(EventDate)
      ORDER BY MONTH(EventDate)
    `);

    const activityLog = await pool.request().query(`
      SELECT TOP 10 * FROM (
        SELECT 
          CreatedAt AS Date,
          'Club' AS Category,
          Name + ' Added' AS Action,
          'COMPLETED' AS Status
        FROM Clubs

        UNION ALL

        SELECT 
          CreatedAt AS Date,
          'Event' AS Category,
          EventTitle + ' Scheduled' AS Action,
          'COMPLETED' AS Status
        FROM Events

        UNION ALL

        SELECT 
          cr.CreatedAt AS Date,
          'Request' AS Category,
          'Club Request: ' + s.FullName + ' - ' + c.Name AS Action,
          UPPER(cr.Status) AS Status
        FROM ClubRequests cr
        INNER JOIN Students s ON cr.StudentID = s.StudentID
        INNER JOIN Clubs c ON cr.ClubID = c.ClubID
      ) AS CombinedActivity
      ORDER BY Date DESC
    `);

    res.status(200).json({
      clubDistribution: clubDist.recordset,
      eventGrowth: eventGrowth.recordset,
      recentActivity: activityLog.recordset
    });

  } catch (err) {
    console.error("Analytics Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;