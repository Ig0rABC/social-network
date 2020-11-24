import { Language, Theme } from "../../types/app";
import { InferActions } from "../../types/flux";

const initialState = {
  theme: "dark" as Theme,
  language: "en" as Language
}

type InitialState = typeof initialState;
type Action = InferActions<typeof actions>;

export const actions = {
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

export default appReducer;