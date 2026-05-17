import express from 'express';
import sql from 'mssql';

import config from '../../server/dbConfig.js'; 

const router = express.Router();


router.put('/update-profile/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, contact } = req.body;

    try {
        let pool = await sql.connect(config); 
        
       
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('contact', sql.NVarChar, contact)
            .query(`
                UPDATE Admins 
                SET FullName = @name, 
                    Email = @email, 
                    ContactNumber = @contact 
                WHERE AdminID = @id
            `);

      
        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ 
                success: true, 
                message: "Profile updated successfully in Database!" 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                message: "Admin not found with provided ID" 
            });
        }
    } catch (err) {
        console.error("SQL Error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Database Error", 
            error: err.message 
        });
    }
});

export default router;