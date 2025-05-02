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

interface Message {
  sender: "user" | "bot";
  content: string;
}

const ChatWindow: React.FC = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false); // Para o indicador de "digitando..."
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lógica para carregar o histórico de mensagens da conversa (se houver)
    console.log("Carregando histórico para a conversa:", conversationId);
    // Você faria uma chamada ao backend aqui para buscar as mensagens existentes
  }, [conversationId]);

  useEffect(() => {
    // Rola a área de chat para a última mensagem sempre que novas mensagens são adicionadas
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const userMessage: Message = { sender: "user", content: newMessage };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage("");
      setIsTyping(true);

      // Enviar a mensagem para o backend
      try {
        const response = await fetch(`/conversations/${conversationId}/chat`, {
          // Ajuste a URL conforme sua API
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: newMessage }],
          }), // Adapte o formato do body
        });

        if (
          response.ok &&
          response.headers.get("Content-Type")?.includes("text/event-stream")
        ) {
          // Lidar com streaming de resposta
          const reader = response.body?.getReader();
          const decoder = new TextDecoder("utf-8");
          let partialResponse = "";

          while (true) {
            const { done, value } = await reader!.read();
            if (done) {
              break;
            }
            partialResponse += decoder.decode(value);
            // Processar e exibir a resposta parcial (você precisará formatar isso)
            console.log("Resposta parcial:", partialResponse);
            // Atualizar o estado das mensagens com a resposta parcial
            const botMessage: Message = {
              sender: "bot",
              content: partialResponse,
            }; // Simplificado
            setMessages((prevMessages) => [...prevMessages, botMessage]); // Isso precisará ser refinado para streams
          }
          setIsTyping(false);
        } else if (response.ok) {
          // Lidar com resposta completa (não streaming)
          const data = await response.json();
          const botMessage: Message = {
            sender: "bot",
            content: data.choices[0]?.message?.content || "Resposta do bot",
          }; // Adapte conforme a estrutura da sua resposta
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
                secondary={message.sender === "user" ? "Você" : "SeekerNaut"}
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
