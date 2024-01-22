import * as React from "react";
import { useEffect, useState } from "react";
import Constants from "expo-constants";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, FontSize, Color, Border, Padding } from "../GlobalStyles";
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';


const RegisterBook = () => {
  const navigation = useNavigation();
  const apiUrl = Constants.expoConfig.extra.apiUrl;

  const [selectedImage, setSelectedImage] = useState(null);

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [genero, setGenero] = useState("");
  const [resumo, setResumo] = useState("");
  const [imagem, setImagem] = useState("");

  const getAccessToken = async () => {
    try {
      const user = JSON.parse(await await SecureStore.getItemAsync("user"));

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

  const send_book = async () => {
    const accessToken = await getAccessToken();

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage,
        type: 'image/jpeg', // Ajuste conforme o tipo de arquivo
        name: 'cover.jpg',
      });

      formData.append('title', titulo);
      formData.append('author', autor);
      formData.append('summary', resumo);
      formData.append('genre', genero);

      const response = await fetch(`${apiUrl}/api/book/`, {
        method: "POST",
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: "Bearer " + accessToken,
        },
        body: formData,
      });

      console.log(formData);

      if (!response.ok) {
        // Tentar analisar o corpo da resposta como JSON para obter detalhes específicos do erro
        let errorMessage = "Erro na requisição";
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (jsonError) {
          // Imprimir a resposta completa em caso de erro de análise JSON
          console.error(
            "Resposta completa do servidor:",
            await response.text()
          );
          console.error(
            "Erro ao analisar o corpo JSON da resposta de erro",
            jsonError
          );
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json();

      if (responseData?.id != null) {
        console.log("Livro cadastrado com sucesso:", responseData);
        navigation.navigate("HomeScreen");
      } else {
        if (responseData?.message) {
          console.error("Erro no cadastro:", responseData.message);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const pickDocument = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
          console.error('Permissão negada para acessar a biblioteca de mídia');
          return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          // aspect: [4, 3],
          quality: 1,
      });

      if (!result.cancelled) {
          setSelectedImage(result.uri);
      }
    } catch (err) {
    console.error('Erro ao selecionar o documento:', err);
    }
  };

  return (
    <View style={styles.RegisterBook}>
      <Image
        style={[styles.phlistIcon, styles.iconLayout]}
        contentFit="cover"
        source={require("../assets/phlist.png")}
      />
      {/* <Image
        style={[styles.epsearchIcon, styles.iconLayout]}
        contentFit="cover"
        source={require("../assets/epsearch.png")}
      /> */}
      <Pressable
        style={styles.brandLogo}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <Text style={[styles.libro, styles.libroPosition]}>Cadastre seu </Text>
        <Text style={[styles.l, styles.lTypo]}>Livro</Text>
      </Pressable>

      <View style={[styles.cta, styles.ctaLayout]} />
      <View style={[styles.cta1, styles.ctaLayout]}>
        <TextInput
          style={[styles.irAlLibroInput]} // Certifique-se de ter um estilo para seus TextInput
          placeholder=" Título "
          placeholderTextColor={Color.colorBlanchedalmond_101}
          value={titulo}
          onChangeText={(text) => setTitulo(text)}
        />
      </View>

      <View style={[styles.cta2, styles.ctaLayout]}>
        <TextInput
          style={[styles.irAlLibroInput]} // Certifique-se de ter um estilo para seus TextInput
          placeholder="  Autor  "
          placeholderTextColor={Color.colorBlanchedalmond_101}
          value={autor}
          onChangeText={(text) => setAutor(text)}
        />
      </View>

      <View style={[styles.cta3, styles.ctaLayout]}>
        <TextInput
          style={[styles.irAlLibroInput]} // Certifique-se de ter um estilo para seus TextInput
          placeholder="  Genêro  "
          placeholderTextColor={Color.colorBlanchedalmond_101}
          value={genero}
          onChangeText={(text) => setGenero(text)}
        />
      </View>

      <View style={[styles.cta4, styles.ctaLayout]}>
        <TextInput
          style={[styles.irAlLibroInput]} // Certifique-se de ter um estilo para seus TextInput
          placeholder=" Resumo "
          placeholderTextColor={Color.colorBlanchedalmond_101}
          value={resumo}
          onChangeText={(text) => setResumo(text)}
        />
      </View>

      <View style={[styles.cta5, styles.ctaLayout]}>
        <Pressable
        onPress={pickDocument}>
          <Text style={[styles.contenidoRelacionado, styles.irAlLibroTypo]}>Insira uma imagem</Text>
        </Pressable>
      </View>

      <View style={[styles.android1, styles.androidLayout]} />

      <Image source={{ uri: selectedImage ? selectedImage : `${apiUrl}/static/img/default_cover.jpg` }} style={styles.imgBook} />
      
      <View style={[styles.android2, styles.androidLayout]} />

      <Pressable style={styles.irAlLibroParent} onPress={send_book}>
        <Text style={[styles.irAlLibro, styles.irAlLibroTypo]}>Cadastrar</Text>
        <Image
          style={[styles.ionbookIcon, styles.lPosition]}
          contentFit="cover"
          source={require("../assets/ionbook.png")}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  android1: {
    top: 170,
  },
  android2: {
    top: 320,
  },
  androidLayout: {
    height: 1,
    width: 300,
    borderTopWidth: 0.5,
    borderColor: Color.colorBlanchedalmond_200,
    borderStyle: "solid",
    alignSelf:"center",
    position: "absolute",
  },
  imgBook:{
    width: 111,
    height: 111,
    borderRadius: Border.br_mini,
    top:190,
    alignSelf:"center",
  },
  iconLayout: {
    width: 25,
    top: 62,
    height: 25,
    position: "absolute",
    overflow: "hidden",
  },
  lTypo: {
    textAlign: "center",
    fontFamily: FontFamily.rosarivoRegular,
  },
  libroPosition: {
    top: 0,
    position: "absolute",
  },
  sidePosition: {
    top: 17,
    height: 11,
    position: "absolute",
  },
  containerTypo: {
    fontSize: FontSize.size_xs,
    color: Color.colorWhite,
    textAlign: "left",
    position: "absolute",
  },
  iconoirpageFlipPosition: {
    top: 538,
    height: 24,
    width: 24,
    position: "absolute",
    overflow: "hidden",
  },
  ctaLayout: {
    alignSelf: "center",
    justifyContent: "center",
    height: 45,
    borderRadius: Border.br_3xs,
    width: 302,
    position: "absolute",
  },
  irAlLibroTypo: {
    textAlign: "center",
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_base,
  },
  irAlLibroInput: {
    textAlign: "center",
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_base,
    color: Color.colorBlanchedalmond_100,
  },
  lPosition: {
    left: 0,
    position: "absolute",
  },
  phlistIcon: {
    height: 25,
    left: 27,
    width: 25,
    top: 62,
  },
  epsearchIcon: {
    left: 311,
    height: 25,
    width: 25,
    top: 62,
  },
  l: {
    top: 46,
    fontSize: FontSize.size_29xl,
    color: Color.colorBlanchedalmond_400,
    width: 250,
    height: 50,
    left: 70,
    position: "absolute",
  },
  libro: {
    left: 37,
    fontSize: FontSize.size_23xl,
    width: 350,
    height: 50,
    color: Color.colorBlanchedalmond_100,
    textAlign: "center",
    fontFamily: FontFamily.rosarivoRegular,
  },
  brandLogo: {
    top: 49,
    left: 10,
    width: 144,
    height: 52,
    position: "absolute",
  },
  bgIcon: {
    top: -2,
    right: 70,
    bottom: 16,
    left: 69,
    maxWidth: "100%",
    maxHeight: "100%",
    display: "none",
    position: "absolute",
    overflow: "hidden",
  },
  batteryIcon: {
    width: 24,
    height: 11,
    right: 0,
    top: 0,
    position: "absolute",
  },
  wifiIcon: {
    width: 15,
    height: 11,
  },
  mobileSignalIcon: {
    width: 17,
    height: 11,
  },
  rightSide: {
    right: 15,
    width: 67,
    height: 11,
  },
  leftSideIcon: {
    left: 34,
    width: 28,
    height: 11,
  },
  iosstatusBarblack: {
    left: 2,
    height: 44,
    right: 0,
    top: 0,
    position: "absolute",
    overflow: "hidden",
    backgroundColor: Color.colorGray_200,
  },
  productImageIcon: {
    top: 119,
    height: 336,
    width: 302,
    left: 27,
    position: "absolute",
  },
  pachinko: {
    top: 482,
    left: 113,
    fontSize: FontSize.size_5xl,
    lineHeight: 30,
    color: Color.colorWhite,
    textAlign: "left",
    fontFamily: FontFamily.rosarivoRegular,
    position: "absolute",
  },
  minJinLee: {
    top: 512,
    left: 136,
    lineHeight: 20,
    fontSize: FontSize.size_base,
    color: Color.colorBlanchedalmond_100,
    textAlign: "left",
    fontFamily: FontFamily.rosarivoRegular,
    position: "absolute",
  },
  aSingleEspresso: {
    fontWeight: "300",
    fontFamily: FontFamily.openSansLight,
  },
  text: {
    fontFamily: FontFamily.openSansRegular,
  },
  readMore1: {
    textDecoration: "underline",
  },
  aSingleEspressoContainer: {
    top: 594,
    lineHeight: 17,
    height: 57,
    left: 29,
    fontSize: FontSize.size_xs,
    width: 302,
  },
  cuentoNovela: {
    fontFamily: FontFamily.rosarivoRegular,
  },
  cuentoNovelaContainer: {
    top: 579,
    left: 101,
    lineHeight: 15,
  },
  biuploadIcon: {
    top: 537,
    left: 129,
    height: 24,
    width: 24,
    position: "absolute",
    overflow: "hidden",
  },
  solarstarOutlineIcon: {
    left: 168,
  },
  iconoirpageFlip: {
    left: 207,
  },
  cta: {
    top: 700,
    backgroundColor: Color.colorBlanchedalmond_100,
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 15,
    elevation: 15,
    shadowOpacity: 1,
  },
  contenidoRelacionado: {
    color: Color.colorBlanchedalmond_100,
  },
  cta1: {
    top: 420,
    borderStyle: "solid",
    borderColor: Color.colorBlanchedalmond_100,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 50,
    paddingTop: 10,
    paddingBottom: Padding.p_smi,
  },

  cta2: {
    top: 490,
    borderStyle: "solid",
    borderColor: Color.colorBlanchedalmond_100,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 50,
    paddingTop: 10,
    paddingBottom: Padding.p_smi,
  },
  cta3: {
    top: 560,
    borderStyle: "solid",
    borderColor: Color.colorBlanchedalmond_100,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 50,
    paddingTop: 10,
    paddingBottom: Padding.p_smi,
  },
  cta4: {
    top: 630,
    borderStyle: "solid",
    borderColor: Color.colorBlanchedalmond_100,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 50,
    paddingTop: 10,
    paddingBottom: Padding.p_smi,
  },
  cta5: {
    top: 350,
    borderStyle: "solid",
    borderColor: Color.colorBlanchedalmond_100,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 50,
    paddingTop: 10,
    paddingBottom: Padding.p_smi,
  },


  irAlLibro: {
    left: 20,
    color: Color.colorGray_100,
    width: 86,
    top: 0,
    position: "absolute",
    height: 25,
  },
  ionbookIcon: {
    top: 2,
    width: 20,
    height: 20,
    overflow: "hidden",
  },
  irAlLibroParent: {
    top: 710,
    left: 150,
    width: 106,
    height: 25,
    position: "absolute",
  },
  RegisterBook: {
    flex: 1,
    width: "100%",
    height: 900,
    overflow: "hidden",
    backgroundColor: Color.colorGray_200,
  },
});

export default RegisterBook;
