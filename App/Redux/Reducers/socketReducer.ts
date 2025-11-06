import { TOGGLE_CONNECT_SOCKET } from "../Actions/socketActions";

interface initData {
    isConnectSocket: boolean;
}
const initData: initData = {
    isConnectSocket: false,
}
const socketReducer = (state = initData, { type, payload }: any) => {
    switch (type) {
        case TOGGLE_CONNECT_SOCKET:
            return {
                ...state,
                isConnectSocket: true
            }
        default:
            return state;
    }
}
export default socketReducer;