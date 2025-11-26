import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { ApplicationStyles, Colors, Fonts, MetricsRes } from "../../Themes";

interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    room: string;
    condition: string;
    status: "stable" | "monitoring" | "critical";
    admissionDate: string;
}

const PatientListScreen = () => {
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string | null>(null);

    const patients: Patient[] = [
        {
            id: "1",
            name: "Nguyễn Văn A",
            age: 65,
            gender: "Nam",
            room: "101",
            condition: "Huyết áp cao",
            status: "stable",
            admissionDate: "2024-01-15",
        },
        {
            id: "2",
            name: "Trần Thị B",
            age: 58,
            gender: "Nữ",
            room: "102",
            condition: "Đái tháo đường",
            status: "monitoring",
            admissionDate: "2024-01-18",
        },
        {
            id: "3",
            name: "Lê Văn C",
            age: 72,
            gender: "Nam",
            room: "103",
            condition: "Tim mạch",
            status: "critical",
            admissionDate: "2024-01-20",
        },
        {
            id: "4",
            name: "Phạm Thị D",
            age: 45,
            gender: "Nữ",
            room: "104",
            condition: "Hô hấp",
            status: "stable",
            admissionDate: "2024-01-22",
        },
    ];

    const filteredPatients = patients.filter((patient) => {
        const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || patient.room.includes(searchQuery);
        const matchesFilter = !filterStatus || patient.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "critical":
                return Colors.red;
            case "monitoring":
                return Colors.orange;
            default:
                return Colors.green;
        }
    };

    const renderPatientItem = ({ item }: { item: Patient }) => (
        <TouchableOpacity
            style={styles.patientCard}
            onPress={() =>
                navigation.navigate("PatientDetailScreen", {
                    patientId: item.id,
                })
            }
        >
            <View style={styles.cardHeader}>
                <View style={styles.patientInfo}>
                    <View style={[styles.avatar, { backgroundColor: getStatusColor(item.status) + "20" }]}>
                        <Icon name="person" size={24} color={getStatusColor(item.status)} />
                    </View>
                    <View style={styles.patientDetails}>
                        <Text style={styles.patientName}>{item.name}</Text>
                        <Text style={styles.patientMeta}>
                            {item.age} tuổi • {item.gender} • Room {item.room}
                        </Text>
                    </View>
                </View>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Icon name="medical" size={16} color={Colors.textGray} />
                    <Text style={styles.infoText}>{item.condition}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Icon name="calendar" size={16} color={Colors.textGray} />
                    <Text style={styles.infoText}>Admitted: {new Date(item.admissionDate).toLocaleDateString("vi-VN")}</Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <Text style={styles.statusLabel}>{item.status === "stable" ? "Ổn định" : item.status === "monitoring" ? "Theo dõi" : "Nguy kịch"}</Text>
                <Icon name="chevron-forward" size={20} color={Colors.primary} />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color={Colors.textBlack} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Patient List</Text>
                <TouchableOpacity onPress={() => navigation.navigate("AddPatientScreen")}>
                    <Icon name="add-circle" size={28} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color={Colors.textGray} />
                <TextInput style={styles.searchInput} placeholder="Search by name or room..." value={searchQuery} onChangeText={setSearchQuery} />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Icon name="close-circle" size={20} color={Colors.textGray} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Filter Chips */}
            <View style={styles.filterContainer}>
                <TouchableOpacity style={[styles.filterChip, !filterStatus && styles.filterChipActive]} onPress={() => setFilterStatus(null)}>
                    <Text style={[styles.filterText, !filterStatus && styles.filterTextActive]}>All ({patients.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterChip, filterStatus === "stable" && styles.filterChipActive]} onPress={() => setFilterStatus("stable")}>
                    <View style={[styles.filterDot, { backgroundColor: Colors.green }]} />
                    <Text style={[styles.filterText, filterStatus === "stable" && styles.filterTextActive]}>Stable</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterChip, filterStatus === "monitoring" && styles.filterChipActive]} onPress={() => setFilterStatus("monitoring")}>
                    <View style={[styles.filterDot, { backgroundColor: Colors.orange }]} />
                    <Text style={[styles.filterText, filterStatus === "monitoring" && styles.filterTextActive]}>Monitoring</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.filterChip, filterStatus === "critical" && styles.filterChipActive]} onPress={() => setFilterStatus("critical")}>
                    <View style={[styles.filterDot, { backgroundColor: Colors.red }]} />
                    <Text style={[styles.filterText, filterStatus === "critical" && styles.filterTextActive]}>Critical</Text>
                </TouchableOpacity>
            </View>

            {/* Patient List */}
            <FlatList data={filteredPatients} renderItem={renderPatientItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.listContainer} ListEmptyComponent={<Text style={styles.emptyText}>No patients found</Text>} />
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
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
        margin: MetricsRes.margin.base,
        paddingHorizontal: MetricsRes.margin.base,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    searchInput: {
        flex: 1,
        paddingVertical: MetricsRes.margin.base,
        paddingHorizontal: MetricsRes.margin.small,
        fontSize: Fonts.size.h16,
        fontFamily: ApplicationStyles.fontFamily.regular,
    },
    filterContainer: {
        flexDirection: "row",
        paddingHorizontal: MetricsRes.margin.base,
        marginBottom: MetricsRes.margin.small,
    },
    filterChip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: MetricsRes.margin.base,
        paddingVertical: MetricsRes.margin.small,
        marginRight: MetricsRes.margin.small,
        borderRadius: 20,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    filterChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    filterText: {
        fontSize: Fonts.size.h14,
        color: Colors.textGray,
        fontFamily: ApplicationStyles.fontFamily.semiBold,
    },
    filterTextActive: {
        color: Colors.white,
    },
    listContainer: {
        padding: MetricsRes.margin.base,
    },
    patientCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: MetricsRes.margin.base,
        marginBottom: MetricsRes.margin.base,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: MetricsRes.margin.base,
    },
    patientInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: MetricsRes.margin.base,
    },
    patientDetails: {
        flex: 1,
    },
    patientName: {
        fontSize: Fonts.size.h16,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
    },
    patientMeta: {
        fontSize: Fonts.size.h14,
        color: Colors.textGray,
        marginTop: 2,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    cardBody: {
        paddingVertical: MetricsRes.margin.small,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#f0f0f0",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4,
    },
    infoText: {
        fontSize: Fonts.size.h14,
        color: Colors.textGray,
        marginLeft: MetricsRes.margin.small,
        fontFamily: ApplicationStyles.fontFamily.regular,
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: MetricsRes.margin.small,
    },
    statusLabel: {
        fontSize: Fonts.size.h14,
        color: Colors.primary,
        fontFamily: ApplicationStyles.fontFamily.semiBold,
    },
    emptyText: {
        textAlign: "center",
        fontSize: Fonts.size.h16,
        color: Colors.textGray,
        marginTop: MetricsRes.margin.huge,
    },
});

export default PatientListScreen;
