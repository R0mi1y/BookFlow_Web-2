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
import CustomPopup from "../components/CustomPopup";
import getAccessToken from "../components/auxiliarFunctions";
import * as ImagePicker from 'expo-image-picker';

const Profile = (context) => {
  const navigation = useNavigation();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [hasImagem, setHasImagem] = useState(false);

  const [messagePopup, setPopupTexto] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);

  const togglePopup = (message = null) => {
    setPopupVisible(false);
    if (message != null) {
      setPopupTexto(message);
      setPopupVisible(true);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      console.log(status);
      if (status !== 'granted') {
        console.error('Permissão negada para acessar a biblioteca de mídia');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({

        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log(result);
      if (!result.cancelled) {
        console.log(result);
        setHasImagem(true);  // Adicione essa linha
        setSelectedImage(result.assets[0].uri);  // Acessar a URI dentro do array de assets
        console.log(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Erro ao selecionar a imagem:', err);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Chama a função para obter e preencher os dados do usuário
        SecureStore.getItemAsync("user").then((user) => {
          const parsedUser = JSON.parse(user);

          setUser(parsedUser);
          setUserName(parsedUser.username);
          setEmail(parsedUser.email);

          // Carregar a imagem do usuário
          if (parsedUser.photo) {
            setSelectedImage(parsedUser.photo); // Assumindo que o campo da imagem é 'photo'
          }
        });
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error.message);
      }
    };

    loadUserData();
  }, []);

  const apiUrl = Constants.expoConfig.extra.apiUrl;

  const updateUserData = async () => {
    try {
      const accessToken = await getAccessToken(navigation);

      let id = user.id;

      let url = `${apiUrl}/api/user/${id}/`;

      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);

      if (selectedImage) {
        const localUri = selectedImage;
        const filename = localUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";

        formData.append("photo", {
          uri: localUri,
          name: filename,
          type,
        });
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        let user = await response.json();

        if (user.id) {
          try {
            SecureStore.setItem("user", JSON.stringify(user));
            togglePopup("Dados atualizados com sucesso");
          } catch (e) {
            console.log(e.message);
          }
        } else {
          console.log(json);
        }
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
    <>
      <CustomPopup
        visible={popupVisible}
        onClose={() => {
          togglePopup(null);
        }}
        message={messagePopup}
      />
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
          {selectedImage ? (
            <Image
              style={styles.telaUserChild}
              resizeMode="cover"
              source={{ uri: selectedImage }}
            />
          ) : (
            <Image
              style={styles.telaUserChild}
              resizeMode="cover"
              source={require("../assets/ellipse-2.png")}
            />
          )}
          <Pressable onPress={pickImage}>
            <Image
              style={styles.solarcameraMinimalisticBoldIcon}
              resizeMode="cover"
              source={require("../assets/solar_camera-minimalistic-bold.png")}
            />
          </Pressable>
        </View>
        <View style={[styles.nameParent, styles.parentLayout]}>
          <Text style={[styles.name, styles.nameTypo]}>Name</Text>
          <View style={[styles.rectangleParent, styles.groupChildLayout]}>
            <View style={styles.groupChildPosition} />
            <TextInput
              style={[styles.melissaPeters, styles.saveChangesPosition]}
              placeholder=""
              placeholderTextColor={Color.colorBlanchedalmond_101}
              value={username}
              onChangeText={(text) => setUserName(text)}
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
        <Pressable onPress={updateUserData}>
          <View style={[styles.groupView, styles.viewLayout]}>
            <View style={styles.rectangleView} />
            <Text style={[styles.saveChanges, styles.saveChangesPosition]}>
              Save changes
            </Text>
          </View>
        </Pressable>
        {/* <Pressable onPress={() => {
          navigation.navigate("SelectMapScreen", { showBooks: true, screen: "Profile" });
        }}
          style={[styles.groupView1, styles.saveChanges]}
        >   */}
        <Pressable onPress={() => {
          navigation.navigate("RegisterLocation");
        }}
          style={[styles.groupView1, styles.saveChanges]}
        >
          <View style={[styles.viewLayout]}>
            <View style={styles.rectangleView} />
            <Text style={[styles.saveChanges, styles.saveChangesPosition]}>
              Adicionar endereço
            </Text>
          </View>
        </Pressable>
      </View>
    </>
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
    height: 168,
    borderRadius: 84,
    overflow: "hidden",
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
  groupView1: {
    top: 726,
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
