import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import AttachmentIcon from "@mui/icons-material/Attachment"; // Ícone padrão para anexos no menu
import AttachmentButton from "./AttachmentButton"; // Importe o componente abstrato

interface ChatInputProps {
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  onAddAttachment?: (files: FileList | null) => void;
  // onAddFromCloud?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  isTyping,
  onSendMessage,
  onAddAttachment /* , onAddFromCloud */,
}) => {
  const [localMessage, setLocalMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleLocalInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLocalMessage(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAttachLocal = (files: FileList | null) => {
    if (onAddAttachment) {
      onAddAttachment(files);
    }
    handleCloseMenu();
  };

  // const handleAttachCloud = () => {
  //     if (onAddFromCloud) {
  //         onAddFromCloud();
  //     }
  //     handleCloseMenu();
  // };

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
      <IconButton
        color="default"
        onClick={handleOpenMenu}
        sx={{ color: "#f5f5f5" }}
        aria-label="adicionar opções"
      >
        <AddIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        PaperProps={{
          style: {
            backgroundColor: "#2e2e2e",
            color: "#f5f5f5",
            maxWidth: 200,
          },
        }}
      >
        {onAddAttachment && (
          <MenuItem disableRipple>
            {" "}
            <AttachmentButton
              onChange={handleAttachLocal}
              ariaLabel="Inserir Arquivos"
            />
          </MenuItem>
        )}
      </Menu>
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
    </Box>
  );
};

export default ChatInput;
