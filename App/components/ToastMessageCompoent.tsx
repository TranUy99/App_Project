import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import { ApplicationStyles, Colors, Fonts, Images, MetricsRes } from "../Themes";

const ToastMessage = ({ visible, message, icon, iconStyle, containerStyle, textStyle }: any) => {
    if (!visible) return null;

    return (
        <View style={[styles.container, containerStyle]}>
            {/* <Image source={icon} style={[styles.icon, iconStyle]} /> */}
            <Text style={[styles.text, textStyle]}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: MetricsRes.screenHeight * 0.1,
        paddingHorizontal: MetricsRes.margin.base,
        paddingVertical: MetricsRes.margin.small,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        zIndex: 1000,
        backgroundColor: 'black',
        alignSelf: 'center'
    },
    icon: {
        width: MetricsRes.screenWidth / 25,
        height: MetricsRes.screenWidth / 25,
        marginRight: MetricsRes.margin.small,
    },
    text: {
        color: Colors.white,
        fontSize: Fonts.size.h13,
        fontFamily: ApplicationStyles.fontFamily.regular,
        fontWeight: "400",
    },
});

export default ToastMessage;
