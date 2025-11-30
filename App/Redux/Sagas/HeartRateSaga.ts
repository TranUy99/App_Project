import { call, put, takeLatest } from "redux-saga/effects";
import HeartRateService from "../Services/heartRateServices";
import { GET_HISTORICAL_HEARTRATE_FAILURE, GET_HISTORICAL_HEARTRATE_SUCCESS, GET_LATEST_HEARTRATE_FAILURE, GET_LATEST_HEARTRATE_SUCCESS } from "../Actions/HeartRateActions";

const api = new HeartRateService();

type Action = {
    type: string;
    payload: any;
};

export function* getLatestHeartRateSaga(action: Action): any {
    const { payload } = action;
    let result = yield call(api.getLatestHeartRate, payload);
    console.log("getLatestHeartRateSaga", result);
    if (result && result.data) {
        yield put({ type: GET_LATEST_HEARTRATE_SUCCESS, payload: result?.data });
    } else {
        yield put({ type: GET_LATEST_HEARTRATE_FAILURE });
    }
}

export function* getHeartRateHistorySaga(action: Action): any {
    const { payload } = action;
    let result = yield call(api.getHistoricalHeartRate, payload);
    console.log("getHeartRateHistorySaga", result);
    if (result && result.data && result.data.success) {
        yield put({ type: GET_HISTORICAL_HEARTRATE_SUCCESS, payload: result?.data });
    } else {
        yield put({ type: GET_HISTORICAL_HEARTRATE_FAILURE });
    }
}
