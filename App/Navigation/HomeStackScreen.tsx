import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../Screens/HomeScreen/HomeScreen";
import RecordHeartRateScreen from "../Screens/HomeScreen/RecordHeartRateScreen";
import HeartRateHistoryScreen from "../Screens/HomeScreen/HeartRateHistoryScreen";
import HeartRateTrendScreen from "../Screens/HomeScreen/HeartRateTrendScreen";
import DashboardScreen from "../Screens/DashboardScreen/DashboardScreen";
import PatientListScreen from "../Screens/PatientListScreen/PatientListScreen";
import PatientDetailScreen from "../Screens/PatientDetailScreen/PatientDetailScreen";
import HistoryScreen from "../Screens/HistoryStackScreen/HistoryScreen";

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
            <HomeStack.Screen name="DashboardScreen" component={DashboardScreen} />
            <HomeStack.Screen name="PatientListScreen" component={PatientListScreen} />
            <HomeStack.Screen name="PatientDetailScreen" component={PatientDetailScreen} />
            <HomeStack.Screen name="HistoryScreen" component={HistoryScreen} />

            {/* <HomeStack.Screen name="VitalsHistoryScreen" component={VitalsHistoryScreen} />
            <HomeStack.Screen name="AlertScreen" component={AlertScreen} />
            <HomeStack.Screen name="AddPatientScreen" component={AddPatientScreen} />
            <HomeStack.Screen name="SettingsScreen" component={SettingsScreen} /> */}
        </HomeStack.Navigator>
    );
};

export default HomeStackScreen;

const styles = StyleSheet.create({});
