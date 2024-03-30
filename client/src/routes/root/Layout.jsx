import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MapIcon from "@mui/icons-material/Map";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import PersonIcon from "@mui/icons-material/Person";
import MemoryIcon from "@mui/icons-material/Memory";
import ConstructionIcon from "@mui/icons-material/Construction";
import LogoutIcon from "@mui/icons-material/Logout";

import { useLocation, useNavigate, Outlet } from "react-router-dom";
import useLogout from "../../hooks/auth/useLogout";
import useAuth from "../../hooks/auth/useAuth";

const drawerWidth = 240;

function Layout({ children }) {
  const { auth } = useAuth();
  const isSuperAdmin = auth.role === "SuperAdmin";
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <img src="/logo.png" height={50} width={200} alt="logo" />
      </Toolbar>
      <Divider />
      <List>
        {isSuperAdmin && (
          <ListItem
            disablePadding
            className={pathname === "/" ? "text-red-500 bg-red-100" : ""}
            onClick={() => {
              navigate("/");
            }}
          >
            <ListItemButton>
              <ListItemIcon
                sx={{
                  color: `${
                    "/"
                      ? "rgb(239 68 68 / var(--tw-text-opacity))"
                      : "rgb(51 65 85)"
                  }`,
                }}
              >
                <SpaceDashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem
          disablePadding
          className={pathname === "/maps" ? "text-red-500 bg-red-100" : ""}
          onClick={() => {
            navigate("/maps");
          }}
        >
          <ListItemButton>
            <ListItemIcon
              sx={{
                color: `${
                  "/maps"
                    ? "rgb(239 68 68 / var(--tw-text-opacity))"
                    : "rgb(51 65 85)"
                }`,
              }}
            >
              <MapIcon />
            </ListItemIcon>
            <ListItemText primary="Maps" />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          className={pathname === "/devices" ? "text-red-500 bg-red-100" : ""}
          onClick={() => {
            navigate("/devices");
          }}
        >
          <ListItemButton>
            <ListItemIcon
              sx={{
                color: `${
                  "/devices"
                    ? "rgb(239 68 68 / var(--tw-text-opacity))"
                    : "rgb(51 65 85)"
                }`,
              }}
            >
              <MemoryIcon />
            </ListItemIcon>
            <ListItemText primary="Devices" />
          </ListItemButton>
        </ListItem>
        {isSuperAdmin && (
          <ListItem
            disablePadding
            className={pathname === "/users" ? "text-red-500 bg-red-100" : ""}
            onClick={() => {
              navigate("/users");
            }}
          >
            <ListItemButton>
              <ListItemIcon
                sx={{
                  color: `${
                    "/users"
                      ? "rgb(239 68 68 / var(--tw-text-opacity))"
                      : "rgb(51 65 85)"
                  }`,
                }}
              >
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          </ListItem>
        )}
        {isSuperAdmin && (
          <ListItem
            disablePadding
            className={pathname === "/test" ? "text-red-500 bg-red-100" : ""}
            onClick={() => {
              navigate("/test");
            }}
          >
            <ListItemButton>
              <ListItemIcon
                sx={{
                  color: `${
                    "/test"
                      ? "rgb(239 68 68 / var(--tw-text-opacity))"
                      : "rgb(51 65 85)"
                  }`,
                }}
              >
                <ConstructionIcon />
              </ListItemIcon>
              <ListItemText primary="Test" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "#FFFFFF",
          color: "#2F2F2F",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            People Tracking
          </Typography>
        </Toolbar>
        <div className="flex gap-3 justify-center items-center">
          <Typography variant="h6">{`@${auth?.username}`}</Typography>
          <IconButton
            aria-label="logout"
            sx={{ mr: 2, color: "black" }}
            onClick={signOut}
          >
            <LogoutIcon />
          </IconButton>
        </div>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <main>{children}</main>
      </Box>
    </Box>
  );
}

export default Layout;
