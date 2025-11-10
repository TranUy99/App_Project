import { StyleSheet, Text, View, Image, ImageBackground } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { ApplicationStyles, Colors, Fonts, Images, MetricsRes } from "../Themes";

const IntroScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate("AuthenticationStackScreen", { screen: "LoginScreen" });
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <ImageBackground source={Images.bg_intro} style={styles.container} resizeMode="cover">
            <Image source={Images.logo} style={styles.logo} />
            <Text style={styles.title}>IoT Biomedical Monitoring</Text>
            <Text style={styles.subTitle}>Smart healthcare system for real-time patient monitoring</Text>
        </ImageBackground>
    );
};

export default IntroScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: MetricsRes.margin.huge,
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
    },

    logo: {
        width: MetricsRes.screenWidth * 0.5,
        height: MetricsRes.screenWidth * 0.5,
        resizeMode: "contain",
        alignSelf: "center",
    },
    title: {
        fontSize: Fonts.size.h24,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.white,
        textAlign: "center",
        marginTop: MetricsRes.margin.base,
    },
    subTitle: {
        fontSize: Fonts.size.h18,
        fontFamily: ApplicationStyles.fontFamily.regular,
        color: Colors.textBlack,
        textAlign: "center",
        marginTop: MetricsRes.margin.base,
    },
});
