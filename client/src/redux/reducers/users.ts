import { getObjectWithoutNullProps } from "../../utils";
import { Action } from "../actions/users";

const initialState = {
  isAuthorized: false,
  followingInProgress: false,
  profileEditMode: false,
  currentUser: {
    id: null as number | null,
    login: null as string | null,
    photoUrl: null as string | null
  },
  selectedUserProfile: {
    id: null as number | null,
    login: null as string | null,
    photoUrl: null as string | null,
    firstName: null as string | null,
    lastName: null as string | null,
    contacts: {
      github: null as string | null,
      telegram: null as string | null,
      email: null as string | null,
      vk: null as string | null,
      facebook: null as string | null,
      twitter: null as string | null,
      instagram: null as string | null,
      phoneNumber: null as string | null
    },
    about: null as string | null,
    isFollowed: false
  }
}

type InitialState = typeof initialState;

const usersReducer = (state = initialState, action: Action): InitialState => {
  switch (action.type) {
    case "users/SET-CURRENT-USER":
      return {
        ...state,
        isAuthorized: true,
        currentUser: action.payload
      }
    case "users/RESET-CURRENT-USER":
      return {
        ...state,
        isAuthorized: false,
        currentUser: initialState.currentUser
      }
    case "users/SET-SELECTED-USER-PROFILE":
      return {
        ...state,
        selectedUserProfile: action.payload as typeof initialState.selectedUserProfile
      }
    case "users/UPDATE-SELECTED-USER-PROFILE":
      return {
        ...state,
        selectedUserProfile: {
          ...state.selectedUserProfile,
          ...getObjectWithoutNullProps(action.payload)
        }
      }
    case "users/SET-FOLLOWING-IN-PROGRESS":
      return {
        ...state,
        followingInProgress: action.payload
      }
    case "users/TOGGLE-IS-FOLLOWED":
      return {
        ...state,
        selectedUserProfile: {
          ...state.selectedUserProfile,
          isFollowed: !state.selectedUserProfile.isFollowed
        }
      }
    case "users/SET-RPOFILE-EDIT-MODE":
      return {
        ...state,
        profileEditMode: action.payload
      }
    default:
      return state;
  }
}

export default usersReducer;
