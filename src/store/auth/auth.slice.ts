import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import authService from "../../services/auth.service";
import { User } from "../types"; // Criaremos este arquivo de tipos

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: null | {
    /* your user type */
  };
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  user: null,
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
