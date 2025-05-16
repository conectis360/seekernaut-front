import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import authService from "../../services/auth.service";
import { User } from "../types"; // Criaremos este arquivo de tipos
import axios from "axios"; // Import axios

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: User | null;
  accessToken: string | null; // Renomeado para accessToken
  refreshToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
  user: null,
  accessToken: localStorage.getItem("accessToken"), // Renomeado para accessToken
  refreshToken: localStorage.getItem("refreshToken"),
};

interface Credentials {
  username: string;
  password: string;
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }: Credentials, thunkAPI) => {
    try {
      const data = await authService.login(username, password);
      return {
        user: data,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }; // Assumindo que a API retorna accessToken e refreshToken
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Thunk para buscar dados com refresh token
export const fetchWithRefresh = createAsyncThunk(
  "api/fetchWithRefresh",
  async (url: string, { getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      const accessToken = state.auth.accessToken;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Se o access token expirar, busca um novo
        try {
          await dispatch(refreshAccessToken());
          // Tenta a requisição novamente com o novo token
          const state = getState() as RootState;
          const newAccessToken = state.auth.accessToken;
          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${newAccessToken}` },
          });
          return response.data;
        } catch (refreshError) {
          // Se o refresh falhar, repassar o erro original
          throw error;
        }
      }
      throw error;
    }
  }
);

// Thunk para obter um novo access token
export const refreshAccessToken = createAsyncThunk(
  "auth/refresh",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    try {
      const response = await axios.post("/api/token/refresh", { refreshToken });
      dispatch(
        setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
      ); // Atualiza ambos os tokens
      return response.data;
    } catch (error) {
      // Se o refresh falhar, desloga o usuário
      dispatch(clearTokens());
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      // Nova action para atualizar ambos os tokens
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{
            user: User;
            accessToken: string;
            refreshToken: string;
          }>
        ) => {
          // Atualizado para receber refreshToken
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken; // Salva o refreshToken
        }
      )
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        state.accessToken = null;
        state.refreshToken = null;
      });
  },
});

export const { setTokens, logout, clearTokens } = authSlice.actions; // Removido loginSuccess, não é mais necessário
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
