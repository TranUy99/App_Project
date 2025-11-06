import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, AppStateStatus } from "react-native";

import { authSelector, settingSelector, socketSelector } from "../Redux/Reducers/selector";
import { baseURL } from "../Redux/Services/api";
import { onSocketConnect } from "../SocketIO/SocketIOClient";
import { LINK_CONNET, TOKEN_SOCKET } from "../Utils/KeynameAsynstorage";

import { TOGGLE_CONNECT_SOCKET } from "../Redux/Actions/socketActions";

const AppRootSocketContainer = () => {
    const dispatch = useDispatch();
    const socketRef = useRef<any>(null);
    const disconnectRef = useRef<any>(null);
    const appState = useRef(AppState.currentState);
    const isAppActive = useRef(true);

    const { link_connect_socket } = useSelector(settingSelector);
    const { isConnectSocket } = useSelector(socketSelector);
    const { dataUser, isLogin } = useSelector(authSelector);

    console.log("🔄 dataUser:", dataUser);
    console.log("🔄 isLogin:", isLogin);
    console.log("🔄 isConnectSocket:", isConnectSocket);

    const HandleGetTokenSocket = async () => {
        if (!isLogin || !dataUser?.id) return;

        const url = `${baseURL}api/socket/connect?user_id=${dataUser.id}&user_name=${dataUser.fullname}`;
        console.log("🌐 Fetch socket token:", url);

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const data = await response.json();

            if (data?.status) {
                console.log("✅ Received socket token:", data);
                dispatch({ type: TOGGLE_CONNECT_SOCKET, payload: true });
                await AsyncStorage.setItem(TOKEN_SOCKET, data.data);
                await AsyncStorage.setItem(LINK_CONNET, link_connect_socket);
            }
            return data;
        } catch (err) {
            console.log("🚫 Fetch API Error:", err);
        }
    };

    const HandleConnectSocket = async () => {
        // if (!isLogin || !dataUser?.id || !link_connect_socket) {
        //     console.log("🚫 Cannot connect socket — missing login/user/link");
        //     return;
        // }

        console.log("🔗 Connecting socket to:", link_connect_socket);
        const { socket, disconnectSocket } = await onSocketConnect(link_connect_socket);
        socketRef.current = socket;
        disconnectRef.current = disconnectSocket;

        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);
            socket.emit("connectedData", {
                user_id: dataUser.id,
                user_name: dataUser.fullname,
                db_name: "sql_system_homec",
            });
        });

        socket.on("payment_success", (data) => {
            if (data?.data?.id_payment) {
                console.log("💰 Payment success event:", data);
                dispatch({ type: "PAYMENT_SUCCESS_SOCKET", payload: data.data });
            } else {
                console.log("⚠️ payment_success without id_payment", data);
            }
        });
    };

    const HandleDisconnectSocket = () => {
        if (disconnectRef.current) {
            console.log("👋 Disconnecting socket…");
            disconnectRef.current();
            socketRef.current = null;
            disconnectRef.current = null;
        }
    };

    const restoreSocketState = async () => {
        const token = await AsyncStorage.getItem(TOKEN_SOCKET);
        const link = await AsyncStorage.getItem(LINK_CONNET);

        if (token && link && isLogin) {
            console.log("🪄 Restoring socket state from storage");
            dispatch({ type: TOGGLE_CONNECT_SOCKET, payload: true });
        }
    };

    useEffect(() => {
        restoreSocketState();
    }, []);

    // useEffect(() => {
    //     const subscription = AppState.addEventListener("change", async (nextAppState) => {
    //         const isActive = nextAppState === "active";
    //         const wasBackground = appState.current.match(/inactive|background|unknown/);

    //         appState.current = nextAppState;
    //         isAppActive.current = isActive;

    //         if (isActive && wasBackground) {
    //             console.log("🔄 App resumed from background");

    //             if (!socketRef.current || !socketRef.current.connected) {
    //                 console.log("🔗 Reconnecting socket…");
    //                 await HandleConnectSocket();
    //             }
    //         }
    //     });

    //     return () => subscription.remove();
    // }, []);

    useEffect(() => {
        if (isLogin) {
            setTimeout(() => {
                HandleGetTokenSocket();
            }, 4000);
        } else {
            console.log("❌ User logged out — disconnect socket");
            HandleDisconnectSocket();
        }
    }, [isLogin]);

    useEffect(() => {
        if (isConnectSocket && isLogin && dataUser?.id && link_connect_socket) {
            console.log("🚀 Connecting socket due to Redux state");
            HandleConnectSocket();
        }
        return () => {
            HandleDisconnectSocket();
        };
    }, [isConnectSocket, isLogin, dataUser?.id, link_connect_socket]);

    return null;
};

export default AppRootSocketContainer;
