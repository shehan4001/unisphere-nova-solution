import React from "react";
import { Routes, Route } from "react-router-dom";

// පවතින Pages Import කිරීම
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

// වැදගත්: AdminRoutes Import කිරීම (Path එක හරියටම බලන්න)
import AdminRoutes from "../admin/routes/AdminRoutes"; 

function AppRoutes() {
  return (
    <Routes>
      {/* සාමාන්‍ය පාරවල් (Student/Public) */}
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

      {/* --- අලුතින් එක් කළ Admin පාර --- */}
      {/* මෙහි /* දැමීමෙන් AdminRoutes ඇතුළේ තියෙන dashboard, students වැනි පාරවල් වැඩ කරයි */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      
    </Routes>
  );
}

export default AppRoutes;