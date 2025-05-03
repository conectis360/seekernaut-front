import React, { useState, useEffect } from "react";
import {
  List,
  Typography,
  Divider,
  CircularProgress,
  Box,
  Button,
  SxProps,
  Theme,
} from "@mui/material";
import { apiFetch } from "../../utils/api"; // Assuming you have this utility
import ConversationItem from "./ConversationItem";

interface Conversation {
  conversationId: string;
  title: string;
  icon?: string;
  isPinned?: boolean;
  // Add other relevant properties
}

interface ConversationListProps {
  onConversationClick: (id: string) => void;
  onConversationMenuOpen: (id: string) => void;
  selectedConversationId?: string | null;
  sx?: SxProps<Theme>; // Adicione a prop sx à interface
}

const ConversationList: React.FC<ConversationListProps> = ({
  onConversationClick,
  onConversationMenuOpen,
  selectedConversationId,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleLoadMore = () => {
    // Implement logic to load more conversations
    console.log("Load more conversations");
  };

  return (
    <Box
      sx={{
        width: 450, // Adjust width as needed
        height: "98%",
        backgroundColor: "#2e2e2e", // Match the background color
        color: "#f5f5f5", // Match the text color
        borderRight: "1px solid #383838", // Match the border
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
            <ConversationItem
              key={conversation.conversationId}
              id={conversation.conversationId}
              title={conversation.title}
              iconUrl={conversation.icon}
              isPinned={conversation.isPinned}
              isSelected={
                conversation.conversationId === selectedConversationId
              }
              onClick={onConversationClick}
              onOpenMenu={onConversationMenuOpen}
            />
          ))}
        </List>
      )}
      <Divider sx={{ borderColor: "#383838", marginTop: 1 }} />
      <Button onClick={handleLoadMore} fullWidth>
        Mais
      </Button>
      {/* Add new conversation button or other actions here */}
    </Box>
  );
};

export default ConversationList;
