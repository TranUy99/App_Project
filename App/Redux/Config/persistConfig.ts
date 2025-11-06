import AsyncStorage from "@react-native-async-storage/async-storage";

export const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    whitelist: ["authReducer", "settingReducer"],
    blacklist: ["errorSelector", "loadingReducer"],
};
// cacheReducer
