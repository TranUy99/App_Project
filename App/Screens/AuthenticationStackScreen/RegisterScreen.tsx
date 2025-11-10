import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { ApplicationStyles, Colors, Fonts, MetricsRes } from "../../Themes";

const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => {
        // Handle register logic here
        console.log("Register with:", name, email, password);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
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
});

export default RegisterScreen;
