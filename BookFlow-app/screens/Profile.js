// import * as React from "react";
import { useEffect, useState } from "react";
import { FontFamily, FontSize, Color, Border, Padding } from "../GlobalStyles";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const Profile = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    // Chama a função para obter e preencher os dados do usuário
    SecureStore.getItemAsync("user").then((user) => {
      const parsedUser = JSON.parse(user);

      setUser(parsedUser);
      setName(parsedUser.username);
      setEmail(parsedUser.email);
    });
  }, []);

  const apiUrl = Constants.expoConfig.extra.apiUrl;

  const getAccessToken = async () => {
    try {
      user = JSON.parse(await SecureStore.getItemAsync("user"));

      if (!user) {
        throw new Error("Couldn't find user");
      }

      const refreshToken = user.refresh_token;

      if (!refreshToken) {
        throw new Error("Refresh token não encontrado");
      }

      const response = await fetch(`${apiUrl}/api/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Erro na requisição de atualização do token: ${response.statusText}`
        );
      }

      const data = await response.json();

      if ("access" in data) {
        return data.access;
      } else {
        throw new Error("Resposta não contém o token de acesso");
      }
    } catch (error) {
      throw new Error("Erro ao obter o token de acesso: " + error.message);
    }
  };

  const updateUserData = async () => {
    try {
      const accessToken = await getAccessToken();

      let id = user.id;
      let url = `${apiUrl}/api/user/${id}/`;
      console.log(url);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name,
          email,
        }),
      });

      if (response.ok) {
        console.log("Dados do usuário atualizados com sucesso!");
      } else {
        console.error(
          "Erro ao atualizar dados do usuário:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error.message);
    }
  };

  return (
    <View style={styles.telaUser}>
      <Pressable onPress={() => navigation.goBack()}>
        <Image
          style={styles.materialSymbolsarrowBackIoIcon}
          resizeMode="cover"
          source={require("../assets/material-symbols_arrow-back-ios.png")}
        />
      </Pressable>
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
          source={require("../assets/solar_camera-minimalistic-bold.png")}
        />
      </View>
      <View style={[styles.nameParent, styles.parentLayout]}>
        <Text style={[styles.name, styles.nameTypo]}>Name</Text>
        <View style={[styles.rectangleParent, styles.groupChildLayout]}>
          <View style={styles.groupChildPosition} />
          <TextInput
            style={[styles.melissaPeters, styles.saveChangesPosition]}
            placeholder=""
            placeholderTextColor={Color.colorBlanchedalmond_101}
            value={name}
            onChangeText={(text) => setName(text)}
          ></TextInput>
        </View>
      </View>
      <View style={[styles.emailParent, styles.parentLayout]}>
        <Text style={styles.nameTypo}>Email</Text>
        <View style={[styles.rectangleParent, styles.groupChildLayout]}>
          <View style={styles.groupChildPosition} />
          <TextInput
            style={[styles.melissaPeters, styles.saveChangesPosition]}
            placeholder="melpeters@gmail.com "
            placeholderTextColor={Color.colorBlanchedalmond_101}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
      </View>
      <View style={[styles.passwordParent, styles.parentLayout]}>
        <Text style={styles.nameTypo}>Password</Text>
        <View style={[styles.rectangleParent, styles.groupChildLayout]}>
          <View style={styles.groupChildPosition} />
          <TextInput
            style={[styles.melissaPeters, styles.saveChangesPosition]}
            value={password}
            onChangeText={(text) => setPassword(text)}
          ></TextInput>
        </View>
      </View>
      <Pressable onPress={updateUserData}>
        <View style={[styles.groupView, styles.viewLayout]}>
          <View style={styles.rectangleView} />
          <Text style={[styles.saveChanges, styles.saveChangesPosition]}>
            Save changes
          </Text>
        </View>
      </Pressable>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
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
    marginTop: -14,
    left: 10,
    fontSize: 16,
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
