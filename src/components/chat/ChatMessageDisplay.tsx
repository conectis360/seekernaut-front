import React from "react";
import { ListItem, ListItemText } from "@mui/material";

interface ChatMessageProps {
  message: {
    sender: "user" | "bot";
    content: string;
    sentAtFormatted?: string;
  };
}

const ChatMessageDisplay: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <ListItem
      sx={{
        justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
      }}
    >
      <ListItemText
        primary={message.content}
        secondary={
          message.sender === "user"
            ? `Você ${
                message.sentAtFormatted ? `em ${message.sentAtFormatted}` : ""
              }`
            : `SeekerNaut ${
                message.sentAtFormatted ? `em ${message.sentAtFormatted}` : ""
              }`
        }
        sx={{
          backgroundColor: message.sender === "user" ? "#e0f7fa" : "#f5f5f5",
          padding: 1.5,
          borderRadius: "8px",
          maxWidth: "70%",
          wordBreak: "break-word",
        }}
      />
    </ListItem>
  );
};

export default ChatMessageDisplay;
