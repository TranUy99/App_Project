import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ApplicationStyles, Colors, Fonts, Images, MetricsRes } from "../../Themes";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // Handle login logic here
        console.log("Login with:", email, password);
    };

    return (
        <View style={styles.container}>
            <Image source={Images.logo} style={styles.logo} />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Login</Text>
            </View>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
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
    input: {
        height: 50,
        borderColor: Colors.gray,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: MetricsRes.margin.base,
        marginBottom: MetricsRes.margin.base,
        fontSize: Fonts.size.h16,
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
});

export default LoginScreen;
