import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HistoryScreen from "../Screens/HistoryStackScreen/HistoryScreen";


const HistoryStack = createNativeStackNavigator();

const HistoryStackScreen = () => {
    return (
        <HistoryStack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: false,
            }}
            initialRouteName="HistoryScreen"
        >
            <HistoryStack.Screen name="HistoryScreen" component={HistoryScreen} />
        </HistoryStack.Navigator>
    );
};

export default HistoryStackScreen;

const styles = StyleSheet.create({});
