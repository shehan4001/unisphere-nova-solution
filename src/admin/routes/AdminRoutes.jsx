import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';


import Dashboard from '../pages/Dashboard/Dashboard';
import CampusClubs from '../pages/CampusClubs/CampusClubs';
import EventAndFacilities from '../pages/EventAndFacilities/EventAndFacilities';
import Reports from '../pages/Reports/Reports';

import StudentRegistration from '../pages/StudentRegistration/StudentRegistration'; 

const AdminRoutes = () => {
  return (
    <Routes>
     
      <Route index element={<Dashboard />} />
      
    
      <Route path="dashboard" element={<Dashboard />} />
      
      
      <Route path="students" element={<StudentRegistration />} />
      
   
      <Route path="clubs" element={<CampusClubs />} />
      
   
      <Route path="facility" element={<EventAndFacilities />} />
      
 
      <Route path="reports" element={<Reports />} />

     
      <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
  );
};

export default AdminRoutes;