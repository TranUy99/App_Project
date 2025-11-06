import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../Screens/AuthenticationStackScreen/LoginScreen";

const AuthenticationStack = createNativeStackNavigator();

const AuthenticationStackScreen = () => {
    return (
        <AuthenticationStack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: false,
            }}
            initialRouteName={"LoginScreen"}
        >
            <AuthenticationStack.Screen name="LoginScreen" component={LoginScreen} options={{ animation: "none" }} />
        </AuthenticationStack.Navigator>
    );
};

export default AuthenticationStackScreen;

const styles = StyleSheet.create({});
