import { Action } from "../actions/users";

const initialState = {
  isAuthorized: false,
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
      email: null as string | null,
      github: null as string | null,
      telegram: null as string | null,
      instagram: null as string | null,
      vk: null as string | null
    }
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
        selectedUserProfile: action.payload
      }
    default:
      return state;
  }
}

export default usersReducer;
