import React, { useState } from "react";
import { TextField, Button, Container, Typography, Alert } from "@mui/material";
import { apiFetch, ApiError } from "../utils/api"; // Importe a função utilitária

interface LoginResponse {
  accessToken: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
  nome: string;
  sobrenome: string | null;
  tokenType: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const data: LoginResponse = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        skipAuth: true, // Não precisa de token para a própria requisição de login
      });

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userId", String(data.id));
      localStorage.setItem("nome", data.nome);
      localStorage.setItem("email", data.email);
      localStorage.setItem("username", data.username);

      console.log("Login successful, token:", data.accessToken);
      window.location.href = "/chat";
    } catch (err: any) {
      setError(
        err.message || "Falha ao fazer login. Verifique suas credenciais."
      );
      console.error("Login failed:", err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h2" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <TextField
          label="Nome de Usuário"
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
