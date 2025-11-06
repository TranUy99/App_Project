// SocketIO/SocketIOClient.js
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSelector } from "react-redux";
import { TOKEN_SOCKET } from "../Utils/KeynameAsynstorage";

export const onSocketConnect = async (link_connect_socket) => {
    // const socket_link = await AsyncStorage.getItem(SOCKET_LINK_CONNECT);

    // const { link_connect_socket } = useSelector(settingSelector);
    const token_socket = await AsyncStorage.getItem(TOKEN_SOCKET);
    // const link_connect_socket = await AsyncStorage.getItem(LINK_CONNET);

    console.log("link_connect_socket", link_connect_socket);

    console.log("token_socket", token_socket);

    const socket = io(link_connect_socket, {
        autoConnect: false,
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        extraHeaders: {
            auth: token_socket ?? "",
        },
    });

    const disconnectSocket = () => {
        if (socket) {
            // Log socket ID trước khi ngắt kết nối
            console.log("Đang cố gắng ngắt kết nối socket với ID:", socket.id);

            // Ngắt kết nối socket
            socket.disconnect();

            // Log xác nhận ngắt kết nối
            console.log("Socket đã ngắt kết nối. ID hiện tại:", socket.id || "undefined (đã ngắt)");
        } else {
            console.log("Không có socket nào để ngắt kết nối.");
        }
    };

    return { socket, disconnectSocket };
};
