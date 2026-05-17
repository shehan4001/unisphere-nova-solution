import express from 'express';
import cors from 'cors';
import path from 'path'; 
import loginRoute from '../api/login/auth.js';
import registerRoutes from '../api/StudentRegistration/register.js';
import clubsRoutes from '../api/CampusClubs/clubs.js';
import profileRoutes from '../api/AdminProfile/profile.js'; 
import eventRoutes from '../api/EventManagement/eventRoutes.js';
import dashboardRoutes from '../api/Dashboard/Routes.js';
import analyticsRoutes from '../api/Dashboard/reports.js';
import studentUpdateRoute from '../api/StudentProfile/update.js';
import rewardRoutes from '../api/Rewards/rewardRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/login', loginRoute); 
app.use('/api/register', registerRoutes);
app.use('/api/clubs', clubsRoutes);
app.use('/api/admin', profileRoutes); 
app.use('/api/events', eventRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/dashboard', analyticsRoutes);
app.use('/api/students', studentUpdateRoute);
app.use('/api/rewards', rewardRoutes);


app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.listen(5000, () => console.log("🚀 Server running on port 5000"));