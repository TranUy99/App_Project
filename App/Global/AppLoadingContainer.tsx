import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors, Images, MetricsRes } from "../Themes";
import { useSelector } from "react-redux";
import { loadingSelector } from "../Redux/Reducers/selector";
import FastImage from "react-native-fast-image";

const BACKGROUND_COLOR_OPACITY = "rgba(0, 0, 0, 0.5)";

const AppLoadingContainer = () => {
	const { isLoading, isLoadingFullScreen } = useSelector(loadingSelector);

	return (
		<>
			{( isLoading || isLoadingFullScreen) && (
				<View style={[styles.container, { backgroundColor: isLoadingFullScreen ? Colors.white : BACKGROUND_COLOR_OPACITY }]}>
					{/* <FastImage source={Images.logo} style={styles.sizeIcon} resizeMode="contain" /> */}
					{/* <Image source={Images._loading} style={styles.sizeIcon} resizeMode="contain" /> */}
 				</View>
			)}
		</>
	);
};

export default AppLoadingContainer;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1000,
	},
	sizeIcon: {
		width: MetricsRes.screenWidth * 0.2,
		height: MetricsRes.screenWidth * 0.2,
		borderRadius: MetricsRes.radius.circle,
	},
});
