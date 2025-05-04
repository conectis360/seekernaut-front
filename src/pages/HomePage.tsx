import React from "react";
import { Typography, Button, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Login from "../components/authorization/Login";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartChat = async () => {
    // Lógica para iniciar uma nova conversa no backend (se necessário)
    // e obter o conversationId

    // Simulação de criação de nova conversa e obtenção do ID
    const newConversationId = "new-conversation-" + Date.now(); // Substituir pela chamada real ao backend

    navigate(`/chat/${newConversationId}`);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom align="center">
        SeekerNaut Chat
      </Typography>
      <Typography
        variant="subtitle1"
        color="textSecondary"
        align="center"
        paragraph
      >
        Obtenha respostas inteligentes, gere ideias e explore o conhecimento
        através de conversas interativas.
      </Typography>
      <Box sx={{ mt: 6 }}>
        <Login></Login>
      </Box>

      <Box sx={{ mt: 6, textAlign: "center", color: "textSecondary" }}>
        <Typography variant="body2" paragraph>
          SeekerNaut Chat utiliza inteligência artificial avançada para fornecer
          respostas e auxiliar em diversas tarefas.
        </Typography>
        <Typography variant="body2" paragraph>
          Comece uma nova conversa e descubra o poder da interação com um LLM.
        </Typography>
        {/* Outras informações opcionais podem ser adicionadas aqui */}
      </Box>
    </Container>
  );
};

export default HomePage;
