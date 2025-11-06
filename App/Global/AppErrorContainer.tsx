import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorSelector } from "../Redux/Reducers/selector";
import DropdownAlert, { DropdownAlertData, DropdownAlertType } from "react-native-dropdownalert";
import { SHOW_ERROR } from "../Redux/Actions/errorAction";

const DEFAULT_CONTENT_MESSAGE = "Đã có lỗi xảy ra! Vui lòng thử lại sau.";

const AppErrorContainer = () => {
    const dispatch = useDispatch();
    const { isError, messageError } = useSelector(errorSelector);

    let alert = useRef((_data?: DropdownAlertData) => new Promise<DropdownAlertData>((res) => res));

    let dismiss = useRef(() => {});

    const showAlert = () => {
        setTimeout(async () => {
            await alert.current({ type: DropdownAlertType.Error, title: "Kanow", message: messageError ? messageError : DEFAULT_CONTENT_MESSAGE });
            setTimeout(() => {
                dispatch({ type: SHOW_ERROR, payload: { isError: false, messageError: "" } });
            }, 100);
        }, 10);
    };

    useEffect(() => {
        if (isError) {
            showAlert();
        }
    }, [isError]);

    return <DropdownAlert alert={(func) => (alert.current = func)} dismiss={(func) => (dismiss.current = func)} />;
};

export default AppErrorContainer;
