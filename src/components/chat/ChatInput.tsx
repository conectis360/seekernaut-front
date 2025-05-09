import React, { useState, useRef, useEffect, useCallback } from "react";
import { TextField, IconButton, Box, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";

interface ChatInputProps {
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  onAddAttachment?: (files: FileList | null) => void; // Prop opcional para lidar com anexos
}

const ChatInput: React.FC<ChatInputProps> = ({
  isTyping,
  onSendMessage,
  onAddAttachment,
}) => {
  const [localMessage, setLocalMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref para o input de arquivo (oculto)

  const handleLocalInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalMessage(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Manter o comportamento de nova linha com Shift+Enter
    if (event.key === "Enter" && !event.shiftKey && localMessage.trim()) {
      event.preventDefault();
      onSendMessage(localMessage.trim());
      setLocalMessage("");
    }
  };

  const handleSendMessageClick = () => {
    if (localMessage.trim()) {
      onSendMessage(localMessage.trim());
      setLocalMessage("");
    }
  };

  const handleAddAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Simula o clique no input de arquivo oculto
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onAddAttachment) {
      onAddAttachment(event.target.files);
      // Limpar o valor do input para permitir o envio do mesmo arquivo novamente
      if (event.target.value) {
        event.target.value = "";
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [localMessage]);

  return (
    <Box
      sx={{
        padding: 2,
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
      {onAddAttachment && (
        <IconButton
          color="default"
          onClick={handleAddAttachmentClick}
          sx={{ color: "#f5f5f5" }}
          aria-label="adicionar anexo"
        >
          <AttachFileIcon />
        </IconButton>
      )}
      <TextField
        fullWidth
        multiline
        minRows={1}
        maxRows={4}
        placeholder="Digite sua mensagem..."
        variant="outlined"
        value={localMessage}
        onChange={handleLocalInputChange}
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
        onClick={handleSendMessageClick}
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
      {/* Input de arquivo oculto */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        multiple // Permite selecionar múltiplos arquivos
      />
    </Box>
  );
};

export default ChatInput;
