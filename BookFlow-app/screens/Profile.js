import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const Profile = () => {
	return (
		<View style={styles.telaUser}>
			<Image
				style={styles.materialSymbolsarrowBackIoIcon}
				resizeMode="cover"
				source={require("../assets/material-symbols_arrow-back-ios.png")}
			/>
			<Text style={[styles.profile, styles.profileTypo]}>Profile</Text>

			<View style={styles.containerImagem}>
				<Image
					style={styles.telaUserChild}
					resizeMode="cover"
					source={require("../assets/ellipse-2.png")}
				/>
				<Image
					style={styles.solarcameraMinimalisticBoldIcon}
					resizeMode="cover"
					source={require("../assets/solar_camera-minimalistic-bold.png")} />
			</View>
			<View style={[styles.nameParent, styles.parentLayout]}>
				<Text style={[styles.name, styles.nameTypo]}>Name</Text>
				<View style={[styles.rectangleParent, styles.groupChildLayout]}>
					<View style={styles.groupChildPosition} />
					<Text style={[styles.melissaPeters, styles.saveChangesPosition]}>Melissa Peters</Text>
				</View>
			</View>
			<View style={[styles.emailParent, styles.parentLayout]}>
				<Text style={styles.nameTypo}>Email</Text>
				<View style={[styles.rectangleParent, styles.groupChildLayout]}>
					<View style={styles.groupChildPosition} />
					<Text style={[styles.melissaPeters, styles.saveChangesPosition]}>melpeters@gmail.com</Text>
				</View>
			</View>
			<View style={[styles.passwordParent, styles.parentLayout]}>
				<Text style={styles.nameTypo}>Password</Text>
				<View style={[styles.rectangleParent, styles.groupChildLayout]}>
					<View style={styles.groupChildPosition} />
					<Text style={[styles.melissaPeters, styles.saveChangesPosition]}>************</Text>
				</View>
			</View>
			<View style={[styles.groupView, styles.viewLayout]}>
				<View style={styles.rectangleView} />
				<Text style={[styles.saveChanges, styles.saveChangesPosition]}>Save changes</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	profileTypo: {
		textAlign: "left",
		fontFamily: "Rosarivo-Regular",
	},
	saveChangesPosition: {
		top: "50%",
		position: "absolute",
	},
	parentLayout: {
		height: 80,
		width: 314,
		left: 24,
		position: "absolute",
	},
	nameTypo: {
		// lineHeight: 14,
		fontSize: 16,
		top: 0,
		left: 0,
		textAlign: "left",
		color: "#efe3c8",
		fontFamily: "Rosarivo-Regular",
		position: "absolute",
	},
	groupChildLayout: {
		height: 44,
		width: 314,
		position: "absolute",
	},
	groupChildPosition: {
		borderRadius: 6,
		borderColor: "rgba(239, 227, 200, 0.5)",
		borderWidth: 1,
		height: 44,
		width: 370,
		position: "absolute",
	},
	viewLayout: {
		height: 45,
		width: 221,
		position: "absolute",
	},
	materialSymbolsarrowBackIoIcon: {
		top: 58,
		left: 25,
		width: 30,
		height: 30,
		position: "absolute",
		overflow: "hidden",
	},
	profile: {
		marginLeft: -32,
		top: 67,
		color: "#efe3c8",
		textAlign: "left",
		fontFamily: "Rosarivo-Regular",
		lineHeight: 30,
		fontSize: 20,
		left: "50%",
		position: "absolute",
	},

	telaUserChild: {
		// marginTop: 0,
		// marginLeft: 0,
		width: 168,
		height: 173,
		// left: "50%",
		// top: "50%",
	},
	containerImagem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		position: 'absolute',
		top: 110,
		left: 120,
		// right: 200,
	},

	solarcameraMinimalisticBoldIcon: {
		top: 80,
		height: 32,
		width: 32,
		right: 30,
		
	},
	name: {
		textShadowColor: "rgba(0, 0, 0, 0.25)",
		textShadowOffset: {
			width: 0,
			height: 4,
		},
		textShadowRadius: 4,
	},
	groupChild: {
		borderStyle: "solid",
		borderColor: "rgba(239, 227, 200, 0.5)",
		borderWidth: 1,
		height: 44,
		width: 314,
		position: "absolute",
	},
	melissaPeters: {
		marginTop: -6,
		left: 10,
		fontSize: 14,
		// lineHeight: 12,
		textAlign: "left",
		fontFamily: "Rosarivo-Regular",
		color: "#efe3c8",
	},
	rectangleParent: {
		top: 25,
		left: 0,

	},
	nameParent: {
		top: 308,
	},
	emailParent: {
		top: 395,
	},
	passwordParent: {
		top: 482,
	},
	rectangleView: {
		backgroundColor: "#efe3c8",
		borderRadius: 6,
		borderStyle: "solid",
		top: 0,
		height: 45,
		width: 215,
		position: "absolute",
	},
	saveChanges: {
		marginTop: -10,
		marginLeft: -70.5,
		color: "#4a2b29",
		textAlign: "left",
		fontFamily: "Rosarivo-Regular",
		top: "50%",
		lineHeight: 23,
		fontSize: 20,
		left: "50%",
		position: "absolute",
	},
	groupView: {
		top: 626,
		left: "25%",
	},
	telaUser: {
		backgroundColor: "#1c161e",
		flex: 1,
		width: "100%",
		height: 800,
		overflow: "hidden",
	},
});

export default Profile;
