import React, { useCallback } from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material"; // Importe Box
import { styled } from "@mui/material/styles";
import ModelSelector from "./ModelSelector";
import UserInfo from "./UserInfo";
import { Link } from "react-router-dom";

const Spacer = styled("div")(({ theme }) => ({
  flexGrow: 1,
}));

interface ChatHeaderBarProps {
  onModelChange: (modelInfo: { modelName: string; newChat: boolean }) => void;
  userName: string | null;
  userAvatarUrl: string | null | undefined;
}

const ChatHeaderBar: React.FC<ChatHeaderBarProps> = ({
  onModelChange,
  userName,
  userAvatarUrl,
}) => {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <ModelSelector onModelChange={onModelChange} />
        <Spacer />
        <Box
          component={Link}
          to="/user-dashboard"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            "&:hover": { opacity: 0.8 },
          }}
        >
          <UserInfo userName={userName} userAvatarUrl={userAvatarUrl} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ChatHeaderBar;
