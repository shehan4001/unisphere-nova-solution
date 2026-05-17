import express from 'express';
const router = express.Router();

import sql from 'mssql';
import config from '../../server/dbConfig.js';

router.get('/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    const pool = await sql.connect(config);

    let pointsResult = await pool.request()
      .input('StudentID', sql.Int, studentId)
      .query(`
        SELECT Points 
        FROM StudentPoints 
        WHERE StudentID = @StudentID
      `);

    if (pointsResult.recordset.length === 0) {
      await pool.request()
        .input('StudentID', sql.Int, studentId)
        .query(`
          INSERT INTO StudentPoints (StudentID, Points, UpdatedAt)
          VALUES (@StudentID, 0, GETDATE())
        `);

      pointsResult = {
        recordset: [{ Points: 0 }]
      };
    }

    const claimedTasks = await pool.request()
      .input('StudentID', sql.Int, studentId)
      .query(`
        SELECT TaskID
        FROM ClaimedTasks
        WHERE StudentID = @StudentID
        AND CAST(ClaimedAt AS DATE) = CAST(GETDATE() AS DATE)
      `);

    const activities = await pool.request()
      .input('StudentID', sql.Int, studentId)
      .query(`
        SELECT 
          ActivityID AS id,
          ActivityTitle AS title,
          FORMAT(CreatedAt, 'MMM dd, hh:mm tt') AS date,
          CASE 
            WHEN PointsChanged > 0 THEN '+' + CAST(PointsChanged AS NVARCHAR) + ' pts'
            ELSE CAST(PointsChanged AS NVARCHAR) + ' pts'
          END AS points,
          ActivityType AS type
        FROM RewardActivities
        WHERE StudentID = @StudentID
        ORDER BY CreatedAt DESC
      `);

    res.json({
      points: pointsResult.recordset[0].Points,
      claimedTasks: claimedTasks.recordset.map(item => item.TaskID),
      activities: activities.recordset
    });

  } catch (err) {
    console.error("Reward GET Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/claim-task', async (req, res) => {
  const { studentId, taskId, title, points } = req.body;

  if (!studentId || !taskId || !title || !points) {
    return res.status(400).json({
      message: "Missing required task claim data"
    });
  }

  try {
    const pool = await sql.connect(config);

    const check = await pool.request()
      .input('StudentID', sql.Int, studentId)
      .input('TaskID', sql.NVarChar, taskId)
      .query(`
        SELECT ClaimID 
        FROM ClaimedTasks 
        WHERE StudentID = @StudentID 
        AND TaskID = @TaskID
        AND CAST(ClaimedAt AS DATE) = CAST(GETDATE() AS DATE)
      `);

    if (check.recordset.length > 0) {
      return res.status(400).json({
        message: "Task already claimed today"
      });
    }

    await pool.request()
      .input('StudentID', sql.Int, studentId)
      .input('TaskID', sql.NVarChar, taskId)
      .input('Title', sql.NVarChar, title)
      .input('PointsEarned', sql.Int, points)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM StudentPoints WHERE StudentID = @StudentID)
        BEGIN
          INSERT INTO StudentPoints (StudentID, Points, UpdatedAt)
          VALUES (@StudentID, 0, GETDATE())
        END;

        INSERT INTO ClaimedTasks (StudentID, TaskID, PointsEarned, ClaimedAt)
        VALUES (@StudentID, @TaskID, @PointsEarned, GETDATE());

        UPDATE StudentPoints
        SET Points = Points + @PointsEarned,
            UpdatedAt = GETDATE()
        WHERE StudentID = @StudentID;

        INSERT INTO RewardActivities 
        (StudentID, ActivityTitle, PointsChanged, ActivityType, CreatedAt)
        VALUES 
        (@StudentID, @Title, @PointsEarned, 'add', GETDATE());
      `);

    res.json({ message: "Task claimed successfully" });

  } catch (err) {
    console.error("Claim Task Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/redeem', async (req, res) => {
  const { studentId, rewardTitle, pointsRequired } = req.body;

  if (!studentId || !rewardTitle || !pointsRequired) {
    return res.status(400).json({
      message: "Missing required redeem data"
    });
  }

  try {
    const pool = await sql.connect(config);

    const alreadyRedeemed = await pool.request()
      .input('StudentID', sql.Int, studentId)
      .input('RewardTitle', sql.NVarChar, `Redeem: ${rewardTitle}`)
      .query(`
        SELECT ActivityID
        FROM RewardActivities
        WHERE StudentID = @StudentID
        AND ActivityTitle = @RewardTitle
        AND ActivityType = 'subtract'
        AND MONTH(CreatedAt) = MONTH(GETDATE())
        AND YEAR(CreatedAt) = YEAR(GETDATE())
      `);

    if (alreadyRedeemed.recordset.length > 0) {
      return res.status(400).json({
        message: "You can redeem this reward only once per month."
      });
    }

    let balance = await pool.request()
      .input('StudentID', sql.Int, studentId)
      .query(`
        SELECT Points 
        FROM StudentPoints 
        WHERE StudentID = @StudentID
      `);

    if (balance.recordset.length === 0) {
      await pool.request()
        .input('StudentID', sql.Int, studentId)
        .query(`
          INSERT INTO StudentPoints (StudentID, Points, UpdatedAt)
          VALUES (@StudentID, 0, GETDATE())
        `);

      balance = {
        recordset: [{ Points: 0 }]
      };
    }

    if (balance.recordset[0].Points < pointsRequired) {
      return res.status(400).json({
        message: "Not enough points"
      });
    }

    await pool.request()
      .input('StudentID', sql.Int, studentId)
      .input('RewardTitle', sql.NVarChar, rewardTitle)
      .input('PointsRequired', sql.Int, pointsRequired)
      .query(`
        UPDATE StudentPoints
        SET Points = Points - @PointsRequired,
            UpdatedAt = GETDATE()
        WHERE StudentID = @StudentID;

        INSERT INTO RewardActivities 
        (StudentID, ActivityTitle, PointsChanged, ActivityType, CreatedAt)
        VALUES 
        (@StudentID, 'Redeem: ' + @RewardTitle, -@PointsRequired, 'subtract', GETDATE());
      `);

    res.json({
      message: "Reward redeemed successfully"
    });

  } catch (err) {
    console.error("Redeem Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;