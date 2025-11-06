import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { enableFreeze } from "react-native-screens";
import RootNavigation from "./Navigation/RootNavigation";
import AppLoadingContainer from "./Global/AppLoadingContainer";
import { Platform, UIManager } from "react-native";
import AppErrorContainer from "./Global/AppErrorContainer";
import { AlertNotificationRoot } from "react-native-alert-notification";
import SplashScreen from "react-native-splash-screen";
import { Colors } from "./Themes";
import AppRootSocketContainer from "./Global/AppRootSocketContainer";
import { persistor, store } from "./Redux/Stores/configureStore";

enableFreeze(true);

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hide();
        }, 1000);
    }, []);

    const IColors: any = {
        card: Colors.white,
        success: Colors.primary,
    };

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AlertNotificationRoot theme="light" colors={[IColors, IColors]}>
                    <AppLoadingContainer />
                    <AppErrorContainer />
                    <AppRootSocketContainer />
                    <RootNavigation />
                </AlertNotificationRoot>
            </PersistGate>
        </Provider>
    );
};

export default App;
