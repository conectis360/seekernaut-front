import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { Usuario } from "../../store/types";
import { useNavigate } from "react-router-dom";

interface QuickActionsProps {
  userRoles?: Usuario["tipoUsuario"];
}

const QuickActions: React.FC<QuickActionsProps> = ({ userRoles }) => {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/profile/edit"); // Exemplo de rota
  };

  const handleChangePassword = () => {
    navigate("/settings/password"); // Exemplo de rota
  };

  const handleAdminPanel = () => {
    navigate("/admin"); // Exemplo de rota para usuários com role de administrador
  };

  return (
    <Card sx={{ bgcolor: "#282a2c", color: "#f5f5f5" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Ações Rápidas
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditProfile}
          >
            Editar Perfil
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleChangePassword}
          >
            Alterar Senha
          </Button>
          {userRoles &&
            userRoles.some(
              (role: { tipoUsuario: string }) => role.tipoUsuario === "ADMIN"
            ) && (
              <Button
                variant="contained"
                color="success"
                onClick={handleAdminPanel}
              >
                Painel de Administração
              </Button>
            )}
          {/* Adicione mais botões de ação conforme necessário */}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
