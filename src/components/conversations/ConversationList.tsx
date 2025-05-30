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
  title: string | null;
  icon?: string;
  isPinned?: boolean;
  startedAt: string;
  userId: number;
}

interface ConversationListProps {
  onConversationClick: (id: string) => void;
  onConversationMenuOpen: (id: string) => void;
  selectedConversationId?: string | null;
  sx?: SxProps<Theme>; // Adicione a prop sx à interface
}

interface ApiResponse {
  totalPages: number;
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  records: Conversation[];
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
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response: ApiResponse = await apiFetch(
            `/ollama/${userId}/conversations?pageSize=5&pageNumber=1` // Já estamos limitando no backend
          );
          setConversations(response.records); // Extrai o array de conversas da propriedade 'records'
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
    // Implement logic to load more conversations using pagination
    console.log("Load more conversations");
  };

  const handlePinConversation = (id: string) => {
    console.log(`Fixar conversa ${id}`);
    // Implemente a lógica para fixar a conversa (atualizar o estado, chamar a API, etc.)
  };

  const handleEditTitleConversation = (id: string) => {
    console.log(`Editar título da conversa ${id}`);
    // Implemente a lógica para editar o título (abrir um modal, etc.)
  };

  const handleDeleteConversation = (id: string) => {
    console.log(`Excluir conversa ${id}`);
    // Implemente a lógica para excluir a conversa (atualizar o estado, chamar a API, etc.)
  };

  return (
    <Box
      sx={{
        width: 350, // Use a largura desejada
        height: "98%",
        backgroundColor: "#282a2c",
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
              onPinConversation={handlePinConversation} // Passe as novas funções como props
              onEditTitleConversation={handleEditTitleConversation}
              onDeleteConversation={handleDeleteConversation}
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
