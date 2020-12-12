import { Thunk } from "../../types/flux";
import actions, { Action } from "../actions/users";
import usersAPI from "../../api/users";
import followAPI from "../../api/follow";
import { UserInfoFormValues } from "../../components/Profile/UserInfo/UserInfoForm";
import { User } from "../../types/models";

export const me = (): Thunk<Action> => async (dispatch) => {
  try {
    const data = await usersAPI.me();
    dispatch(actions.setCurrentUser(data));
  } catch { }
}

export const register = (login: string, password: string): Thunk<Action> => async (dispatch) => {
  try {
    await usersAPI.register(login, password);
    await dispatch(signIn(login, password, false));
  } catch { }
}

export const signIn = (login: string, password: string, rememberMe: boolean): Thunk<Action> => async (dispatch) => {
  try {
    await usersAPI.login(login, password, rememberMe);
    await dispatch(me());
  } catch { }
}

export const logout = (): Thunk<Action> => async (dispatch) => {
  try {
    await usersAPI.logout();
  } catch { }
  dispatch(actions.resetCurrentUser());
}

export const requestUserProfile = (userId: number): Thunk<Action> => async (dispatch) => {
  const data = await usersAPI.getUserProfile(userId);
  dispatch(actions.setSelectedUserProfile(data));
}

export const updateUserProfile = (profile: UserInfoFormValues): Thunk<Action> => async (dispatch) => {
  await usersAPI.updateUserProfile(profile);
  dispatch(actions.updateSelectedUserProfile(profile));
  dispatch(actions.setProfileEditMode(false));
}

export const setIsFollowed = (user: User, isFollowed: boolean): Thunk<Action> => async (dispatch) => {
  dispatch(actions.setFollowingInProgress(true));
  if (isFollowed) {
    await followAPI.follow(user.id);
  } else {
    await followAPI.unfollow(user.id);
  }
  dispatch(actions.setIsFollowed(user, isFollowed));
  dispatch(actions.setFollowingInProgress(false));
}

export const requestFollowings = (): Thunk<Action> => async (dispatch) => {
  dispatch(actions.setFollowingInProgress(true));
  const data = await followAPI.getFolowings();
  dispatch(actions.setFollowings(data.followings));
  dispatch(actions.setFollowingInProgress(false));
}
