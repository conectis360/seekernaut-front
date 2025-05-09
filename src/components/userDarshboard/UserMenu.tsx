import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  Typography,
  Divider,
  Box,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface UserMenuProps {
  userName: string | null;
  userEmail: string | null;
  userAvatarUrl: string | null | undefined;
  onLogOff: () => void; // Função para lidar com o log off
}

const UserMenu: React.FC<UserMenuProps> = ({
  userName,
  userEmail,
  userAvatarUrl,
  onLogOff,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGoToDashboard = () => {
    handleClose();
    navigate("/user-dashboard"); // Certifique-se de que esta rota esteja configurada
  };

  const handleLogOff = () => {
    handleClose();
    onLogOff(); // Chama a função de log off passada como prop
  };

  return (
    <Box>
      <Box
        onClick={handleClick}
        sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        <Typography variant="subtitle2" sx={{ mr: 1 }}>
          {userName}
        </Typography>
        {userAvatarUrl ? (
          <IconButton size="small" sx={{ p: 0 }}>
            <img
              src={userAvatarUrl}
              alt={userName || "User"}
              style={{ width: 24, height: 24, borderRadius: "50%" }}
            />
          </IconButton>
        ) : (
          <IconButton size="small" sx={{ p: 0 }}>
            <Typography
              variant="caption"
              style={{
                backgroundColor: "#ccc",
                color: "#fff",
                width: 24,
                height: 24,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {userName?.charAt(0)}
            </Typography>
          </IconButton>
        )}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem disabled>
          <Typography variant="body2">{userName}</Typography>
        </MenuItem>
        <MenuItem disabled>
          <Typography variant="caption">{userEmail}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleGoToDashboard}>
          <Typography>Dashboard</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogOff}>
          <Typography>Log Off</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
