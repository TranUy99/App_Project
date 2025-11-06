import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ApplicationStyles, Colors, Fonts, MetricsRes } from "../Themes";

type BUTTON_TYPE = {
    backgroundButton?: string;
    customStyle?: any;
    title: string;
    outline?: boolean;
    onPress: () => void;
    buttonStyle?: any;
    disabled?: boolean;
    icon?: any;
};

const ButtonCustom: React.FC<BUTTON_TYPE> = ({ disabled = false, backgroundButton, customStyle, title, outline, onPress, buttonStyle, icon }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.5}
            disabled={disabled}
            onPress={onPress}
            style={{
                backgroundColor: outline ? "transparent" : disabled ? Colors.gray : backgroundButton !== undefined ? backgroundButton : Colors.primary,
                borderRadius: MetricsRes.radius.large,
                alignItems: "center",
                borderWidth: outline ? 1.2 : 0,
                borderColor: outline ? (disabled ? Colors.gray : Colors.primary) : "transparent",
                ...buttonStyle,
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                    allowFontScaling={false}
                    style={{
                        color: outline ? (disabled ? Colors.gray : Colors.primary) : disabled ? Colors.white : Colors.white,
                        fontFamily: ApplicationStyles.fontFamily.regular,
                        fontSize: Fonts.size.h10 - 1,
                        paddingVertical: MetricsRes.margin.base + 3,
                        ...customStyle,
                    }}
                >
                    {title && title}
                </Text>
                {icon && <Image source={icon} style={styles.sizeIcon}></Image>}
            </View>
        </TouchableOpacity>
    );
};

export default ButtonCustom;

const styles = StyleSheet.create({
    sizeIcon: {
        width: 24,
        height: 24,
        marginLeft: MetricsRes.margin.small,
    },
});
