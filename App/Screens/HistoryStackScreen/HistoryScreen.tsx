import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ApplicationStyles, Colors, Fonts, MetricsRes } from "../../Themes";

const { width } = Dimensions.get("window");

const HistoryScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { patientId } = route.params || {};

    const [selectedPeriod, setSelectedPeriod] = useState<"24h" | "7d" | "30d" | "all">("24h");
    const [selectedVital, setSelectedVital] = useState<"all" | "hr" | "spo2" | "temp" | "bp">("all");

    // Mock historical data
    const historicalData = [
        { date: "2024-01-20 08:00", hr: 75, spO2: 98, temp: 36.7, bp: "118/78", glucose: 105 },
        { date: "2024-01-20 12:00", hr: 78, spO2: 97, temp: 36.8, bp: "120/80", glucose: 110 },
        { date: "2024-01-20 16:00", hr: 80, spO2: 98, temp: 36.9, bp: "122/82", glucose: 115 },
        { date: "2024-01-20 20:00", hr: 76, spO2: 97, temp: 36.8, bp: "119/79", glucose: 108 },
        { date: "2024-01-21 00:00", hr: 72, spO2: 98, temp: 36.7, bp: "117/77", glucose: 102 },
        { date: "2024-01-21 04:00", hr: 70, spO2: 97, temp: 36.6, bp: "115/75", glucose: 100 },
        { date: "2024-01-21 08:00", hr: 74, spO2: 98, temp: 36.7, bp: "118/78", glucose: 106 },
        { date: "2024-01-21 12:00", hr: 79, spO2: 97, temp: 36.9, bp: "121/81", glucose: 112 },
    ];

    const vitalTypes = [
        { key: "all", label: "All Vitals", icon: "pulse" },
        { key: "hr", label: "Heart Rate", icon: "heart", color: Colors.red },
        { key: "spo2", label: "SpO2", icon: "water", color: Colors.blue },
        { key: "temp", label: "Temperature", icon: "thermometer", color: Colors.green },
        { key: "bp", label: "Blood Pressure", icon: "fitness", color: Colors.primary },
    ];

    const periods = [
        { key: "24h", label: "24h" },
        { key: "7d", label: "7 Days" },
        { key: "30d", label: "30 Days" },
        { key: "all", label: "All Time" },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color={Colors.textBlack} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Vital Signs History</Text>
                <TouchableOpacity onPress={() => {}}>
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
                        <Text style={styles.summaryValue}>Normal</Text>
                        <Text style={styles.summaryLabel}>Trend</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Icon name="stats-chart" size={24} color={Colors.primary} />
                        <Text style={styles.summaryValue}>{historicalData.length}</Text>
                        <Text style={styles.summaryLabel}>Readings</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Icon name="checkmark-circle" size={24} color={Colors.blue} />
                        <Text style={styles.summaryValue}>98%</Text>
                        <Text style={styles.summaryLabel}>In Range</Text>
                    </View>
                </View>

                {/* Chart Placeholder */}
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>{vitalTypes.find((v) => v.key === selectedVital)?.label || "All Vitals"} Trend</Text>
                    <View style={styles.chartPlaceholder}>
                        <Icon name="analytics" size={80} color={Colors.textGray + "40"} />
                        <Text style={styles.chartPlaceholderText}>Chart visualization will appear here</Text>
                        <Text style={styles.chartPlaceholderSubtext}>Install react-native-chart-kit for visual graphs</Text>
                    </View>
                </View>

                {/* Statistics Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Average HR</Text>
                        <Text style={[styles.statValue, { color: Colors.red }]}>76 bpm</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Avg SpO2</Text>
                        <Text style={[styles.statValue, { color: Colors.blue }]}>97.6%</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Avg Temp</Text>
                        <Text style={[styles.statValue, { color: Colors.green }]}>36.8°C</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Avg BP</Text>
                        <Text style={[styles.statValue, { color: Colors.primary }]}>119/79</Text>
                    </View>
                </View>

                {/* Detailed Readings Table */}
                <View style={styles.tableCard}>
                    <Text style={styles.tableTitle}>Detailed Readings</Text>

                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Date & Time</Text>
                        <Text style={styles.tableHeaderText}>HR</Text>
                        <Text style={styles.tableHeaderText}>SpO2</Text>
                        <Text style={styles.tableHeaderText}>Temp</Text>
                        <Text style={styles.tableHeaderText}>BP</Text>
                    </View>

                    {/* Table Rows */}
                    {historicalData.map((reading, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>
                                {new Date(reading.date).toLocaleDateString("vi-VN", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Text>
                            <Text style={[styles.tableCell, styles.tableCellValue]}>{reading.hr}</Text>
                            <Text style={[styles.tableCell, styles.tableCellValue]}>{reading.spO2}%</Text>
                            <Text style={[styles.tableCell, styles.tableCellValue]}>{reading.temp}°</Text>
                            <Text style={[styles.tableCell, styles.tableCellValue]}>{reading.bp}</Text>
                        </View>
                    ))}
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
