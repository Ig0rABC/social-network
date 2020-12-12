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

export const selectFollowingInProgress = (state: RootState) => {
  return state.users.followingInProgress;
}

export const selectProfileEditMode = (state: RootState) => {
  return state.users.profileEditMode;
}

export const selectFollowings = (state: RootState) => {
  return state.users.followings;
}

export const selectIsFollowedOnSelectedUser = (state: RootState) => {
  const selectedUserProfile = selectSelectedUserProfile(state);
  const followings = selectFollowings(state);
  return !!followings.find(user => user.id === selectedUserProfile.id);
}