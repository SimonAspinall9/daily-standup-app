import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Link from "@mui/material/Link";

const MyAccount = () => {
  const { loginWithPopup, isAuthenticated, user, isLoading, logout } =
    useAuth0();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: any) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  if (isLoading) return <span></span>;

  if (isAuthenticated && user) {
    return (
      <div>
        <Button
          id="fade-button"
          aria-controls="fade-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          variant="contained"
          disableElevation
          endIcon={<KeyboardArrowDownIcon />}
        >
          <Avatar alt={user.name} src={user.picture} />
        </Button>
        <Menu
          id="fade-menu"
          MenuListProps={{
            "aria-labelledby": "fade-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          <MenuItem divider>
            <Link href="/profile" underline="none" variant="body1">
              My Profile
            </Link>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    );
  }

  return (
    <div>
      <Button
        color="inherit"
        onClick={() => {
          loginWithPopup({ screen_hint: "signup" });
        }}
      >
        Sign Up
      </Button>
      <Button color="inherit" onClick={loginWithPopup}>
        Login
      </Button>
    </div>
  );
};

export default MyAccount;
