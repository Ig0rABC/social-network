import { RootState } from "../store";

export const selectUserId = (state: RootState) => {
  return state.users.userId;
}

export const selectLogin = (state: RootState) => {
  return state.users.login;
}

export const selectPhotoUrl = (state: RootState) => {
  return state.users.photoUrl;
}