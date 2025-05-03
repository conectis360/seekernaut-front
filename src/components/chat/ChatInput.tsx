import React, { useState, useRef, useEffect, useCallback } from "react";
import { TextField, IconButton, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatInputProps {
  isTyping: boolean;
  onSendMessage: (message: string) => void; // Agora espera receber a mensagem
}

const ChatInput: React.FC<ChatInputProps> = ({ isTyping, onSendMessage }) => {
  const [localMessage, setLocalMessage] = useState(""); // Estado local para o input
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLocalInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalMessage(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey && localMessage.trim()) {
      event.preventDefault();
      onSendMessage(localMessage.trim()); // Envia o valor local para o pai
      setLocalMessage(""); // Limpa o input localmente
    }
  };

  const handleSendMessageClick = () => {
    if (localMessage.trim()) {
      onSendMessage(localMessage.trim()); // Envia o valor local para o pai
      setLocalMessage(""); // Limpa o input localmente
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [localMessage]); // Agora depende do estado local

  return (
    <Box
      sx={{
        padding: 2,
        borderTop: "1px solid #383838",
        backgroundColor: "#1b1c1d",
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <TextField
        fullWidth
        multiline
        minRows={1}
        maxRows={4}
        placeholder="Digite sua mensagem..."
        variant="outlined"
        value={localMessage} // Usa o estado local
        onChange={handleLocalInputChange} // Usa o handler local
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#2e2e2e",
            color: "#f5f5f5",
            "& fieldset": {
              borderColor: "#5e5e5e",
            },
            "&:hover fieldset": {
              borderColor: "#757575",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#9fa8da",
            },
          },
        }}
        disabled={isTyping}
      />
      <IconButton
        color="primary"
        onClick={handleSendMessageClick} // Usa o handler local para enviar
        disabled={isTyping || !localMessage.trim()}
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
