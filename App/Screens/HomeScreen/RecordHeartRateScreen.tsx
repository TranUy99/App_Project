/* -----------------------------------------
   UI ĐẸP HƠN – GRADIENT – CARD SOFT SHADOW
------------------------------------------*/

import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, Animated } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import { ApplicationStyles, Colors, Fonts, MetricsRes } from "../../Themes";
import { useDispatch, useSelector } from "react-redux";
import { HEARTRATE_ANALYZE_REQUEST } from "../../Redux/Actions/HeartRateActions";
import { authSelector, heartRateSelector } from "../../Redux/Reducers/selector";

const RecordHeartRateScreen = () => {
    const isFocused = useIsFocused();
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();

    const [heartRate, setHeartRate] = useState("");
    const [showResult, setShowResult] = useState(false);

    const { dataUser } = useSelector(authSelector);
    const { loading, analyzeData } = useSelector(heartRateSelector);

    // Animation
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
        }).start();
    }, [showResult]);

    useEffect(() => {
        if (analyzeData && analyzeData.success) {
            setShowResult(true);
        }
    }, [analyzeData]);

    useEffect(() => {
        if (isFocused) {
            setShowResult(false);
        }
    }, [isFocused]);

    const handleRecord = () => {
        if (!heartRate || isNaN(Number(heartRate)) || Number(heartRate) <= 0) {
            Alert.alert("Invalid Input", "Please enter a valid heart rate value");
            return;
        }

        dispatch({
            type: HEARTRATE_ANALYZE_REQUEST,
            payload: { data: { heartRate: Number(heartRate) }, token: dataUser.token },
        });
    };

    const getSeverityColor = (severity: string) => {
        switch (severity?.toLowerCase()) {
            case "critical":
            case "high":
                return "#ff4d4d";
            case "medium":
            case "warning":
                return "#ffb84d";
            case "low":
            case "normal":
                return "#4CAF50";
            default:
                return "#777";
        }
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={28} color={"#fff"} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Analyze Heart Rate</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* --------------------------------------
                     INPUT MODE
                ----------------------------------------*/}
                {!showResult ? (
                    <Animated.View style={[styles.inputContent, { opacity: fadeAnim }]}>
                        <Icon name="heart-circle" size={90} color={"#ff6b6b"} style={{ marginBottom: 20 }} />

                        <Text style={styles.label}>Enter your Heart Rate (BPM)</Text>

                        {/* Input Field */}
                        <View style={styles.inputContainer}>
                            <TextInput style={styles.input} value={heartRate} onChangeText={setHeartRate} placeholder="72" keyboardType="numeric" maxLength={3} placeholderTextColor={"#aaa"} />
                        </View>

                        {/* Analyze Button */}
                        <TouchableOpacity style={[styles.analyzeButton, loading && { opacity: 0.6 }]} onPress={handleRecord} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.analyzeButtonText}>Analyze</Text>}
                        </TouchableOpacity>

                        <Text style={styles.note}>AI-powered biomedical analysis</Text>
                    </Animated.View>
                ) : (
                    /* --------------------------------------
                       RESULT MODE
                    ----------------------------------------*/
                    <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
                        {/* Result Icon */}
                        <View style={styles.resultHeader}>
                            <Icon name="pulse" size={70} color={getSeverityColor(analyzeData?.severity)} />
                            <Text style={styles.resultTitle}>Analysis Result</Text>
                            <Text style={styles.resultTimestamp}>{new Date(analyzeData?.timestamp || "").toLocaleString("vi-VN")}</Text>
                        </View>

                        {/* Diagnosis Card */}
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Icon name="medical" size={22} color="#4e73df" />
                                <Text style={styles.cardTitle}>Diagnosis</Text>
                            </View>

                            <Text style={styles.bigResultText}>{analyzeData?.diagnosis?.diagnosis || "N/A"}</Text>

                            <View style={[styles.severityChip, { backgroundColor: getSeverityColor(analyzeData?.severity) }]}>
                                <Text style={styles.severityChipText}>{(analyzeData?.severity || "unknown").toUpperCase()}</Text>
                            </View>
                        </View>

                        {/* Analysis Description */}
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Icon name="document-text" size={22} color="#4e73df" />
                                <Text style={styles.cardTitle}>Detailed Analysis</Text>
                            </View>

                            <Text style={styles.textBody}>{analyzeData?.analysis || analyzeData?.diagnosis?.analysis || "No analysis available"}</Text>
                        </View>

                        {/* Recommendations */}
                        {analyzeData?.recommendations?.length > 0 && (
                            <View style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Icon name="checkmark-circle" size={22} color="#2ecc71" />
                                    <Text style={styles.cardTitle}>Recommendations</Text>
                                </View>

                                {analyzeData.recommendations.map((r: string, index: number) => (
                                    <View key={index} style={styles.listItem}>
                                        <Icon name="checkmark" size={18} color="#2ecc71" />
                                        <Text style={styles.textBody}>{r}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Action Buttons */}
                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => {
                                    setHeartRate("");
                                    setShowResult(false);
                                }}
                            >
                                <Icon name="refresh" size={20} color={"#4e73df"} />
                                <Text style={styles.secondaryButtonText}>New</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("HistoryScreen")}>
                                <Icon name="time" size={20} color={"#fff"} />
                                <Text style={styles.primaryButtonText}>History</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
};

export default RecordHeartRateScreen;

/* -----------------------------------------
   STYLESHEET – CLEAN MEDICAL UI
------------------------------------------*/
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f8ff",
    },

    /* Header */
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

    scrollContent: {
        padding: 20,
        paddingBottom: 120,
    },

    /** INPUT MODE */
    inputContent: {
        alignItems: "center",
        marginTop: 20,
    },
    label: {
        fontSize: 18,
        color: "#555",
        marginBottom: 12,
    },
    inputContainer: {
        width: "70%",
        borderRadius: 14,
        backgroundColor: "#fff",
        elevation: 5,
        shadowOpacity: 0.15,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    input: {
        fontSize: 50,
        fontWeight: "700",
        color: "#4e73df",
        textAlign: "center",
    },

    analyzeButton: {
        marginTop: 28,
        width: "70%",
        backgroundColor: "#4e73df",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    analyzeButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    note: {
        marginTop: 18,
        color: "#777",
        fontStyle: "italic",
    },

    /** RESULT MODE */
    resultContainer: {
        marginTop: 10,
    },
    resultHeader: {
        alignItems: "center",
        marginBottom: 20,
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#333",
        marginTop: 10,
    },
    resultTimestamp: {
        color: "#999",
        fontSize: 13,
        marginTop: 4,
    },

    /* Cards */
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    cardTitle: {
        marginLeft: 8,
        fontSize: 17,
        fontWeight: "700",
        color: "#4e73df",
    },
    bigResultText: {
        fontSize: 22,
        fontWeight: "800",
        color: "#333",
        marginBottom: 14,
    },
    severityChip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    severityChipText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 12,
    },

    textBody: {
        fontSize: 15,
        color: "#444",
        lineHeight: 22,
        marginLeft: 6,
    },

    listItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 8,
    },

    /* Buttons Bottom */
    actionRow: {
        flexDirection: "row",
        marginTop: 10,
    },
    secondaryButton: {
        flex: 1,
        flexDirection: "row",
        borderWidth: 1.6,
        borderColor: "#4e73df",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
        marginRight: 10,
    },
    secondaryButtonText: {
        marginLeft: 6,
        color: "#4e73df",
        fontWeight: "700",
    },

    primaryButton: {
        flex: 1,
        backgroundColor: "#4e73df",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
        marginLeft: 10,
        flexDirection: "row",
    },
    primaryButtonText: {
        marginLeft: 6,
        color: "#fff",
        fontWeight: "700",
    },
});
