// Dashboard.tsx (ou o componente que renderiza ChatWindow)
import React from "react";
import { Box, Typography } from "@mui/material";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { Routes, Route } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100vh" }}>
      <ConversationList />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route path="/chat/:conversationId" element={<ChatWindow />} />
          <Route
            path="/chat"
            element={
              <Typography variant="h6" sx={{ padding: 2, color: "#f5f5f5" }}>
                Selecione uma conversa ou inicie uma nova.
              </Typography>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;
