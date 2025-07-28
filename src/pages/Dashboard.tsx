import React, { useState } from "react";
import Navbar from "../components/NavBar";
import UserTable from "../components/SignedUpUsersTable";
import SeverityAuthTable from "../components/AuthSettings";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Users");
  return (
    <div>
      <Navbar onTabChange={setActiveTab} />
      {activeTab === "Users" && <UserTable />}
      {activeTab === "Settings" && <SeverityAuthTable />}
    </div>
  );
};

export default Dashboard;
