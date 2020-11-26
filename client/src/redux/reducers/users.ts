import { InferActions } from "../../types/flux";
import { User } from "../../types/models";

const initialState = {
  isAuthorized: false,
  currentUser: {
    id: null as number | null,
    login: null as string | null,
    photoUrl: null as string | null
  }
}

export const actions = {
  setCurrentUser: (currentUser: User) => ({
    type: "users/SET-CURRENT-USER",
    payload: currentUser
  } as const),
  resetCurrentUser: () => ({
    type: "users/RESET-CURRENT-USER"
  } as const)
}

type InitialState = typeof initialState;
type Action = InferActions<typeof actions>;

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
    default:
      return state;
  }
}

export default usersReducer;