import { RootState } from "../store";

export const selectLanguage = (state: RootState) => {
  return state.app.language;
}

export const selectTheme = (state: RootState) => {
  return state.app.theme;
}