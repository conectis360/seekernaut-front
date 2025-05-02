// ChatMessageDisplay.tsx
import React from "react";
import { ListItem, Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import * as styles from "./ChatMessageDisplay.styles";

interface ChatMessageProps {
  message: {
    sender: "user" | "bot";
    content: string;
    sentAtFormatted?: string;
  };
  isCentered?: boolean;
}

interface CustomCodeProps {
  node?: any; // Tipo mais seguro seria 'Element' do 'hast', mas 'any' funciona se não quiser instalar/importar
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any; // Permite outras props (como 'key' passada pelo ReactMarkdown)
}

// --- Componente Renderizador de Código Melhorado ---
const markdownComponents: object = {
  code: ({ node, inline, className, children, ...props }: CustomCodeProps) => {
    if (inline) {
      // Código inline: renderiza dentro de uma tag <code> simples.
      // Adiciona um estilo leve para diferenciar do texto normal.
      return (
        <code
          className={className}
          style={{
            backgroundColor: "rgba(175, 184, 193, 0.2)", // Fundo sutil
            padding: "0.2em 0.4em",
            margin: "0",
            fontSize: "85%",
            borderRadius: "3px",
            fontFamily: "'JetBrains Mono', monospace", // Usa a fonte mono também para inline
          }}
          {...props}
        >
          {children}
        </code>
      );
    }

    // Bloco de código: usa SyntaxHighlighter
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "text"; // Assume 'text' se nenhuma linguagem for especificada

    // Extrai o conteúdo do código. String(children) geralmente funciona bem com react-markdown.
    // .replace(/\n$/, '') remove uma possível quebra de linha extra no final.
    const codeString = String(children).replace(/\n$/, "");

    return (
      <SyntaxHighlighter
        style={atomOneDark} // **PASSE O ESTILO IMPORTADO AQUI** (atomOneDark ou outro)
        language={language}
        PreTag="pre" // **USA <pre> PARA SEMÂNTICA CORRETA**
        {...props}
      >
        {codeString}
      </SyntaxHighlighter>
    );
  },
};

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

  return (
    <ListItem sx={listItemSx} disablePadding>
      <Box sx={isUser ? styles.userMessageStyle : styles.botMessageStyle}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {message.content}
        </ReactMarkdown>
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
