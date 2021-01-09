import { RootState } from "../store";

export const selectCurrentUser = (state: RootState) => {
  return state.users.currentUser;
}

export const selectIsAuthorized = (state: RootState) => {
  return state.users.isAuthorized;
}

export const selectSelectedProfile = (state: RootState) => {
  return state.users.selectedProfile;
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
  const selectedProfile = selectSelectedProfile(state);
  const followings = selectFollowings(state);
  return followings
    .map(user => user.id)
    .includes(selectedProfile.userId as number);
}