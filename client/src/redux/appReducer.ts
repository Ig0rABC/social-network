type Theme = "light" | "dark";

const initialState = {
  theme: "dark" as Theme
}

type InitialState = typeof initialState;

export default (state = initialState, action: any): InitialState => {
  switch (action.type) {
    default:
      return state;
  }
}