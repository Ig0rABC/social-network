import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../redux/store";

export type InferActions<T> = T extends { [key: string]: (...args: any[]) => infer U } ? U : never;
export type Thunk<A extends Action, R = Promise<void>> = ThunkAction<R, RootState, unknown, A>;