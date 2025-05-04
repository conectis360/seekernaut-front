import React, { useState } from "react";
import { Box } from "@mui/material";
import ChatHeaderBar from "../components/header/ChatHeaderBar";
import ConversationList from "../components/conversations/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";

const Root = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100vh", // Garante que ocupa toda a altura da tela
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1, // Ocupa o espaço restante
  display: "flex",
  flexDirection: "column", // Organiza ChatHeader e ChatWindow verticalmente
  height: "100%", // Garante que ocupa toda a altura disponível na Root
}));

const ChatPage: React.FC = () => {
  const { conversationId: initialConversationId } = useParams();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(initialConversationId || null);
  const navigate = useNavigate();

  const handleConversationClick = (id: string) => {
    setSelectedConversationId(id);
    navigate(`/chat/${id}`);
  };

  const handleConversationMenuOpen = (id: string) => {
    console.log(`Menu for conversation ${id} opened`);
  };

  const userName = localStorage.getItem("nome"); // Supondo que você armazene o userId no localStorage

  return (
    <Root>
      <ConversationList
        sx={{
          width: "40%", // Largura fixa para a ConversationList
          height: "100%",
          overflowY: "auto", // Barra de rolagem se a lista for longa
        }}
        onConversationClick={handleConversationClick}
        onConversationMenuOpen={handleConversationMenuOpen}
        selectedConversationId={selectedConversationId}
      />
      <MainContent>
        <ChatHeaderBar
          onModelChange={function (modelId: string): void {
            throw new Error("Function not implemented.");
          }}
          userName={userName}
          userAvatarUrl={undefined}
        />
        <ChatWindow />
      </MainContent>
    </Root>
  );
};

export default ChatPage;
