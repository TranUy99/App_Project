import { call, put } from "redux-saga/effects";
import AuthService from "../Services/authServices";
import { LOG_OUT_FAILURE, LOG_OUT_SUCCESS, POST_LOGIN_PHONE_NUMBER_FAILURE, POST_LOGIN_PHONE_NUMBER_SUCCESS, LOGIN_SUCCESS, LOGIN_FAILURE, REGISTER_SUCCESS, REGISTER_FAILURE } from "../Actions/authActions";
import { SHOW_LOADING } from "../Actions/loadingAction";
import { ShowAlertFailure, ShowAlertSuccess } from "../../Utils/Alert";

type Action = {
    type: string;
    payload: any;
};
const api = new AuthService();

const DEFAULT_ERROR_MESSAGE = "Đã có lỗi xảy ra vui lòng thử lại sau!";
const VERIFY_SUBMIT = "Xác nhận OTP thành công!";

export function* postLoginPhoneNumber(action: Action): any {
    yield put({ type: SHOW_LOADING, payload: true });
    const { payload } = action;
    let result = yield call(api.postLoginPhoneNumber, payload);
    console.log("postLoginPhoneNumber", result);
    if (result && result.data && result.data.result.isSuccess == true) {
        yield put({ type: SHOW_LOADING, payload: false });
        yield put({ type: POST_LOGIN_PHONE_NUMBER_SUCCESS, payload: result.data.result });
    } else {
        yield put({ type: SHOW_LOADING, payload: false });
        ShowAlertFailure(result?.data?.message || "Tài khoản hoặc mật khẩu không hợp lệ");
        yield put({ type: POST_LOGIN_PHONE_NUMBER_FAILURE });
    }
}
export function* logout(action: Action): any {
    yield put({ type: SHOW_LOADING, payload: true });
    const { payload } = action;
    let result = yield call(api.logout, payload);
    console.log("logout", result);
    if (result && result.data && result.data.result == true) {
        yield put({ type: SHOW_LOADING, payload: false });
        yield put({ type: LOG_OUT_SUCCESS, payload: result.data.result });
    } else {
        yield put({ type: SHOW_LOADING, payload: false });
        ShowAlertFailure(result?.data?.message || DEFAULT_ERROR_MESSAGE);
        yield put({ type: LOG_OUT_FAILURE });
    }
}
export function* login(action: Action): any {
    yield put({ type: SHOW_LOADING, payload: true });
    const { payload } = action;
    let result = yield call(api.login, payload);
    console.log("login", result);
    console.log("result.data.token", result.data.token);
    console.log("error", result.data.error);
    if (result && result.data && result.data.token !== "") {
        yield put({ type: SHOW_LOADING, payload: false });
        yield put({ type: LOGIN_SUCCESS, payload: result.data });
    } else {
        yield put({ type: SHOW_LOADING, payload: false });
        ShowAlertFailure(result?.data?.error || "Invalid email or password");
        yield put({ type: LOGIN_FAILURE });
    }
}
export function* register(action: Action): any {
    yield put({ type: SHOW_LOADING, payload: true });
    const { payload } = action;
    let result = yield call(api.register, payload);
    console.log("register", result);
    if (result && result.data && result.data.error === "") {
        yield put({ type: SHOW_LOADING, payload: false });
        yield put({ type: REGISTER_SUCCESS, payload: result.data.result });
        ShowAlertSuccess("Registration successful!");
    } else {
        yield put({ type: SHOW_LOADING, payload: false });
        ShowAlertFailure(result?.data?.error || "Registration failed");
        yield put({ type: REGISTER_FAILURE });
    }
}
