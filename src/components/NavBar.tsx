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
import { NotificationsList, type NotificationItem } from "./NotificationsList";
import { useNavigate } from "react-router";

type ResponsiveAppBarProps = {
  notifications: NotificationItem[];
  onTabChange?: (tabName: string) => void;
  onNotificationSelect?: (notif: NotificationItem) => void;
  isAdmin:boolean
};

const pages = ["Users", "Risk Policy", "Alerts"];
const settings = ["Logout", "Profile"];

function ResponsiveAppBar({ notifications, onTabChange, onNotificationSelect, isAdmin }: ResponsiveAppBarProps) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = React.useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (id: number) => {
    const notif = notifications.find((n) => n.id === id)!;
    onTabChange?.("Alerts");
    onNotificationSelect?.(notif);
    setAnchorElNotifications(null);
  };

  return (
    <>
      <AppBar position="fixed" color="primary">
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            <Typography
              variant="h5"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "Lato, sans-serif",
                fontWeight: 900,
                color: "#3b354bff",
                letterSpacing: "1px",
                fontSize: { xs: "1.25rem", md: "2rem" },
              }}
            >
              AuthicaAI
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton size="large" onClick={(e) => setAnchorElNav(e.currentTarget)} color="inherit">
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={() => setAnchorElNav(null)}
              >
                {isAdmin &&
                  pages.map((page) => (
                    <MenuItem
                      key={page}
                      onClick={() => {
                        setAnchorElNav(null);
                        onTabChange?.(page);
                      }}
                    >
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
              </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {isAdmin &&
                pages.map((page) => (
                  <Button
                    key={page}
                    onClick={() => {
                      onTabChange?.(page);
                    }}
                    sx={{
                      my: 2,
                      color: "white",
                      display: "block",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      textTransform: "none",
                      fontSize: 16,
                    }}
                  >
                    {page}
                  </Button>
                ))}
            </Box>

            <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
              {isAdmin && (
                <Tooltip title="View notifications">
                  <IconButton
                    onClick={(e) => setAnchorElNotifications(e.currentTarget)}
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
              )}
              <Menu
                anchorEl={anchorElNotifications}
                open={Boolean(anchorElNotifications)}
                onClose={() => setAnchorElNotifications(null)}
              >
                <NotificationsList notifications={notifications} onItemClick={handleNotificationClick} />
              </Menu>

              <Tooltip title="Open settings">
                <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
                  <Avatar alt="Admin Avatar" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={() => setAnchorElUser(null)}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      if (setting === "Profile") {
                        navigate("/userProfile");
                      } else if (setting === "Logout") {
                        navigate("/signin");
                      }
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default ResponsiveAppBar;
