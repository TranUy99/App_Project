import { combineReducers } from "redux";
import authReducer from "./authReducer";
import settingReducer from "./settingReducer";
import errorReducer from "./errorReducer";
import socketReducer from "./socketReducer";
import loadingReducer from "./loadingReducer";

const rootReducer = combineReducers({
    authReducer,
    settingReducer,
    errorReducer,
    socketReducer,
    loadingReducer,
    
});

export default rootReducer;
