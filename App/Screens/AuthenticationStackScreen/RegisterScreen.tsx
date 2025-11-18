import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { REGISTER } from "../../Redux/Actions/authActions";
import { ApplicationStyles, Colors, Fonts, Images, MetricsRes } from "../../Themes";

const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const validate = () => {
        let valid = true;
        if (!name.trim()) {
            setNameError("Name is required");
            valid = false;
        } else {
            setNameError("");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Invalid email format");
            valid = false;
        } else {
            setEmailError("");
        }
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            valid = false;
        } else {
            setPasswordError("");
        }
        return valid;
    };

    const handleRegister = () => {
        if (validate()) {
            dispatch({ type: REGISTER, payload: { name, email, password } });
        }
    };

    return (
        <View style={styles.container}>
            <Image source={Images.logo} style={styles.logo} />
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Register</Text>
            </View>
            <View style={styles.inputRow}>
                <Icon name="person-outline" size={22} color={Colors.gray} style={styles.inputIcon} />
                <TextInput
                    style={styles.inputField}
                    placeholder="Name"
                    value={name}
                    onChangeText={(text) => {
                        setName(text);
                        if (nameError) setNameError("");
                    }}
                />
            </View>
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            <View style={styles.inputRow}>
                <Icon name="mail-outline" size={22} color={Colors.gray} style={styles.inputIcon} />
                <TextInput
                    style={styles.inputField}
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        if (emailError) setEmailError("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            <View style={styles.inputRow}>
                <Icon name="lock-closed-outline" size={22} color={Colors.gray} style={styles.inputIcon} />
                <TextInput
                    style={styles.inputField}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        if (passwordError) setPasswordError("");
                    }}
                    secureTextEntry
                />
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>
                    Already have an account?{" "}
                    <Text style={styles.loginLink} onPress={() => navigation.navigate("LoginScreen")}>
                        Login
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
    loginContainer: {
        marginTop: MetricsRes.margin.base,
        alignItems: "center",
    },
    loginText: {
        fontSize: Fonts.size.h16,
        color: Colors.textBlack,
    },
    loginLink: {
        color: Colors.primary,
        fontFamily: ApplicationStyles.fontFamily.bold,
    },
    errorText: {
        color: Colors.error || "red",
        fontSize: Fonts.size.h14,
        marginBottom: MetricsRes.margin.small,
        marginLeft: MetricsRes.margin.base,
    },
});

export default RegisterScreen;
