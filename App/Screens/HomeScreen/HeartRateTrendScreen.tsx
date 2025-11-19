import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { ApplicationStyles, Colors, Fonts, MetricsRes } from "../../Themes";

const HeartRateTrendScreen = () => {
    const [trendData, setTrendData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(7);
    const navigation = useNavigation();

    useEffect(() => {
        fetchTrend();
    }, [selectedPeriod]);

    const fetchTrend = async () => {};

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={28} color={Colors.textBlack} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI Trend Analysis</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.periodSelector}>
                {[7, 14, 30].map((days) => (
                    <TouchableOpacity key={days} style={[styles.periodButton, selectedPeriod === days && styles.periodButtonActive]} onPress={() => setSelectedPeriod(days)}>
                        <Text style={[styles.periodText, selectedPeriod === days && styles.periodTextActive]}>{days} days</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <ScrollView style={styles.content}>
                    {trendData && (
                        <>
                            <View style={styles.card}>
                                <Icon name="trending-up" size={32} color={Colors.primary} />
                                <Text style={styles.cardTitle}>Trend Overview</Text>
                                <Text style={styles.trendText}>{trendData.trend || "Analyzing..."}</Text>
                            </View>

                            {trendData.insights && (
                                <View style={styles.card}>
                                    <Icon name="bulb" size={32} color={Colors.orange} />
                                    <Text style={styles.cardTitle}>AI Insights</Text>
                                    <Text style={styles.insightText}>{trendData.insights}</Text>
                                </View>
                            )}

                            {trendData.recommendations && (
                                <View style={styles.card}>
                                    <Icon name="checkmark-circle" size={32} color={Colors.green} />
                                    <Text style={styles.cardTitle}>Recommendations</Text>
                                    {trendData.recommendations.map((rec: string, index: number) => (
                                        <View key={index} style={styles.recommendationItem}>
                                            <Icon name="chevron-forward" size={16} color={Colors.primary} />
                                            <Text style={styles.recommendationText}>{rec}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {trendData.statistics && (
                                <View style={styles.statsGrid}>
                                    <View style={styles.statBox}>
                                        <Text style={styles.statValue}>{trendData.statistics.average}</Text>
                                        <Text style={styles.statLabel}>Avg BPM</Text>
                                    </View>
                                    <View style={styles.statBox}>
                                        <Text style={styles.statValue}>{trendData.statistics.variability}</Text>
                                        <Text style={styles.statLabel}>Variability</Text>
                                    </View>
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>
            )}
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
    periodSelector: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: MetricsRes.margin.base,
        backgroundColor: Colors.white,
    },
    periodButton: {
        paddingVertical: MetricsRes.margin.small,
        paddingHorizontal: MetricsRes.margin.base,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    periodButtonActive: {
        backgroundColor: Colors.primary,
    },
    periodText: {
        fontSize: Fonts.size.h14,
        color: Colors.primary,
    },
    periodTextActive: {
        color: Colors.white,
        fontFamily: ApplicationStyles.fontFamily.bold,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        padding: MetricsRes.margin.base,
    },
    card: {
        backgroundColor: Colors.white,
        padding: MetricsRes.margin.large,
        borderRadius: 15,
        marginBottom: MetricsRes.margin.base,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: Fonts.size.h18,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
        marginTop: MetricsRes.margin.small,
        marginBottom: MetricsRes.margin.base,
    },
    trendText: {
        fontSize: Fonts.size.h16,
        color: Colors.textGray,
        lineHeight: 24,
    },
    insightText: {
        fontSize: Fonts.size.h14,
        color: Colors.textGray,
        lineHeight: 22,
    },
    recommendationItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: MetricsRes.margin.small,
    },
    recommendationText: {
        flex: 1,
        fontSize: Fonts.size.h14,
        color: Colors.textBlack,
        marginLeft: MetricsRes.margin.small,
    },
    statsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    statBox: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: MetricsRes.margin.base,
        borderRadius: 10,
        marginHorizontal: MetricsRes.margin.small / 2,
        alignItems: "center",
    },
    statValue: {
        fontSize: Fonts.size.h24,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.primary,
    },
    statLabel: {
        fontSize: Fonts.size.h12,
        color: Colors.gray,
        marginTop: MetricsRes.margin.small / 2,
    },
});

export default HeartRateTrendScreen;
