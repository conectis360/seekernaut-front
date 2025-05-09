import React from "react";
import { AppBar, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import ModelSelector from "./ModelSelector";
import UserMenu from "../userDarshboard/UserMenu"; // Importe o UserMenu

const Spacer = styled("div")(({ theme }) => ({
  flexGrow: 1,
}));

interface ChatHeaderBarProps {
  onModelChange: (modelInfo: { modelName: string; newChat: boolean }) => void;
  userName: string | null;
  userEmail: string | null;
  userAvatarUrl: string | null | undefined;
  onLogOff: () => void; // Adicione a prop para o log off
}

const ChatHeaderBar: React.FC<ChatHeaderBarProps> = ({
  onModelChange,
  userName,
  userEmail,
  userAvatarUrl,
  onLogOff,
}) => {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <ModelSelector onModelChange={onModelChange} />
        <Spacer />
        <UserMenu
          userName={userName}
          userEmail={userEmail}
          userAvatarUrl={userAvatarUrl}
          onLogOff={onLogOff}
        />
      </Toolbar>
    </AppBar>
  );
};

export default ChatHeaderBar;
