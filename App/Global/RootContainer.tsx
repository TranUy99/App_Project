import { PermissionsAndroid, Platform, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, settingSelector } from "../Redux/Reducers/selector";
import { useNavigation } from "@react-navigation/native";
import { LogLevel, NotificationWillDisplayEvent, OneSignal } from 'react-native-onesignal'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ONE_SIGNAL_APP_ID } from "../Utils/OneSignalAppId";
import { GET_SETTING } from "../Redux/Actions/settingAction";
import AppRootSocketContainer from "./AppRootSocketContainer";
import UpdateVersionModal from "../components/UpdateVersionModal";
import DeviceInfo from "react-native-device-info";

const RootContainer = () => {
    const navigation: any = useNavigation();
    const dispatch = useDispatch();

    const { isLogin, dataUser } = useSelector(authSelector);
    const { dataSetting, isGetDataSetting } = useSelector(settingSelector);
    const [isShowUpdateVersionModal, setIsShowUpdateVersionModal] = useState(false)

    useEffect(() => {
        if (!isLogin) return;
        dispatch({ type: GET_SETTING, payload: { token: dataUser?.token_account } });
    }, [isLogin])

    useEffect(() => {
        if (!dataSetting) return
        if (Platform.OS === 'ios') {
            if (dataSetting?.version_app !== DeviceInfo?.getVersion()) {
                if (
                    dataSetting?.version_app &&
                    parseFloat(dataSetting?.version_app) > parseFloat(DeviceInfo?.getVersion())
                ) {
                    setIsShowUpdateVersionModal(true)
                }
            }
        } else {
            if (dataSetting?.version_app_android !== DeviceInfo?.getVersion()) {
                if (
                    dataSetting?.version_app_android &&
                    parseFloat(dataSetting?.version_app_android) > parseFloat(DeviceInfo?.getVersion())
                ) {
                    setIsShowUpdateVersionModal(true)
                }
            }
        }
    }, [dataSetting])

    // cấu hình OneSignal v5 + listener
    useEffect(() => {
        const onForeground = (event: NotificationWillDisplayEvent) => {
            event.preventDefault()
            event.notification.display()
        }

        const onClick = (event: any) => {
            const data = event?.notification?.additionalData
            setTimeout(() => {
                navigation.navigate('HomeStackScreen', { screen: 'NotificationScreen' })
            }, 500)
        }

        const initPush = async () => {
            OneSignal.Debug.setLogLevel(LogLevel.Verbose)
            OneSignal.initialize(ONE_SIGNAL_APP_ID)

            if (Platform.OS === 'ios') {
                // 🔑 Chỉ hỏi lần đầu tiên
                const asked = await AsyncStorage.getItem('asked_push_permission')
                if (!asked) {
                    await OneSignal.Notifications.requestPermission(true)
                    await AsyncStorage.setItem('asked_push_permission', 'true')
                } else {
                    // Đã hỏi rồi thì chỉ kiểm tra trạng thái
                    const hasPermission = await OneSignal.Notifications.getPermissionAsync()
                    if (!hasPermission) {
                    }
                }
            } else if (Platform.OS === 'android' && Platform.Version >= 33) {
                // ✅ Android 13+ xin quyền POST_NOTIFICATIONS
                try {
                    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
                } catch (err) {
                    console.warn('Permission error:', err)
                }
            }
            OneSignal.Notifications.addEventListener('foregroundWillDisplay', onForeground)
            OneSignal.Notifications.addEventListener('click', onClick)
            // ✅ Lấy & lưu ID
            try {
                const oneSignalId = await OneSignal.User.getOnesignalId()
                const subscriptionId = await OneSignal.User.pushSubscription.getIdAsync()
                const pushToken = await OneSignal.User.pushSubscription.getTokenAsync()

                console.log('✅ OneSignalId:', oneSignalId)
                console.log('✅ SubscriptionId:', subscriptionId)
                console.log('✅ PushToken:', pushToken)

                if (subscriptionId) {
                    await AsyncStorage.setItem('player_id', String(subscriptionId))
                    dispatch({ type: "SET_PLAYER_ID", payload: String(subscriptionId) })
                }
            } catch (err) {
                console.warn('OneSignal error:', err)
            }
        }

        initPush()

        return () => {
            OneSignal.Notifications.removeEventListener('foregroundWillDisplay', onForeground)
            OneSignal.Notifications.removeEventListener('click', onClick)
        }
    }, [])

    const HandleCheckLogin = async () => {
        if (isLogin) {
            navigation.navigate("HomeStackScreen", { screen: "HomeScreen" });
        } else {
            navigation.navigate("IntroStackScreen", { screen: "IntroScreen" });
            // navigation.navigate("AuthenticationStackScreen", { screen: "LoginScreen" });
        }
    };

    useEffect(() => {
        HandleCheckLogin();
    }, [dataUser, isLogin]);

    return <>
        <UpdateVersionModal visible={isShowUpdateVersionModal} />
    </>;
};

export default RootContainer;

const styles = StyleSheet.create({});
