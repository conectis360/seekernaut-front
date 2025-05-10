// src/store/auth/authActions.ts

import { ActionCreator, Action } from "redux";

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";

export interface LogoutRequestAction extends Action {
  type: typeof LOGOUT_REQUEST;
}

export interface LogoutSuccessAction extends Action {
  type: typeof LOGOUT_SUCCESS;
}

export interface LogoutFailureAction extends Action {
  type: typeof LOGOUT_FAILURE;
  payload: string; // Mensagem de erro (opcional)
}

export const logoutRequest: ActionCreator<LogoutRequestAction> = () => ({
  type: LOGOUT_REQUEST,
});

export const logoutSuccess: ActionCreator<LogoutSuccessAction> = () => ({
  type: LOGOUT_SUCCESS,
});

export const logoutFailure: ActionCreator<LogoutFailureAction> = (
  error: string
) => ({
  type: LOGOUT_FAILURE,
  payload: error,
});

export type AuthActions =
  | LogoutRequestAction
  | LogoutSuccessAction
  | LogoutFailureAction;
