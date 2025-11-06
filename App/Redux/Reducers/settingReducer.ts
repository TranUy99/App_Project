import { CHANGE_STATUS_GET_SETTING, GET_SETTING, GET_SETTING_FAILURE, GET_SETTING_SUCCESS } from "../Actions/settingAction";

interface initData {
    dataSettings: any,
};
const initData: initData = {
    dataSettings: null,
}

const settingReducer = (state = initData, { type, payload }: any) => {
    switch (type) {
        // get setting
        case GET_SETTING:
            return {
                ...state,
                isGetDataSetting: true,
            };
        case GET_SETTING_SUCCESS:
            return {
                ...state,
                dataSettings: payload
            };
        case GET_SETTING_FAILURE:
            return {
                ...state,
                dataSettings: null,
            };
        case CHANGE_STATUS_GET_SETTING:
            return {
                ...state,
                dataSettings: null,
            };
        
        default:
            return state;
    }
};

export default settingReducer;
