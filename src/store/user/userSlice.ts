import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Usuario } from "../types"; // Ajuste o caminho conforme a sua estrutura

interface UserState {
  user: Usuario | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUserProfileStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchUserProfileSuccess(state, action: PayloadAction<Usuario>) {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    },
    fetchUserProfileFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
    },
    // Você pode adicionar mais reducers aqui para outras ações relacionadas ao usuário
  },
});

export const {
  fetchUserProfileStart,
  fetchUserProfileSuccess,
  fetchUserProfileFailure,
} = userSlice.actions;

export default userSlice.reducer;
