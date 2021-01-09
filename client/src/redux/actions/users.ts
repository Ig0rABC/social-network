import { User, Profile } from "../../types/models";
import { InferActions } from "../../types/flux";
import { UserInfoFormValues } from "../../components/Profile/UserInfo/UserInfoForm";

const actions = {
  setCurrentUser: (currentUser: User) => ({
    type: "users/SET-CURRENT-USER",
    payload: currentUser
  } as const),
  resetCurrentUser: () => ({
    type: "users/RESET-CURRENT-USER"
  } as const),
  setSelectedProfile: (profile: Profile) => ({
    type: "users/SET-SELECTED-PROFILE",
    payload: profile
  } as const),
  updateSelectedProfile: (profile: UserInfoFormValues) => ({
    type: "users/UPDATE-SELECTED-PROFILE",
    payload: profile
  } as const),
  setFollowingInProgress: (isFetching: boolean) => ({
    type: "users/SET-FOLLOWING-IN-PROGRESS",
    payload: isFetching
  } as const),
  setIsFollowed: (user: User, isFollowed: boolean) => ({
    type: "users/SET-IS-FOLLOWED",
    payload: {
      user,
      isFollowed
    }
  } as const),
  setProfileEditMode: (editMode: boolean) => ({
    type: "users/SET-PROFILE-EDIT-MODE",
    payload: editMode
  } as const),
  setFollowings: (followings: User[]) => ({
    type: "users/SET-FOLLOWINGS",
    payload: followings
  } as const)
}

export type Action = InferActions<typeof actions>;

export default actions;