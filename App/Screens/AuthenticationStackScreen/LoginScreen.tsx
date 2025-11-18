import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN } from "../../Redux/Actions/authActions";

import { ApplicationStyles, Colors, Fonts, Images, MetricsRes } from "../../Themes";
import { authSelector } from "../../Redux/Reducers/selector";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { isLogin, dataUser } = useSelector(authSelector);

    const handleLogin = async () => {
        // Dispatch login action
        dispatch({ type: LOGIN, payload: { email, password } });

        // Assuming your LOGIN action returns a token
    };

    useEffect(() => {
        if (isLogin) {
            navigation.navigate("HomeStackScreen", { screen: "HomeScreen" });
        }
    }, [isLogin]);

    return (
        <View style={styles.container}>
            <Image source={Images.logo} style={styles.logo} />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Login</Text>
            </View>
            <View style={styles.inputRow}>
                <Icon name="mail-outline" size={22} color={Colors.gray} style={styles.inputIcon} />
                <TextInput style={styles.inputField} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>
            <View style={styles.inputRow}>
                <Icon name="lock-closed-outline" size={22} color={Colors.gray} style={styles.inputIcon} />
                <TextInput style={styles.inputField} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                    Don't have an account?{" "}
                    <Text style={styles.registerLink} onPress={() => navigation.navigate("RegisterScreen")}>
                        Sign up
                    </Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: MetricsRes.margin.huge,
        backgroundColor: Colors.white,
    },
    title: {
        fontSize: Fonts.size.h24,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
        textAlign: "center",
        marginBottom: MetricsRes.margin.large,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: Colors.gray,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: MetricsRes.margin.base,
        marginBottom: MetricsRes.margin.base,
        height: 50,
        backgroundColor: Colors.white,
    },
    inputIcon: {
        marginRight: MetricsRes.margin.small,
    },
    inputField: {
        flex: 1,
        fontSize: Fonts.size.h16,
        color: Colors.textBlack,
    },
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: MetricsRes.margin.base,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: Colors.white,
        fontSize: Fonts.size.h18,
        fontFamily: ApplicationStyles.fontFamily.bold,
    },
    logo: {
        width: MetricsRes.screenWidth * 0.3,
        height: MetricsRes.screenWidth * 0.3,
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: MetricsRes.margin.large,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: MetricsRes.margin.large,
    },
    registerContainer: {
        marginTop: MetricsRes.margin.base,
        alignItems: "center",
    },
    registerText: {
        fontSize: Fonts.size.h16,
        color: Colors.textBlack,
    },
    registerLink: {
        color: Colors.primary,
        fontFamily: ApplicationStyles.fontFamily.bold,
    },
});

export default LoginScreen;
