import { combineReducers } from "redux";
import authReducer from "./authReducer";
import settingReducer from "./settingReducer";
import errorReducer from "./errorReducer";
import socketReducer from "./socketReducer";
import loadingReducer from "./loadingReducer";
import heartRateReducer from "./heartRateReducer";

const rootReducer = combineReducers({
    authReducer,
    settingReducer,
    errorReducer,
    socketReducer,
    loadingReducer,
    heartRateReducer,
});

export default rootReducer;
