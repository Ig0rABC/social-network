type Theme = "light" | "dark";
type Language = "en" | "ru";

const initialState = {
  theme: "dark" as Theme,
  language: "ru" as Language
}

type InitialState = typeof initialState;

export default (state = initialState, action: any): InitialState => {
  switch (action.type) {
    default:
      return state;
  }
}