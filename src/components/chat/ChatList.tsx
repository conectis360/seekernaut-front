// ChatList.tsx (sem alterações significativas na estrutura)
import React, { useRef, useEffect } from "react";
import { Box, List, CircularProgress, ListItem } from "@mui/material";
import ChatMessageDisplay from "./ChatMessageDisplay";

interface ChatListProps {
  messages: {
    sender: "user" | "bot";
    content: string;
    sentAtFormatted?: string;
  }[];
  isTyping: boolean;
  chatAreaRef: React.RefObject<HTMLDivElement | null>;
}

const ChatList: React.FC<ChatListProps> = ({
  messages,
  isTyping,
  chatAreaRef,
}) => {
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, chatAreaRef]);

  return (
    <Box
      ref={chatAreaRef}
      sx={{
        flexGrow: 1, // Ocupa o espaço vertical disponível no ChatWindow
        overflowY: "auto", // Adiciona a barra de rolagem
        padding: 2,
      }}
    >
      {" "}
      {/* Adicionando um pequeno padding para as mensagens */}
      <List>
        {messages.map((message, index) => (
          <ChatMessageDisplay
            key={index}
            message={message}
            isCentered={message.sender === "bot"}
          />
        ))}
        {isTyping && (
          <ListItem sx={{ justifyContent: "flex-start" }}>
            <CircularProgress size={24} color="inherit" />{" "}
            {/* Usando color="inherit" para o spinner */}
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default ChatList;
