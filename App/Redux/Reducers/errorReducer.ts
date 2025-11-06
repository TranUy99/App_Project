import { SHOW_ERROR } from "../Actions/errorAction";

interface initData {
	isError: boolean;
	messageError?: string;
}

const initData: initData = {
	isError: false,
	messageError: "",
};

const errorReducer = (state = initData, { type, payload }: any) => {
	switch (type) {
		case SHOW_ERROR:
			return {
				...state,
				isError: payload.isError,
				messageError: payload.messageError,
			};
		default:
			return state;
	}
};

export default errorReducer;
