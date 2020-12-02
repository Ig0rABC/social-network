import { User, UserProfile } from "../../types/models";
import { InferActions } from "../../types/flux";

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
  } as const)
}

export type Action = InferActions<typeof actions>;

export default actions;