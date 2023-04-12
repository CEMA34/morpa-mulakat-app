import { createStore } from "redux";
import { userInfoReducer } from "./reducers/reducer";

const store = createStore(userInfoReducer);

export default store;
