import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importe Navigate
import HomePage from "./pages/HomePage";
import Login from "./components/authorization/Login";
import ChatPage from "./pages/ChatPage";
import PrivateRoute from "./components/authorization/PrivateRoute";
import { Provider } from "react-redux"; // Importe useSelector
import store from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/chat/*"
            element={
              <PrivateRoute path="/chat/*">
                <ChatPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat/:conversationId"
            element={
              <PrivateRoute path="/chat/:conversationId">
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
