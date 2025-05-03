import React, { useState } from "react";
import { Box } from "@mui/material";
import ChatHeader from "../components/chat/ChatHeader";
import ConversationList from "../components/conversations/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";

const Root = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100vh",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
}));

const ChatPage: React.FC = () => {
  const { conversationId: initialConversationId } = useParams();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(initialConversationId || null);
  const navigate = useNavigate();

  const handleConversationClick = (id: string) => {
    setSelectedConversationId(id);
    navigate(`/chat/${id}`); // Keep the URL update for ChatWindow to react
  };

  const handleConversationMenuOpen = (id: string) => {
    console.log(`Menu for conversation ${id} opened`);
    // Implement your menu logic here
  };

  return (
    <Root>
      <ConversationList
        onConversationClick={handleConversationClick}
        onConversationMenuOpen={handleConversationMenuOpen}
        selectedConversationId={selectedConversationId}
      />
      <MainContent>
        <ChatHeader />
        <ChatWindow /> {/* Pass the ID as a prop */}
      </MainContent>
    </Root>
  );
};

export default ChatPage;
