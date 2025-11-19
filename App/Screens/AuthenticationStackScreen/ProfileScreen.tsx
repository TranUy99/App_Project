import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ApplicationStyles, Colors, Fonts, MetricsRes } from "../../Themes";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

const ProfileScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={28} color={Colors.textBlack} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 28 }} />
            </View>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background || "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: MetricsRes.margin.base,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray || "#e0e0e0",
        marginTop: MetricsRes.screenHeight * 0.05,
    },
    headerTitle: {
        fontSize: Fonts.size.h20,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
    },
});
