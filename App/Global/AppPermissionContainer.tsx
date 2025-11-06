import { Alert, Linking, PermissionsAndroid, StyleSheet, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GOOGLE_API_KEY } from "../Utils/GoogleApiKey";
import Geolocation from "react-native-geolocation-service";
import { Platform } from "react-native";

const AppPermissionContainer = () => {
    const dispatch = useDispatch();

    const [isOpenSetting, setIsOpenSetting] = useState(false);

    const hasPermissionIOS = async () => {
        const openSetting = () => {
            setIsOpenSetting(true);
            Linking.openSettings().catch(() => {
                Alert.alert("Unable to open settings");
            });
        };
        const status = await Geolocation.requestAuthorization("whenInUse");
        console.log("statusstatus", status);

        if (status === "denied") {
            const params = {
                status: status,
                location: "",
            };
            dispatch({ type: "SET_STATUS_PERMISION_LOCATION", payload: params });
        }

        if (status === "granted") {
            Geolocation.getCurrentPosition(
                async (position) => {
                    getNameLocation(position);
                },
                (error) => {
                    console.log("error", error);
                },
                {
                    accuracy: {
                        android: "high",
                        ios: "best",
                    },
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 10000,
                    distanceFilter: 0,
                    forceRequestLocation: true,
                    forceLocationManager: false,
                    showLocationDialog: true,
                }
            );
        }

        if (status === "disabled") {
            Alert.alert(`Turn on Location Services to allow ALADIN to determine your location.`, "", [
                { text: "Go to Settings", onPress: openSetting },
                { text: "Don't Use Location", onPress: () => {} },
            ]);
        }
    };

    const hasLocationPermission = async () => {
        if (Platform.OS === "ios") {
            const hasPermission = await hasPermissionIOS();
            return hasPermission;
        }

        if (Platform.OS === "android" && Platform.Version < 23) {
            return true;
        }

        const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

        if (status === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        }

        if (status === PermissionsAndroid.RESULTS.DENIED) {
            ToastAndroid.show("Location permission denied by user.", ToastAndroid.LONG);
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            ToastAndroid.show("Location permission revoked by user.", ToastAndroid.LONG);
        }

        return false;
    };

    const getNameLocation = (position: any) => {
        fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + position?.coords?.latitude + "," + position?.coords?.longitude + "&key=" + GOOGLE_API_KEY)
            .then((response) => response.json())
            .then((responseJson) => {
                const params = {
                    status: "granted",
                    location: responseJson?.results[0]?.formatted_address ? responseJson?.results[0]?.formatted_address : "",
                };
                dispatch({ type: "SET_STATUS_PERMISION_LOCATION", payload: params });
            });
    };

    useEffect(() => {
        hasLocationPermission();
    }, []);

    useEffect(() => {
        if (isOpenSetting) {
            hasLocationPermission();
            setIsOpenSetting(false);
        }
    }, [isOpenSetting]);

    return <></>;
};

export default AppPermissionContainer;

const styles = StyleSheet.create({});
