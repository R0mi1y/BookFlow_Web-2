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
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import CustomPopup from "../components/CustomPopup";
import getAccessToken from "../components/auxiliarFunctions";
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from "react-native";

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Profile = (context) => {

  const navigation = useNavigation();

  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [biography, setBiography] = useState("");
  const [phone, setPhone] = useState("");

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

          setUser(parsedUser ?? "");
          setUserName(parsedUser.username ?? "");
          setEmail(parsedUser.email ?? "");
          setPhone(parsedUser.phone ?? "");
          setBiography(parsedUser.biography ?? "");

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
      togglePopup("Loading");
      const accessToken = await getAccessToken(navigation);
      const id = user.id;
      const url = `${apiUrl}/api/user/${id}/`;
  
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("biography", biography);
  
      if (selectedImage) {
        const localUri = selectedImage;
        const filename = localUri.split("/").pop();
        const type = `image/${filename.split(".").pop()}`;
  
        formData.append("photo", {
          uri: localUri,
          name: filename,
          type,
        });
      }
      
      console.log(url);
      
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

  
      if (response.ok) {
        const updatedUser = await response.json();
  
        if (updatedUser.id) {
          SecureStore.setItem("user", JSON.stringify(updatedUser));
          togglePopup("Dados atualizados com sucesso");
        } else {
          console.error("Erro ao atualizar dados do usuário: ID não encontrado");
        }
      } else {
        const errorMessage = await response.text();
        console.error("Erro ao atualizar dados do usuário:", errorMessage);
        togglePopup(`Erro: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error.message);
      togglePopup(`Erro: ${error.message}`);
    }
  };  


  return (

    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
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
            <Text style={[styles.profile, styles.profileTypo]}>Perfil</Text>

            <View style={styles.containerImagem}>
              <Image
                style={styles.telaUserChild}
                resizeMode="cover"
                source={{ uri: selectedImage ? selectedImage.includes("http") ? selectedImage : apiUrl + selectedImage : "../assets/ellipse-2.png" }}
              />
              <Pressable onPress={pickImage}>
                <Image
                  style={styles.solarcameraMinimalisticBoldIcon}
                  resizeMode="cover"
                  source={require("../assets/solar_camera-minimalistic-bold.png")}
                />
              </Pressable>
            </View>


            <View style={[styles.parentLayout]}>
              <Text style={[styles.name, styles.nameTypo]}>Nome:</Text>
              {/* <View style={[styles.rectangleParent, styles.groupChildLayout]}> */}

              <TextInput
                style={[styles.textInput]}
                placeholder=""
                placeholderTextColor={Color.colorBlanchedalmond_101}
                value={username}
                onChangeText={(text) => setUserName(text)}
              ></TextInput>
              {/* </View> */}
            </View>
            <View style={[styles.parentLayout]}>
              <Text style={styles.nameTypo}>Email:</Text>
              {/* <View style={[styles.rectangleParent, styles.groupChildLayout]}> */}
              <TextInput
                style={[styles.textInput]}
                placeholder="melpeters@gmail.com "
                placeholderTextColor={Color.colorBlanchedalmond_101}
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              {/* </View> */}
            </View>
            <View style={[styles.parentLayout]}>
              <Text style={styles.nameTypo}>Telefone:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Digite seu telefone"
                placeholderTextColor={Color.colorBlanchedalmond_101}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(text) => setPhone(text)}
              />
            </View>
            <View style={[styles.parentLayout]}>
              <Text style={styles.nameTypo}>Biografia:</Text>
              <TextInput
                style={[styles.textInput, { height: 120 }]} // Ajuste a altura conforme necessário
                placeholder="Digite sua biografia"
                placeholderTextColor={Color.colorBlanchedalmond_101}
                multiline
                numberOfLines={4} // Ajuste conforme necessário
                value={biography}
                onChangeText={(text) => setBiography(text)}
              />
            </View>

            <View style={styles.viewButtons}>
              <Pressable onPress={() => {
                navigation.navigate("RegisterLocation");
              }}
                style={[styles.button]}
              >
                <Text style={[styles.irAlLibro, styles.irAlLibroTypo]}>Editar Endereço</Text>
              </Pressable>
              <Pressable style={[styles.button]} onPress={updateUserData}>
                <Text style={[styles.irAlLibro, styles.irAlLibroTypo]}>Salvar Alterações</Text>
                <Image
                  style={[styles.ionbookIcon]}
                  contentFit="cover"
                  source={require("../assets/ionbook.png")}
                />
              </Pressable>
            </View>
          </View >
        </>
      </View>
    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c161e",
    flexDirection: "column",
    height: screenHeight * 1.5,
  },
  textInput: {
    textAlignVertical: 'top',
    padding: 10,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_base,
    color: Color.colorBlanchedalmond_100,
    width: "100%",
    borderStyle: "solid",
    borderColor: Color.colorBlanchedalmond_100,
    borderWidth: 1,
    borderRadius: Border.br_3xs,
    height: 45,
  },

  viewButtons: {
    flex: 1,
    justifyContent: "top",
    top: "10%",
    alignItems: "center",
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.colorBlanchedalmond_100,
    width: "70%",
    height: 45,
    borderRadius: Border.br_3xs,
    marginTop: "5%",

  },
  ionbookIcon: {
    top: 2,
    width: 25,
    height: 25,
    overflow: "hidden",
  },

  profileTypo: {
    textAlign: "center",
    fontFamily: "Rosarivo-Regular",
  },
  saveChangesPosition: {
    top: "50%",
    display: "flex"
  },
  parentLayout: {
    width: "90%",
    left: 24,
    display: "flex",
    top: "10%",
    marginBottom: "5%",

  },
  nameTypo: {
    // lineHeight: 14,
    fontSize: 16,
    top: 0,
    left: 0,
    textAlign: "left",
    color: "#efe3c8",
    fontFamily: "Rosarivo-Regular",
    display: "flex",
  },
  groupChildLayout: {
    height: 44,
    width: 314,
    display: "flex",
  },
  groupChildPosition: {
    borderRadius: 6,
    borderColor: "rgba(239, 227, 200, 0.5)",
    borderWidth: 1,
    height: 44,
    width: 370,
    display: "flex",
  },
  viewLayout: {
    height: 45,
    width: 221,
  },
  materialSymbolsarrowBackIoIcon: {
    top: 58,
    left: 30,
    width: 30,
    height: 30,
    display: "flex",
    overflow: "hidden",
  },
  profile: {
    top: 67,
    color: "#efe3c8",
    textAlign: "left",
    fontFamily: "Rosarivo-Regular",
    lineHeight: 30,
    fontSize: 20,
    display: "flex",
    textAlign: "center",
  },

  telaUserChild: {
    // marginTop: 0,
    // marginLeft: 0,
    width: 200,
    height: 200,
    borderRadius: 500,
    overflow: "hidden",
    // left: "50%",
    // top: "20%",
  },
  containerImagem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // position: "absolute",
    top: "18%",
    left: "1%"
    // right: 200,
  },

  solarcameraMinimalisticBoldIcon: {
    top: "45%",
    height: 32,
    width: 32,
    right: "40%",
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
    display: "flex",
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
    top: "20%",
    left: 0,
  },
  // nameParent: {
  //   top: "37%",
  // },
  // emailParent: {
  //   top: "40%",
  // },
  // phoneParent: {
  //   top: "43%",
  // },
  // biographyParent: {
  //   top: "46%",
  // },

  rectangleView: {
    backgroundColor: "#efe3c8",
    borderRadius: 6,
    borderStyle: "solid",
    top: 0,
    height: 45,
    width: 215,
    display: "flex",
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
    display: "flex",
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
    display: "flex",
    flexDirection: "column",
  },

  irAlLibroTypo: {
    textAlign: "center",
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_base,
  },

  irAlLibro: {
    color: Color.colorGray_100,
    marginRight: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },

  viewLayout: {
    marginVertical: 10,
    alignSelf: "center", // Adicione essa linha para centralizar a largura dos elementos
  },

  biography: {
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_base,
    color: Color.colorBlanchedalmond_100,
    borderStyle: "solid",
    borderColor: Color.colorBlanchedalmond_100,
    borderWidth: 1,
    borderRadius: Border.br_3xs,
    paddingHorizontal: 10,
  },

  phone: {
    height: 45,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_base,
    color: Color.colorBlanchedalmond_100,
    borderStyle: "solid",
    borderColor: Color.colorBlanchedalmond_100,
    borderWidth: 1,
    borderRadius: Border.br_3xs,
    paddingHorizontal: 10,
  },
});

export default Profile;
