import React from "react";
import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";

const Spacer = styled("div")(({ theme }) => ({
  flexGrow: 1,
}));

const ChatHeader: React.FC = () => {
  // TODO: Obter o nome do modelo e as informações do usuário
  const modelName = "Modelo Alpha";
  const userName = "Você";
  const userAvatarUrl = null; // Ou um ícone padrão

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="subtitle1">{modelName}</Typography>
        <Spacer />
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle2">{userName}</Typography>
          {userAvatarUrl ? (
            <Avatar src={userAvatarUrl} sx={{ ml: 1 }} />
          ) : (
            <Avatar sx={{ ml: 1 }}>{userName.charAt(0)}</Avatar>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ChatHeader;
