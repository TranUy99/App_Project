import { Image, ImageBackground, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ApplicationStyles, Colors, Fonts, Images, MetricsRes } from "../Themes";
import { useNavigation } from "@react-navigation/native";

const BASE_HEIGHT_HEADER = Platform.OS == "ios" ? MetricsRes.screenWidth * 0.249 : MetricsRes.screenWidth * 0.249;

const HeaderSingleComponent = ({
    //
    title = "",
    subTitle = "",
    rightComponent = () => { },
    container = {},
    typeIconLeft = 1,
    typeIconRight = 1,
    iconLeft = true,
    iconRight = false,
    isBack = false,
    onPressLeft = () => { },
    onPressRight = () => { },
}) => {
    const navigation = useNavigation();

    const HandleGoBack = () => navigation.goBack();

    const HandleIconLeft = () => {
        if (isBack) {
            HandleGoBack();
        } else {
            onPressLeft();
        }
    };

    return (
        <View style={[styles.container, container]}>
            <View style={[styles.wraperContainer, { paddingBottom: subTitle ? 10 : MetricsRes.margin.base + 5 }]}>
                <StatusBar
                    barStyle="light-content"
                />
                {iconLeft ? (
                    <TouchableOpacity onPress={HandleIconLeft}>
                        {/* <Image
                            source={Images.icon_arrow_left}
                            style={[
                                styles.iconLeft,
                                {
                                    width: MetricsRes.screenWidth * 0.06,
                                    height: MetricsRes.screenWidth * 0.06,
                                },
                            ]}
                            resizeMode="contain"
                        /> */}
                    </TouchableOpacity>
                ) : (
                    <View
                        style={{
                            width: MetricsRes.screenWidth * 0.06,
                            height: MetricsRes.screenWidth * 0.06,
                        }}
                    />
                )}
                <View style={styles.wrapperCenter}>
                    <Text style={styles.title}>{title}</Text>
                    {subTitle !== "" && <Text style={styles.subTitle}>{subTitle}</Text>}
                </View>
                {iconRight ? (
                    <TouchableOpacity onPress={()=> onPressRight?.()}>
                        {/* <Image
                            source={typeIconRight == 1 ? Images.icon_scan : Images.icon_check_noti}
                            style={[
                                styles.iconLeft,
                                {
                                    width: MetricsRes.screenWidth * 0.06,
                                    height: MetricsRes.screenWidth * 0.06,
                                },
                            ]}
                            resizeMode="contain"
                        /> */}
                    </TouchableOpacity>
                ) : (
                    <View
                        style={{
                            width: MetricsRes.screenWidth * 0.06,
                            height: MetricsRes.screenWidth * 0.06,
                        }}
                    />
                )}
            </View>
        </View>
    );
};

export default HeaderSingleComponent;

const styles = StyleSheet.create({
    container: {
        height: BASE_HEIGHT_HEADER,
        width: MetricsRes.screenWidth,
        justifyContent: "flex-end",
        paddingHorizontal: MetricsRes.margin.base,
    },
    wraperContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

    },
    iconLeft: {
        resizeMode: "contain",
    },
    wrapperCenter: {
        alignItems: "center",
    },
    title: {
        fontFamily: ApplicationStyles.fontFamily.regular,
        fontSize: Fonts.size.h20,
        color: Colors.white,
        marginBottom: MetricsRes.margin.small - 5,
        fontWeight:'700'
    },
    subTitle: {
        fontFamily: ApplicationStyles.fontFamily.regular,
        fontSize: Fonts.size.h12,
        color: Colors.white,
    },
});
