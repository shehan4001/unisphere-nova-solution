import express from 'express';
import sql from 'mssql';
import config from '../../server/dbConfig.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { studentId, fullName, faculty, email, password } = req.body;

    if (!studentId || !fullName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All required fields must be filled!"
        });
    }

    try {
        const pool = await sql.connect(config);

        const checkUser = await pool.request()
            .input('email', sql.NVarChar, email)
            .input('customId', sql.NVarChar, studentId)
            .query(`
                SELECT StudentID 
                FROM Students 
                WHERE Email = @email OR CustomID = @customId
            `);

        if (checkUser.recordset.length > 0) {
            return res.status(400).json({
                success: false,
                message: "This Email or Student ID already exists!"
            });
        }

        await pool.request()
            .input('customId', sql.NVarChar, studentId)
            .input('fullName', sql.NVarChar, fullName)
            .input('faculty', sql.NVarChar, faculty)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, password)
            .query(`
                INSERT INTO Students 
                (CustomID, FullName, Faculty, Email, Password, Role, CreatedAt)
                VALUES 
                (@customId, @fullName, @faculty, @email, @password, 'Student', GETDATE())
            `);

        res.status(201).json({
            success: true,
            message: "Student registered successfully!"
        });

    } catch (err) {
        console.error("Student Register Error:", err);
        res.status(500).json({
            success: false,
            message: "Database insert failed",
            error: err.message
        });
    }
});

router.get('/all', async (req, res) => {
    try {
        const pool = await sql.connect(config);

        const result = await pool.request().query(`
            SELECT 
                StudentID,
                CustomID,
                FullName,
                Faculty,
                Email,
                Password,
                Role,
                CreatedAt
            FROM Students
            ORDER BY CreatedAt DESC
        `);

        res.status(200).json(result.recordset);

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch students",
            error: err.message
        });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { fullName, faculty, email, password } = req.body;

    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('customId', sql.NVarChar, id)
            .input('fullName', sql.NVarChar, fullName)
            .input('faculty', sql.NVarChar, faculty)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, password)
            .query(`
                UPDATE Students
                SET FullName = @fullName,
                    Faculty = @faculty,
                    Email = @email,
                    Password = @password
                WHERE CustomID = @customId
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Student updated successfully!"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Update failed",
            error: err.message
        });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(config);

        await pool.request()
            .input('customId', sql.NVarChar, id)
            .query(`
                DELETE FROM StudentPoints 
                WHERE StudentID IN (
                    SELECT StudentID FROM Students WHERE CustomID = @customId
                );

                DELETE FROM ClaimedTasks 
                WHERE StudentID IN (
                    SELECT StudentID FROM Students WHERE CustomID = @customId
                );

                DELETE FROM RewardActivities 
                WHERE StudentID IN (
                    SELECT StudentID FROM Students WHERE CustomID = @customId
                );

                DELETE FROM ClubRequests 
                WHERE StudentID IN (
                    SELECT StudentID FROM Students WHERE CustomID = @customId
                );

                DELETE FROM Students 
                WHERE CustomID = @customId;
            `);

        res.status(200).json({
            success: true,
            message: "Student deleted successfully!"
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Delete failed",
            error: err.message
        });
    }
});

export default router;