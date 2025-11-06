import { Image, StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import { ApplicationStyles, Colors, Fonts, Images, MetricsRes } from "../Themes";

const NoDataComponent = ({ content = "Chưa có đơn hàng", style = {}, image = "" }) => {
    return (
        <View style={[styles.container, style]}>
            {/* <Image source={Images.icon_empty} style={styles.sizeImage} /> */}
            <Text style={styles.content}>{content}</Text>
        </View>
    );
};

export default memo(NoDataComponent); 

const styles = StyleSheet.create({
    container: {
        marginHorizontal: MetricsRes.margin.base - 5,
        paddingHorizontal: MetricsRes.margin.base,
        paddingVertical: MetricsRes.margin.large,
    },
    sizeImage: {
        width: MetricsRes.screenWidth * 0.6,
        height: MetricsRes.screenWidth * 0.6,
        resizeMode: "contain",
        alignSelf: "center",
        borderRadius: MetricsRes.radius.base,
        marginBottom: MetricsRes.margin.base,
    },
    content: {
        fontFamily: ApplicationStyles.fontFamily.regular,
        color: Colors.textBlack,
        textAlign: "center",
        fontSize: Fonts.size.h18,
        fontWeight: "700",
    },
});
