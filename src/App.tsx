import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"; // Importe o componente HomePage
import ChatWindow from "./components/ChatWindow"; // Importe o componente ChatWindow

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota para a página inicial */}
        <Route path="/" element={<HomePage />} />

        {/* Rota para a janela de chat, com um parâmetro para o ID da conversa */}
        <Route path="/chat/:conversationId" element={<ChatWindow />} />

        {/* Você pode adicionar mais rotas aqui, se necessário */}
      </Routes>
    </Router>
  );
}

export default App;
