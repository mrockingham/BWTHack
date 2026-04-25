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
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ParkIcon from "@mui/icons-material/Park"; // A great tree icon for Legacy Hub

const pages = [
  { title: "The Tree", path: "/tree" },
  { title: "Trip Planner", path: "/planner" },
  { title: "RSVP & Dues", path: "/dues" },
];

const mockUsers = [
  "Michael Rockingham III",
  "Joseph Rockingham Jr.",
  "Keith Rockingham",
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const [currentUser, setCurrentUser] = React.useState(mockUsers[0]);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = (user: string) => {
    if (typeof user === "string") setCurrentUser(user);
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "transparent",
        boxShadow: "none",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ParkIcon
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
              color: "#75B06F",
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 900,
              letterSpacing: ".1rem",
              color: "white",
              textDecoration: "none",
            }}
          >
            LEGACY<span style={{ color: "#75B06F" }}>HUB</span>
          </Typography>

          {/* MOBILE MENU */}
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
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.title}
                  onClick={handleCloseNavMenu}
                  component="a"
                  href={page.path}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "#2C3E50",
                      fontWeight: "bold",
                    }}
                  >
                    {page.title}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <ParkIcon
            sx={{
              display: { xs: "flex", md: "none" },
              mr: 1,
              color: "#75B06F",
            }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 900,
              letterSpacing: ".1rem",
              color: "white",
              textDecoration: "none",
            }}
          >
            LEGACY<span style={{ color: "#75B06F" }}>HUB</span>
          </Typography>

          {/* DESKTOP MENU */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end",
              mr: 3,
              gap: 2,
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.title}
                href={page.path}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: page.title === "RSVP & Dues" ? "#161B07" : "white",
                  display: "block",
                  fontWeight: "bold",
                  backgroundColor:
                    page.title === "RSVP & Dues" ? "#75B06F" : "transparent",
                  borderRadius: page.title === "RSVP & Dues" ? "20px" : "4px",
                  px: page.title === "RSVP & Dues" ? 3 : 2,
                  "&:hover": {
                    backgroundColor:
                      page.title === "RSVP & Dues"
                        ? "#5f9159"
                        : "rgba(255,255,255,0.1)",
                  },
                }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* USER PROFILE MOCK LOGIN */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Switch User Perspective">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, border: "2px solid #75B06F" }}
              >
                <Avatar sx={{ bgcolor: "#36656B" }}>
                  {currentUser.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={() => handleCloseUserMenu("")}
            >
              <Typography
                sx={{
                  px: 2,
                  py: 1,
                  fontSize: "0.8rem",
                  color: "#7f8c8d",
                  fontWeight: "bold",
                }}
              >
                LOGGED IN AS:
              </Typography>
              {mockUsers.map((user) => (
                <MenuItem
                  key={user}
                  onClick={() => handleCloseUserMenu(user)}
                  selected={user === currentUser}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontWeight: user === currentUser ? "bold" : "normal",
                    }}
                  >
                    {user}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
