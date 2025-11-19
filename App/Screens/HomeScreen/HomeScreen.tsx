import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Alert } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { ApplicationStyles, Colors, Fonts, MetricsRes } from "../../Themes";

const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const [latestData, setLatestData] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
    };

    const getHeartRateStatus = (heartRate: number) => {
        if (heartRate < 60) return { text: "Low", color: Colors.blue };
        if (heartRate > 100) return { text: "High", color: Colors.red };
        return { text: "Normal", color: Colors.green };
    };

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Heart Rate Monitor</Text>
                <TouchableOpacity onPress={() => navigation.navigate("ProfileStackScreen", { screen: "ProfileScreen" })}>
                    <Icon name="person-circle-outline" size={32} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Latest Heart Rate Card */}
            {latestData && (
                <View style={[styles.card, styles.latestCard]}>
                    <Icon name="heart" size={40} color={Colors.red} />
                    <Text style={styles.latestValue}>{latestData.heartRate}</Text>
                    <Text style={styles.latestLabel}>BPM</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getHeartRateStatus(latestData.heartRate).color }]}>
                        <Text style={styles.statusText}>{getHeartRateStatus(latestData.heartRate).text}</Text>
                    </View>
                    {latestData.aiDiagnosis && <Text style={styles.diagnosis}>AI: {latestData.aiDiagnosis}</Text>}
                </View>
            )}

            {/* Alerts Section */}
            {alerts.length > 0 && (
                <View style={styles.alertsSection}>
                    <Text style={styles.sectionTitle}>⚠️ Alerts & Warnings</Text>
                    {alerts.slice(0, 3).map((alert, index) => (
                        <View key={index} style={styles.alertCard}>
                            <Icon name="warning" size={20} color={Colors.orange} />
                            <Text style={styles.alertText}>{alert.message}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Stats Cards */}
            {stats && (
                <View style={styles.statsContainer}>
                    <Text style={styles.sectionTitle}>Statistics</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Icon name="trending-up" size={24} color={Colors.primary} />
                            <Text style={styles.statValue}>{stats.average || 0}</Text>
                            <Text style={styles.statLabel}>Average</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Icon name="arrow-up" size={24} color={Colors.red} />
                            <Text style={styles.statValue}>{stats.max || 0}</Text>
                            <Text style={styles.statLabel}>Max</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Icon name="arrow-down" size={24} color={Colors.blue} />
                            <Text style={styles.statValue}>{stats.min || 0}</Text>
                            <Text style={styles.statLabel}>Min</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={() => navigation.navigate("HomeStackScreen", { screen: "RecordHeartRateScreen" })}>
                    <Icon name="add-circle" size={24} color={Colors.white} />
                    <Text style={styles.actionButtonText}>Record New</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("HomeStackScreen", { screen: "HeartRateHistoryScreen" })}>
                    <Icon name="time-outline" size={24} color={Colors.primary} />
                    <Text style={[styles.actionButtonText, { color: Colors.primary }]}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("HomeStackScreen", { screen: "HeartRateTrendScreen" })}>
                    <Icon name="analytics-outline" size={24} color={Colors.primary} />
                    <Text style={[styles.actionButtonText, { color: Colors.primary }]}>AI Trend</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
        padding: MetricsRes.margin.large,
        backgroundColor: Colors.white,
        marginTop: MetricsRes.screenHeight * 0.05,
    },
    headerTitle: {
        fontSize: Fonts.size.h24,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
    },
    card: {
        backgroundColor: Colors.white,
        margin: MetricsRes.margin.base,
        padding: MetricsRes.margin.large,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    latestCard: {
        alignItems: "center",
        marginTop: MetricsRes.margin.large,
    },
    latestValue: {
        fontSize: 64,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.primary,
        marginVertical: MetricsRes.margin.small,
    },
    latestLabel: {
        fontSize: Fonts.size.h18,
        color: Colors.gray,
    },
    statusBadge: {
        paddingHorizontal: MetricsRes.margin.base,
        paddingVertical: MetricsRes.margin.small / 2,
        borderRadius: 20,
        marginTop: MetricsRes.margin.base,
    },
    statusText: {
        color: Colors.white,
        fontFamily: ApplicationStyles.fontFamily.bold,
        fontSize: Fonts.size.h14,
    },
    diagnosis: {
        marginTop: MetricsRes.margin.base,
        fontSize: Fonts.size.h14,
        color: Colors.textGray,
        textAlign: "center",
    },
    alertsSection: {
        margin: MetricsRes.margin.base,
    },
    sectionTitle: {
        fontSize: Fonts.size.h20,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
        marginBottom: MetricsRes.margin.base,
    },
    alertCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF3CD",
        padding: MetricsRes.margin.base,
        borderRadius: 10,
        marginBottom: MetricsRes.margin.small,
    },
    alertText: {
        marginLeft: MetricsRes.margin.small,
        flex: 1,
        fontSize: Fonts.size.h14,
        color: Colors.textBlack,
    },
    statsContainer: {
        margin: MetricsRes.margin.base,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: MetricsRes.margin.base,
        borderRadius: 10,
        alignItems: "center",
        marginHorizontal: MetricsRes.margin.small / 2,
    },
    statValue: {
        fontSize: Fonts.size.h24,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
        marginVertical: MetricsRes.margin.small / 2,
    },
    statLabel: {
        fontSize: Fonts.size.h12,
        color: Colors.gray,
    },
    actionsContainer: {
        margin: MetricsRes.margin.base,
        marginBottom: MetricsRes.margin.huge,
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.white,
        padding: MetricsRes.margin.base,
        borderRadius: 10,
        marginBottom: MetricsRes.margin.base,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    primaryButton: {
        backgroundColor: Colors.primary,
        borderWidth: 0,
    },
    actionButtonText: {
        marginLeft: MetricsRes.margin.small,
        fontSize: Fonts.size.h16,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.white,
    },
});

export default HomeScreen;
