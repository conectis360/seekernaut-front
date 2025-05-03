import React from "react";
import { Box } from "@mui/material";
import ChatHeader from "../components/chat/ChatHeader";
import ConversationList from "../components/chat/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";
import { styled } from "@mui/material/styles";

const Root = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100vh", // Ocupar a altura total da tela
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
}));

const ChatPage: React.FC = () => {
  return (
    <Root>
      <ConversationList />
      <MainContent>
        <ChatHeader />
        <ChatWindow />
      </MainContent>
    </Root>
  );
};

export default ChatPage;
