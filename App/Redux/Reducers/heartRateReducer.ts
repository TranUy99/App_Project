import { GET_LATEST_HEARTRATE_REQUEST, GET_LATEST_HEARTRATE_SUCCESS, GET_LATEST_HEARTRATE_FAILURE, GET_HISTORICAL_HEARTRATE_FAILURE, GET_HISTORICAL_HEARTRATE_SUCCESS, GET_HISTORICAL_HEARTRATE_REQUEST, HEARTRATE_ANALYZE_FAILURE, HEARTRATE_ANALYZE_SUCCESS, HEARTRATE_ANALYZE_REQUEST, GET_HEARTRATE_TREND_REQUEST, GET_HEARTRATE_TREND_SUCCESS, GET_HEARTRATE_TREND_FAILURE } from "../Actions/HeartRateActions";

interface HeartRateState {
    loading: boolean; // Computed from individual loadings (backward compatible)
    latestLoading: boolean;
    historicalLoading: boolean;
    analyzeLoading: boolean;
    trendLoading: boolean;
    latestData: any;
    error: any;
    historicalData?: any;
    analyzeData?: any;
    trendData?: any;
}

const initialState: HeartRateState = {
    loading: false,
    latestLoading: false,
    historicalLoading: false,
    analyzeLoading: false,
    trendLoading: false,
    latestData: null,
    error: null,
    historicalData: null,
    analyzeData: null,
    trendData: null,
};

// Helper to compute overall loading state
const computeLoading = (state: HeartRateState, updates: Partial<HeartRateState>): boolean => {
    const latestLoading = updates.latestLoading ?? state.latestLoading;
    const historicalLoading = updates.historicalLoading ?? state.historicalLoading;
    const analyzeLoading = updates.analyzeLoading ?? state.analyzeLoading;
    const trendLoading = updates.trendLoading ?? state.trendLoading;
    return latestLoading || historicalLoading || analyzeLoading || trendLoading;
};

const heartRateReducer = (state = initialState, { type, payload }: any) => {
    switch (type) {
        case GET_LATEST_HEARTRATE_REQUEST: {
            const updates = { latestLoading: true, error: null };
            return {
                ...state,
                ...updates,
                loading: computeLoading(state, updates),
            };
        }
        case GET_LATEST_HEARTRATE_SUCCESS: {
            const updates = { latestLoading: false, latestData: payload?.data, error: null };
            return {
                ...state,
                ...updates,
                loading: computeLoading(state, updates),
            };
        }
        case GET_LATEST_HEARTRATE_FAILURE: {
            const updates = { latestLoading: false, error: payload?.data };
            return {
                ...state,
                ...updates,
                loading: computeLoading(state, updates),
            };
        }

        case GET_HISTORICAL_HEARTRATE_REQUEST: {
            const updates = { historicalLoading: true, error: null };
            return {
                ...state,
                ...updates,
                loading: computeLoading(state, updates),
            };
        }
        case GET_HISTORICAL_HEARTRATE_SUCCESS: {
            console.log("payload in reducer", payload);
            const updates = { historicalLoading: false, historicalData: payload, error: null };
            return {
                ...state,
                ...updates,
                loading: computeLoading(state, updates),
            };
        }
        case GET_HISTORICAL_HEARTRATE_FAILURE: {
            const updates = { historicalLoading: false, error: payload?.data };
            return {
                ...state,
                ...updates,
                loading: computeLoading(state, updates),
            };
        }

        case HEARTRATE_ANALYZE_REQUEST: {
            const updates = { analyzeLoading: true, error: null };
            return {
                ...state,
                ...updates,
                loading: computeLoading(state, updates),
            };
        }
        case HEARTRATE_ANALYZE_SUCCESS: {
            const updates = { analyzeLoading: false, analyzeData: payload, error: null };
            return {
                ...state,
                ...updates,
                loading: computeLoading(state, updates),
            };
        }
        case HEARTRATE_ANALYZE_FAILURE: {
            const updates = { analyzeLoading: false, error: payload?.data };
            return {
                ...state,
                ...updates,
                loading: computeLoading(state, updates),
            };
        }

        case GET_HEARTRATE_TREND_REQUEST: {
            const updates = { trendLoading: true, error: null };
            return {
                ...state,
                ...updates,
                loading: computeLoading(state, updates),
            };
        }
        case GET_HEARTRATE_TREND_SUCCESS: {
            const updates = { trendLoading: false, trendData: payload, error: null };
            return {
                ...state,
                ...updates,
                loading: computeLoading(state, updates),
            };
        }
        case GET_HEARTRATE_TREND_FAILURE: {
            const updates = { trendLoading: false, error: payload?.data };
            return {
                ...state,
                ...updates,
                loading: computeLoading(state, updates),
            };
        }

        default:
            return state;
    }
};

export default heartRateReducer;
