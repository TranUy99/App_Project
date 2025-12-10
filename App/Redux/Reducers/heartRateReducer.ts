import { GET_LATEST_HEARTRATE_REQUEST, GET_LATEST_HEARTRATE_SUCCESS, GET_LATEST_HEARTRATE_FAILURE, GET_HISTORICAL_HEARTRATE_FAILURE, GET_HISTORICAL_HEARTRATE_SUCCESS, GET_HISTORICAL_HEARTRATE_REQUEST, HEARTRATE_ANALYZE_FAILURE, HEARTRATE_ANALYZE_SUCCESS, HEARTRATE_ANALYZE_REQUEST, GET_HEARTRATE_TREND_REQUEST, GET_HEARTRATE_TREND_SUCCESS, GET_HEARTRATE_TREND_FAILURE } from "../Actions/HeartRateActions";

interface HeartRateState {
    loading: boolean;
    latestData: any;
    error: any;
    historicalData?: any;
    analyzeData?: any;
    trendData?: any;
}

const initialState: HeartRateState = {
    loading: false,
    latestData: null,
    error: null,
    historicalData: null,
    analyzeData: null,
    trendData: null,
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

        case GET_HISTORICAL_HEARTRATE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_HISTORICAL_HEARTRATE_SUCCESS:
            console.log("payload in reducer", payload);
            return {
                ...state,
                loading: false,
                historicalData: payload,
                error: null,
            };
        case GET_HISTORICAL_HEARTRATE_FAILURE:
            return {
                ...state,
                loading: false,
                error: payload?.data,
            };

        case HEARTRATE_ANALYZE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case HEARTRATE_ANALYZE_SUCCESS:
            return {
                ...state,
                loading: false,
                analyzeData: payload,
                error: null,
            };
        case HEARTRATE_ANALYZE_FAILURE:
            return {
                ...state,
                loading: false,
                error: payload?.data,
            };

        case GET_HEARTRATE_TREND_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_HEARTRATE_TREND_SUCCESS:
            return {
                ...state,
                loading: false,
                trendData: payload,
                error: null,
            };
        case GET_HEARTRATE_TREND_FAILURE:
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
