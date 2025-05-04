import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./components/authorization/Login";
import ChatPage from "./pages/ChatPage";
import PrivateRoute from "./components/authorization/PrivateRoute";
import { Provider } from "react-redux"; // Importe o Provider
import store from "./store/store"; // Importe a sua store Redux

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem("authToken") !== null;
  };

  return (
    <Provider store={store}>
      {" "}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/chat/*"
            element={
              <PrivateRoute path="/chat/*" isAuthenticated={isAuthenticated()}>
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat/:conversationId"
            element={
              <PrivateRoute
                path="/chat/:conversationId"
                isAuthenticated={isAuthenticated()}
              >
                <ChatPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
