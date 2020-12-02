import { Thunk } from "../../types/flux";
import actions, { Action } from "../actions/app";
import { me } from "./users";

export const initialize = (): Thunk<Action> => async (dispatch) => {
  await dispatch(me());
  dispatch(actions.setIsInitialized(true));
}