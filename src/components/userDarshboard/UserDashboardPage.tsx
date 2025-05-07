import React, { useEffect } from "react";
import { Box, Grid, Typography, CircularProgress, Alert } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { fetchUserProfile } from "../store/user/userActions";
import UserProfileCard from "./UserProfileCard";
import UserRolesList from "./UserRolesList";
import QuickActions from "./QuickActions";

const UserDashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#1b1c1d",
          color: "#f5f5f5",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#1b1c1d",
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        bgcolor: "#1b1c1d",
        color: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Painel do Usuário
      </Typography>
      <Grid container spacing={3}>
        {user && (
          <>
            <Grid item xs={12} md={6}>
              <UserProfileCard user={user} />
            </Grid>
            <Grid item xs={12} md={6}>
              <UserRolesList roles={user.tipoUsuario} />{" "}
              {/* Assumindo que 'tipoUsuario' são as roles */}
            </Grid>
            <Grid item xs={12}>
              <QuickActions userRoles={user.tipoUsuario} />{" "}
              {/* Passando as roles para ações condicionais */}
            </Grid>
            {/* Outras seções do dashboard */}
          </>
        )}
      </Grid>
    </Box>
  );
};

export default UserDashboardPage;
