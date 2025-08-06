import { useState } from "react";
import Navbar from "../components/NavBar";
import UserTable from "../components/SignedUpUsersTable";
import SeverityAuthTable from "../components/AuthSettings";
import AlertsPage from "../components/AlertsPage";
import { type NotificationItem } from "../components/NotificationsList";

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    message: "Mike Chen has logged in from a different location than usual",
    read: false,
    title: "Login from New Location Detected",
    details: {
      device: "MacBook Pro (Safari 17.1)",
      location: { city: "San Francisco", country: "USA", coordinates: { lat: 37.7749, lon: -122.4194 } },
      ip: "192.168.45.23",
      loginTime: "2025-08-01T09:23:15Z"
    }
  },
  {
    id: 2,
    message: "John Doe has logged in at an unusual time",
    read: false,
    title: "Login at Unusual Time Detected",
    details: {
      device: "Windows 11 PC (Chrome 126)",
      location: { city: "New York", country: "USA", coordinates: { lat: 40.7128, lon: -74.0060 } },
      ip: "10.14.67.89",
      loginTime: "2025-08-01T03:45:02Z"
    }
  },
  {
    id: 3,
    message: "David Kim logged in at an unusual time",
    read: false,
    title: "Unusual Login Activity",
    details: {
      device: "Samsung Galaxy S23 (Android, Chrome 125)",
      location: { city: "Seoul", country: "South Korea", coordinates: { lat: 37.5665, lon: 126.9780 } },
      ip: "172.16.23.54",
      loginTime: "2025-08-01T04:12:39Z"
    }
  },
  {
    id: 4,
    message: "David Kim logged in at an unusual time",
    read: true,
    title: "Unusual Login Activity",
    details: {
      device: "iPad Pro (Safari 17.0)",
      location: { city: "Busan", country: "South Korea", coordinates: { lat: 35.1796, lon: 129.0756 } },
      ip: "172.16.45.77",
      loginTime: "2025-07-31T23:56:27Z"
    }
  },
  {
    id: 5,
    message: "Emily Rodriguez has logged in from a different location than usual",
    read: true,
    title: "Login from New Location Detected",
    details: {
      device: "MacBook Air (Chrome 126)",
      location: { city: "Toronto", country: "Canada", coordinates: { lat: 43.65107, lon: -79.347015 } },
      ip: "10.24.98.102",
      loginTime: "2025-07-31T15:33:44Z"
    }
  }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Users");
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div>
      <Navbar
        notifications={notifications}
        onTabChange={setActiveTab}
        onNotificationSelect={(notif) => {
          markNotificationAsRead(notif.id);
          setSelectedNotification(notif);
          setActiveTab("Alerts");
        }}
      />

      {activeTab === "Users" && <UserTable />}
      {activeTab === "Risk Policy" && <SeverityAuthTable />}
      {activeTab === "Alerts" && (
        <AlertsPage
          notifications={notifications}
          selectedNotification={selectedNotification}
          markNotificationAsRead={markNotificationAsRead}
          clearSelectedNotification={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
