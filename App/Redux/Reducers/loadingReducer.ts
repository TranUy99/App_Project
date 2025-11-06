import { SET_DISABLED_BUTTON, SHOW_ALERT_GLOBAL, SHOW_LOADING, SHOW_LOADING_DEEP_LINK, SHOW_LOADING_FULL_SCREEN, SHOW_POP_UP_FAILURE, SHOW_POP_UP_SUCCESS } from "../Actions/loadingAction";

interface initData {
	isLoading: boolean;
	isLoadingFullScreen: boolean;
	dataAlert: {
		status: number;
		title: string;
		subtitle: string;
		isShow: boolean;
	};
	dataPopup: {
		isShowSuccess: boolean;
		isShowFailure: boolean;
		message: string;
	};
	isDisableButton: boolean;
	isLoadingDeepLink: boolean;
}

const initData: initData = {
	isLoading: false,
	isLoadingFullScreen: false,
	dataAlert: {
		status: 1,
		title: "",
		subtitle: "",
		isShow: false,
	},

	dataPopup: {
		isShowSuccess: false,
		isShowFailure: false,
		message: "",
	},
	isDisableButton: false,
	isLoadingDeepLink: false,
};

const loadingReducer = (state = initData, { type, payload }: any) => {
	switch (type) {
		case SHOW_LOADING:
			return {
				...state,
				isLoading: payload,
			};
		case SHOW_LOADING_DEEP_LINK:
			return {
				...state,
				isLoadingDeepLink: payload,
			};
		case SHOW_LOADING_FULL_SCREEN:
			return {
				...state,
				isLoadingFullScreen: payload,
			};
		case SHOW_ALERT_GLOBAL:
			return {
				...state,
				dataAlert: {
					...payload,
				},
			};
		case SHOW_POP_UP_SUCCESS:
			return {
				...state,
				dataPopup: {
					...state.dataPopup,
					...payload,
				},
			};
		case SHOW_POP_UP_FAILURE:
			return {
				...state,
				dataPopup: {
					...state.dataPopup,
					...payload,
				},
			};
		case SET_DISABLED_BUTTON:
			return {
				...state,
				isDisableButton: payload,
			};
		default:
			return state;
	}
};

export default loadingReducer;
