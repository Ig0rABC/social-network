import { Thunk } from "../../types/flux";
import actions, { Action } from "../actions/app";
import { requestCurrentUser } from "./users";

export const initialize = (): Thunk<Action> => async (dispatch) => {
  await dispatch(requestCurrentUser());
  dispatch(actions.setIsInitialized(true));
}