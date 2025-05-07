import React, { useState, useRef } from "react"; // Importe useState e useRef
import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Avatar,
  IconButton,
  Tooltip,
  ListItemOwnProps,
  Menu, // Importe Menu
  MenuItem, // Importe MenuItem
} from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled, Theme } from "@mui/material/styles"; // Importe Theme

interface ConversationItemProps {
  id: string;
  title: string | null | undefined;
  iconUrl?: string;
  isPinned?: boolean;
  isSelected?: boolean;
  onClick: (id: string) => void;
  onOpenMenu: (id: string) => void;
  onPinConversation?: (id: string) => void; // Handlers para as ações do menu (opcional)
  onEditTitleConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
}

interface ListItemStyledProps extends ListItemOwnProps {
  selected?: boolean;
}

const ConversationItemRoot = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "selected",
})<ListItemStyledProps>(({ theme, selected }) => ({
  backgroundColor: selected ? "#52565a" : "transparent",
  "&:hover": {
    backgroundColor: "#424649",
  },
  borderRadius: theme.shape.borderRadius,
}));

const ConversationIconContainer = styled(ListItemIcon)(({ theme }) => ({
  minWidth: "auto",
  marginRight: theme.spacing(1),
}));

const ConversationItem: React.FC<ConversationItemProps> = ({
  id,
  title,
  iconUrl,
  isPinned,
  isSelected,
  onClick,
  onOpenMenu,
  onPinConversation,
  onEditTitleConversation,
  onDeleteConversation,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Estado para a âncora do menu
  const open = Boolean(anchorEl); // Estado para controlar se o menu está aberto

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Impede que o onClick do ListItemButton seja acionado
    setAnchorEl(event.currentTarget);
    onOpenMenu(id); // Chama a função pai para indicar que o menu foi aberto (se necessário)
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePinClick = () => {
    handleClose();
    if (onPinConversation) {
      onPinConversation(id);
    }
  };

  const handleEditClick = () => {
    handleClose();
    if (onEditTitleConversation) {
      onEditTitleConversation(id);
    }
  };

  const handleDeleteClick = () => {
    handleClose();
    if (onDeleteConversation) {
      onDeleteConversation(id);
    }
  };

  return (
    <ConversationItemRoot disablePadding selected={isSelected}>
      <ListItemButton
        onClick={() => onClick(id)}
        sx={(theme: Theme) => ({
          paddingY: 0.1,
          borderRadius: theme.shape.borderRadius,
        })}
      >
        <ListItemText primary={title || "Sem título"} />
        {isPinned && (
          <Tooltip title="Fixado">
            <PushPinIcon color="action" sx={{ mr: 1 }} />
          </Tooltip>
        )}
        <IconButton
          edge="end"
          aria-label="menu"
          onClick={handleClick} // Abre o menu ao clicar
          sx={(theme: Theme) => ({ borderRadius: theme.shape.borderRadius })}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu // Componente Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuItem onClick={handlePinClick}>
            {isPinned ? "Desfixar" : "Fixar"}
          </MenuItem>
          <MenuItem onClick={handleEditClick}>Editar Título</MenuItem>
          <MenuItem onClick={handleDeleteClick}>Excluir Conversa</MenuItem>
        </Menu>
      </ListItemButton>
    </ConversationItemRoot>
  );
};

export default ConversationItem;
