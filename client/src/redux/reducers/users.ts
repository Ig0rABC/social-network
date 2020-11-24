import { InferActions } from "../../types/flux";

const initialState = {
  userId: null as number | null,
  login: null as string | null,
  photoUrl: null as string | null
}

export const actions = {
  setUserData: (userId: number, login: string, photoUrl: string) => ({
    type: "users/SET-USER-DATA",
    payload: {
      userId,
      login,
      photoUrl
    }
  } as const)
}

type InitialState = typeof initialState;
type Action = InferActions<typeof actions>;

const usersReducer = (state = initialState, action: Action): InitialState => {
  switch (action.type) {
    case "users/SET-USER-DATA":
      return {
        ...state,
        userId: action.payload.userId,
        login: action.payload.login,
        photoUrl: action.payload.photoUrl
      }
    default:
      return state;
  }
}

export default usersReducer;