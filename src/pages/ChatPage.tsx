import React, { useCallback, useState } from "react";
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
  const [currentModel, setCurrentModel] = useState<string | null>(null);

  const handleConversationClick = (id: string) => {
    setSelectedConversationId(id);
    navigate(`/chat/${id}`);
  };

  const handleConversationMenuOpen = (id: string) => {
    console.log(`Menu for conversation ${id} opened`);
  };

  const userName = localStorage.getItem("nome"); // Supondo que você armazene o userId no localStorage

  const handleModelChange = useCallback(
    (modelInfo: { modelName: string; newChat: boolean }) => {
      setCurrentModel(modelInfo.modelName);
      if (modelInfo.newChat) {
        // Lógica para criar um novo chat com o modelo selecionado
        const newConversationId = generateNewConversationId(); // Função para gerar um novo ID
        setSelectedConversationId(newConversationId);
        navigate(`/chat/${newConversationId}`); // Atualiza a URL
        // Possivelmente fazer uma chamada à API para inicializar a conversa
        // com o novo modelo (se necessário)
        console.log(`New chat started with model: ${modelInfo.modelName}`);
      } else {
        // Lógica para lidar com a mudança de modelo sem criar um novo chat
        console.log(`Model changed to: ${modelInfo.modelName}`);
      }
    },
    [navigate]
  );
  // Função para gerar um novo ID de conversa (substitua pela sua lógica)
  const generateNewConversationId = () => {
    return `chat-${Date.now()}`; // Exemplo simples
  };
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
          onModelChange={handleModelChange}
          userName={userName}
          userAvatarUrl={undefined}
        />
        <ChatWindow />
      </MainContent>
    </Root>
  );
};

export default ChatPage;
