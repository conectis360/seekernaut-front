import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import authService from "../../services/auth.service";
import { User } from "../types"; // Criaremos este arquivo de tipos

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: User | null; // Alterei para User
  token: string | null; // Adicionei o token ao estado
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
  token: null, // Inicializei o token
};

interface Credentials {
  username: string;
  password: string;
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }: Credentials, thunkAPI) => {
    // Add type annotation
    try {
      const data = await authService.login(username, password);
      return { user: data, token: data.token }; // Retorne o token
    } catch (error: any) {
      const message =
        error.response?.data?.message || // Optional chaining syntax
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logoutAsync = createAsyncThunk("auth/logout", () => {
  // Renomeei para evitar conflito
  authService.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Adicionei os reducers loginSuccess e logout
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.user = action.payload.user;
      state.token = action.payload.token; // Armazene o token
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null; // Limpe o token
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          // Atualizei o tipo da action
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token; // Armazene o token
        }
      )
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        state.token = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        // Usei o nome renomeado
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions; // Exporte as actions diretamente do slice
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
