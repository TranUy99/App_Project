import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useImperativeHandle } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { Extrapolate, interpolate, runOnJS, useAnimatedProps, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { Colors, MetricsRes } from "../Themes";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type BottomSheetProps = {
    children?: React.ReactNode;
    minScroll?: number;
    nonShadow?: boolean;
    maxScroll?: number;
    onDismiss?: () => void;
    isDisplayLine?: boolean;
    colorSadow?: boolean;
    bottomsheet?: any;
    isDraggable?: boolean;
    duration?: number;
    onEndDraggable?: () => void;
};

export type BottomSheetRefProps = {
    scrollTo: (destination: number) => void;
    isActive: () => boolean;
};

const BottomSheetComponent = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(({
    children, minScroll = 0, nonShadow = true, onDismiss = () => { },
    maxScroll = -MetricsRes.screenHeight * 0.9, isDisplayLine = true,
    colorSadow = false, bottomsheet, isDraggable = true, duration = 500,
    onEndDraggable = () => { } }, ref) => {
    const translateY = useSharedValue(0);
    const active = useSharedValue(false);

    const scrollTo = useCallback((destination: number) => {
        "worklet";
        active.value = destination !== 0;

        translateY.value = withTiming(destination, { duration: duration });
    }, []);

    const isActive = useCallback(() => {
        return active.value;
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [scrollTo, isActive]);

    const context = useSharedValue({ y: minScroll });
    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            if (!isDraggable) return;
            translateY.value = event.translationY + context.value.y;
            translateY.value = Math.max(translateY.value, maxScroll);
        })
        .onEnd(() => {
            if (!isDraggable) return;

            // lấy khoảng cách tới 2 điểm
            const distToMin = Math.abs(translateY.value - minScroll);
            const distToMax = Math.abs(translateY.value - maxScroll);

            if (distToMin < distToMax) {
                // gần minScroll hơn => đóng
                scrollTo(minScroll);
                runOnJS(onDismiss)();
                runOnJS(onEndDraggable)();
            } else {
                // gần maxScroll hơn => mở
                scrollTo(maxScroll);
            }


        });


    const rBottomSheetStyle = useAnimatedStyle(() => {

        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const rBackdropStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(active.value ? 1 : 0),
        };
    }, []);

    const rBackdropProps = useAnimatedProps(() => {
        return {
            pointerEvents: active.value ? "auto" : "none",
        } as any;
    }, []);

    return (
        <>
            {nonShadow && (
                <Animated.View
                    onTouchStart={() => {
                        // Dismiss the BottomSheet
                        scrollTo(minScroll);
                        onDismiss();
                    }}
                    animatedProps={rBackdropProps}
                    style={[
                        {
                            ...StyleSheet.absoluteFillObject,
                            backgroundColor: colorSadow ? "rgba(9, 88, 217, 0.25)" : "rgba(0,0,0,0.4)",
                        },
                        rBackdropStyle,
                    ]}
                />
            )}
            <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle, bottomsheet, { top: Platform.OS == 'ios' ? SCREEN_HEIGHT : SCREEN_HEIGHT + 20 }]}>
                <GestureDetector gesture={gesture}>
                    <View>
                        {isDisplayLine && <View style={styles.line} />}
                    </View>
                </GestureDetector>
                <View style={{ flex: 1 }}>
                    {children}
                </View>

            </Animated.View>

        </>
    );
});

export default BottomSheetComponent;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: SCREEN_HEIGHT,
        width: "100%",
        backgroundColor: Colors.white,
        position: "absolute",
        top: SCREEN_HEIGHT,
        zIndex: 100000,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: "hidden", // để tránh children lòi ra ngoài góc bo
    },
    line: {
        width: 55,
        height: 4,
        backgroundColor: "grey",
        alignSelf: "center",
        marginVertical: 15,
        borderRadius: 2,
    },
});

