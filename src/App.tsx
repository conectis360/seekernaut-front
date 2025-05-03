import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage"; // Importe o componente HomePage
import ChatWindow from "./components/chat/ChatWindow"; // Importe o componente ChatWindow
import Login from "./components/Login"; // Importe o componente ChatWindow
import Dashboard from "./components/chat/Dashboard";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota para a página inicial */}
        <Route path="/" element={<HomePage />} />
        {/* Rota para a página inicial */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />{" "}
        <Route path="/chat/*" element={<ChatPage />} />{" "}
        {/* Rota para o Dashboard e suas sub-rotas */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />{" "}
        {/* Redirecionar raiz para o dashboard */}
        {/* Rota para a janela de chat, com um parâmetro para o ID da conversa */}
        <Route path="/chat/:conversationId" element={<ChatPage />} />{" "}
        {/* Também renderiza o layout para um chat específico */}
        {/* Você pode adicionar mais rotas aqui, se necessário */}
      </Routes>
    </Router>
  );
}

export default App;
