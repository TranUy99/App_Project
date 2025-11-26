import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { ApplicationStyles, Colors, Fonts, MetricsRes } from "../../Themes";

import { authSelector, heartRateSelector } from "../../Redux/Reducers/selector";
import { GET_LATEST_HEARTRATE_REQUEST } from "../../Redux/Actions/HeartRateActions";

const PatientDetailScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dispatch = useDispatch();
    const { patientId } = route.params || {};

    const { dataUser } = useSelector(authSelector);
    const { loading, latestData, error } = useSelector(heartRateSelector);

    const [selectedTab, setSelectedTab] = useState<"vitals" | "history">("vitals");

    useEffect(() => {
        // Call API khi component mount
        if (dataUser?.token) {
            // dispatch(getLatestHeartRate(dataUser.token));
            dispatch({ type: GET_LATEST_HEARTRATE_REQUEST, payload: { token: dataUser.token } });
        }

        // Refresh data every 30 seconds
    }, []);

    // Parse API data
    const getVitalsFromAPI = () => {
        if (!latestData?.aiDiagnosis) {
            return null;
        }

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
            timestamp: latestData?.diagnosedAt || new Date().toISOString(),
            acceleration: {
                x: acc[0]?.toFixed(2) || 0,
                y: acc[1]?.toFixed(2) || 0,
                z: acc[2]?.toFixed(2) || 0,
            },
        };
    };

    const apiVitals = getVitalsFromAPI();

    // Mock patient data
    const patient = {
        id: patientId || latestData?.data?.userId || "N/A",
        name: "Patient " + (patientId || latestData?.data?.userId?.slice(-4) || ""),
        age: 65,
        gender: "N/A",
        room: "101",
        bed: "A",
        admissionDate: "2024-01-15",
        diagnosis: apiVitals?.diagnosis || "Awaiting diagnosis",
        doctor: "BS. Trần Văn B",
        status: apiVitals?.severity || "unknown",
    };

    const recentReadings = [
        { time: "14:30", hr: 78, spO2: 98, temp: 36.8, bp: "120/80" },
        { time: "14:00", hr: 76, spO2: 97, temp: 36.7, bp: "118/78" },
        { time: "13:30", hr: 80, spO2: 98, temp: 36.9, bp: "122/82" },
        { time: "13:00", hr: 77, spO2: 97, temp: 36.8, bp: "119/79" },
    ];

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

    console.log("Rendered PatientDetailScreen with latestData:", latestData);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color={Colors.textBlack} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Patient Details</Text>
                <TouchableOpacity
                    onPress={() => {
                        if (dataUser?.token) {
                            dispatch({ type: GET_LATEST_HEARTRATE_REQUEST, payload: { token: dataUser.token } });
                        }
                    }}
                >
                    <Icon name="refresh" size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            {loading && !latestData ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading patient data...</Text>
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Icon name="alert-circle" size={48} color={Colors.red} />
                    <Text style={styles.errorText}>Failed to load data</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            if (dataUser?.token) {
                                dispatch({ type: GET_LATEST_HEARTRATE_REQUEST, payload: { token: dataUser.token } });
                            }
                        }}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView>
                    {/* Patient Info Card */}
                    <View style={styles.infoCard}>
                        <View style={styles.patientHeader}>
                            <View style={[styles.avatar, { backgroundColor: getStatusColor(patient.status) + "20" }]}>
                                <Icon name="person" size={40} color={getStatusColor(patient.status)} />
                            </View>
                            <View style={styles.patientInfo}>
                                <Text style={styles.patientName}>{patient.name}</Text>
                                <Text style={styles.patientMeta}>
                                    {patient.age} tuổi • {patient.gender}
                                </Text>
                                <Text style={styles.patientMeta}>
                                    Room {patient.room} - Bed {patient.bed}
                                </Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(patient.status) }]}>
                                <Text style={styles.statusText}>{patient.status.toUpperCase()}</Text>
                            </View>
                        </View>

                        <View style={styles.infoGrid}>
                            <View style={styles.infoItem}>
                                <Icon name="medical" size={16} color={Colors.textGray} />
                                <Text style={styles.infoLabel}>Diagnosis</Text>
                                <Text style={styles.infoValue}>{patient.diagnosis}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Icon name="person" size={16} color={Colors.textGray} />
                                <Text style={styles.infoLabel}>Doctor</Text>
                                <Text style={styles.infoValue}>{patient.doctor}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Icon name="calendar" size={16} color={Colors.textGray} />
                                <Text style={styles.infoLabel}>Last Updated</Text>
                                <Text style={styles.infoValue}>{apiVitals?.timestamp ? new Date(apiVitals.timestamp).toLocaleString("vi-VN") : "N/A"}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity style={[styles.tab, selectedTab === "vitals" && styles.tabActive]} onPress={() => setSelectedTab("vitals")}>
                            <Text style={[styles.tabText, selectedTab === "vitals" && styles.tabTextActive]}>Current Vitals</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.tab, selectedTab === "history" && styles.tabActive]} onPress={() => setSelectedTab("history")}>
                            <Text style={[styles.tabText, selectedTab === "history" && styles.tabTextActive]}>Recent History</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Current Vitals */}
                    {selectedTab === "vitals" && apiVitals && (
                        <View style={styles.vitalsContainer}>
                            {/* Heart Rate from API */}
                            <View style={styles.vitalCard}>
                                <View style={styles.vitalHeader}>
                                    <Icon name={apiVitals.heartRate.icon} size={24} color={apiVitals.heartRate.color} />
                                    <Text style={styles.vitalTitle}>Heart Rate</Text>
                                </View>
                                <Text style={[styles.vitalValue, { color: apiVitals.heartRate.color }]}>
                                    {apiVitals.heartRate.value} <Text style={styles.vitalUnit}>{apiVitals.heartRate.unit}</Text>
                                </Text>
                                <Text style={styles.vitalRange}>Normal: {apiVitals.heartRate.range}</Text>
                                <View style={[styles.severityBadge, { backgroundColor: apiVitals.heartRate.color + "20" }]}>
                                    <Text style={[styles.severityText, { color: apiVitals.heartRate.color }]}>{apiVitals.severity.toUpperCase()}</Text>
                                </View>
                            </View>

                            {/* Acceleration Data */}
                            <View style={styles.vitalCard}>
                                <View style={styles.vitalHeader}>
                                    <Icon name="speedometer" size={24} color={Colors.blue} />
                                    <Text style={styles.vitalTitle}>Acceleration</Text>
                                </View>
                                <View style={styles.accContainer}>
                                    <Text style={styles.accText}>X: {apiVitals.acceleration.x}</Text>
                                    <Text style={styles.accText}>Y: {apiVitals.acceleration.y}</Text>
                                    <Text style={styles.accText}>Z: {apiVitals.acceleration.z}</Text>
                                </View>
                            </View>

                            {/* AI Analysis */}
                            <View style={[styles.vitalCard, { width: "98%" }]}>
                                <View style={styles.vitalHeader}>
                                    <Icon name="analytics" size={24} color={Colors.purple} />
                                    <Text style={styles.vitalTitle}>AI Analysis</Text>
                                </View>
                                <Text style={styles.analysisText}>{apiVitals.analysis}</Text>
                            </View>

                            {/* Recommendations */}
                            {apiVitals.recommendations.length > 0 && (
                                <View style={[styles.vitalCard, { width: "98%" }]}>
                                    <View style={styles.vitalHeader}>
                                        <Icon name="medical" size={24} color={Colors.green} />
                                        <Text style={styles.vitalTitle}>Recommendations</Text>
                                    </View>
                                    {apiVitals.recommendations.map((rec: string, index: number) => (
                                        <View key={index} style={styles.recommendationItem}>
                                            <Icon name="checkmark-circle" size={16} color={Colors.green} />
                                            <Text style={styles.recommendationText}>{rec}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Risk Factors */}
                            {apiVitals.riskFactors.length > 0 && (
                                <View style={[styles.vitalCard, { width: "98%" }]}>
                                    <View style={styles.vitalHeader}>
                                        <Icon name="warning" size={24} color={Colors.orange} />
                                        <Text style={styles.vitalTitle}>Risk Factors</Text>
                                    </View>
                                    {apiVitals.riskFactors.map((risk: string, index: number) => (
                                        <View key={index} style={styles.riskItem}>
                                            <Icon name="alert-circle" size={16} color={Colors.orange} />
                                            <Text style={styles.riskText}>{risk}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    {/* Recent History */}
                    {selectedTab === "history" && (
                        <View style={styles.historyContainer}>
                            <Text style={styles.sectionTitle}>Last 4 Hours</Text>
                            {recentReadings.map((reading, index) => (
                                <View key={index} style={styles.historyCard}>
                                    <Text style={styles.historyTime}>{reading.time}</Text>
                                    <View style={styles.historyValues}>
                                        <Text style={styles.historyValue}>
                                            <Icon name="heart" size={14} color={Colors.red} /> {reading.hr}
                                        </Text>
                                        <Text style={styles.historyValue}>
                                            <Icon name="water" size={14} color={Colors.blue} /> {reading.spO2}%
                                        </Text>
                                        <Text style={styles.historyValue}>
                                            <Icon name="thermometer" size={14} color={Colors.green} /> {reading.temp}°C
                                        </Text>
                                        <Text style={styles.historyValue}>
                                            <Icon name="fitness" size={14} color={Colors.primary} /> {reading.bp}
                                        </Text>
                                    </View>
                                </View>
                            ))}

                            <TouchableOpacity style={styles.viewFullButton} onPress={() => navigation.navigate("HistoryScreen", { patientId })}>
                                <Text style={styles.viewFullText}>View Full History</Text>
                                <Icon name="arrow-forward" size={16} color={Colors.primary} />
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Action Buttons */}
                    <View style={styles.actionContainer}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Icon name="add-circle-outline" size={24} color={Colors.primary} />
                            <Text style={styles.actionButtonText}>Add Reading</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Icon name="document-text-outline" size={24} color={Colors.primary} />
                            <Text style={styles.actionButtonText}>View Records</Text>
                        </TouchableOpacity>
                    </View>
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
    infoCard: {
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
    patientHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: MetricsRes.margin.large,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
        marginRight: MetricsRes.margin.base,
    },
    patientInfo: {
        flex: 1,
    },
    patientName: {
        fontSize: Fonts.size.h20,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
    },
    patientMeta: {
        fontSize: Fonts.size.h14,
        color: Colors.textGray,
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: Colors.white,
        fontSize: Fonts.size.h12,
        fontFamily: ApplicationStyles.fontFamily.bold,
    },
    infoGrid: {
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
        paddingTop: MetricsRes.margin.base,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: MetricsRes.margin.base,
    },
    infoLabel: {
        fontSize: Fonts.size.h14,
        color: Colors.textGray,
        marginLeft: MetricsRes.margin.small,
        width: 80,
    },
    infoValue: {
        flex: 1,
        fontSize: Fonts.size.h14,
        color: Colors.textBlack,
        fontFamily: ApplicationStyles.fontFamily.semiBold,
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: Colors.white,
        marginHorizontal: MetricsRes.margin.base,
        marginTop: MetricsRes.margin.base,
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: MetricsRes.margin.base,
        alignItems: "center",
        borderRadius: 10,
    },
    tabActive: {
        backgroundColor: Colors.primary,
    },
    tabText: {
        fontSize: Fonts.size.h14,
        fontFamily: ApplicationStyles.fontFamily.semiBold,
        color: Colors.textGray,
    },
    tabTextActive: {
        color: Colors.white,
    },
    vitalsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: MetricsRes.margin.base,
    },
    vitalCard: {
        width: "48%",
        backgroundColor: Colors.white,
        padding: MetricsRes.margin.base,
        borderRadius: 12,
        marginBottom: MetricsRes.margin.base,
        marginHorizontal: "1%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    vitalHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: MetricsRes.margin.small,
    },
    vitalTitle: {
        fontSize: Fonts.size.h14,
        fontFamily: ApplicationStyles.fontFamily.semiBold,
        color: Colors.textBlack,
        marginLeft: MetricsRes.margin.small,
    },
    vitalValue: {
        fontSize: Fonts.size.h28,
        fontFamily: ApplicationStyles.fontFamily.bold,
        marginVertical: MetricsRes.margin.small,
    },
    vitalUnit: {
        fontSize: Fonts.size.h16,
        fontFamily: ApplicationStyles.fontFamily.regular,
    },
    vitalRange: {
        fontSize: Fonts.size.h12,
        color: Colors.textGray,
    },
    historyContainer: {
        padding: MetricsRes.margin.base,
    },
    sectionTitle: {
        fontSize: Fonts.size.h18,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
        marginBottom: MetricsRes.margin.base,
    },
    historyCard: {
        flexDirection: "row",
        backgroundColor: Colors.white,
        padding: MetricsRes.margin.base,
        borderRadius: 12,
        marginBottom: MetricsRes.margin.small,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    historyTime: {
        fontSize: Fonts.size.h16,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.primary,
        width: 60,
    },
    historyValues: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
    },
    historyValue: {
        fontSize: Fonts.size.h14,
        color: Colors.textBlack,
        fontFamily: ApplicationStyles.fontFamily.semiBold,
    },
    viewFullButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.white,
        padding: MetricsRes.margin.base,
        borderRadius: 12,
        marginTop: MetricsRes.margin.base,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    viewFullText: {
        fontSize: Fonts.size.h16,
        fontFamily: ApplicationStyles.fontFamily.semiBold,
        color: Colors.primary,
        marginRight: MetricsRes.margin.small,
    },
    actionContainer: {
        flexDirection: "row",
        padding: MetricsRes.margin.base,
        paddingBottom: MetricsRes.margin.huge,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.white,
        padding: MetricsRes.margin.base,
        borderRadius: 12,
        marginHorizontal: MetricsRes.margin.small,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    actionButtonText: {
        fontSize: Fonts.size.h14,
        fontFamily: ApplicationStyles.fontFamily.semiBold,
        color: Colors.primary,
        marginLeft: MetricsRes.margin.small,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: MetricsRes.margin.huge,
    },
    loadingText: {
        fontSize: Fonts.size.h16,
        fontFamily: ApplicationStyles.fontFamily.regular,
        color: Colors.textGray,
        marginTop: MetricsRes.margin.base,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: MetricsRes.margin.huge,
    },
    errorText: {
        fontSize: Fonts.size.h18,
        fontFamily: ApplicationStyles.fontFamily.semiBold,
        color: Colors.red,
        marginTop: MetricsRes.margin.base,
        marginBottom: MetricsRes.margin.large,
    },
    retryButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: MetricsRes.margin.huge,
        paddingVertical: MetricsRes.margin.base,
        borderRadius: 12,
    },
    retryButtonText: {
        fontSize: Fonts.size.h16,
        fontFamily: ApplicationStyles.fontFamily.semiBold,
        color: Colors.white,
    },
    severityBadge: {
        marginTop: MetricsRes.margin.small,
        paddingHorizontal: MetricsRes.margin.base,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    severityText: {
        fontSize: Fonts.size.h12,
        fontFamily: ApplicationStyles.fontFamily.bold,
    },
    accContainer: {
        marginTop: MetricsRes.margin.base,
    },
    accText: {
        fontSize: Fonts.size.h14,
        fontFamily: ApplicationStyles.fontFamily.semiBold,
        color: Colors.textBlack,
        marginBottom: 4,
    },
    analysisText: {
        fontSize: Fonts.size.h14,
        fontFamily: ApplicationStyles.fontFamily.regular,
        color: Colors.textBlack,
        lineHeight: 20,
        marginTop: MetricsRes.margin.small,
    },
    recommendationItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: MetricsRes.margin.small,
    },
    recommendationText: {
        flex: 1,
        fontSize: Fonts.size.h14,
        fontFamily: ApplicationStyles.fontFamily.regular,
        color: Colors.textBlack,
        marginLeft: MetricsRes.margin.small,
        lineHeight: 20,
    },
    riskItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: MetricsRes.margin.small,
    },
    riskText: {
        flex: 1,
        fontSize: Fonts.size.h14,
        fontFamily: ApplicationStyles.fontFamily.regular,
        color: Colors.textBlack,
        marginLeft: MetricsRes.margin.small,
        lineHeight: 20,
    },
});

export default PatientDetailScreen;
