import { call, put, takeLatest } from "redux-saga/effects";
import HeartRateService from "../Services/heartRateServices";
import { GET_HISTORICAL_HEARTRATE_FAILURE, GET_HISTORICAL_HEARTRATE_SUCCESS, GET_LATEST_HEARTRATE_FAILURE, GET_LATEST_HEARTRATE_SUCCESS, HEARTRATE_ANALYZE_FAILURE, HEARTRATE_ANALYZE_SUCCESS, GET_HEARTRATE_TREND_SUCCESS, GET_HEARTRATE_TREND_FAILURE } from "../Actions/HeartRateActions";

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

export function* analyzeHeartRateSaga(action: Action): any {
    const { payload } = action;
    let result = yield call(api.analyzeHeartRate, payload);
    console.log("analyzeHeartRateSaga", result);
    if (result && result.data && result.data.success) {
        yield put({ type: HEARTRATE_ANALYZE_SUCCESS, payload: result?.data });
    } else {
        yield put({ type: HEARTRATE_ANALYZE_FAILURE });
    }
}

export function* getHeartRateTrendSaga(action: Action): any {
    const { payload } = action;
    let result = yield call(api.getHeartRateTrend, payload);
    console.log("getHeartRateTrendSaga", result);
    if (result && result.data && result.data.success) {
        yield put({ type: GET_HEARTRATE_TREND_SUCCESS, payload: result?.data });
    } else {
        yield put({ type: GET_HEARTRATE_TREND_FAILURE });
    }
}
