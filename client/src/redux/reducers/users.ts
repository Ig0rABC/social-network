import { Action } from "../actions/users";
import { User } from "../../types/models";
import { getObjectWithoutNullProps } from "../../utils";

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
    followersCount: null as number | null,
  },
  followings: [] as User[]
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
    case "users/SET-IS-FOLLOWED":
      return {
        ...state,
        selectedUserProfile: {
          ...state.selectedUserProfile,
          followersCount: action.payload.isFollowed
            ? state.selectedUserProfile.followersCount as number + 1
            : state.selectedUserProfile.followersCount as number - 1
        },
        followings: action.payload.isFollowed
          ? [...state.followings, action.payload.user]
          : state.followings.filter(user => user.id !== action.payload.user.id)
      }
    case "users/SET-PROFILE-EDIT-MODE":
      return {
        ...state,
        profileEditMode: action.payload
      }
    case "users/SET-FOLLOWINGS":
      return {
        ...state,
        followings: action.payload
      }
    default:
      return state;
  }
}

export default usersReducer;
