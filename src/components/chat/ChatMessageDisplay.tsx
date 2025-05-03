// ChatMessageDisplay.tsx
import React from "react";
import { ListItem, Box, Typography, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import * as styles from "./ChatMessageDisplay.styles";
import MessageContent from "./MessageContent";

interface ChatMessageProps {
  message: {
    sender: "user" | "bot";
    content: string;
    sentAtFormatted?: string;
  };
  isCentered?: boolean;
}

interface CustomCodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const ChatMessageDisplay: React.FC<ChatMessageProps> = ({
  message,
  // isCentered,
}) => {
  const isUser = message.sender === "user";

  const listItemSx = {
    ...styles.listItemStyle,
    alignItems: isUser ? "flex-end" : "flex-start",
  };

  const typographySx = {
    ...styles.typographyStyle,
    fontFamily: isUser ? "inherit" : "'JetBrains Mono', monospace",
    paddingRight: isUser ? "8px" : "0",
    paddingLeft: !isUser ? "8px" : "0",
  };

  const markdownComponents: object = {
    code: ({
      node,
      inline,
      className,
      children,
      ...props
    }: CustomCodeProps) => {
      if (inline) {
        return (
          <code className={className} style={styles.inlineCodeStyle} {...props}>
            {children}
          </code>
        );
      }

      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "text";
      const codeString = String(children).replace(/\n$/, "");

      return (
        <div style={styles.codeWindow}>
          <div style={styles.codeWindowBar}>
            <Typography variant="caption" color="white">
              {language.toUpperCase()}
            </Typography>
            <IconButton
              aria-label="copiar código"
              size="small"
              onClick={() => navigator.clipboard.writeText(codeString)}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(173, 216, 230, 0.1)", // Um azul claro com baixa opacidade
                },
              }}
            >
              <ContentCopyIcon fontSize="inherit" />
            </IconButton>
          </div>
          <SyntaxHighlighter
            style={atomOneDark}
            language={language}
            PreTag="pre"
            {...props}
            className="code-block" // Adicionando uma classe para estilização mais específica se necessário
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      );
    },
  };

  return (
    <ListItem sx={listItemSx} disablePadding>
      <Box sx={isUser ? styles.userMessageStyle : styles.botMessageStyle}>
        <MessageContent
          content={message.content}
          components={markdownComponents}
        />
      </Box>
      <Typography variant="caption" color="inherit" sx={typographySx}>
        {message.sender === "user"
          ? `Você ${
              message.sentAtFormatted ? `em ${message.sentAtFormatted}` : ""
            }`
          : `SeekerNaut ${
              message.sentAtFormatted ? `em ${message.sentAtFormatted}` : ""
            }`}
      </Typography>
    </ListItem>
  );
};

export default ChatMessageDisplay;
