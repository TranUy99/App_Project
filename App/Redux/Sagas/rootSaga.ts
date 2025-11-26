import { all, takeEvery } from "redux-saga/effects";
import { LOG_OUT, POST_LOGIN_PHONE_NUMBER, LOGIN, REGISTER } from "../Actions/authActions";
import { logout, postLoginPhoneNumber, login, register } from "./authSaga";
import { GET_SETTING } from "../Actions/settingAction";
import { getSetting } from "./settingSaga";
import { GET_LATEST_HEARTRATE_REQUEST } from "../Actions/HeartRateActions";
import { getLatestHeartRateSaga } from "./HeartRateSaga";

const rootSaga = function* () {
    yield all([
        //auth
        takeEvery(POST_LOGIN_PHONE_NUMBER, postLoginPhoneNumber),
        takeEvery(LOGIN, login),
        takeEvery(REGISTER, register),
        takeEvery(LOG_OUT, logout),

        //setting
        takeEvery(GET_SETTING, getSetting),

        takeEvery(GET_LATEST_HEARTRATE_REQUEST, getLatestHeartRateSaga),
    ]);
};

export default rootSaga;
