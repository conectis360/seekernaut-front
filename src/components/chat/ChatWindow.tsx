import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Box, styled } from "@mui/material";
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

const ChatWindowContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1, // Ocupa o espaço restante na MainContent
  height: "100%", // Ocupa toda a altura disponível na MainContent
  overflow: "hidden", // Impede que cresça além da altura da MainContent
}));

const ChatListContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1, // A lista de mensagens cresce para ocupar o espaço disponível
  overflowY: "auto", // Adiciona barra de rolagem vertical
  backgroundColor: "#1b1c1d",
}));

const ChatWindow: React.FC = () => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
      } else {
        // Lógica para quando não há conversationId na URL (ex: tela inicial do chat?)
        setMessages([]); // Limpa as mensagens
      }
    };

    loadHistory();
  }, [conversationId]); // Executa novamente quando conversationId muda

  const handleSendMessage = useCallback(
    async (messageToSend: string) => {
      if (messageToSend.trim() && conversationId) {
        const userMessage: ChatMessage = {
          sender: "user",
          content: messageToSend,
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setIsTyping(true);

        try {
          const response = await fetch(
            `/conversations/${conversationId}/chat`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messages: [{ role: "user", content: messageToSend }],
              }),
            }
          );

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
    },
    [conversationId, setMessages, setIsTyping]
  );

  return (
    <ChatWindowContainer>
      <ChatListContainer ref={chatAreaRef}>
        <ChatList
          messages={messages}
          isTyping={isTyping}
          chatAreaRef={chatAreaRef}
        />
      </ChatListContainer>
      <ChatInput isTyping={isTyping} onSendMessage={handleSendMessage} />
    </ChatWindowContainer>
  );
};

export default ChatWindow;
