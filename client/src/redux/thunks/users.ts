import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../types/models";
import { UserInfoFormValues } from "../../components/Profile/UserInfo/UserInfoForm";
import usersAPI from "../../api/users";
import followAPI from "../../api/follow";

export const fetchCurrentUser = createAsyncThunk(
  "users/FETCH-CURRENT-USER",
  async () => {
    return await usersAPI.me();
  }
)

export const register = createAsyncThunk(
  "users/REGISTER",
  async ({ login, password }: { login: string, password: string }, { dispatch }) => {
    await usersAPI.register(login, password);
    dispatch(signIn({ login, password, rememberMe: false }));
  }
)

export const signIn = createAsyncThunk(
  "users/SIGN-IN",
  async ({ login, password, rememberMe }: { login: string, password: string, rememberMe: boolean }) => {
    await usersAPI.login(login, password, rememberMe);
    return await usersAPI.me();
  }
)

export const signOut = createAsyncThunk(
  "users/SIGN-OUT",
  async () => {
    await usersAPI.logout();
  }
)

export const fetchProfile = createAsyncThunk(
  "users/FETCH-PROFILE",
  async (userId: number) => {
    return await usersAPI.getProfile(userId);
  }
)

export const updateProfile = createAsyncThunk(
  "users/UPDATE-PROFILE",
  async (profile: UserInfoFormValues) => {
    await usersAPI.updateProfile(profile);
  }
)

export const setIsFollowed = createAsyncThunk(
  "users/SET-IS-FOLLOWED",
  async ({ user, isFollowed }: { user: User, isFollowed: boolean }) => {
    if (isFollowed) {
      await followAPI.follow(user.id);
    } else {
      await followAPI.unfollow(user.id);
    }
    return { user, isFollowed };
  }
)

export const fetchFollowings = createAsyncThunk(
  "users/FETCH-FOLLOWINGS",
  async () => {
    return await followAPI.getFolowings();
  }
)