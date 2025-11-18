import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { heartRateService } from "../../Services/heartRateService";
import { ApplicationStyles, Colors, Fonts, MetricsRes } from "../../Themes";

const RecordHeartRateScreen = () => {
    const [heartRate, setHeartRate] = useState("");
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleRecord = async () => {
        if (!heartRate || isNaN(Number(heartRate))) {
            Alert.alert("Error", "Please enter a valid heart rate");
            return;
        }

        try {
            setLoading(true);
            await heartRateService.recordHeartRate({
                heartRate: Number(heartRate),
                timestamp: new Date().toISOString(),
            });
            Alert.alert("Success", "Heart rate recorded successfully", [{ text: "OK", onPress: () => navigation.goBack() }]);
        } catch (error) {
            Alert.alert("Error", "Failed to record heart rate");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={28} color={Colors.textBlack} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Record Heart Rate</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.content}>
                <Icon name="heart" size={80} color={Colors.red} style={styles.icon} />

                <Text style={styles.label}>Enter your heart rate (BPM)</Text>

                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} value={heartRate} onChangeText={setHeartRate} placeholder="e.g., 75" keyboardType="numeric" maxLength={3} />
                    <Text style={styles.bpmText}>BPM</Text>
                </View>

                <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleRecord} disabled={loading}>
                    {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.buttonText}>Record & Analyze</Text>}
                </TouchableOpacity>

                <Text style={styles.note}>AI will automatically analyze your heart rate and provide diagnosis</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: MetricsRes.margin.base,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGray || "#e0e0e0",
    },
    headerTitle: {
        fontSize: Fonts.size.h20,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: MetricsRes.margin.huge,
    },
    icon: {
        marginBottom: MetricsRes.margin.large,
    },
    label: {
        fontSize: Fonts.size.h16,
        color: Colors.textGray,
        marginBottom: MetricsRes.margin.base,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderColor: Colors.primary,
        borderRadius: 10,
        paddingHorizontal: MetricsRes.margin.base,
        marginBottom: MetricsRes.margin.large,
        width: "100%",
    },
    input: {
        flex: 1,
        fontSize: 48,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.primary,
        textAlign: "center",
        paddingVertical: MetricsRes.margin.base,
    },
    bpmText: {
        fontSize: Fonts.size.h18,
        color: Colors.gray,
        fontFamily: ApplicationStyles.fontFamily.bold,
    },
    button: {
        backgroundColor: Colors.primary,
        paddingVertical: MetricsRes.margin.base,
        paddingHorizontal: MetricsRes.margin.huge,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: Colors.white,
        fontSize: Fonts.size.h18,
        fontFamily: ApplicationStyles.fontFamily.bold,
    },
    note: {
        marginTop: MetricsRes.margin.large,
        fontSize: Fonts.size.h14,
        color: Colors.textGray,
        textAlign: "center",
        fontStyle: "italic",
    },
});

export default RecordHeartRateScreen;
