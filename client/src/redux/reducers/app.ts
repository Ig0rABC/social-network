import { Language, Theme } from "../../types/app";
import { InferActions, Thunk } from "../../types/flux";
import { me } from "./users";

const initialState = {
  isInitialized: false,
  theme: "dark" as Theme,
  language: "en" as Language
}

type InitialState = typeof initialState;
type Action = InferActions<typeof actions>;

export const actions = {
  setIsInitialized: (isInitialized: boolean) => ({
    type: "app/SET-IS-INITIALIZED",
    payload: isInitialized
  } as const),
  switchLanguage: (language: Language) => ({
    type: "app/SWITCH-LANGUAGE",
    payload: language
  } as const),
  switchTheme: (theme: Theme) => ({
    type: "app/SWITCH-THEME",
    payload: theme
  } as const)
}

const appReducer = (state = initialState, action: Action): InitialState => {
  switch (action.type) {
    case "app/SET-IS-INITIALIZED":
      return {
        ...state,
        isInitialized: action.payload
      }
    case "app/SWITCH-LANGUAGE":
      return {
        ...state,
        language: action.payload
      }
    case "app/SWITCH-THEME":
      return {
        ...state,
        theme: action.payload
      }
    default:
      return state;
  }
}

export const initialize = (): Thunk<Action> => async (dispatch) => {
  await dispatch(me());
  dispatch(actions.setIsInitialized(true));
}

export default appReducer;