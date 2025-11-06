import { StyleSheet } from "react-native";
import React from "react";
import ProfileScreen from "../Screens/AuthenticationStackScreen/ProfileScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = () => {
    return (
        <ProfileStack.Navigator
            screenOptions={{
                headerShown: false,
                gestureEnabled: true,
            }}
            initialRouteName="ProfileScreen"
        >
            <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
        </ProfileStack.Navigator>
    );
};

export default ProfileStackScreen;

const styles = StyleSheet.create({});
