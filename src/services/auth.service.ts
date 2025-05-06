import axios from "axios";

const API_URL = "http://localhost:9000/v1";

const authService = {
  login: (username: string, password: string) => {
    return axios
      .post(API_URL + "/auth/login", { username, password })
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("userId", response.data.id);
          localStorage.setItem("nome", response.data.nome);
          localStorage.setItem("email", response.data.email);
          localStorage.setItem("username", response.data.username);
        }
        return response.data;
      });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("nome");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
  },

  register: (username: string, email: string, password: string) => {
    return axios.post(API_URL + "register", {
      username,
      email,
      password,
    });
  },

  getCurrentUser: () => {
    return localStorage.getItem("userId") || null;
  },
};

export default authService;
