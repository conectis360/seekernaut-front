import React from "react";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Avatar,
  IconButton,
  Tooltip,
  ListItemOwnProps,
} from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/material/styles";

interface ConversationItemProps {
  id: string;
  title: string | null | undefined; // Permitir que title seja null ou undefined
  iconUrl?: string;
  isPinned?: boolean;
  isSelected?: boolean;
  onClick: (id: string) => void;
  onOpenMenu: (id: string) => void;
}

interface ListItemStyledProps extends ListItemOwnProps {
  selected?: boolean;
}

const ConversationItemRoot = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "selected",
})<ListItemStyledProps>(({ theme, selected }) => ({
  backgroundColor: selected ? theme.palette.action.selected : "transparent",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
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
}) => {
  return (
    <ConversationItemRoot disablePadding selected={isSelected}>
      <ListItemButton onClick={() => onClick(id)}>
        <ConversationIconContainer>
          {iconUrl ? (
            <Avatar src={iconUrl} alt={title || "Conversa"} />
          ) : (
            <Avatar>{title ? title.charAt(0) : "?"}</Avatar>
          )}
        </ConversationIconContainer>
        <ListItemText primary={title || "Sem título"} />
        {isPinned && (
          <Tooltip title="Fixado">
            <PushPinIcon color="action" sx={{ mr: 1 }} />
          </Tooltip>
        )}
        <IconButton
          edge="end"
          aria-label="menu"
          onClick={(event) => {
            event.stopPropagation(); // Prevent onClick on the ListItemButton
            onOpenMenu(id);
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </ListItemButton>
    </ConversationItemRoot>
  );
};

export default ConversationItem;
