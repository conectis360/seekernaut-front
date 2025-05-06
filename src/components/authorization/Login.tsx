import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";
import { login as loginAction } from "../../store/auth.slice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store"; // Export this from your store setup

// Update the component code:

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error: reduxError } = useAppSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    dispatch(loginAction({ username, password })); // Now matches Credentials type
  };

  useEffect(() => {
    if (reduxError) {
      setError(reduxError);
    }

    if (isAuthenticated) {
      navigate("/chat");
    }
  }, [isAuthenticated, reduxError, navigate]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h2" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {/* Indicador de carregamento */}
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <TextField
          label="username"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          variant="outlined"
        />
        <TextField
          label="Senha"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Entrar
        </Button>
      </form>
    </Container>
  );
};

export default Login;
