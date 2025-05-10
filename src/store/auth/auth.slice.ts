import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import authService from "../../services/auth.service";
import { User } from "../types"; // Criaremos este arquivo de tipos

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
  user: null,
  token: localStorage.getItem("accessToken"), // Inicializa o token do localStorage
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
      return { user: data, token: data.accessToken }; // Assumindo que a API retorna accessToken
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Removendo o createAsyncThunk para logout. A lógica será no serviço.
// export const logoutAsync = createAsyncThunk("auth/logout", () => {
//   authService.logout();
// });

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
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
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      )
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        state.token = null;
      });
    // Removendo o caso para logoutAsync.fulfilled
    // .addCase(logoutAsync.fulfilled, (state) => {
    //   state.isAuthenticated = false;
    //   state.user = null;
    //   state.token = null;
    // });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
