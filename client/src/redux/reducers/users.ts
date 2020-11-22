const initialState = {
  userId: null as number | null,
  login: null as string | null,
  photoUrl: null as string | null
}

type InitialState = typeof initialState;

export default (state = initialState, action: any): InitialState => {
  switch (action.type) {
    default:
      return state;
  }
}