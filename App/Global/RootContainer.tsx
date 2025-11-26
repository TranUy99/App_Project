import { PermissionsAndroid, Platform, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, settingSelector } from "../Redux/Reducers/selector";
import { useNavigation } from "@react-navigation/native";

const RootContainer = () => {
    const navigation: any = useNavigation();
    const dispatch = useDispatch();

    const { isLogin, dataUser } = useSelector(authSelector);

    // cấu hình OneSignal v5 + listener

    const HandleCheckLogin = async () => {
        if (dataUser?.token) {
            navigation.navigate("HomeStackScreen", { screen: "HomeScreen" });
        } else {
            navigation.navigate("IntroStackScreen", { screen: "IntroScreen" });
        }
    };

    useEffect(() => {
        HandleCheckLogin();
    }, [dataUser, isLogin]);

    return <></>;
};

export default RootContainer;

const styles = StyleSheet.create({});
