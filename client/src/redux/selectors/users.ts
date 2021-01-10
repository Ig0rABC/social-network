import { RootState } from "../store";

export const selectCurrentUser = (state: RootState) => {
  return state.users.currentUser;
}

export const selectIsAuthorized = (state: RootState) => {
  return state.users.currentUser !== null;
}

export const selectProfile = (state: RootState) => {
  return state.users.profile;
}

export const selectPendingFollowing = (state: RootState) => {
  return state.users.pendingFollowing;
}

export const selectProfileEditMode = (state: RootState) => {
  return state.users.profileEditMode;
}

export const selectFollowings = (state: RootState) => {
  return state.users.followings;
}

export const selectIsFollowedOnSelectedUser = (state: RootState) => {
  const profile = selectProfile(state);
  const followings = selectFollowings(state);
  return followings
    .map(user => user.id)
    .includes(profile?.userId as number);
}