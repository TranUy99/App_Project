import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../Screens/HomeScreen/HomeScreen";
import RecordHeartRateScreen from "../Screens/HomeScreen/RecordHeartRateScreen";
import HeartRateHistoryScreen from "../Screens/HomeScreen/HeartRateHistoryScreen";
import HeartRateTrendScreen from "../Screens/HomeScreen/HeartRateTrendScreen";

const HomeStack = createNativeStackNavigator();

const HomeStackScreen = () => {
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: false,
            }}
            initialRouteName="HomeScreen"
        >
            <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
            <HomeStack.Screen name="RecordHeartRateScreen" component={RecordHeartRateScreen} />
            <HomeStack.Screen name="HeartRateHistoryScreen" component={HeartRateHistoryScreen} />
            <HomeStack.Screen name="HeartRateTrendScreen" component={HeartRateTrendScreen} />
        </HomeStack.Navigator>
    );
};

export default HomeStackScreen;

const styles = StyleSheet.create({});
