import { StyleSheet, Platform, View, Image, Text, Dimensions, TouchableOpacity } from "react-native"; // Thêm Dimensions
import React, { useEffect, useMemo, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ApplicationStyles, Colors, MetricsRes, Images, Fonts } from "../Themes";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, settingSelector } from "../Redux/Reducers/selector";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated"; // Thêm Easing
import ProfileStackScreen from "./ProfileStackScreen";
import NotificationStackScreen from "./NotificationStackScreen";
import HomeStackScreen from "./HomeStackScreen";
import HistoryStackScreen from "./HistoryStackScreen";
import SupportScreen from "../Screens/SupportScreen";
import Svg, { Path } from "react-native-svg";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import HistoryScreen from "../Screens/HistoryStackScreen/HistoryScreen";

const Tab = createBottomTabNavigator();
const screenWidth = Dimensions.get("window").width;

const TabBarNotch = ({ width, height, tabBarColor, notchWidth = 120, notchHeightFactor = 1 }) => {
    if (!width || !height) {
        return null;
    }

    const actualNotchHeight = height * notchHeightFactor;
    const bottomHeight = 1;
    const straightExtension = 20; // Độ dài đoạn thẳng thêm vào

    const d_smoothNotch = `
    M0,${height}
    L${(width - notchWidth) / 2 - straightExtension},${height}
    L${(width - notchWidth) / 2},${height}
    C${(width - notchWidth) / 2 + notchWidth * 0.3},${height} 
     ${width / 2 - notchWidth * 0.2},${height - actualNotchHeight}
     ${width / 2},${height - actualNotchHeight}
    C${width / 2 + notchWidth * 0.2},${height - actualNotchHeight}
     ${(width + notchWidth) / 2 - notchWidth * 0.3},${height}
     ${(width + notchWidth) / 2},${height}
    L${(width + notchWidth) / 2 + straightExtension},${height}
    L${width},${height}
    L${width},${height + bottomHeight} 
    L0,${height + bottomHeight}
    Z
  `;

    const d_topNotchCurve = `
    M${(width - notchWidth) / 2},${height}
    C${(width - notchWidth) / 2 + notchWidth * 0.3},${height} 
     ${width / 2 - notchWidth * 0.2},${height - actualNotchHeight}
     ${width / 2},${height - actualNotchHeight}
    C${width / 2 + notchWidth * 0.2},${height - actualNotchHeight}
     ${(width + notchWidth) / 2 - notchWidth * 0.3},${height}
     ${(width + notchWidth) / 2},${height}
  `;

    return (
        <Svg
            height={height + 10}
            width={width}
            viewBox={`0 0 ${width} ${height + 10}`}
            style={{
                ...Platform.select({
                    ios: {
                        shadowColor: Colors.textBlack,
                        shadowOffset: { width: 0, height: -3 },
                        shadowOpacity: 0.1,
                        shadowRadius: 3.0,
                    },
                    android: {
                        elevation: 2,
                    },
                }),
            }}
        >
            <Path d={d_smoothNotch} fill={tabBarColor} />
            <Path d={d_topNotchCurve} stroke={Colors.border} strokeWidth={2} fill="none" />
        </Svg>
    );
};

