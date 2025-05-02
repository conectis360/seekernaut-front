import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { apiFetch } from "../../utils/api";
import ChatList from "./ChatList";
import ChatInput from "./ChatInput";

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
  const { conversationId: initialConversationId } = useParams();
  const [conversationId, setConversationId] = useState<string | null>(
    initialConversationId ? initialConversationId : null
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      if (conversationId) {
        try {
          const data: BackendMessage[] | null = await apiFetch(
            `/ollama/conversations/${conversationId}/chat`
          );
          if (data) {
            setMessages(
              data.map((msg) => ({
                sender: msg.senderType === "user" ? "user" : "bot",
                content: msg.content,
                sentAtFormatted: format(
                  new Date(msg.sentAt),
                  "dd/MM/yyyy HH:mm",
                  { locale: ptBR }
                ),
              }))
            );
          } else {
            console.error("Erro ao carregar o histórico: Resposta vazia");
          }
        } catch (error: any) {
          console.error(
            "Erro ao comunicar com o backend para o histórico:",
            error
          );
        }
      }
    };

    loadHistory();
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && conversationId) {
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
          let accumulatedContent = "";

          while (true) {
            const { done, value } = await reader!.read();
            if (done) {
              break;
            }
            partialResponse += decoder.decode(value);
            try {
              const parsed = JSON.parse(partialResponse);
              if (parsed?.message?.content) {
                accumulatedContent += parsed.message.content;
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
              partialResponse = "";
            } catch (error) {
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
        }
      } catch (error) {
        console.error("Erro ao comunicar com o backend:", error);
        setIsTyping(false);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
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
      <ChatList
        messages={messages}
        isTyping={isTyping}
        chatAreaRef={chatAreaRef}
      />
      <ChatInput
        newMessage={newMessage}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        onInputChange={handleInputChange}
      />
    </Box>
  );
};

export default ChatWindow;
