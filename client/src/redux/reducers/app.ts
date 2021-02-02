import { createReducer } from "@reduxjs/toolkit";
import { Language, Theme } from "../../types/app";
import { setLanguage, setTheme } from "../actions/app";
import { initialize } from "../thunks/app";

const initialState = {
  isInitialized: false,
  theme: "dark" as Theme,
  language: "ru" as Language
}

const appReducer = createReducer(initialState, builder =>
  builder
    .addCase(setLanguage, (state, { payload }) => ({
      ...state,
      language: payload
    }))
    .addCase(setTheme, (state, { payload }) => ({
      ...state,
      theme: payload
    }))
    .addCase(initialize.fulfilled, (state) => ({
      ...state,
      isInitialized: true
    }))
    .addCase(initialize.rejected, (state) => ({
      ...state,
      isInitialized: true
    }))
)

export default appReducer;