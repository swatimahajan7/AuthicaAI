import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import logo from "../assets/logo.svg";
import { NotificationsList, type NotificationItem } from "./NotificationsList";
import { useNavigate } from "react-router";
import { Dialog, DialogTitle, DialogContent, DialogContentText } from "@mui/material";

type ResponsiveAppBarProps = {
  onTabChange?: (tabName: string) => void;
};

const pages = ["Users", "Settings"];
const settings = ["Logout"];

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    message: "Mike Chen has logged in from a different location than usual",
    read: false,
    title: "Login from New Location Detected",
    details: {
      device: "MacBook Pro (Safari 17.1)",
      location: {
        city: "San Francisco",
        country: "USA",
        coordinates: { lat: 37.7749, lon: -122.4194 }
      },
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
      location: {
        city: "New York",
        country: "USA",
        coordinates: { lat: 40.7128, lon: -74.0060 }
      },
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
      location: {
        city: "Seoul",
        country: "South Korea",
        coordinates: { lat: 37.5665, lon: 126.9780 }
      },
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
      location: {
        city: "Busan",
        country: "South Korea",
        coordinates: { lat: 35.1796, lon: 129.0756 }
      },
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
      location: {
        city: "Toronto",
        country: "Canada",
        coordinates: { lat: 43.65107, lon: -79.347015 }
      },
      ip: "10.24.98.102",
      loginTime: "2025-07-31T15:33:44Z"
    }
  }
];


function ResponsiveAppBar({ onTabChange }: ResponsiveAppBarProps) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = React.useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(initialNotifications);
  const [selectedNotification, setSelectedNotification] = React.useState<NotificationItem>({} as NotificationItem)
  const [openNotificationPopup, setOpenNotificationPopup] = React.useState<boolean>(false)

  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenNotificationsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleCloseNotificationsMenu = () => setAnchorElNotifications(null);

  const handleNotificationClick = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
    setSelectedNotification(notifications.find((n) => n.id === id)!)
    setOpenNotificationPopup(true)
    handleCloseNotificationsMenu();
  };

  return (
    <>
      <AppBar position="static" color="primary">
        <Container maxWidth={false}>
          <Toolbar disableGutters>

            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "Lato",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <img
                src={logo}
                alt="Company Logo"
                style={{ width: "auto", marginRight: "20px" }}
              />
              AuthicaAI
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => {
                    handleCloseNavMenu();
                    onTabChange?.(page);
                  }}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "Lato",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <img
                src={logo}
                alt="Company Logo"
                style={{ width: "auto", marginRight: "20px" }}
              />
              AuthicaAI
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => {
                    handleCloseNavMenu();
                    onTabChange?.(page);
                  }}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
              <Tooltip title="View notifications">
                <IconButton
                  onClick={handleOpenNotificationsMenu}
                  sx={{ p: 0, mr: 2, color: "inherit" }}
                >
                  <Badge
                    color="error"
                    variant={unreadCount > 0 ? "dot" : "standard"}
                    overlap="circular"
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElNotifications}
                open={Boolean(anchorElNotifications)}
                onClose={handleCloseNotificationsMenu}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                sx={{ mt: "45px" }}
              >
                <NotificationsList
                  notifications={notifications}
                  onItemClick={(id) => handleNotificationClick(id)}
                />
              </Menu>

              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Admin Avatar" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                sx={{ mt: "45px" }}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => navigate('/signin')}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {
        openNotificationPopup && <Dialog
          open={openNotificationPopup}
          onClose={() => setOpenNotificationPopup(false)}
        >
          <DialogTitle>
            {selectedNotification.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText component="div">
              <p><strong>Device:</strong> {selectedNotification.details.device}</p>
              <p><strong>Location:</strong> {selectedNotification.details.location.city}, {selectedNotification.details.location.country}</p>
              <p>
                <strong>Coordinates:</strong>
                {selectedNotification.details.location.coordinates.lat},
                {selectedNotification.details.location.coordinates.lon}
              </p>
              <p><strong>IP Address:</strong> {selectedNotification.details.ip}</p>
              <p><strong>Login Time:</strong> {new Date(selectedNotification.details.loginTime).toLocaleString()}</p>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      }
    </>
  );
}

export default ResponsiveAppBar;
