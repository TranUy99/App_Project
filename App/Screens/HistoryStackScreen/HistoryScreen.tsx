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

    // Transform readingsArray into chart data format
    const chartData = useMemo(() => {
        return readingsArray.map((reading: any, index: number) => {
            const hr = typeof reading.heartRate === "number" ? reading.heartRate : typeof reading.hr === "number" ? reading.hr : 0;
            const timestamp = reading.timestamp || reading.date || reading.time;
            const label = timestamp ? new Date(timestamp).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : `${index}`;

            return {
                value: Number(hr.toFixed(1)),
                label: label,
                dataPointText: hr.toFixed(1),
            };
        });
    }, [readingsArray]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color={Colors.textBlack} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Vital Signs History</Text>
                <TouchableOpacity onPress={() => callApi()}>
                    <Icon name="download-outline" size={24} color={Colors.primary} />
                </TouchableOpacity>
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

                {/* Chart Card with react-native-gifted-charts */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>{vitalTypes.find((v) => v.key === selectedVital)?.label || "Heart Rate"} Trend</Text>
                    {chartData.length > 0 ? (
                        <LineChart data={chartData} width={width - MetricsRes.margin.base * 4} height={180} spacing={Math.max(40, (width - 100) / Math.max(chartData.length, 1))} color={Colors.primary} thickness={2} startFillColor={Colors.primary + "40"} endFillColor={Colors.primary + "10"} areaChart curved hideDataPoints={false} dataPointsColor={Colors.primary} dataPointsRadius={4} textColor1={Colors.textGray} textFontSize={10} hideRules={false} rulesColor="#e0e0e0" rulesType="solid" initialSpacing={10} endSpacing={10} yAxisColor="#e0e0e0" xAxisColor="#e0e0e0" yAxisTextStyle={{ color: Colors.textGray, fontSize: 10 }} xAxisLabelTextStyle={{ color: Colors.textGray, fontSize: 9, width: 40, textAlign: "center" }} showVerticalLines={false} noOfSections={4} />
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
                <TouchableOpacity style={styles.exportButton}>
                    <Icon name="document-text" size={20} color={Colors.white} />
                    <Text style={styles.exportButtonText}>Export Report (PDF)</Text>
                </TouchableOpacity>
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: MetricsRes.margin.large,
        backgroundColor: Colors.white,
        marginTop: MetricsRes.screenHeight * 0.05,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    headerTitle: {
        fontSize: Fonts.size.h20,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
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
