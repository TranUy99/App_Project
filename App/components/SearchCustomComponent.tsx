import { Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";
import { ApplicationStyles, Colors, Fonts, Images, MetricsRes } from "../Themes";

const SearchCustomComponent = ({ container = {}, search = "", filterIcon = false, filterPress = () => {}, onChangeText = (txt: string) => {}, placeholder = "Nhập mã đơn, tên KH..." }) => {
    const clearSearch = () => {
        onChangeText("");
    };

    return (
        <View style={{ ...container }}>
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <TextInput
                        //
                        style={[
                            styles.searchInput,
                            {
                                fontFamily: ApplicationStyles.fontFamily.regular
                            },
                        ]}
                        placeholder={placeholder}
                        placeholderTextColor={Colors.textDisable}
                        value={search}
                        onChangeText={onChangeText}
                    />
                    <View>
                        {search !== "" && (
                            <TouchableOpacity onPress={() => clearSearch()}>
                                {/* <Image source={Images.ic_clear_input} style={styles.iconClose} /> */}
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={[styles.searchButton, { paddingVertical: Platform.OS === "ios" ? 10 : 15 }]}>
                        {/* <Image
                            source={Images.icon_search}
                            style={{
                                width: MetricsRes.screenWidth / 22,
                                height: MetricsRes.screenWidth / 22,
                            }}
                        /> */}
                    </View>
                </View>
            </View>
        </View>
    );
};

export default SearchCustomComponent;

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: "row",
        marginTop: MetricsRes.margin.base,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: Colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: "rgba(16, 24, 40, 0.05)",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.7,
        shadowRadius: 4,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: MetricsRes.margin.base,
        fontSize: Fonts.size.h16,
        fontFamily: ApplicationStyles.fontFamily.regular,
        color: Colors.textBlack,
        fontWeight: "500",
    },
    searchButton: {
        backgroundColor: Colors.primary,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        width: MetricsRes.screenWidth / 9,

        paddingLeft: 15,
        marginRight: -1,
    },
    filterButton: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: MetricsRes.margin.small + 2,
    },
    iconClose: {
        width: MetricsRes.screenWidth / 25,
        height: MetricsRes.screenWidth / 25,
        marginTop: Platform.OS == "ios" ? MetricsRes.margin.base - 2 : MetricsRes.margin.medium - 2,
        marginRight: MetricsRes.margin.small,
    },
});
