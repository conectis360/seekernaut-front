import axios from "axios";

const API_URL = "/api/auth/"; // Sua URL base da API de autenticação

const authService = {
  login: (email: string, password: string) => {
    return axios
      .post(API_URL + "login", { email, password })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  },

  logout: () => {
    localStorage.removeItem("user");
  },

  register: (username: string, email: string, password: string) => {
    return axios.post(API_URL + "register", {
      username,
      email,
      password,
    });
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user") || "{}");
  },
};

export default authService;
