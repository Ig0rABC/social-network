import { combineReducers, applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import appReducer from "./reducers/app";
import publicReducer from "./reducers/public";
import usersReducer from "./reducers/users";

const rootReducer = combineReducers({
  app: appReducer,
  users: usersReducer,
  public: publicReducer
});

type RootReducer = typeof rootReducer;
export type RootState = ReturnType<RootReducer>;

const middlewares = [thunkMiddleware];
export default createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));