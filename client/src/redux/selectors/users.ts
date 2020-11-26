import { RootState } from "../store";

export const selectUserId = (state: RootState) => {
  return state.users.currentUser.id;
}

export const selectLogin = (state: RootState) => {
  return state.users.currentUser.login;
}

export const selectPhotoUrl = (state: RootState) => {
  return state.users.currentUser.photoUrl;
}