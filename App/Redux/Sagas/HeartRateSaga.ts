import { call, put, takeLatest } from "redux-saga/effects";
import HeartRateService from "../Services/heartRateServices";
import { GET_LATEST_HEARTRATE_FAILURE, GET_LATEST_HEARTRATE_SUCCESS } from "../Actions/HeartRateActions";

const api = new HeartRateService();

type Action = {
    type: string;
    payload: any;
};
// function* getLatestHeartRateSaga(action: any): Generator<any, void, any> {
//     try {
//         const response = yield call(api.getToken, "/api/heartrate/latest", {}, action.token);

//         console.log("Heart Rate API Response:", response);

//         if (response.ok && response.data) {
//             yield put(getLatestHeartRateSuccess(response.data));
//         } else {
//             yield put(getLatestHeartRateFailure(response.problem || "Unknown error"));
//         }
//     } catch (error) {
//         yield put(getLatestHeartRateFailure(error));
//     }
// }

// export default function* heartRateSaga() {
//     yield takeLatest(GET_LATEST_HEARTRATE_REQUEST, getLatestHeartRateSaga);
// }

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
