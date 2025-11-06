import { StyleSheet, Text, View } from "react-native";
import React from "react";
import NotificationScreen from "../Screens/NotificationScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const NotificationStack = createNativeStackNavigator();

const NotificationStackScreen = () => {
    return (
        <NotificationStack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
            }}
            initialRouteName="NotificationScreen"
        >
            <NotificationStack.Screen name="NotificationScreen" component={NotificationScreen} />
        </NotificationStack.Navigator>
    );
};

export default NotificationStackScreen;

const styles = StyleSheet.create({});
