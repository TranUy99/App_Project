import React, { useState, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions, ActivityIndicator, Animated } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

import { ApplicationStyles, Colors, Fonts, Images, MetricsRes } from "../../Themes";

const { width } = Dimensions.get("window");

/**
 * Card ảnh có:
 * - Placeholder
 * - Loading spinner
 * - Fade-in khi load xong
 * - Background đẹp
 */
const CarouselImageCard = ({ uri, title }: { uri: any; title: string }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const opacity = useRef(new Animated.Value(0)).current;

    const handleLoad = () => {
        setLoaded(true);
        Animated.timing(opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    };

    const handleError = () => {
        setError(true);
        setLoaded(true);
    };

    return (
        <View style={[styles.carouselItem, { width: width * 0.88 }]}>
            {/* Background card */}
            <View style={styles.carouselBackground} />

            {/* Placeholder + loading */}
            {!loaded && !error && (
                <View style={styles.placeholderContainer}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                    <Text style={styles.placeholderText}>Đang tải ảnh...</Text>
                </View>
            )}

            {/* Ảnh thật với fade-in */}
            {!error && <Animated.Image source={uri} style={[styles.carouselImage, { opacity }]} resizeMode="cover" onLoad={handleLoad} onError={handleError} />}

            {/* Khi lỗi ảnh */}
            {error && (
                <View style={styles.errorContainer}>
                    <Icon name="image-outline" size={28} color="#fff" />
                    <Text style={styles.errorText}>Không tải được ảnh</Text>
                </View>
            )}

            {/* Overlay mờ */}
            <View style={styles.carouselOverlay} />

            {/* Text trên ảnh */}
            <View style={styles.carouselTextWrapper}>
                <Text style={styles.carouselTitle}>{title}</Text>
                <Text style={styles.carouselSubtitle}>Monitor • AI • Insight</Text>
            </View>
        </View>
    );
};

const HomeScreen = () => {
    const navigation = useNavigation<any>();

    const [activeSlide, setActiveSlide] = useState(0);
    const images = [
        {
            uri: Images.first,
            title: "Smart Health Monitor",
        },
        {
            uri: Images.second,
            title: "AI Heart Analysis",
        },
        {
            uri: Images.third,
            title: "Health Insights Dashboard",
        },
    ];

    const onScroll = (e: any) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / (width * 0.88));
        setActiveSlide(index);
    };

    return (
        <View style={styles.screen}>
            <View style={styles.topBackground} />
            <View style={styles.bottomBackground} />

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerSubtitle}>Welcome back 👋</Text>
                        <Text style={styles.headerTitle}>Heart Rate Monitor</Text>
                    </View>

                    <View style={styles.profileButton}>
                        <Image source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }} style={styles.profileAvatar} />
                    </View>
                </View>

              
                <View style={styles.carouselContainer}>
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingHorizontal: 10 }}>
                        {images.map((item, i) => (
                            <CarouselImageCard key={i} uri={item.uri} title={item.title} />
                        ))}
                    </ScrollView>

                    <View style={styles.pagination}>
                        {images.map((_, i) => (
                            <View key={i} style={[styles.dot, i === activeSlide && styles.activeDot]} />
                        ))}
                    </View>
                </View>

           
                <View style={styles.actionsContainer}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>

                    <View style={styles.actionsGrid}>
                        <TouchableOpacity
                            style={[styles.actionCard, styles.actionPrimary]}
                            onPress={() =>
                                navigation.navigate("HomeStackScreen", {
                                    screen: "RecordHeartRateScreen",
                                })
                            }
                        >
                            <View style={styles.actionIconWrapperPrimary}>
                                <Icon name="heart" size={26} color="#fff" />
                            </View>
                            <Text style={[styles.actionTitle, { color: "#fff" }]}>Record HR</Text>
                            <Text style={[styles.actionDesc, { color: "#fefefe" }]}>Đo nhịp tim ngay</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() =>
                                navigation.navigate("HomeStackScreen", {
                                    screen: "PatientDetailScreen",
                                    params: { patientId: "1" },
                                })
                            }
                        >
                            <View style={styles.actionIconWrapper}>
                                <Icon name="person-outline" size={24} color={Colors.primary} />
                            </View>
                            <Text style={styles.actionTitle}>Patient Detail</Text>
                            <Text style={styles.actionDesc}>Thông tin bệnh nhân</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() =>
                                navigation.navigate("HomeStackScreen", {
                                    screen: "HeartRateTrendScreen",
                                })
                            }
                        >
                            <View style={styles.actionIconWrapper}>
                                <Icon name="analytics-outline" size={24} color={Colors.primary} />
                            </View>
                            <Text style={styles.actionTitle}>AI Trend</Text>
                            <Text style={styles.actionDesc}>Phân tích xu hướng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    // Nền tổng
    screen: {
        flex: 1,
        backgroundColor: "#edcdf5ff",
    },
    topBackground: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 240,
        backgroundColor: Colors.primary,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    bottomBackground: {
        position: "absolute",
        top: 220,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#f3ecf5ff",
    },

    // HEADER
    header: {
        marginTop: 50,
        marginHorizontal: 20,
        padding: 18,
        backgroundColor: "#ffffff",
        borderRadius: 18,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    headerSubtitle: {
        fontSize: Fonts.size.h14,
        color: "#7c8aa5",
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
    },
    profileButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#e2e8f0",
    },
    profileAvatar: {
        width: "100%",
        height: "100%",
    },

    // CAROUSEL
    carouselContainer: {
        marginTop: 22,
    },
    carouselItem: {
        height: 250,
        marginRight: 16,
        borderRadius: 20,
        overflow: "hidden",
        justifyContent: "flex-end",
    },
    carouselBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#d9e2ff",
    },
    carouselImage: {
        width: "100%",
        height: "100%",
        borderRadius: 20,
    },
    placeholderContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        marginTop: 8,
        color: "#4a5568",
        fontSize: 13,
    },
    errorContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(15, 23, 42, 0.55)",
    },
    errorText: {
        marginTop: 6,
        color: "#fff",
        fontSize: 13,
    },
    carouselOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.18)",
    },
    carouselTextWrapper: {
        padding: 16,
    },
    carouselTitle: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 4,
    },
    carouselSubtitle: {
        color: "#e2e8f0",
        fontSize: 13,
    },

    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 6,
        backgroundColor: "#cbd5e0",
        marginHorizontal: 4,
    },
    activeDot: {
        width: 20,
        height: 8,
        borderRadius: 6,
        backgroundColor: Colors.primary,
    },

    // QUICK ACTIONS
    actionsContainer: {
        marginTop: 28,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.textBlack,
        marginBottom: 14,
    },
    actionsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    actionCard: {
        width: "48%",
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 18,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    actionPrimary: {
        backgroundColor: Colors.primary,
    },
    actionIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#e5edff",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    actionIconWrapperPrimary: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    actionTitle: {
        fontSize: 16,
        fontFamily: ApplicationStyles.fontFamily.bold,
        color: Colors.primary,
        marginBottom: 4,
    },
    actionDesc: {
        fontSize: 13,
        color: "#64748b",
    },
});
