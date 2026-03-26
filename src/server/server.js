import express from 'express';
import cors from 'cors';
import loginRoute from '../api/login/auth.js';
import registerRoutes from '../api/StudentRegistration/register.js';
import clubsRoutes from '../api/CampusClubs/clubs.js';
import profileRoutes from '../api/AdminProfile/profile.js'; 

const app = express();
app.use(cors());
app.use(express.json());

// Routes සම්බන්ධ කිරීම
app.use('/api/login', loginRoute); 
app.use('/api/register', registerRoutes);
app.use('/api/clubs', clubsRoutes);
app.use('/api/admin', profileRoutes); 

app.use('/uploads', express.static('uploads'));

app.listen(5000, () => console.log("🚀 Server running on port 5000"));