import { Profile, User } from "../../types/models";
import { getObjectWithoutNullProps } from "../../utils";
import { createReducer } from "@reduxjs/toolkit";
import { fetchCurrentUser, fetchFollowings, fetchProfile, setIsFollowed, signOut, updateProfile } from "../thunks/users";
import { setProfileEditMode } from "../actions/users";

const initialState = {
  pendingFollowing: false,
  pendingProfile: false,
  profileEditMode: false,
  currentUser: null as User | null,
  profile: null as Profile | null,
  followings: [] as User[]
}

const usersReducer = createReducer(initialState, builder =>
  builder
    .addCase(fetchCurrentUser.fulfilled, (state, { payload }) => ({
      ...state,
      currentUser: payload
    }))
    .addCase(signOut.fulfilled, (state) => ({
      ...state,
      currentUser: initialState.currentUser
    }))
    .addCase(fetchProfile.fulfilled, (state, { payload }) => ({
      ...state,
      profile: payload
    }))
    .addCase(updateProfile.fulfilled, (state, { payload }) => ({
      ...state,
      profileEditMode: false,
      profile: {
        ...state.profile,
        ...getObjectWithoutNullProps(payload)
      }
    }))
    .addCase(setIsFollowed.pending, (state) => ({
      ...state,
      pendingFollowing: true
    }))
    .addCase(setIsFollowed.fulfilled, (state, { payload }) => ({
      ...state,
      pendingFollowing: false,
      profile: state.profile && {
        ...state.profile,
        followersCount: payload.isFollowed
          ? state.profile.followersCount as number + 1
          : state.profile.followersCount as number - 1
      },
      followings: payload.isFollowed
        ? [...state.followings, payload.user]
        : state.followings.filter(user => user.id !== payload.user.id)
    }))
    .addCase(setProfileEditMode, (state, { payload }) => ({
      ...state,
      profileEditMode: payload
    }))
    .addCase(fetchFollowings.fulfilled, (state, { payload }) => ({
      ...state,
      followings: payload
    }))
);

export default usersReducer;