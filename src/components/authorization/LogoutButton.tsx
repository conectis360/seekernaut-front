import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { RootState } from "../../store/store";
import { Typography, Box, CircularProgress, styled } from "@mui/material";

const StyledLogoutText = styled(Typography)(({ theme }) => ({
  cursor: "pointer",
  userSelect: "none", // Evita a seleção de texto
  // Outros estilos do seu design anterior
  "&:hover": {
    // Estilos de hover
    color: theme.palette.primary.light, // Exemplo
  },
  "&:focus": {
    // Estilos de foco (importante para acessibilidade)
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "2px",
  },
  "&:active": {
    // Estilos de clique
    color: theme.palette.primary.dark, // Exemplo
  },
}));

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(AuthService.logoutService() as any)
      .then(() => {
        navigate("/login");
      })
      .catch((err: any) => {
        console.error("Erro durante o logoff:", err);
      });
  };

  return (
    <Box
      component="span" // Usamos span para evitar problemas de layout
      onClick={handleLogout}
      role="button" // Indica que é um botão para leitores de tela
      tabIndex={0} // Permite que o elemento receba foco
      onKeyDown={(event) => {
        // Habilita a ativação com Enter ou Espaço
        if (event.key === "Enter" || event.key === " ") {
          handleLogout();
        }
      }}
      aria-label="Sair" // Fornece um rótulo acessível
    >
      <StyledLogoutText variant="body1">
        {loading ? (
          <Box display="inline-flex" alignItems="center">
            Saindo...{" "}
            <CircularProgress size={16} sx={{ ml: 1 }} color="inherit" />
          </Box>
        ) : (
          "Sair"
        )}
      </StyledLogoutText>
    </Box>
  );
};

export default LogoutButton;
