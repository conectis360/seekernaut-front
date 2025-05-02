import React from "react";
import { TextField, Button, InputAdornment } from "@mui/material";
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
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSendMessage();
    }
  };

  return (
    <TextField
      fullWidth
      label="Digite sua mensagem"
      variant="outlined"
      value={newMessage}
      onChange={onInputChange}
      onKeyDown={handleKeyDown}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              color="primary"
              onClick={onSendMessage}
              disabled={isTyping || !newMessage.trim()}
            >
              <SendIcon />
            </Button>
          </InputAdornment>
        ),
      }}
      disabled={isTyping}
    />
  );
};

export default ChatInput;
