import React, { useCallback } from "react";
import { AppBar, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import ModelSelector from "./ModelSelector";
import UserInfo from "./UserInfo";

const Spacer = styled("div")(({ theme }) => ({
  flexGrow: 1,
}));

interface ChatHeaderBarProps {
  onModelChange: (modelId: string) => void;
  userName: string | null;
  userAvatarUrl: string | null | undefined;
}

const ChatHeaderBar: React.FC<ChatHeaderBarProps> = ({
  onModelChange,
  userName,
  userAvatarUrl,
}) => {
  const handleModelChange = useCallback(
    (modelId: string) => {
      onModelChange(modelId);
    },
    [onModelChange]
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <ModelSelector onModelChange={handleModelChange} />
        <Spacer />
        <UserInfo userName={userName} userAvatarUrl={userAvatarUrl} />
      </Toolbar>
    </AppBar>
  );
};

export default ChatHeaderBar;
