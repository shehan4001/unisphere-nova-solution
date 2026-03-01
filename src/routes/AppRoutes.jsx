import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import CreateAccount from "../pages/CreateAccount";
import Menu from "../pages/Menu";
import Reward from "../pages/Reward";
import CampusClubs from "../pages/CampusClubs";
import EventAndFacilities from "../pages/EventAndFacilities";
import Transit from "../pages/Transit";
import LMSLoading from "../pages/LMSLoading";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/reward" element={<Reward />} />
      <Route path="/campus-clubs" element={<CampusClubs />} />
      <Route path="/events" element={<EventAndFacilities />} />
      <Route path="/transit" element={<Transit />} />
      <Route path="/lms-loading" element={<LMSLoading />} />
    </Routes>
  );
}

export default AppRoutes;