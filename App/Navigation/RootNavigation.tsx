import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthenticationStackScreen from "./AuthenticationStackScreen";
import RootContainer from "../Global/RootContainer";
import IntroStackScreen from "./IntroStackScreen";
import HomeStackScreen from "./HomeStackScreen";
import ProfileStackScreen from "./ProfileStackScreen";

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
                initialRouteName="RootContainer"
            >
                <Stack.Screen name="RootContainer" component={RootContainer} />
                <Stack.Screen name="IntroStackScreen" component={IntroStackScreen} />
                <Stack.Screen name="AuthenticationStackScreen" component={AuthenticationStackScreen} />
                <Stack.Screen name="HomeStackScreen" component={HomeStackScreen} />
                <Stack.Screen name="ProfileStackScreen" component={ProfileStackScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigation;
