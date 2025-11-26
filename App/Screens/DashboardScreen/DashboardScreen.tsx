import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { ApplicationStyles, Colors, Fonts, MetricsRes } from "../../Themes";

interface PatientVital {
    id: string;
    name: string;
    room: string;
    heartRate: number;
    spO2: number;
    temperature: number;
    bloodPressure: string;
    status: "normal" | "warning" | "critical";
    lastUpdate: string;
}

const DashboardScreen = () => {
    const navigation = useNavigation<any>();
    const [patients, setPatients] = useState<PatientVital[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        normal: 0,
        warning: 0,
        critical: 0,
    });

    useEffect(() => {
        // Simulate real-time data
        loadDashboardData();
        const interval = setInterval(loadDashboardData, 5000); // Update every 5s
        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = () => {
        // Mock data - replace with API call
        const mockPatients: PatientVital[] = [
            {
                id: "1",
                name: "Nguyễn Văn A",
                room: "101",
                heartRate: 78,
                spO2: 98,
                temperature: 36.8,
                bloodPressure: "120/80",
                status: "normal",
                lastUpdate: new Date().toLocaleTimeString(),
            },
            {
                id: "2",
                name: "Trần Thị B",
                room: "102",
                heartRate: 115,
                spO2: 94,
                temperature: 37.5,
                bloodPressure: "145/95",
                status: "warning",
                lastUpdate: new Date().toLocaleTimeString(),
            },
            {
                id: "3",
                name: "Lê Văn C",
                room: "103",
                heartRate: 145,
                spO2: 88,
                temperature: 38.2,
                bloodPressure: "160/100",
                status: "critical",
                lastUpdate: new Date().toLocaleTimeString(),
            },
        ];

        setPatients(mockPatients);
        setStats({
            total: mockPatients.length,
            normal: mockPatients.filter((p) => p.status === "normal").length,
            warning: mockPatients.filter((p) => p.status === "warning").length,
            critical: mockPatients.filter((p) => p.status === "critical").length,
        });
        setRefreshing(false);
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadDashboardData();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "critical":
                return Colors.red;
            case "warning":
                return Colors.orange;
            default:
                return Colors.green;
        }
    };

    const getVitalStatus = (vital: string, value: number) => {
        switch (vital) {
            case "heartRate":
                return value < 60 || value > 100 ? "warning" : "normal";
            case "spO2":
                return value < 95 ? "warning" : "normal";
            case "temperature":
                return value > 37.5 ? "warning" : "normal";
            default:
                return "normal";
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={28} color={Colors.textBlack} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Patient Dashboard</Text>
                    <Text style={styles.headerSubtitle}>Real-time Monitoring</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("HomeStackScreen", { screen: "AlertScreen" })}>
                    <Icon name="notifications" size={28} color={Colors.primary} />
                    {stats.critical > 0 && <View style={styles.alertBadge} />}
                </TouchableOpacity>
            </View>

            {/* Stats Overview */}
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { borderLeftColor: Colors.primary }]}>
                    <Text style={styles.statValue}>{stats.total}</Text>
                    <Text style={styles.statLabel}>Total Patients</Text>
                </View>
                <View style={[styles.statCard, { borderLeftColor: Colors.green }]}>
                    <Text style={[styles.statValue, { color: Colors.green }]}>{stats.normal}</Text>
                    <Text style={styles.statLabel}>Normal</Text>
                </View>
                <View style={[styles.statCard, { borderLeftColor: Colors.orange }]}>
                    <Text style={[styles.statValue, { color: Colors.orange }]}>{stats.warning}</Text>
                    <Text style={styles.statLabel}>Warning</Text>
                </View>
                <View style={[styles.statCard, { borderLeftColor: Colors.red }]}>
                    <Text style={[styles.statValue, { color: Colors.red }]}>{stats.critical}</Text>
                    <Text style={styles.statLabel}>Critical</Text>
                </View>
            </View>

            {/* Patient List */}
            <ScrollView style={styles.scrollView} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={styles.listHeader}>
                    <Text style={styles.sectionTitle}>Active Patients</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("HomeStackScreen", { screen: "PatientListScreen" })}>
                        <Text style={styles.viewAllText}>View All →</Text>
                    </TouchableOpacity>
                </View>

                {patients.map((patient) => (
                    <TouchableOpacity
                        key={patient.id}
                        style={[styles.patientCard, { borderLeftColor: getStatusColor(patient.status), borderLeftWidth: 4 }]}
                        onPress={() =>
                            navigation.navigate("HomeStackScreen", {
                                screen: "PatientDetailScreen",
                                params: { patientId: patient.id },
                            })
                        }
                    >
                        <View style={styles.patientHeader}>
                            <View>
                                <Text style={styles.patientName}>{patient.name}</Text>
                                <Text style={styles.patientRoom}>Room {patient.room}</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(patient.status) }]}>
                                <Text style={styles.statusText}>{patient.status.toUpperCase()}</Text>
                            </View>
                        </View>

                        <View style={styles.vitalsGrid}>
                            <View style={styles.vitalItem}>
                                <Icon name="heart" size={20} color={getVitalStatus("heartRate", patient.heartRate) === "warning" ? Colors.red : Colors.primary} />
                                <Text style={styles.vitalValue}>{patient.heartRate}</Text>
                                <Text style={styles.vitalLabel}>HR (bpm)</Text>
                            </View>

                            <View style={styles.vitalItem}>
                                <Icon name="water" size={20} color={getVitalStatus("spO2", patient.spO2) === "warning" ? Colors.red : Colors.blue} />
                                <Text style={styles.vitalValue}>{patient.spO2}%</Text>
                                <Text style={styles.vitalLabel}>SpO2</Text>
                            </View>

                            <View style={styles.vitalItem}>
                                <Icon name="thermometer" size={20} color={getVitalStatus("temperature", patient.temperature) === "warning" ? Colors.red : Colors.green} />
                                <Text style={styles.vitalValue}>{patient.temperature}°C</Text>
                                <Text style={styles.vitalLabel}>Temp</Text>
                            </View>

                            <View style={styles.vitalItem}>
                                <Icon name="fitness" size={20} color={Colors.primary} />
                                <Text style={styles.vitalValue}>{patient.bloodPressure}</Text>
                                <Text style={styles.vitalLabel}>BP</Text>
                            </View>
                        </View>

                        <Text style={styles.lastUpdate}>Last update: {patient.lastUpdate}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* FAB Button */}
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("HomeStackScreen", { screen: "AddPatientScreen" })}>
                <Icon name="add" size={28} color={Colors.white} />
            </TouchableOpacity>
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
        fontSize: Fonts.size.h24,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
    },
    headerSubtitle: {
        fontSize: Fonts.size.h14,
        color: Colors.textGray,
        marginTop: 4,
    },
    alertBadge: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.red,
    },
    statsContainer: {
        flexDirection: "row",
        padding: MetricsRes.margin.base,
        backgroundColor: Colors.white,
    },
    statCard: {
        flex: 1,
        padding: MetricsRes.margin.base,
        marginHorizontal: 4,
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        borderLeftWidth: 3,
        alignItems: "center",
    },
    statValue: {
        fontSize: Fonts.size.h24,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.primary,
    },
    statLabel: {
        fontSize: Fonts.size.h12,
        color: Colors.textGray,
        marginTop: 4,
    },
    scrollView: {
        flex: 1,
    },
    listHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: MetricsRes.margin.base,
    },
    sectionTitle: {
        fontSize: Fonts.size.h18,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
    },
    viewAllText: {
        fontSize: Fonts.size.h14,
        color: Colors.primary,
        fontFamily: ApplicationStyles.fontFamily.semiBold,
    },
    patientCard: {
        backgroundColor: Colors.white,
        margin: MetricsRes.margin.base,
        marginTop: 0,
        padding: MetricsRes.margin.base,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    patientHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: MetricsRes.margin.base,
    },
    patientName: {
        fontSize: Fonts.size.h16,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
    },
    patientRoom: {
        fontSize: Fonts.size.h14,
        color: Colors.textGray,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: Colors.white,
        fontSize: Fonts.size.h12,
        fontFamily: ApplicationStyles.fontFamily.bold,
    },
    vitalsGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: MetricsRes.margin.base,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#e0e0e0",
    },
    vitalItem: {
        flex: 1,
        alignItems: "center",
    },
    vitalValue: {
        fontSize: Fonts.size.h16,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
        marginTop: 4,
    },
    vitalLabel: {
        fontSize: Fonts.size.h12,
        color: Colors.textGray,
        marginTop: 2,
    },
    lastUpdate: {
        fontSize: Fonts.size.h12,
        color: Colors.textGray,
        marginTop: MetricsRes.margin.small,
        textAlign: "right",
    },
    fab: {
        position: "absolute",
        bottom: MetricsRes.margin.large,
        right: MetricsRes.margin.large,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
});

export default DashboardScreen;
