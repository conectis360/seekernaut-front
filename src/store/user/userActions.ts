import { AppDispatch } from "../store"; // Importe AppDispatch
import axios from "axios";
import {
  fetchUserProfileStart,
  fetchUserProfileSuccess,
  fetchUserProfileFailure,
} from "./userSlice";
import { Usuario } from "../types";

const userId = localStorage.getItem("userId");
const USER_PROFILE_API_URL = `http://localhost:9000/v1/user/${userId}`;

// Action assíncrona para buscar o perfil do usuário
export const fetchUserProfile = () => {
  return async (dispatch: AppDispatch) => {
    // Use AppDispatch aqui
    dispatch(fetchUserProfileStart()); // Dispatch da action de início da busca

    const token = localStorage.getItem("accessToken"); // Recupere o token

    try {
      const response = await axios.get<Usuario>(USER_PROFILE_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // Adicione o header de autorização
        },
      });
      dispatch(fetchUserProfileSuccess(response.data)); // Dispatch da action de sucesso com os dados recebidos
    } catch (error: any) {
      dispatch(
        fetchUserProfileFailure(
          error.message || "Erro ao buscar perfil do usuário."
        )
      ); // Dispatch da action de falha com a mensagem de erro
    }
  };
};
