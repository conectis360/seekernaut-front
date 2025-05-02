import { CSSProperties } from "@mui/material/styles";

export const userMessageStyle: CSSProperties = {
  backgroundColor: "#4a148c", // Roxo escuro
  color: "#f5f5f5", // Texto claro
  padding: "10px 16px",
  borderRadius: "20px",
  maxWidth: "70%",
  wordBreak: "break-word",
  margin: "8px",
  marginLeft: "auto", // Alinha à direita
  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
};

export const botMessageStyle: CSSProperties = {
  color: "#e0e0e0", // Cor de texto para o bot
  backgroundColor: "#333", // Fundo escuro para o bot para diferenciar
  padding: "10px 16px", // Ajustado padding
  borderRadius: "20px", // Bordas arredondadas também para o bot
  maxWidth: "80%",
  wordBreak: "break-word",
  margin: "8px", // Margem consistente
  marginRight: "auto", // Alinha à esquerda
  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  fontFamily: "'JetBrains Mono', monospace", // Aplicado aqui se todo o conteúdo do bot deve usar esta fonte
};

export const listItemStyle: CSSProperties = {
  padding: "0 16px",
  display: "flex", // Necessário para marginLeft/Right auto funcionar
  flexDirection: "column", // Empilha a mensagem e a data/hora
  alignItems: "flex-start", // Alinhamento padrão (será sobrescrito condicionalmente)
};

export const typographyStyle: CSSProperties = {
  marginTop: "4px",
  display: "block",
  color: "#9e9e9e",
  fontSize: "0.8em",
  fontFamily: "inherit", // Padrão, será sobrescrito condicionalmente
  paddingRight: 0,
  paddingLeft: 0,
};

export const inlineCodeStyle: CSSProperties = {
  backgroundColor: "rgba(175, 184, 193, 0.2)", // Fundo sutil
  padding: "0.2em 0.4em",
  margin: "0",
  fontSize: "85%",
  borderRadius: "3px",
  fontFamily: "'JetBrains Mono', monospace", // Usa a fonte mono também para inline
};
