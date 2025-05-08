import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { Usuario } from "../../store/types";

interface UserRolesListProps {
  roles?: Usuario["tipoUsuario"];
}

const UserRolesList: React.FC<UserRolesListProps> = ({ roles }) => {
  return (
    <Card sx={{ bgcolor: "#282a2c", color: "#f5f5f5" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Roles do Usuário
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {roles &&
            roles.map((role) => (
              <Chip key={role.id} label={role.tipoUsuario} color="primary" />
            ))}
          {!roles || roles.length === 0 ? (
            <Typography variant="body2">Nenhuma role atribuída.</Typography>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserRolesList;
