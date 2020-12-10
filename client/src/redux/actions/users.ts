import { User, UserProfile } from "../../types/models";
import { InferActions } from "../../types/flux";
import { ProfileInfoFormValues } from "../../components/Profile/ProfileInfo/ProfileInfoForm";

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
  updateSelectedUserProfile: (userProfile: ProfileInfoFormValues) => ({
    type: "users/UPDATE-SELECTED-USER-PROFILE",
    payload: userProfile
  } as const),
  setFollowingInProgress: (isFetching: boolean) => ({
  type: "users/SET-FOLLOWING-IN-PROGRESS",
  payload: isFetching
} as const),
  toggleFollow: (userId: number) => ({
    type: "users/TOGGLE-IS-FOLLOWED",
    payload: userId
  } as const),
    setProfileEditMode: (editMode: boolean) => ({
      type: "users/SET-RPOFILE-EDIT-MODE",
      payload: editMode
    } as const)
}

export type Action = InferActions<typeof actions>;

export default actions;