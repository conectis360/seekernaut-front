import React from "react";
import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";
import { Usuario } from "../../store/types"; // Importe a interface Usuario

interface UserProfileCardProps {
  user: Usuario;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  return (
    <Card sx={{ bgcolor: "#282a2c", color: "#f5f5f5" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{ width: 56, height: 56, mr: 2 }}
            src={user.foto || undefined}
            alt={user.nome}
          />
          <Typography variant="h6">{user.nome}</Typography>
        </Box>
        <Typography variant="subtitle1">@{user.usuario}</Typography>
        <Typography variant="body2">Email: {user.email}</Typography>
        <Typography variant="body2">
          Status: {user.accountNonLocked ? "Ativa" : "Bloqueada"}
        </Typography>
        {/* Outras informações do perfil que você queira exibir */}
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
