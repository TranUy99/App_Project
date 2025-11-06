import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "../Themes";

const LayoutComponent = ({ children, style = {} }: any) => {
    return <View style={[styles.container, style]}>{children}</View>;
};

export default LayoutComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
});
