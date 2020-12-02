import { Language, Theme } from "../../types/app";
import { Action } from "../actions/app";

const initialState = {
  isInitialized: false,
  theme: "dark" as Theme,
  language: "en" as Language
}

type InitialState = typeof initialState;

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

export default appReducer;