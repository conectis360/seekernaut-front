// ChatInput.tsx (Estilizado para se parecer com o input do Gemini)
import React, { useState, useRef, useEffect } from "react";
import { TextField, IconButton, InputAdornment, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  newMessage: string;
  isTyping: boolean;
  onSendMessage: () => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  newMessage,
  isTyping,
  onSendMessage,
  onInputChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Enviar com Enter, mas não com Shift+Enter (para novas linhas)
      event.preventDefault();
      onSendMessage();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

  return (
    <Box
      sx={{
        padding: 2,
        borderTop: "1px solid #383838", // Borda sutil na parte superior
        backgroundColor: "#1b1c1d", // Manter o fundo escuro
        position: "sticky", // Fixar na parte inferior
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10, // Garantir que fique acima das mensagens
        display: "flex",
        alignItems: "center",
        gap: 1, // Espaçamento entre o input e o botão
      }}
    >
      <TextField
        fullWidth
        multiline
        minRows={1}
        maxRows={4} // Limitar a expansão para não ocupar toda a tela
        placeholder="Digite sua mensagem..."
        variant="outlined"
        value={newMessage}
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#2e2e2e", // Fundo mais claro para o input
            color: "#f5f5f5",
            "& fieldset": {
              borderColor: "#5e5e5e", // Borda do input
            },
            "&:hover fieldset": {
              borderColor: "#757575",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#9fa8da", // Cor de foco
            },
          },
        }}
        disabled={isTyping}
      />
      <IconButton
        color="primary"
        onClick={onSendMessage}
        disabled={isTyping || !newMessage.trim()}
        sx={{
          color: "#9fa8da",
          "&:disabled": {
            color: "#5e5e5e",
          },
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default ChatInput;
