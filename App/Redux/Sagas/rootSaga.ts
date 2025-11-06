import { all, takeEvery } from "redux-saga/effects";
import { LOG_OUT, POST_LOGIN_PHONE_NUMBER } from "../Actions/authActions";
import { logout, postLoginPhoneNumber } from "./authSaga";
import { GET_SETTING } from "../Actions/settingAction";
import { getSetting } from "./settingSaga";

const rootSaga = function* () {
    yield all([
        //auth
        takeEvery(POST_LOGIN_PHONE_NUMBER, postLoginPhoneNumber),
        takeEvery(LOG_OUT, logout),

        //setting
        takeEvery(GET_SETTING, getSetting),
    ]);
};

export default rootSaga;
