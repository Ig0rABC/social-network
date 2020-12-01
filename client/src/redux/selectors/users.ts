import { RootState } from "../store";

export const selectCurrentUser = (state: RootState) => {
  return state.users.currentUser;
}

export const selectIsAuthorized = (state: RootState) => {
  return state.users.isAuthorized;
}

export const selectSelectedUserProfile = (state: RootState) => {
  return state.users.selectedUserProfile;
}