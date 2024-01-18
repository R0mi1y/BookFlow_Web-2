import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, FontSize, Color, Border, Padding } from "../GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';
import starOutlineImage from "../assets/solarstaroutline.png";
import starFilledImage from "../assets/solarstarfilled.png";

const BookDetailScreen = ({ route }) => {
  const navigation = useNavigation();

  const apiUrl = Constants.manifest.extra.apiUrl;
  const [books, setBooks] = useState([]);

  const getAccessToken = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem("@user"));

      if (!user) {
        console.error("Couldn't find user");
        navigation.navigate("LogInScreen");
        return;
      }

      const refreshToken = user.refresh_token;

      if (!refreshToken) {
        console.error("Refresh token não encontrado");
        navigation.navigate("LogInScreen");
        return;
      }

      const response = await fetch(
        `${apiUrl}/api/token/refresh/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        }
      );

      if (!response.ok) {
        console.error(`Erro na requisição de atualização do token: ${response.statusText}`);
        return;
      }

      if (response.code === "token_not_valid") {
        console.error("Invalid token: " + response.statusText);
        navigation.navigate("LogInScreen");
      }

      const data = await response.json();

      if (!('access' in data)) {
        console.error("Resposta não contém o token de acesso");
        navigation.navigate("LogInScreen");
        return;
      }

      return data.access;

    } catch (error) {
      console.error("Erro ao obter o token de acesso", error);
      navigation.navigate("LogInScreen");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await getAccessToken();

        if (accessToken) {
          const response = await fetch(`${apiUrl}/api/book/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": 'Bearer ' + accessToken,
            },
          });

          if (!response.ok) {
            throw new Error(`Erro ao buscar livros: ${response.status}`);
          }

          const data = await response.json();
          setBooks(data);
          console.log(data);
        } else {
          console.error("Falha ao obter AccessToken");
        }
      } catch (error) {
        console.error('Erro ao buscar livros:', error.message);
      }
    };

    fetchData();

  }, []);

  const { bookId } = route.params || {};

  return (
    <View style={styles.BookDetailScreen}>
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
        <Text style={[styles.l, styles.lTypo]}>Book</Text>
        <Text style={[styles.libro, styles.libroPosition]}>Flow</Text>
      </Pressable>
      <Image
        style={styles.productImageIcon}
        contentFit="cover"
        source={require("../assets/product-image.png")}
      />
      <Text style={styles.pachinko}>{books.find(book => book.id === bookId)?.title}</Text>
      <Text style={styles.minJinLee}>{books.find(book => book.id === bookId)?.author}</Text>
      <Text style={[styles.aSingleEspressoContainer, styles.containerTypo]}>

        {/* Descrição do Livro */}

        {books.filter(book => book.id === bookId).map(book => (

          <Text key={book.id} style={styles.aSingleEspresso}>
            {book.summary}
          </Text>

        ))}
        <Text style={styles.text}>{`... `}</Text>
        <Text style={styles.text}>
          <Text style={styles.readMore1}>Read More</Text>
        </Text>
      </Text>
      <Text style={[styles.cuentoNovelaContainer, styles.containerTypo]}>
        <Text style={styles.cuentoNovela}>{books.find(book => book.id === bookId)?.genre}</Text>
      </Text>
      <Image
        style={styles.biuploadIcon}
        contentFit="cover"
        source={require("../assets/biupload.png")}
      />
      <Image
        style={[styles.solarstarOutlineIcon, styles.iconoirpageFlipPosition]}
        contentFit="cover"
        source={books.find(book => book.id === bookId)?.is_in_wishlist ? starFilledImage : starOutlineImage}
      />
      <Image
        style={[styles.iconoirpageFlip, styles.iconoirpageFlipPosition]}
        contentFit="cover"
        source={require("../assets/iconoirpageflip.png")}
      />
      <View style={[styles.cta, styles.ctaLayout]} />
      <View style={[styles.cta1, styles.ctaLayout]}>
        <Text style={[styles.contenidoRelacionado, styles.irAlLibroTypo]}>
          Contenido relacionado
        </Text>
      </View>
      <View style={styles.irAlLibroParent}>
        <Text style={[styles.irAlLibro, styles.irAlLibroTypo]}>
          Ir al libro
        </Text>
        <Image
          style={[styles.ionbookIcon, styles.lPosition]}
          contentFit="cover"
          source={require("../assets/ionbook.png")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconLayout: {
    width: 25,
    top: 62,
    height: 25,
    position: "absolute",
    overflow: "hidden",
  },
  lTypo: {
    textAlign: "left",
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
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    borderRadius: Border.br_3xs,
    left: 55,
    width: 302,
    position: "absolute",
  },
  irAlLibroTypo: {
    textAlign: "center",
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_base,
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
    top: 9,
    fontSize: FontSize.size_11xl,
    color: Color.colorBlanchedalmond_400,
    width: 100,
    height: 43,
    left: 0,
    position: "absolute",
  },
  libro: {
    left: 75,
    fontSize: FontSize.size_23xl,
    width: 105,
    height: 50,
    color: Color.colorBlanchedalmond_100,
    textAlign: "left",
    fontFamily: FontFamily.rosarivoRegular,
  },
  brandLogo: {
    top: 49,
    left: 125,
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
    left: 50,
    position: "absolute",
  },
  pachinko: {
    top: 482,
    left: 133,
    fontSize: FontSize.size_5xl,
    lineHeight: 30,
    color: Color.colorWhite,
    textAlign: "left",
    fontFamily: FontFamily.rosarivoRegular,
    position: "absolute",
  },
  minJinLee: {
    top: 512,
    left: 156,
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
    left: 59,
    fontSize: FontSize.size_xs,
    width: 302,
  },
  cuentoNovela: {
    fontFamily: FontFamily.rosarivoRegular,
  },
  cuentoNovelaContainer: {
    top: 579,
    left: 121,
    lineHeight: 15,
  },
  biuploadIcon: {
    top: 537,
    left: 140,
    height: 24,
    width: 24,
    position: "absolute",
    overflow: "hidden",
  },
  solarstarOutlineIcon: {
    left: 185,
  },
  iconoirpageFlip: {
    left: 227,
  },
  cta: {
    top: 665,
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
    top: 724,
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
    top: 675,
    left: 155,
    width: 106,
    height: 25,
    position: "absolute",
  },
  BookDetailScreen: {
    flex: 1,
    width: "100%",
    height: 800,
    overflow: "hidden",
    backgroundColor: Color.colorGray_200,
  },
});

export default BookDetailScreen;
