import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IntroScreen from "../Screens/IntroScreen";

const IntroStack = createNativeStackNavigator();

const IntroStackScreen = () => {
    return (
        <IntroStack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: false,
            }}
            initialRouteName="IntroScreen"
        >
            <IntroStack.Screen name="IntroScreen" component={IntroScreen} />
        </IntroStack.Navigator>
    );
};

export default IntroStackScreen;

const styles = StyleSheet.create({});
