import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { ApplicationStyles, Colors, Fonts, MetricsRes } from "../../Themes";

const HeartRateHistoryScreen = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {};

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    const getStatusColor = (heartRate: number) => {
        if (heartRate < 60) return Colors.blue;
        if (heartRate > 100) return Colors.red;
        return Colors.green;
    };

    const renderItem = ({ item }: any) => (
        <View style={styles.historyItem}>
            <View style={styles.itemLeft}>
                <Icon name="heart" size={24} color={getStatusColor(item.heartRate)} />
                <View style={styles.itemInfo}>
                    <Text style={styles.heartRateText}>{item.heartRate} BPM</Text>
                    <Text style={styles.dateText}>{formatDate(item.timestamp || item.createdAt)}</Text>
                    {item.aiDiagnosis && <Text style={styles.diagnosisText}>AI: {item.aiDiagnosis}</Text>}
                </View>
            </View>
            <TouchableOpacity onPress={() => handleReDiagnose(item.id)}>
                <Icon name="refresh" size={20} color={Colors.primary} />
            </TouchableOpacity>
        </View>
    );

    const handleReDiagnose = async (id: string) => {};

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={28} color={Colors.textBlack} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>History</Text>
                <View style={{ width: 28 }} />
            </View>

            <FlatList data={history} renderItem={renderItem} keyExtractor={(item, index) => item.id || index.toString()} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={styles.listContainer} ListEmptyComponent={<Text style={styles.emptyText}>No history available</Text>} />
        </View>
    );
};

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
    listContainer: {
        padding: MetricsRes.margin.base,
    },
    historyItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Colors.white,
        padding: MetricsRes.margin.base,
        borderRadius: 10,
        marginBottom: MetricsRes.margin.base,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    itemInfo: {
        marginLeft: MetricsRes.margin.base,
        flex: 1,
    },
    heartRateText: {
        fontSize: Fonts.size.h18,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
    },
    dateText: {
        fontSize: Fonts.size.h12,
        color: Colors.gray,
        marginTop: 2,
    },
    diagnosisText: {
        fontSize: Fonts.size.h12,
        color: Colors.textGray,
        marginTop: 4,
        fontStyle: "italic",
    },
    emptyText: {
        textAlign: "center",
        fontSize: Fonts.size.h16,
        color: Colors.gray,
        marginTop: MetricsRes.margin.huge,
    },
});

export default HeartRateHistoryScreen;
