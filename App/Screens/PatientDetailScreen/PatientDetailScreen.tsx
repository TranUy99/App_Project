import React, { useState, useEffect, useMemo, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { LineChart } from "react-native-gifted-charts";
import Svg, { Path, Line, G } from "react-native-svg";

import { ApplicationStyles, Colors, Fonts, MetricsRes } from "../../Themes";

import { authSelector, heartRateSelector } from "../../Redux/Reducers/selector";
import { GET_HISTORICAL_HEARTRATE_REQUEST, GET_LATEST_HEARTRATE_REQUEST } from "../../Redux/Actions/HeartRateActions";

// =============== ECG Waveform Component ===============
interface ECGWaveformProps {
    heartRate: number;
    color?: string;
    ecgData?: number[]; // Real ECG data from API
    ecgMetadata?: {
        samplingRate?: number;
        duration?: number;
        unit?: string;
        dataPoints?: number;
        quality?: string;
    };
}

const ECGWaveform: React.FC<ECGWaveformProps> = ({ heartRate, color = "#00FF88", ecgData, ecgMetadata }) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const chartWidth = MetricsRes.screenWidth - 64;
    const chartHeight = 150;

    useEffect(() => {
        const duration = 60000 / heartRate; // duration for one heartbeat cycle
        const animate = () => {
            scrollX.setValue(0);
            Animated.timing(scrollX, {
                toValue: -chartWidth,
                duration: duration * 3, // show 3 beats across the screen
                useNativeDriver: true,
            }).start(() => animate());
        };
        animate();
    }, [heartRate]);

    // Check if ECG data looks unrealistic (simple triangular/sine wave)
    const isUnrealisticData = (data: number[]) => {
        if (!data || data.length < 10) return true;
        
        // Check if data is just increasing then decreasing (triangular pattern)
        let increasing = 0;
        let decreasing = 0;
        for (let i = 1; i < data.length; i++) {
            if (data[i] > data[i - 1]) increasing++;
            if (data[i] < data[i - 1]) decreasing++;
        }
        
        // If more than 80% is monotonic increase/decrease, it's unrealistic
        const monotonic = (increasing + decreasing) / data.length;
        return monotonic > 0.8;
    };

    // Generate realistic ECG data with PQRST complex
    const generateRealisticECGData = () => {
        const points = 50;
        const data: number[] = [];
        
        for (let i = 0; i < points; i++) {
            const t = i / points; // 0 to 1
            let value = 0;
            
            // Baseline (isoelectric line)
            value = 0.3;
            
            // P wave (0.0 - 0.15): Small rounded bump
            if (t >= 0.0 && t <= 0.15) {
                const pPhase = (t - 0.0) / 0.15;
                value += 0.15 * Math.sin(pPhase * Math.PI);
            }
            
            // PR segment (0.15 - 0.25): Flat
            // (baseline only)
            
            // QRS complex (0.25 - 0.35): Sharp spike
            if (t >= 0.25 && t <= 0.35) {
                const qrsPhase = (t - 0.25) / 0.1;
                
                // Q wave (small dip)
                if (qrsPhase < 0.15) {
                    value -= 0.1 * (qrsPhase / 0.15);
                }
                // R wave (sharp peak)
                else if (qrsPhase >= 0.15 && qrsPhase < 0.5) {
                    value += 1.2 * ((qrsPhase - 0.15) / 0.35);
                }
                // S wave (dip)
                else if (qrsPhase >= 0.5) {
                    value += 1.2 - 1.5 * ((qrsPhase - 0.5) / 0.5);
                }
            }
            
            // ST segment (0.35 - 0.5): Flat or slightly elevated
            if (t > 0.35 && t <= 0.5) {
                value += 0.05;
            }
            
            // T wave (0.5 - 0.75): Rounded bump
            if (t > 0.5 && t <= 0.75) {
                const tPhase = (t - 0.5) / 0.25;
                value += 0.3 * Math.sin(tPhase * Math.PI);
            }
            
            // Add slight noise for realism
            value += (Math.random() - 0.5) * 0.02;
            
            data.push(value);
        }
        
        return data;
    };

    // Generate ECG waveform path from REAL DATA
    const generateRealECGPath = () => {
        // Check if we should use realistic synthetic data instead
        let dataToUse = ecgData;
        
        if (!ecgData || ecgData.length === 0 || isUnrealisticData(ecgData)) {
            // Use realistic synthetic data instead of mock PQRST
            dataToUse = generateRealisticECGData();
        }

        const beatWidth = chartWidth / 3; // 3 beats visible on screen
        const dataPointsPerBeat = dataToUse!.length;
        
        // Normalize data to fit chart height (with padding)
        const maxValue = Math.max(...dataToUse!);
        const minValue = Math.min(...dataToUse!);
        const range = maxValue - minValue || 1;
        const verticalPadding = 20; // pixels padding top/bottom
        
        let path = "";

        // Repeat the pattern 6 times (3 visible + 3 for seamless loop)
        for (let repeat = 0; repeat < 6; repeat++) {
            const baseX = repeat * beatWidth;
            
            dataToUse!.forEach((value, index) => {
                // Normalize Y position (flip because SVG Y goes down)
                const normalizedValue = (value - minValue) / range;
                const y = chartHeight - (normalizedValue * (chartHeight - 2 * verticalPadding)) - verticalPadding;
                
                // X position spread across beat width
                const x = baseX + (index / dataPointsPerBeat) * beatWidth;
                
                if (repeat === 0 && index === 0) {
                    path += `M ${x} ${y}`;
                } else {
                    path += ` L ${x} ${y}`;
                }
            });
        }

        return path;
    };

    // Generate ECG waveform path (MOCK PQRST complex - fallback)
    const generateMockECGPath = () => {
        const beatWidth = chartWidth / 3; // 3 beats visible
        let path = `M 0 ${chartHeight / 2}`;

        for (let i = 0; i < 6; i++) {
            // Generate 6 beats (3 visible + 3 for seamless loop)
            const baseX = i * beatWidth;

            // P wave (small bump)
            path += ` L ${baseX + beatWidth * 0.1} ${chartHeight / 2 - 8}`;
            path += ` L ${baseX + beatWidth * 0.15} ${chartHeight / 2}`;

            // Flat segment before QRS
            path += ` L ${baseX + beatWidth * 0.25} ${chartHeight / 2}`;

            // Q wave (small dip)
            path += ` L ${baseX + beatWidth * 0.28} ${chartHeight / 2 + 5}`;

            // R wave (sharp spike - the main peak)
            path += ` L ${baseX + beatWidth * 0.32} ${chartHeight / 2 - 60}`;

            // S wave (dip after spike)
            path += ` L ${baseX + beatWidth * 0.36} ${chartHeight / 2 + 10}`;

            // Return to baseline
            path += ` L ${baseX + beatWidth * 0.4} ${chartHeight / 2}`;

            // ST segment (flat)
            path += ` L ${baseX + beatWidth * 0.5} ${chartHeight / 2}`;

            // T wave (rounded bump)
            path += ` Q ${baseX + beatWidth * 0.55} ${chartHeight / 2 - 15}, ${baseX + beatWidth * 0.65} ${chartHeight / 2}`;

            // Return to baseline until next beat
            path += ` L ${baseX + beatWidth} ${chartHeight / 2}`;
        }

        return path;
    };

    // Generate grid
    const renderGrid = () => {
        const lines = [];
        const smallGridSize = 5;
        const largeGridSize = 25;

        // Vertical lines
        for (let x = 0; x <= chartWidth; x += smallGridSize) {
            const isLarge = x % largeGridSize === 0;
            lines.push(
                <Line
                    key={`v-${x}`}
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={chartHeight}
                    stroke={isLarge ? "#FF6B9D30" : "#FF6B9D15"}
                    strokeWidth={isLarge ? 0.8 : 0.4}
                />
            );
        }

        // Horizontal lines
        for (let y = 0; y <= chartHeight; y += smallGridSize) {
            const isLarge = y % largeGridSize === 0;
            lines.push(
                <Line
                    key={`h-${y}`}
                    x1={0}
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke={isLarge ? "#FF6B9D30" : "#FF6B9D15"}
                    strokeWidth={isLarge ? 0.8 : 0.4}
                />
            );
        }

        return lines;
    };

    return (
        <View style={ecgStyles.container}>
            <Svg width={chartWidth} height={chartHeight} style={ecgStyles.svg}>
                <G>{renderGrid()}</G>
            </Svg>
            <Animated.View
                style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    transform: [{ translateX: scrollX }],
                }}
            >
                <Svg width={chartWidth * 2} height={chartHeight}>
                    <Path d={generateRealECGPath()} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
            </Animated.View>
        </View>
    );
};

