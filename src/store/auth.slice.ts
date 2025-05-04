import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import authService from "../services/auth.service";
import { User } from "./types"; // Criaremos este arquivo de tipos

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "{}"),
  isAuthenticated: !!localStorage.getItem("user"),
  loading: false,
  error: null,
};

interface Credentials {
  email: string;
  password: string;
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: Credentials, thunkAPI) => {
    // Add type annotation
    try {
      const data = await authService.login(email, password);
      return { user: data };
    } catch (error: any) {
      const message =
        error.response?.data?.message || // Optional chaining syntax
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", () => {
  authService.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Não precisamos de reducers para login/logout, pois createAsyncThunk gera automaticamente
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: User }>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
        }
      )
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
