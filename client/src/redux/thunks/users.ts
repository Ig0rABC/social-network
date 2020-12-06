import { Thunk } from "../../types/flux";
import actions, { Action } from "../actions/users";
import usersAPI from "../../api/users";
import followAPI from "../../api/follow";

export const me = (): Thunk<Action> => async (dispatch) => {
  try {
    const data = await usersAPI.me();
    dispatch(actions.setCurrentUser(data));
  } catch {}
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

export const toggleIsFollowed = (userId: number, isFollowed: boolean): Thunk<Action> => async (dispatch) => {
  dispatch(actions.setFollowingInProgress(true));
  if (isFollowed) {
    await followAPI.unfollow(userId);
  } else {
    await followAPI.follow(userId);
  }
  dispatch(actions.toggleFollow(userId));
  dispatch(actions.setFollowingInProgress(true));
}