// --- Custom TabBar Component ---
const CustomTabBar = ({ state, descriptors, navigation, dataCheckReadNotification }: any) => {
    const { dataSetting } = useSelector(settingSelector);
    const disabled = Number(dataSetting?.is_test_app) === 1;

    const [tabLayouts, setTabLayouts] = useState([]);
    const activeTabX = useSharedValue(0);
    const activeItemBackgroundX = useSharedValue(0);

    const NOTCH_HEIGHT = 15;
    const NOTCH_WIDTH_SCALE_FACTOR = 1.2;

    useEffect(() => {
        const currentTabIndex = state.index;
        if (tabLayouts[currentTabIndex]) {
            const tabItemCenterX = tabLayouts[currentTabIndex].x + tabLayouts[currentTabIndex].width / 2;
            const backgroundX = tabItemCenterX - 50 / 2;

            activeTabX.value = withTiming(backgroundX, {
                duration: 250,
                easing: Easing.out(Easing.ease),
            });
            const notchDynamicWidth = tabLayouts[currentTabIndex].width * NOTCH_WIDTH_SCALE_FACTOR;
            const notchX = tabItemCenterX - notchDynamicWidth / 2;
            activeItemBackgroundX.value = withTiming(notchX, {
                duration: 300,
                easing: Easing.out(Easing.ease),
            });
        }
    }, [state.index, tabLayouts, activeTabX, activeItemBackgroundX]);

    const tabRadiusStyle = useMemo(() => {
        const isFirst = state.index === 0;
        const isLast = state.index === state.routes.length - 1;

        return {
            borderTopLeftRadius: isFirst ? 0 : 25,
            borderTopRightRadius: isLast ? 0 : 25,
        };
    }, [state.index, state.routes.length]);

    const animatedBackgroundStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: activeTabX.value }],
            width: 50,
            height: 50,
        };
    });

    const animatedNotchStyle = useAnimatedStyle(() => {
        const currentTabLayout = tabLayouts[state.index];
        const notchDynamicWidth = currentTabLayout ? currentTabLayout.width * NOTCH_WIDTH_SCALE_FACTOR : (screenWidth / state.routes.length) * NOTCH_WIDTH_SCALE_FACTOR;

        return {
            transform: [{ translateX: activeItemBackgroundX.value }],
            width: notchDynamicWidth,
        };
    });
    const [isTabBarVisible, setIsTabBarVisible] = useState(true);
    useEffect(() => {
        const currentTabRoute = state.routes[state.index];
        const focusedChildRouteName = getFocusedRouteNameFromRoute(currentTabRoute);
        const screenShow = ["HomeScreen", "SupportScreen", "HistoryScreen", "NotificationScreen", "ProfileScreen"];
        if (focusedChildRouteName && !screenShow.includes(focusedChildRouteName)) {
            setIsTabBarVisible(false);
        } else {
            setIsTabBarVisible(true);
        }
    }, [state]);

    if (!isTabBarVisible) {
        return null;
    }

    return (
        <View style={{ backgroundColor: "transparent" }}>
            <Animated.View style={[styles.notchContainer, animatedNotchStyle]}>
                <TabBarNotch width={tabLayouts[state.index] ? tabLayouts[state.index].width * NOTCH_WIDTH_SCALE_FACTOR : (screenWidth / state.routes.length) * NOTCH_WIDTH_SCALE_FACTOR} height={NOTCH_HEIGHT} tabBarColor={Colors.white} />
            </Animated.View>
            <View style={[styles.tabBarContainer, { height: Platform.OS === "ios" ? (disabled ? 105 : 115) : 80 }, tabRadiusStyle]}>
                <Animated.View style={[styles.slidingIconBackground, animatedBackgroundStyle]} />
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: "tabLongPress",
                            target: route.key,
                        });
                    };

                    let iconSource;
                    let tabLabelName = "";

                    switch (route.name) {
                        case "HomeStackScreen":
                            // iconSource = isFocused ? Images.logo : Images.logo;
                            tabLabelName = "Trang chủ";
                            break;
                        case "SupportScreen":
                            // iconSource = isFocused ? Images.logo : Images.logo;
                            tabLabelName = "Hỗ trợ";
                            break;
                        case "HistoryStackScreen":
                            // iconSource = isFocused ? Images.logo : Images.logo;
                            tabLabelName = "Lịch sử";
                            break;
                        case "NotificationStackScreen":
                            // iconSource = isFocused ? Images.logo : Images.logo;
                            tabLabelName = "Thông báo";
                            break;
                        case "ProfileStackScreen":
                            // iconSource = isFocused ? Images.logo : Images.logo;
                            tabLabelName = "Tài khoản";
                            break;
                        default:
                            // iconSource = Images.logo;
                            tabLabelName = route.name;
                    }

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.tabItem}
                            onLayout={(event) => {
                                const { x, width: itemWidth, height } = event.nativeEvent.layout;
                                setTabLayouts((prevLayouts) => {
                                    const newLayouts = [...prevLayouts];
                                    newLayouts[index] = { x, width: itemWidth, height };
                                    if (JSON.stringify(prevLayouts[index]) !== JSON.stringify(newLayouts[index])) {
                                        return newLayouts;
                                    }
                                    return prevLayouts;
                                });
                            }}
                        >
                            <View style={styles.tabIconContainer}>
                                <Image source={iconSource} style={[styles.sizeImage, isFocused && { marginBottom: 20 }]} />
                                {route.name === "NotificationStackScreen" && dataCheckReadNotification?.check > 0 && <View style={styles.dotStyle} />}
                            </View>
                            <Text
                                style={{
                                    color: isFocused ? Colors.primary : Colors.grey07,
                                    fontSize: 12,
                                    fontFamily: isFocused ? ApplicationStyles.fontFamily.bold : ApplicationStyles.fontFamily.medium,
                                    marginTop: 4,
                                }}
                            >
                                {tabLabelName}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};
// --- Custom TabBar Component ---

const BottomTabNavigation = ({ route }: any) => {
    const dispatch = useDispatch();
    const { dataCheckReadNotification } = useSelector(settingSelector);
    const { dataUser, isLogin } = useSelector(authSelector);

    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} dataCheckReadNotification={dataCheckReadNotification} />}
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="HomeStackScreen"
        >
            <Tab.Screen name="HomeStackScreen" component={HomeStackScreen} />
            <Tab.Screen name="SupportScreen" component={SupportScreen} />
            <Tab.Screen name="HistoryStackScreen" component={HistoryStackScreen} />
            <Tab.Screen name="NotificationStackScreen" component={NotificationStackScreen} />
            <Tab.Screen name="ProfileStackScreen" component={ProfileStackScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigation;

const styles = StyleSheet.create({
    sizeImage: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
    dotStyle: {
        backgroundColor: Colors.red,
        width: MetricsRes.screenWidth * 0.019,
        height: MetricsRes.screenWidth * 0.019,
        borderRadius: (MetricsRes.screenWidth * 0.019) / 2,
        position: "absolute",
        zIndex: 1,
        top: -2,
        right: -2,
        borderWidth: 1,
        borderColor: Colors.white,
    },

    tabBarContainer: {
        flexDirection: "row",
        backgroundColor: Colors.white,
        position: "relative",
        // borderTopStartRadius: 25,
        // borderTopEndRadius: 25,
        zIndex: -2,
        borderTopColor: Colors.border,
        borderTopWidth: 2,
    },
    tabItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingVertical: Platform.OS === "ios" ? 3 : 0,
        gap: MetricsRes.margin.tiny,
        marginBottom: Platform.OS === "ios" ? 30 : 5,
    },
    tabIconContainer: {
        position: "relative",
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    slidingIconBackground: {
        backgroundColor: Colors.primary,
        borderRadius: 25,
        position: "absolute",
        top: ((Platform.OS === "ios" ? 65 : 53) - 50) / 2,
        zIndex: 0,
    },
    notchContainer: {
        position: "absolute",
        top: -13.5,
        height: 20,
        transform: [{ translateY: -20 + 1 }],
        zIndex: 1,
    },
});
