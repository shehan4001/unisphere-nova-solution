import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// පේජ් import කිරීම
import Dashboard from '../pages/Dashboard/Dashboard';
import CampusClubs from '../pages/CampusClubs/CampusClubs';
import EventAndFacilities from '../pages/EventAndFacilities/EventAndFacilities';
import Reports from '../pages/Reports/Reports';
// 1. අලුතින් සාදන ලද StudentRegistration පේජ් එක import කරන්න
import StudentRegistration from '../pages/StudentRegistration/StudentRegistration'; 

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Default Route: /admin ලෙස ආ විට Dashboard පෙන්වයි */}
      <Route index element={<Dashboard />} />
      
      {/* Dashboard පේජ් එක සඳහා වන පාර */}
      <Route path="dashboard" element={<Dashboard />} />
      
      {/* 2. Student Registration පේජ් එක සඳහා වන නව පාර */}
      <Route path="students" element={<StudentRegistration />} />
      
      {/* Manage Clubs පේජ් එක සඳහා වන පාර */}
      <Route path="clubs" element={<CampusClubs />} />
      
      {/* Facility & Event පේජ් එක සඳහා වන පාර */}
      <Route path="facility" element={<EventAndFacilities />} />
      
      {/* Reports පේජ් එක සඳහා වන පාර */}
      <Route path="reports" element={<Reports />} />

      {/* වෙනත් ඕනෑම වැරදි URL එකක් සඳහා Dashboard එකට redirect කරයි */}
      <Route path="*" element={<Navigate to="dashboard" />} />
    </Routes>
  );
};

export default AdminRoutes;