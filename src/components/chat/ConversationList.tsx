// ConversationList.tsx
import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";

interface Conversation {
  conversationId: string;
  title: string;
  startedAt: string;
  // Outras propriedades da conversa que você possa ter
}

const ConversationList: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      const userId = localStorage.getItem("userId"); // Supondo que você armazene o userId no localStorage
      if (userId) {
        try {
          const data: Conversation[] = await apiFetch(
            `/ollama/${userId}/conversations`
          );
          setConversations(data);
        } catch (error: any) {
          console.error("Erro ao carregar conversas do usuário:", error);
          setError("Erro ao carregar as conversas.");
        } finally {
          setLoading(false);
        }
      } else {
        console.error("ID do usuário não encontrado.");
        setError("ID do usuário não encontrado.");
        setLoading(false);
      }
    };

    fetchConversations();
  }, []); // Executa apenas na montagem

  const handleConversationClick = (conversationId: string) => {
    navigate(`/chat/${conversationId}`);
  };

  return (
    <Box
      sx={{
        width: 300, // Largura do menu lateral
        height: "100%",
        backgroundColor: "#2e2e2e",
        color: "#f5f5f5",
        borderRight: "1px solid #383838",
        padding: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Conversas
      </Typography>
      <Divider sx={{ borderColor: "#383838", marginBottom: 1 }} />
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List sx={{ flexGrow: 1, overflowY: "auto" }}>
          {conversations.map((conversation) => (
            <ListItem key={conversation.conversationId} disablePadding>
              <ListItemButton
                onClick={() =>
                  handleConversationClick(conversation.conversationId)
                }
              >
                <ListItemText
                  primary={
                    conversation.title ||
                    `Nova Conversa (${new Date(
                      conversation.startedAt
                    ).toLocaleDateString()})`
                  }
                  secondary={`Iniciada em: ${new Date(
                    conversation.startedAt
                  ).toLocaleDateString()}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
      <Divider sx={{ borderColor: "#383838", marginTop: 1 }} />
      {/* Adicione aqui botões para novas conversas, configurações, etc. */}
    </Box>
  );
};

export default ConversationList;
