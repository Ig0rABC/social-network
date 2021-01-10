import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "./users";

export const initialize = createAsyncThunk(
  "app/INITIALIZE",
  async (_, { dispatch }) => {;
    dispatch(fetchCurrentUser());
  }
)