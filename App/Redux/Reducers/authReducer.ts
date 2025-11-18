import { CHANGE_LOG_OUT, CHANGE_STATUS_POST_LOGIN_PHONE_NUMBER, DONT_SAVE_LOGIN, LOG_OUT, LOG_OUT_FAILURE, LOG_OUT_SUCCESS, POST_LOGIN_PHONE_NUMBER, POST_LOGIN_PHONE_NUMBER_FAILURE, POST_LOGIN_PHONE_NUMBER_SUCCESS, POST_LOGOUT_TOKEN_EXPIRED, SAVE_LOGIN, LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE, REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE } from "../Actions/authActions";
import AsyncStorage from "@react-native-async-storage/async-storage";

type DATA_USER = {
    userid: string;
    token: string;
    profile_image: string;
    name: string;
    branch_name: string;
    address: string;
    token_account: string;
    admin: boolean;
};
interface initData {
    dataUser: DATA_USER;
    isDataUser: boolean;

    isLogin: boolean;
    isLoginSocial: boolean;
    isLogout: boolean;
    statusLogin: boolean;

    isLoginSuccess: boolean;

    isRegisterPhone: boolean;
    dataRegisterPhone: {};

    isSaveLogin: boolean;
    passSave: string;
    userSave: string;
}

const initData: initData = {
    dataUser: {
        userid: "",
        token: "",
        profile_image: "",
        name: "",
        branch_name: "",
        address: "",
        token_account: "",
        admin: false,
    },
    isDataUser: false,

    isLogin: false,
    isLoginSocial: false,
    isLogout: false,
    statusLogin: false,

    isLoginSuccess: false,

    isRegisterPhone: false,
    dataRegisterPhone: {},

    isSaveLogin: false,
    passSave: "",
    userSave: "",
};

const authReducer = (state = initData, { type, payload }: any) => {
    switch (type) {
        // Login by phone number and OTP
        case POST_LOGIN_PHONE_NUMBER:
            return {
                ...state,
            };
        case POST_LOGIN_PHONE_NUMBER_SUCCESS:
            return {
                ...state,
                isLogin: true,
                isLoginSuccess: true,
                dataUser: {
                    ...state.dataUser,
                    ...payload,
                },
            };
        case POST_LOGIN_PHONE_NUMBER_FAILURE:
            return {
                ...state,
                isLogin: false,
            };
        case CHANGE_STATUS_POST_LOGIN_PHONE_NUMBER:
            return {
                ...state,
                isLoginSuccess: false,
            };
        // saved login
        case SAVE_LOGIN:
            return {
                ...state,
                isSaveLogin: payload?.isSaveLogin ?? true,
                passSave: payload?.passSave ?? "",
                userSave: payload?.userSave ?? "",
            };
        case DONT_SAVE_LOGIN:
            return {
                ...state,
                isSaveLogin: false,
                passSave: "",
                userSave: "",
            };
        // logout
        case LOG_OUT:
            return {
                ...state,
            };
        case LOG_OUT_SUCCESS:
            return {
                ...state,
                isLogin: false,
                isLoginSuccess: false,
                dataUser: {
                    userid: "",
                    token: "",
                    profile_image: "",
                    name: "",
                    branch_name: "",
                    address: "",
                    token_account: "",
                    admin: false,
                },
            };
        case LOG_OUT_FAILURE:
            return {
                ...state,
            };
        case CHANGE_LOG_OUT:
            return {
                ...state,
            };
        case POST_LOGOUT_TOKEN_EXPIRED:
            return {
                ...state,
                isLogin: false,
                isLoginSuccess: false,
                dataUser: {
                    userid: "",
                    token: "",
                    profile_image: "",
                    name: "",
                    branch_name: "",
                    address: "",
                    token_account: "",
                    admin: false,
                },
            };
        case LOGIN:
            return {
                ...state,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLogin: true,
                isLoginSuccess: true,
                dataUser: {
                    ...state.dataUser,
                    ...payload,
                },
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                isLogin: false,
            };
        case REGISTER:
            return {
                ...state,
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                // Optionally set some state on success, e.g., navigate or show message
            };
        case REGISTER_FAILURE:
            return {
                ...state,
            };
        default:
            return state;
    }
};

export default authReducer;
