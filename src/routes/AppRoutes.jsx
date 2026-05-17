import React from "react";
import { Routes, Route } from "react-router-dom";


import Login from "../pages/Login/Login";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import CreateAccount from "../pages/CreateAccount/CreateAccount";
import Menu from "../pages/Menu/Menu";
import Reward from "../pages/Reward/Reward";
import CampusClubs from "../pages/CampusClubs/CampusClubs";
import EventAndFacilities from "../pages/EventAndFacilities/EventAndFacilities";
import Transit from "../pages/Transit/Transit";
import HelpCenter from "../pages/HelpCenter/HelpCenter";
import StudentPortal from "../pages/StudentPortal/StudentPortal";


import AdminRoutes from "../admin/routes/AdminRoutes"; 

function AppRoutes() {
  return (
    <Routes>
     
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/reward" element={<Reward />} />
      <Route path="/campus-clubs" element={<CampusClubs />} />
      <Route path="/events" element={<EventAndFacilities />} />
      <Route path="/transit" element={<Transit />} />
      <Route path="/help-Center" element={<HelpCenter/>}/>
      <Route path="/student-portal" element={<StudentPortal />} />

   
      <Route path="/admin/*" element={<AdminRoutes />} />
      
    </Routes>
  );
}

export default AppRoutes;