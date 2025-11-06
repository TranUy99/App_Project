import { call, put } from "redux-saga/effects";
import SettingService from "../Services/settingServices";
import { ShowAlertFailure } from "../../Utils/Alert";
import { GET_SETTING_FAILURE, GET_SETTING_SUCCESS } from "../Actions/settingAction";

type Action = {
    type: string;
    payload: any;
};

const api = new SettingService();

const DEFAULT_ERROR_MESSAGE = "Đã có lỗi xảy ra vui lòng thử lại sau!";

export function* getSetting(action: Action): any {
    const { payload } = action;
    let result = yield call(api.getSetting, payload);
    console.log("getSetting", result);
    if (result && result?.data && result.data.settings) {
        yield put({
            type: GET_SETTING_SUCCESS,
            payload: result.data?.settings
        });
    } else {
        ShowAlertFailure(result?.data?.message || DEFAULT_ERROR_MESSAGE);
        yield put({ type: GET_SETTING_FAILURE });
    }
}
