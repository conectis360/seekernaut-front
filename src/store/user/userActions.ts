import { AppDispatch } from "../store"; // Importe AppDispatch
import axios from "axios";
import {
  fetchUserProfileStart,
  fetchUserProfileSuccess,
  fetchUserProfileFailure,
} from "./userSlice";
import { Usuario } from "../types";

const USER_PROFILE_API_URL = "/api/users/me";

// Action assíncrona para buscar o perfil do usuário
export const fetchUserProfile = () => {
  return async (dispatch: AppDispatch) => {
    // Use AppDispatch aqui
    dispatch(fetchUserProfileStart()); // Dispatch da action de início da busca

    try {
      const response = await axios.get<Usuario>(USER_PROFILE_API_URL);
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
