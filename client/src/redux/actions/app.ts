import { Language, Theme } from "../../types/app";
import { InferActions } from "../../types/flux";

const actions = {
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

export type Action = InferActions<typeof actions>;

export default actions;