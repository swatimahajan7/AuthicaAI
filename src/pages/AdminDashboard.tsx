import  { useState } from "react";
import Navbar from "../components/NavBar";
import UserTable from "../components/SignedUpUsersTable";
import SeverityAuthTable from "../components/AuthSettings";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Users");
  return (
    <div>
      <Navbar onTabChange={setActiveTab} isAdmin={true} />
      {activeTab === "Users" && <UserTable />}
      {activeTab === "Risk Policy" && <SeverityAuthTable />}
    </div>
  );
};

export default AdminDashboard;
