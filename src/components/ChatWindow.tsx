import React from "react";
import { useParams } from "react-router-dom";

const ChatWindow: React.FC = () => {
  const { conversationId } = useParams();

  return (
    <div>
      <h1>Chat com a Conversa: {conversationId}</h1>
      {/* Área de mensagens e input do usuário aqui */}
    </div>
  );
};

export default ChatWindow;
