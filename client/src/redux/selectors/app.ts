import { RootState } from "../store";

export const selectIsInitizialied = (state: RootState) => {
  return state.app.isInitialized;
}

export const selectLanguage = (state: RootState) => {
  return state.app.language;
}

export const selectTheme = (state: RootState) => {
  return state.app.theme;
}