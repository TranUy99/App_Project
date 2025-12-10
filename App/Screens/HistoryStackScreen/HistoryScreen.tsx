import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ApplicationStyles, Colors, Fonts, MetricsRes } from "../../Themes";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, heartRateSelector } from "../../Redux/Reducers/selector";
import { GET_HISTORICAL_HEARTRATE_REQUEST } from "../../Redux/Actions/HeartRateActions";
import { LineChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

const HistoryScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dispatch = useDispatch();
    const { dataUser } = useSelector(authSelector);

    const { loading, latestData, error, historicalData } = useSelector(heartRateSelector);

    const [selectedPeriod, setSelectedPeriod] = useState<"24h" | "7d" | "30d" | "all">("24h");
    const [selectedVital, setSelectedVital] = useState<"all" | "hr" | "spo2" | "temp" | "bp">("all");

    const callApi = (period?: string) => {
        if (dataUser?.token) {
            dispatch({
                type: GET_HISTORICAL_HEARTRATE_REQUEST,
                payload: {
                    token: dataUser.token,
                    userId: dataUser.userId || "690b7d809c0b474d3e75ad6c",
                    period: period || selectedPeriod,
                },
            });
        }
    };

    useEffect(() => {
        // call on mount and when token or selectedPeriod changes
        callApi(selectedPeriod);
    }, [dataUser?.token, selectedPeriod]);

    // Normalize readings array from API shape (readings || preview) or empty
    const readingsArray = useMemo(() => {
        if (!historicalData) return [];
        if (Array.isArray(historicalData.readings) && historicalData.readings.length) return historicalData.readings;
        if (Array.isArray(historicalData.preview) && historicalData.preview.length) return historicalData.preview;
        // If historicalData itself is an array (legacy), return it
        if (Array.isArray(historicalData)) return historicalData;
        return [];
    }, [historicalData]);

    // Compute stats (prefer API summary fields if present)
    const stats = useMemo(() => {
        if (!historicalData) return { avg: "-", min: "-", max: "-", count: 0 };
        const avg = typeof historicalData.averageHR === "number" ? Number(historicalData.averageHR).toFixed(1) : null;
        const min = typeof historicalData.minHR === "number" ? Number(historicalData.minHR).toFixed(1) : null;
        const max = typeof historicalData.maxHR === "number" ? Number(historicalData.maxHR).toFixed(1) : null;
        const count = historicalData.readingsCount ?? readingsArray.length;

        // If API didn't provide avg/min/max, compute from readingsArray
        if (avg !== null || min !== null || max !== null) {
            return { avg: avg ?? "-", min: min ?? "-", max: max ?? "-", count };
        }
        const hrValues = readingsArray.map((r: any) => (typeof r.heartRate === "number" ? r.heartRate : typeof r.hr === "number" ? r.hr : NaN)).filter((v: any) => !Number.isNaN(v));
        if (!hrValues.length) return { avg: "-", min: "-", max: "-", count };
        const computedAvg = (hrValues.reduce((a: number, b: number) => a + b, 0) / hrValues.length).toFixed(1);
        const computedMin = Math.min(...hrValues).toFixed(1);
        const computedMax = Math.max(...hrValues).toFixed(1);
        return { avg: computedAvg, min: computedMin, max: computedMax, count };
    }, [historicalData, readingsArray]);

    const vitalTypes = [{ key: "hr", label: "Heart Rate", icon: "heart", color: Colors.red }];

    const periods = [
        { key: "24h", label: "24h" },
        { key: "7d", label: "7 Days" },
        { key: "30d", label: "30 Days" },
        { key: "all", label: "All Time" },
    ];

    // Transform readingsArray into daily average chart data
    const chartData = useMemo(() => {
        if (readingsArray.length === 0) return [];

        // Group readings by date (YYYY-MM-DD)
        const dailyGroups: { [key: string]: number[] } = {};

        readingsArray.forEach((reading: any) => {
            const timestamp = reading.timestamp || reading.date || reading.time;
            if (!timestamp) return;

            const date = new Date(timestamp);
            const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

            const hr = typeof reading.heartRate === "number" ? reading.heartRate : typeof reading.hr === "number" ? reading.hr : null;
            if (hr !== null) {
                if (!dailyGroups[dateKey]) dailyGroups[dateKey] = [];
                dailyGroups[dateKey].push(hr);
            }
        });

        // Compute average per day and format for chart
        const dailyData = Object.keys(dailyGroups)
            .sort() // chronological order
            .map((dateKey) => {
                const values = dailyGroups[dateKey];
                const avgHR = values.reduce((a, b) => a + b, 0) / values.length;

                // Format label: "Jan 15" or "15/01"
                const date = new Date(dateKey);
                const label = date.toLocaleDateString("vi-VN", { day: "numeric", month: "short" });

                return {
                    value: Number(avgHR.toFixed(1)),
                    label: label,
                    dataPointText: avgHR.toFixed(1),
                };
            });

        return dailyData;
    }, [readingsArray]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={28} color={Colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Signs History</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView>
                {/* Period Selector */}
                <View style={styles.periodContainer}>
                    {periods.map((period) => (
                        <TouchableOpacity key={period.key} style={[styles.periodButton, selectedPeriod === period.key && styles.periodButtonActive]} onPress={() => setSelectedPeriod(period.key as any)}>
                            <Text style={[styles.periodText, selectedPeriod === period.key && styles.periodTextActive]}>{period.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Vital Type Filter */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
                    {vitalTypes.map((vital) => (
                        <TouchableOpacity key={vital.key} style={[styles.filterButton, selectedVital === vital.key && styles.filterButtonActive, selectedVital === vital.key && vital.color && { backgroundColor: vital.color }]} onPress={() => setSelectedVital(vital.key as any)}>
                            <Icon name={vital.icon} size={18} color={selectedVital === vital.key ? Colors.white : vital.color || Colors.textGray} />
                            <Text style={[styles.filterText, selectedVital === vital.key && styles.filterTextActive]}>{vital.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Summary Cards */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryCard}>
                        <Icon name="trending-up" size={24} color={Colors.green} />
                        <Text style={styles.summaryValue}>{stats.avg !== "-" ? `${stats.avg} bpm` : "-"}</Text>
                        <Text style={styles.summaryLabel}>Average HR</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Icon name="stats-chart" size={24} color={Colors.primary} />
                        <Text style={styles.summaryValue}>{stats.count}</Text>
                        <Text style={styles.summaryLabel}>Readings</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Icon name="checkmark-circle" size={24} color={Colors.blue} />
                        <Text style={styles.summaryValue}>{stats.min !== "-" ? `${stats.min}/${stats.max}` : "-"}</Text>
                        <Text style={styles.summaryLabel}>Min / Max HR</Text>
                    </View>
                </View>

                {/* Chart Card with daily data */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>{vitalTypes.find((v) => v.key === selectedVital)?.label || "Heart Rate"} Trend (Daily Average)</Text>
                    {chartData.length > 0 ? (
                        <LineChart
                            data={chartData}
                            width={width - MetricsRes.margin.base * 4}
                            height={200}
                            spacing={Math.max(50, (width - 100) / Math.max(chartData.length, 1))}
                            color={Colors.primary}
                            thickness={3}
                            startFillColor={Colors.primary + "30"}
                            endFillColor={Colors.primary + "05"}
                            areaChart
                            curved
                            hideDataPoints={false}
                            dataPointsColor={Colors.primary}
                            dataPointsRadius={5}
                            textColor1={Colors.textGray}
                            textFontSize={11}
                            hideRules={false}
                            rulesColor="#e0e0e0"
                            rulesType="solid"
                            initialSpacing={20}
                            endSpacing={20}
                            yAxisColor="#e0e0e0"
                            xAxisColor="#e0e0e0"
                            yAxisTextStyle={{ color: Colors.textGray, fontSize: 11 }}
                            xAxisLabelTextStyle={{ color: Colors.textGray, fontSize: 10, width: 50, textAlign: "center" }}
                            showVerticalLines={false}
                            noOfSections={5}
                            maxValue={stats.max !== "-" ? Math.ceil(Number(stats.max) * 1.1) : undefined}
                            pointerConfig={{
                                pointerStripHeight: 180,
                                pointerStripColor: Colors.primary + "40",
                                pointerStripWidth: 2,
                                pointerColor: Colors.primary,
                                radius: 6,
                                pointerLabelWidth: 100,
                                pointerLabelHeight: 90,
                                activatePointersOnLongPress: true,
                                autoAdjustPointerLabelPosition: false,
                                pointerLabelComponent: (items: any) => {
                                    return (
                                        <View
                                            style={{
                                                height: 70,
                                                width: 90,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: Colors.white,
                                                borderRadius: 8,
                                                borderWidth: 1,
                                                borderColor: Colors.primary,
                                                padding: 8,
                                            }}
                                        >
                                            <Text style={{ color: Colors.textBlack, fontSize: 12, fontFamily: ApplicationStyles.fontFamily.bold }}>{items[0].value} bpm</Text>
                                            <Text style={{ color: Colors.textGray, fontSize: 10, marginTop: 4 }}>{items[0].label}</Text>
                                        </View>
                                    );
                                },
                            }}
                        />
                    ) : (
                        <View style={styles.chartPlaceholder}>
                            <Icon name="analytics" size={80} color={Colors.textGray + "40"} />
                            <Text style={styles.chartPlaceholderText}>No chart data available</Text>
                        </View>
                    )}
                </View>

                {/* Statistics Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Average HR</Text>
                        <Text style={[styles.statValue, { color: Colors.red }]}>{stats.avg !== "-" ? `${stats.avg} bpm` : "-"}</Text>
                    </View>
                </View>

                {/* Detailed Readings Table */}
                <View style={styles.tableCard}>
                    <Text style={styles.tableTitle}>Detailed Readings</Text>

                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Date & Time</Text>

                        <Text style={styles.tableHeaderText}>Heart Rate</Text>
                    </View>

                    {/* Table Rows */}
                    {readingsArray.length === 0 ? (
                        <View style={{ padding: MetricsRes.margin.base }}>
                            <Text style={{ textAlign: "center", color: Colors.textGray }}>No data available for selected period.</Text>
                        </View>
                    ) : (
                        readingsArray.map((reading: any, index: number) => {
                            const timestamp = reading.timestamp || reading.date || reading.time || null;
                            const hr = typeof reading.heartRate === "number" ? reading.heartRate : reading.hr;

                            const dateLabel = timestamp ? new Date(timestamp).toLocaleString("vi-VN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";
                            return (
                                <View key={reading.id || index} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { flex: 2 }]}>{dateLabel}</Text>
                                    <Text style={[styles.tableCell, styles.tableCellValue]}>{hr !== undefined ? Number(hr).toFixed(1) : "-"}</Text>
                                </View>
                            );
                        })
                    )}
                </View>

                {/* Export Button */}
            </ScrollView>
        </View>
    );
};

export default HistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background || "#f5f5f5",
    },
    header: {
        backgroundColor: "#4e73df",
        paddingVertical: 18,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 55,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "700",
    },
    periodContainer: {
        flexDirection: "row",
        backgroundColor: Colors.white,
        margin: MetricsRes.margin.base,
        padding: 4,
        borderRadius: 12,
    },
    periodButton: {
        flex: 1,
        paddingVertical: MetricsRes.margin.base,
        alignItems: "center",
        borderRadius: 10,
    },
    periodButtonActive: {
        backgroundColor: Colors.primary,
    },
    periodText: {
        fontSize: Fonts.size.h14,
        fontFamily: ApplicationStyles.fontFamily.semiBold,
        color: Colors.textGray,
    },
    periodTextActive: {
        color: Colors.white,
    },
    filterContainer: {
        marginHorizontal: MetricsRes.margin.base,
        marginBottom: MetricsRes.margin.base,
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
        paddingHorizontal: MetricsRes.margin.base,
        paddingVertical: MetricsRes.margin.small,
        borderRadius: 20,
        marginRight: MetricsRes.margin.small,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    filterButtonActive: {
        borderColor: "transparent",
    },
    filterText: {
        fontSize: Fonts.size.h14,
        fontFamily: ApplicationStyles.fontFamily.semiBold,
        color: Colors.textGray,
        marginLeft: MetricsRes.margin.small,
    },
    filterTextActive: {
        color: Colors.white,
    },
    summaryContainer: {
        flexDirection: "row",
        paddingHorizontal: MetricsRes.margin.base,
        marginBottom: MetricsRes.margin.base,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: MetricsRes.margin.base,
        borderRadius: 12,
        alignItems: "center",
        marginHorizontal: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryValue: {
        fontSize: Fonts.size.h20,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
        marginTop: MetricsRes.margin.small,
    },
    summaryLabel: {
        fontSize: Fonts.size.h12,
        color: Colors.textGray,
        marginTop: 4,
    },
    chartCard: {
        backgroundColor: Colors.white,
        margin: MetricsRes.margin.base,
        padding: MetricsRes.margin.large,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    chartTitle: {
        fontSize: Fonts.size.h18,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
        marginBottom: MetricsRes.margin.base,
    },
    chartPlaceholder: {
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderStyle: "dashed",
    },
    chartPlaceholderText: {
        fontSize: Fonts.size.h14,
        color: Colors.textGray,
        marginTop: MetricsRes.margin.base,
    },
    chartPlaceholderSubtext: {
        fontSize: Fonts.size.h12,
        color: Colors.textGray,
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: MetricsRes.margin.base,
        marginBottom: MetricsRes.margin.base,
    },
    statCard: {
        width: "48%",
        backgroundColor: Colors.white,
        padding: MetricsRes.margin.base,
        borderRadius: 12,
        marginBottom: MetricsRes.margin.small,
        marginHorizontal: "1%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    statLabel: {
        fontSize: Fonts.size.h12,
        color: Colors.textGray,
    },
    statValue: {
        fontSize: Fonts.size.h24,
        fontFamily: ApplicationStyles.fontFamily.bold,
        marginTop: 4,
    },
    tableCard: {
        backgroundColor: Colors.white,
        margin: MetricsRes.margin.base,
        padding: MetricsRes.margin.base,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tableTitle: {
        fontSize: Fonts.size.h18,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
        marginBottom: MetricsRes.margin.base,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 2,
        borderBottomColor: Colors.primary,
        paddingBottom: MetricsRes.margin.small,
    },
    tableHeaderText: {
        flex: 1,
        fontSize: Fonts.size.h12,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
        textAlign: "center",
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: MetricsRes.margin.base,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    tableCell: {
        flex: 1,
        fontSize: Fonts.size.h12,
        color: Colors.textGray,
        textAlign: "center",
    },
    tableCellValue: {
        fontFamily: ApplicationStyles.fontFamily.semiBold,
        color: Colors.textBlack,
    },
    exportButton: {
        flexDirection: "row",
        backgroundColor: Colors.primary,
        marginHorizontal: MetricsRes.margin.base,
        marginBottom: MetricsRes.margin.huge,
        padding: MetricsRes.margin.base,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    exportButtonText: {
        fontSize: Fonts.size.h16,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.white,
        marginLeft: MetricsRes.margin.small,
    },
});
