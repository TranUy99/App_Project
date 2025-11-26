import { GET_LATEST_HEARTRATE_REQUEST, GET_LATEST_HEARTRATE_SUCCESS, GET_LATEST_HEARTRATE_FAILURE } from "../Actions/HeartRateActions";

interface HeartRateState {
    loading: boolean;
    latestData: any;
    error: any;
}

const initialState: HeartRateState = {
    loading: false,
    latestData: null,
    error: null,
};

const heartRateReducer = (state = initialState, { type, payload }: any) => {
    switch (type) {
        case GET_LATEST_HEARTRATE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_LATEST_HEARTRATE_SUCCESS:
            return {
                ...state,
                loading: false,
                latestData: payload?.data,
                error: null,
            };
        case GET_LATEST_HEARTRATE_FAILURE:
            return {
                ...state,
                loading: false,
                error: payload?.data,
            };
        default:
            return state;
    }
};

export default heartRateReducer;
