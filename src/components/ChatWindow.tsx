import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BackendMessage {
  messageId: number;
  senderType: "user" | "assistant";
  content: string;
  sentAt: string;
  conversation: {
    conversationId: string;
    startedAt: string;
    title: string;
    user: {
      id: number;
      email: string;
      nome: string;
      foto: string | null;
      usuario: string;
      accountNonLocked: boolean;
      tipoUsuario: { id: number; tipoUsuario: "USER" }[];
    };
  };
}

interface ChatMessage {
  sender: "user" | "bot";
  content: string;
  sentAtFormatted?: string;
}

const ChatWindow: React.FC = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/v1/ollama/conversations/${conversationId}/chat`
        );
        if (response.ok) {
          const data: BackendMessage[] = await response.json();
          setMessages(
            data.map((msg) => ({
              sender: msg.senderType === "user" ? "user" : "bot",
              content: msg.content,
              sentAtFormatted: format(
                new Date(msg.sentAt),
                "dd/MM/yyyy HH:mm",
                { locale: ptBR }
              ), // Formata a data
            }))
          );
        } else {
          console.error("Erro ao carregar o histórico:", response.status);
          // Exibir mensagem de erro ao usuário
        }
      } catch (error) {
        console.error(
          "Erro ao comunicar com o backend para o histórico:",
          error
        );
        // Exibir mensagem de erro ao usuário
      }
    };

    loadHistory();
  }, [conversationId]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const userMessage: ChatMessage = { sender: "user", content: newMessage };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage("");
      setIsTyping(true);

      try {
        const response = await fetch(`/conversations/${conversationId}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: newMessage }],
          }),
        });

        if (
          response.ok &&
          response.headers.get("Content-Type")?.includes("text/event-stream")
        ) {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder("utf-8");
          let partialResponse = "";
          let accumulatedContent = ""; // Para reconstruir a mensagem do bot

          while (true) {
            const { done, value } = await reader!.read();
            if (done) {
              break;
            }
            partialResponse += decoder.decode(value);
            // Processar cada evento da stream (assumindo que cada evento é uma parte da resposta)
            try {
              const parsed = JSON.parse(partialResponse);
              if (parsed?.message?.content) {
                accumulatedContent += parsed.message.content;
                // Atualiza a última mensagem do bot com o conteúdo parcial
                setMessages((prevMessages) => {
                  const lastMessage = prevMessages[prevMessages.length - 1];
                  if (lastMessage?.sender === "bot") {
                    return [
                      ...prevMessages.slice(0, -1),
                      { ...lastMessage, content: accumulatedContent },
                    ];
                  } else {
                    return [
                      ...prevMessages,
                      { sender: "bot", content: accumulatedContent },
                    ];
                  }
                });
              }
              partialResponse = ""; // Reset para o próximo evento
            } catch (error) {
              // Pode haver eventos incompletos, então ignoramos o erro de parsing por enquanto
              console.warn(
                "Evento da stream não completamente parseável:",
                partialResponse,
                error
              );
            }
          }
          setIsTyping(false);
        } else if (response.ok) {
          const data = await response.json();
          const botMessage: ChatMessage = {
            sender: "bot",
            content: data.choices[0]?.message?.content || "Resposta do bot",
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
          setIsTyping(false);
        } else {
          console.error("Erro ao enviar mensagem:", response.status);
          setIsTyping(false);
          // Exibir mensagem de erro ao usuário
        }
      } catch (error) {
        console.error("Erro ao comunicar com o backend:", error);
        setIsTyping(false);
        // Exibir mensagem de erro ao usuário
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)",
        padding: 2,
      }}
    >
      <Box ref={chatAreaRef} sx={{ flexGrow: 1, overflowY: "auto", mb: 2 }}>
        <List>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent:
                  message.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <ListItemText
                primary={message.content}
                secondary={
                  message.sender === "user"
                    ? `Você ${
                        message.sentAtFormatted
                          ? `em ${message.sentAtFormatted}`
                          : ""
                      }`
                    : `SeekerNaut ${
                        message.sentAtFormatted
                          ? `em ${message.sentAtFormatted}`
                          : ""
                      }`
                }
                sx={{
                  backgroundColor:
                    message.sender === "user" ? "#e0f7fa" : "#f5f5f5",
                  padding: 1.5,
                  borderRadius: "8px",
                  maxWidth: "70%",
                  wordBreak: "break-word",
                }}
              />
            </ListItem>
          ))}
          {isTyping && (
            <ListItem sx={{ justifyContent: "flex-start" }}>
              <CircularProgress size={24} />
            </ListItem>
          )}
        </List>
      </Box>

      <TextField
        fullWidth
        label="Digite sua mensagem"
        variant="outlined"
        value={newMessage}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                color="primary"
                onClick={handleSendMessage}
                disabled={isTyping || !newMessage.trim()}
              >
                <SendIcon />
              </Button>
            </InputAdornment>
          ),
        }}
        disabled={isTyping}
      />
    </Box>
  );
};

export default ChatWindow;
