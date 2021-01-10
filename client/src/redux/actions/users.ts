import { createAction, PrepareAction } from "@reduxjs/toolkit";

export const setProfileEditMode = createAction<PrepareAction<boolean>, "users/SET-PROFILE-EDIT-MODE">("users/SET-PROFILE-EDIT-MODE", editMode => ({
  payload: editMode
}));