// import { Language, Theme } from "../../types/app";
// import { InferActions } from "../../types/flux";

import { createAction, PrepareAction } from "@reduxjs/toolkit";
import { Language, Theme } from "../../types/app";

export const setLanguage = createAction<PrepareAction<Language>, "app/SET-LANGUAGE">("app/SET-LANGUAGE", language => ({
  payload: language
}));

export const setTheme = createAction<PrepareAction<Theme>, "app/SET-THEME">("app/SET-THEME", theme => ({
  payload: theme
}));