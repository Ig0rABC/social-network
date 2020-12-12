import { User, UserProfile } from "../../types/models";
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
  setSelectedUserProfile: (userProfile: UserProfile) => ({
    type: "users/SET-SELECTED-USER-PROFILE",
    payload: userProfile
  } as const),
  updateSelectedUserProfile: (userProfile: UserInfoFormValues) => ({
    type: "users/UPDATE-SELECTED-USER-PROFILE",
    payload: userProfile
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