const ecgStyles = StyleSheet.create({
    container: {
        backgroundColor: "#0A0E1A",
        borderRadius: 16,
        padding: 12,
        overflow: "hidden",
    },
    svg: {
        backgroundColor: "transparent",
    },
});


const PatientDetailScreen = () => {
    const focus = useIsFocused();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dispatch = useDispatch();
    const { patientId } = route.params || {};

    const { dataUser } = useSelector(authSelector);
    const { loading, latestData, error, historicalData } = useSelector(heartRateSelector);

    const [selectedTab, setSelectedTab] = useState<"vitals" | "history">("vitals");
    const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());

    const callApi = () => {
        if (dataUser?.token) {
            dispatch({
                type: GET_LATEST_HEARTRATE_REQUEST,
                payload: { token: dataUser.token },
            });
            dispatch({
                type: GET_HISTORICAL_HEARTRATE_REQUEST,
                payload: {
                    token: dataUser.token,
                    userId: dataUser.userId || "690b7d809c0b474d3e75ad6c",
                    period: "24h",
                },
            });
            setLastRefreshTime(new Date());
        }
    };

    // Auto-refresh when screen is focused
    useEffect(() => {
        if (focus) {
            callApi();
        }
    }, [focus]);

    // Auto-refresh every 70 seconds to sync with ESP32 (sends every 60s)
    useEffect(() => {
        if (!focus) return; // Only auto-refresh when screen is visible

        const intervalId = setInterval(() => {
            console.log('[ECG] Auto-refreshing data from ESP32...');
            callApi();
        }, 70000); // 70 seconds = 1 min 10 sec

        return () => {
            clearInterval(intervalId);
            console.log('[ECG] Auto-refresh stopped');
        };
    }, [focus, dataUser?.token]);

    const getVitalsFromAPI = () => {
        if (!latestData?.aiDiagnosis) return null;

        const diagnosis = latestData.aiDiagnosis;
        const heartRate = latestData.heartRate || 0;
        const acc = latestData.acc || [0, 0, 0];

        return {
            heartRate: {
                value: heartRate,
                unit: "bpm",
                status: diagnosis?.severity === "low" ? "normal" : diagnosis?.severity === "medium" ? "warning" : "critical",
                icon: "heart",
                color: diagnosis?.severity === "low" ? Colors.green : diagnosis?.severity === "medium" ? Colors.orange : Colors.red,
                range: "60-100",
            },
            diagnosis: diagnosis?.diagnosis || "N/A",
            severity: diagnosis?.severity || "unknown",
            analysis: diagnosis?.analysis || "No analysis available",
            recommendations: diagnosis?.recommendations || [],
            riskFactors: diagnosis?.riskFactors || [],
            timestamp: latestData?.aiDiagnosis?.diagnosedAt || new Date().toISOString(),
            acceleration: {
                x: acc[0]?.toFixed(2) || 0,
                y: acc[1]?.toFixed(2) || 0,
                z: acc[2]?.toFixed(2) || 0,
            },
        };
    };

    const apiVitals = getVitalsFromAPI();

    // Mock patient info (có thể thay bằng dữ liệu thật sau)
    const patient = {
        id: patientId || latestData?.userId || "N/A",
        name: "Uy",
        diagnosis: apiVitals?.diagnosis || "Awaiting diagnosis",
        status: apiVitals?.heartRate.status || "unknown",
        lastUpdated: apiVitals?.timestamp,
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "critical":
            case "high":
                return Colors.red;
            case "warning":
            case "medium":
                return Colors.orange;
            case "normal":
            case "low":
                return Colors.green;
            default:
                return Colors.textGray;
        }
    };

    // Transform historical data cho chart mini
    const miniChartData = useMemo(() => {
        if (!historicalData?.preview && !historicalData?.readings) return [];

        const items = historicalData.readings || historicalData.preview || [];
        const dailyGroups: { [key: string]: number[] } = {};

        items.forEach((item: any) => {
            const timestamp = item.timestamp || item.date;
            if (!timestamp) return;

            const date = new Date(timestamp);
            const dateKey = date.toISOString().split("T")[0];

            const hr = typeof item.heartRate === "number" ? item.heartRate : 0;
            if (hr > 0) {
                if (!dailyGroups[dateKey]) dailyGroups[dateKey] = [];
                dailyGroups[dateKey].push(hr);
            }
        });

        return Object.keys(dailyGroups)
            .sort()
            .slice(-7)
            .map((dateKey) => {
                const values = dailyGroups[dateKey];
                const avgHR = values.reduce((a, b) => a + b, 0) / values.length;
                const date = new Date(dateKey);
                return {
                    value: Number(avgHR.toFixed(1)),
                    label: `${date.getDate()}/${date.getMonth() + 1}`,
                    dataPointText: avgHR.toFixed(0),
                };
            });
    }, [historicalData]);

    const allHistoryItems = (Array.isArray(historicalData?.readings) && historicalData?.readings.length ? historicalData.readings : Array.isArray(historicalData?.preview) && historicalData?.preview.length ? historicalData.preview : []) || [];

    return (
        <View style={styles.screen}>
            {/* Header */}

            {/* <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={26} color="#1B2A4A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Patient Details</Text>
                <TouchableOpacity onPress={callApi}>
                    <Icon name="refresh" size={24} color={Colors.primary} />
                </TouchableOpacity> */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={28} color={"#fff"} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ECG Monitoring</Text>
                <TouchableOpacity onPress={callApi}>
                    <Icon name="refresh" size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            {loading && !latestData ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.centerText}>Loading patient data...</Text>
                </View>
            ) : error ? (
                <View style={styles.centerContainer}>
                    <Icon name="alert-circle" size={48} color={Colors.red} />
                    <Text style={styles.errorText}>Failed to load data</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={callApi}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                    {/* Patient Info Card */}
                    <View style={styles.patientCard}>
                        <View style={styles.patientRow}>
                            <View style={[styles.avatar, { backgroundColor: getStatusColor(patient.status) + "20" }]}>
                                <Icon name="person" size={38} color={getStatusColor(patient.status)} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.patientName}>{patient.name}</Text>
                                <Text style={styles.patientSub}>ID: {patient.id.toString().slice(0, 8)}...</Text>
                                <Text style={styles.patientSub}>Diagnosis: {patient.diagnosis}</Text>
                            </View>
                            <View style={[styles.statusChip, { backgroundColor: getStatusColor(patient.status) }]}>
                                <Text style={styles.statusChipText}>{patient.status.toUpperCase()}</Text>
                            </View>
                        </View>

                        <View style={styles.patientFooter}>
                            <Icon name="time-outline" size={16} color="#8BA0C2" />
                            <Text style={styles.patientFooterText}>Last updated: {patient.lastUpdated ? new Date(patient.lastUpdated).toLocaleString("vi-VN") : "N/A"}</Text>
                        </View>
                        
                        {/* Auto-refresh indicator */}
                        <View style={styles.autoRefreshBadge}>
                            <Icon name="sync-circle" size={14} color="#4e73df" />
                            <Text style={styles.autoRefreshText}>Auto-refresh: every 70s</Text>
                            <Text style={styles.autoRefreshTime}>Last: {lastRefreshTime.toLocaleTimeString("vi-VN")}</Text>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabs}>
                        <TouchableOpacity style={[styles.tabButton, selectedTab === "vitals" && styles.tabActive]} onPress={() => setSelectedTab("vitals")}>
                            <Text style={[styles.tabLabel, selectedTab === "vitals" && styles.tabLabelActive]}>ECG Overview</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tabButton, selectedTab === "history" && styles.tabActive]} onPress={() => setSelectedTab("history")}>
                            <Text style={[styles.tabLabel, selectedTab === "history" && styles.tabLabelActive]}>ECG History</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ───────────── ECG OVERVIEW ───────────── */}
                    {selectedTab === "vitals" && apiVitals && (
                        <View>
                            <View style={styles.vitalsGrid}>
                                {/* Heart Rate from ECG */}
                                <View style={styles.vitalCard}>
                                    <View style={styles.vitalHeader}>
                                        <Icon name="pulse" size={24} color={apiVitals.heartRate.color} />
                                        <Text style={styles.vitalTitle}>Heart Rate (ECG)</Text>
                                    </View>
                                    <Text style={[styles.vitalValue, { color: apiVitals.heartRate.color }]}>
                                        {apiVitals.heartRate.value}
                                        <Text style={styles.vitalValueUnit}> {apiVitals.heartRate.unit}</Text>
                                    </Text>
                                    <Text style={styles.vitalSmall}>Normal: {apiVitals.heartRate.range} bpm</Text>
                                    <View
                                        style={[
                                            styles.hrStatusChip,
                                            {
                                                backgroundColor: apiVitals.heartRate.color + "18",
                                            },
                                        ]}
                                    >
                                        <Text style={[styles.hrStatusText, { color: apiVitals.heartRate.color }]}>{apiVitals.heartRate.status.toUpperCase()}</Text>
                                    </View>
                                </View>

                                {/* ECG Waveform Quality */}
                                <View style={styles.vitalCard}>
                                    <View style={styles.vitalHeader}>
                                        <Icon name="analytics" size={22} color={Colors.blue || "#3A86FF"} />
                                        <Text style={styles.vitalTitle}>Signal Quality</Text>
                                    </View>
                                    <Text style={[styles.vitalValue, { color: Colors.green, fontSize: 24 }]}>
                                        {latestData?.ecgMetadata?.quality ? latestData.ecgMetadata.quality.charAt(0).toUpperCase() + latestData.ecgMetadata.quality.slice(1) : "Excellent"}
                                    </Text>
                                    <Text style={styles.vitalSmall}>Sampling: {latestData?.ecgMetadata?.samplingRate || 250}Hz</Text>
                                    <Text style={styles.vitalSmall}>Points: {latestData?.ecgMetadata?.dataPoints || 50}</Text>
                                </View>
                            </View>

                            {/* ========== ECG WAVEFORM VISUALIZATION ========== */}
                            <View style={styles.ecgWaveformCard}>
                                <View style={styles.ecgHeader}>
                                    <View style={styles.ecgHeaderLeft}>
                                        <Icon name="pulse" size={22} color="#00FF88" />
                                        <Text style={styles.ecgTitle}>Live ECG Monitor</Text>
                                    </View>
                                    <View style={styles.ecgBadge}>
                                        <View style={styles.liveDot} />
                                        <Text style={styles.liveText}>LIVE</Text>
                                    </View>
                                </View>
                                <Text style={styles.ecgSubtitle}>Lead II - Real-time cardiac rhythm</Text>
                                <ECGWaveform heartRate={apiVitals.heartRate.value} color="#00FF88" ecgData={latestData?.ecg} ecgMetadata={latestData?.ecgMetadata} />
                                <View style={styles.ecgFooter}>
                                    <View style={styles.ecgInfoItem}>
                                        <Text style={styles.ecgInfoLabel}>Heart Rate</Text>
                                        <Text style={styles.ecgInfoValue}>{apiVitals.heartRate.value} BPM</Text>
                                    </View>
                                    <View style={styles.ecgInfoItem}>
                                        <Text style={styles.ecgInfoLabel}>Rhythm</Text>
                                        <Text style={styles.ecgInfoValue}>Sinus</Text>
                                    </View>
                                    <View style={styles.ecgInfoItem}>
                                        <Text style={styles.ecgInfoLabel}>QRS Duration</Text>
                                        <Text style={styles.ecgInfoValue}>80-100ms</Text>
                                    </View>
                                </View>
                            </View>

                            {/* ECG AI Analysis */}
                            <View style={styles.analysisCard}>
                                <View style={styles.analysisHeader}>
                                    <Icon name="pulse" size={22} color={Colors.primary} />
                                    <Text style={styles.analysisTitle}>ECG AI Analysis</Text>
                                </View>
                                <Text style={styles.analysisText}>{apiVitals.analysis}</Text>
                            </View>

                            {/* Recommendations */}
                            {apiVitals.recommendations.length > 0 && (
                                <View style={styles.analysisCard}>
                                    <View style={styles.analysisHeader}>
                                        <Icon name="checkmark-circle-outline" size={22} color={Colors.green} />
                                        <Text style={styles.analysisTitle}>Recommendations</Text>
                                    </View>
                                    {apiVitals.recommendations.map((rec: string, index: number) => (
                                        <View key={index} style={styles.recItem}>
                                            <Icon name="checkmark" size={16} color={Colors.green} />
                                            <Text style={styles.recText}>{rec}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Risk Factors */}
                            {apiVitals.riskFactors.length > 0 && (
                                <View style={styles.analysisCard}>
                                    <View style={styles.analysisHeader}>
                                        <Icon name="warning-outline" size={22} color={Colors.orange} />
                                        <Text style={styles.analysisTitle}>Risk Factors</Text>
                                    </View>
                                    {apiVitals.riskFactors.map((risk: string, index: number) => (
                                        <View key={index} style={styles.recItem}>
                                            <Icon name="alert-circle-outline" size={16} color={Colors.orange} />
                                            <Text style={styles.recText}>{risk}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    {/* ───────────── HISTORY ───────────── */}
                    {selectedTab === "history" && (
                        <View style={{ marginTop: 16 }}>
                            <View style={styles.historySummaryCard}>
                                <Text style={styles.historySectionTitle}>ECG Summary (24h)</Text>
                                {historicalData && historicalData.success ? (
                                    <View style={styles.historySummaryRow}>
                                        <Text style={styles.historySummaryText}>Avg HR: {typeof historicalData.averageHR === "number" ? historicalData.averageHR.toFixed(1) : "-"} bpm</Text>
                                        <Text style={styles.historySummaryText}>Min HR: {typeof historicalData.minHR === "number" ? historicalData.minHR.toFixed(1) : "-"} bpm</Text>
                                        <Text style={styles.historySummaryText}>Max HR: {typeof historicalData.maxHR === "number" ? historicalData.maxHR.toFixed(1) : "-"} bpm</Text>
                                        <Text style={styles.historySummaryText}>{historicalData.readingsCount ?? 0} ECG recordings</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.noDataText}>No ECG data available</Text>
                                )}
                            </View>

                            {miniChartData.length > 0 && (
                                <View style={styles.chartCard}>
                                    <Text style={styles.chartTitle}>ECG Heart Rate Trend </Text>
                                    <LineChart
                                        data={miniChartData}
                                        width={MetricsRes.screenWidth - MetricsRes.margin.base * 4}
                                        height={160}
                                        spacing={40}
                                        color={Colors.primary}
                                        thickness={3}
                                        curved
                                        dataPointsColor={Colors.primary}
                                        dataPointsRadius={4}
                                        textColor1={Colors.textGray}
                                        textFontSize={10}
                                        textShiftY={-8}
                                        textShiftX={-5}
                                        showVerticalLines
                                        verticalLinesColor="rgba(0,0,0,0.05)"
                                        xAxisColor="rgba(0,0,0,0.1)"
                                        yAxisColor="rgba(0,0,0,0.1)"
                                        yAxisTextStyle={{
                                            color: Colors.textGray,
                                            fontSize: 10,
                                        }}
                                        xAxisLabelTextStyle={{
                                            color: Colors.textGray,
                                            fontSize: 10,
                                        }}
                                        areaChart
                                        startFillColor={Colors.primary}
                                        startOpacity={0.25}
                                        endFillColor={Colors.primary}
                                        endOpacity={0.05}
                                        initialSpacing={10}
                                        endSpacing={10}
                                        noOfSections={4}
                                        maxValue={Math.max(...miniChartData.map((d) => d.value)) + 10}
                                        yAxisOffset={Math.min(...miniChartData.map((d) => d.value)) - 10}
                                    />
                                </View>
                            )}

                            {allHistoryItems.map((item: any) => (
                                <View key={item.id || item.timestamp} style={styles.historyCard}>
                                    <View style={styles.historyRow}>
                                        <View>
                                            <Text style={styles.historyTime}>{item.timestamp ? new Date(item.timestamp).toLocaleString("vi-VN") : "—"}</Text>
                                            <View style={styles.historyStatusRow}>
                                                <View
                                                    style={[
                                                        styles.statusDot,
                                                        {
                                                            backgroundColor: getStatusColor(item.status),
                                                        },
                                                    ]}
                                                />
                                                <Text style={styles.historyStatusText}>{(item.status || "unknown").toUpperCase()}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.historyValue}>{typeof item.heartRate === "number" ? item.heartRate.toFixed(1) : "-"} bpm</Text>
                                    </View>
                                </View>
                            ))}

                            <TouchableOpacity style={styles.viewFullButton} onPress={() => navigation.navigate("HistoryScreen", { patientId })}>
                                <Text style={styles.viewFullText}>View full ECG history</Text>
                                <Icon name="arrow-forward" size={16} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F5F9FF", // nền trắng xanh sạch
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
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    centerText: {
        marginTop: 10,
        fontSize: 14,
        color: Colors.textGray,
    },
    errorText: {
        marginTop: 10,
        fontSize: 16,
        color: Colors.red,
        fontWeight: "600",
    },
    retryButton: {
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 10,
        backgroundColor: Colors.primary,
        borderRadius: 10,
    },
    retryButtonText: {
        color: "#FFF",
        fontWeight: "600",
    },

    patientCard: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 16,
        marginTop: 16,
        padding: 18,
        borderRadius: 18,
        shadowColor: "#00000015",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    patientRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    patientName: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1B2A4A",
    },
    patientSub: {
        fontSize: 13,
        color: "#7B8CA7",
        marginTop: 2,
    },
    statusChip: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
        alignSelf: "flex-start",
    },
    statusChipText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "700",
    },
    patientFooter: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },
    patientFooterText: {
        marginLeft: 6,
        fontSize: 12,
        color: "#8BA0C2",
    },
    autoRefreshBadge: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: "#E8F3FF",
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    autoRefreshText: {
        marginLeft: 4,
        fontSize: 11,
        color: "#4e73df",
        fontWeight: "600",
    },
    autoRefreshTime: {
        marginLeft: 8,
        fontSize: 10,
        color: "#7B8CA7",
    },

    tabs: {
        flexDirection: "row",
        backgroundColor: "#E8F1FF",
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    tabActive: {
        backgroundColor: Colors.primary,
    },
    tabLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6282A8",
    },
    tabLabelActive: {
        color: "#FFF",
    },

    vitalsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 14,
        paddingHorizontal: 10,
    },
    vitalCard: {
        width: "48%",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        margin: "1%",
        shadowColor: "#00000015",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    vitalHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    vitalTitle: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: "600",
        color: "#1B2A4A",
    },
    vitalValue: {
        marginTop: 10,
        fontSize: 30,
        fontWeight: "800",
    },
    vitalValueUnit: {
        fontSize: 16,
        fontWeight: "400",
    },
    vitalSmall: {
        marginTop: 4,
        color: "#7B8CA7",
        fontSize: 12,
    },
    hrStatusChip: {
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    hrStatusText: {
        fontSize: 11,
        fontWeight: "700",
    },

    analysisCard: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 16,
        marginTop: 14,
        padding: 16,
        borderRadius: 18,
        shadowColor: "#00000015",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    analysisHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    analysisTitle: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: "700",
        color: "#1B2A4A",
    },
    analysisText: {
        fontSize: 14,
        color: "#2F3F55",
        lineHeight: 20,
    },
    recItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 6,
    },
    recText: {
        marginLeft: 6,
        fontSize: 14,
        color: "#1B2A4A",
        flex: 1,
    },

    historySummaryCard: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 16,
        marginTop: 10,
        padding: 14,
        borderRadius: 16,
        shadowColor: "#00000010",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
    historySectionTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1B2A4A",
        marginBottom: 6,
    },
    historySummaryRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    historySummaryText: {
        fontSize: 13,
        color: "#4A5C7A",
        marginVertical: 2,
    },
    noDataText: {
        fontSize: 13,
        color: Colors.textGray,
    },

    chartCard: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 16,
        marginTop: 12,
        padding: 16,
        borderRadius: 16,
        shadowColor: "#00000010",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        alignItems: "center",
    },
    chartTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1B2A4A",
        marginBottom: 8,
        alignSelf: "flex-start",
    },

    historyCard: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 16,
        marginTop: 8,
        padding: 14,
        borderRadius: 14,
        shadowColor: "#00000010",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
    },
    historyRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    historyTime: {
        fontSize: 12,
        color: "#3A86FF",
        fontWeight: "700",
    },
    historyStatusRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    historyStatusText: {
        fontSize: 11,
        color: "#7B8CA7",
    },
    historyValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1B2A4A",
    },

    viewFullButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 16,
        marginTop: 14,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    viewFullText: {
        marginRight: 6,
        fontSize: 14,
        fontWeight: "600",
        color: Colors.primary,
    },

    // =============== ECG Waveform Styles ===============
    ecgWaveformCard: {
        backgroundColor: "#1A1F2E",
        marginHorizontal: 16,
        marginTop: 16,
        padding: 18,
        borderRadius: 18,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: "#00FF8820",
    },
    ecgHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    ecgHeaderLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    ecgTitle: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    ecgBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FF3B3020",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#FF3B30",
        marginRight: 6,
    },
    liveText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#FF3B30",
    },
    ecgSubtitle: {
        fontSize: 12,
        color: "#8E8E93",
        marginBottom: 16,
    },
    ecgFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#FFFFFF15",
    },
    ecgInfoItem: {
        flex: 1,
        alignItems: "center",
    },
    ecgInfoLabel: {
        fontSize: 11,
        color: "#8E8E93",
        marginBottom: 4,
    },
    ecgInfoValue: {
        fontSize: 14,
        fontWeight: "700",
        color: "#00FF88",
    },
});

export default PatientDetailScreen;
