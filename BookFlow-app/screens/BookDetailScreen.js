import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, FontSize, Color, Border, Padding } from "../GlobalStyles";
import Constants from "expo-constants";
import starOutlineImage from "../assets/solarstaroutline.png";
import starFilledImage from "../assets/solarstarfilled.png";
import TopComponent from "../components/topComponent";
import CustomPopup from "../components/CustomPopup";
import getAccessToken from "../components/auxiliarFunctions";
import avalibleImage from "../assets/avalible_plate.png";
import unvalibleImage from "../assets/unvalible_plate.png";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const BookDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const apiUrl = Constants.expoConfig.extra.apiUrl;
  const { bookId, owner, fromScreen } = route.params || {};
  const [book, setBook] = useState([]);
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [showFullRequirementsLoan, setShowFullRequirementsLoan] =
    useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [messagePopup, setPopupTexto] = useState("Loading");
  const [popupVisible, setPopupVisible] = useState(true);

  const togglePopup = (message = null) => {
    setPopupVisible(false);
    if (message != null) {
      setPopupTexto(message);
      setPopupVisible(true);
    }
  };

  async function requestBook(bookId) {
    try {
      const accessToken = await getAccessToken(navigation);

      if (accessToken) {
        const response = await fetch(
          `${apiUrl}/api/book/${bookId}/request_loan/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
          }
        );

        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data = await response.json();

        if (data?.id) {
          setBook(data);
        } else if (data?.error) {
          togglePopup(data.error);
        }

        navigation.reset({
          index: 0,
          routes: [{ name: "HomeScreen" }],
        });
      }
    } catch (error) {
      console.error("Erro ao requisitar empréstimo:");
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await getAccessToken(navigation);

        if (accessToken) {
          const response = await fetch(`${apiUrl}/api/book/${bookId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
          });

          if (!response.ok) {
            throw new Error(await response.text());
          }
          if (!response.ok) {
            throw new Error(response.text());
          }

          let data = await response.json();

          data["summaryLength"] = data.summary.length;
          data["requirements_loanLength"] = data.summary.length;

          await setBook(data);
          setIsFavorited(data.is_in_wishlist ?? false);

          togglePopup();
          console.log(data);
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "LogInScreen" }],
          });
          console.log("Falha ao obter AccessToken");
        }
      } catch (error) {
        console.log("Erro ao buscar livros:", error.message);
      }
    };

    fetchData();
  }, []);

  const toggleShowFullSummary = () => {
    setShowFullSummary(!showFullSummary);
  };
  const toggleShowFullRequirementsLoan = () => {
    setShowFullRequirementsLoan(!showFullRequirementsLoan);
  };

  const getLimitedSummary = (summary) => {
    return (summary?.length && summary?.length) > 93
      ? summary.slice(0, 110) + "...  "
      : summary;
  };

  const toggleFavorite = async (bookId) => {
    const url = `${apiUrl}/api/book/${bookId}/wishlist/`;
    console.log(url);
    try {
      const accessToken = await getAccessToken(navigation);

      if (accessToken) {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
        });
        if (!response.ok) {
          throw new Error(await response.text());
        }

        setIsFavorited((prevIsFavorited) => !prevIsFavorited);
      } else {
        console.log("Falha ao obter AccessToken");
      }
    } catch (error) {
      console.log("Erro ao favoritar livro:", error.message);
    }
  };

  return (
    <ScrollView>
      <CustomPopup
        visible={popupVisible}
        onClose={() => {
          togglePopup(null);
        }}
        message={messagePopup}
      />
      <View style={styles.BookDetailScreen}>
        <TopComponent
          middle={() => {
            navigation.navigate("HomeScreen");
          }}
        />
        <View style={styles.iconsSection}>
          <Pressable onPress={() => toggleFavorite(bookId)}>
            <Image
              style={[
                styles.solarstarOutlineIcon,
                styles.iconoirpageFlipPosition,
              ]}
              contentFit="cover"
              source={isFavorited ? starFilledImage : starOutlineImage}
            />
          </Pressable>
        </View>
        <Image
          style={[styles.avaliabilityIcon]}
          contentFit="cover"
          source={book?.availability ? avalibleImage : unvalibleImage}
        />
        <Image
          style={styles.productImageIcon}
          contentFit="cover"
          source={{
            uri: book?.cover
              ? book?.cover
              : apiUrl + "/static/img/default_cover.jpg",
          }}
        />
        <View style={styles.title}>
          <Text style={styles.pachinko}>{book?.title}</Text>
        </View>
        <View style={styles.viewWithBorder}>
          <Text style={styles.minJinLee}>{book?.author}</Text>

          <Text
            style={[
              styles.aSingleEspressoContainer,
              styles.containerTypo,
              showFullSummary && { textAlign: "justify" },
            ]}
          >
            {
              <Text key={book.id} style={styles.aSingleEspresso}>
                {showFullSummary
                  ? book.summary
                  : getLimitedSummary(book.summary)}
              </Text>
            }
            {book?.summaryLength > 100 && (
              <Pressable onPress={toggleShowFullSummary}>
                <Text style={[styles.readMore1]}>
                  {showFullSummary ? "  Leia Menos" : "Leia Mais"}
                </Text>
              </Pressable>
            )}
          </Text>

          <Text style={[styles.cuentoNovelaContainer, styles.containerTypo1]}>
            <Text style={styles.cuentoNovela}>
              {book?.genre?.replace(/,/g, " • ")}
            </Text>
          </Text>
          {owner ? (
            <Pressable
              onPress={
                owner
                  ? () => navigation.navigate("RegisterBook", { book: book })
                  : () => {
                      book.is_required
                        ? togglePopup("Empréstimo já requisitado!")
                        : requestBook(bookId);
                    }
              }
            >
              <View
                style={[styles.cta, styles.ctaLayout, styles.irAlLibroParent]}
              >
                <Text style={[styles.irAlLibro, styles.irAlLibroTypo]}>
                  Editar livro
                </Text>
                <Image
                  style={[styles.ionbookIcon, styles.lPosition]}
                  contentFit="cover"
                  source={require("../assets/ionbook.png")}
                />
              </View>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => {
                navigation.navigate("OwnerScreen", { ownerId: book.owner });
              }}
            >
              <View
                style={[styles.cta, styles.ctaLayout, styles.irAlLibroParent]}
              >
                <Text style={[styles.irAlLibro, styles.irAlLibroTypo]}>
                  Informações do proprietario
                </Text>
              </View>
            </Pressable>
          )}
          {false && owner && book.status == "Requisitado" && (
            <Pressable
              onPress={
                owner
                  ? () => navigation.navigate("AcceptLoan", { book: book })
                  : () => {
                      book.is_required
                        ? togglePopup("Empréstimo já requisitado!")
                        : requestBook(bookId);
                    }
              }
            >
              <View
                style={[styles.cta, styles.ctaLayout, styles.irAlLibroParent]}
              >
                <Text style={[styles.irAlLibro, styles.irAlLibroTypo]}>
                  Aprovar pedido
                </Text>
                <Image
                  style={[styles.ionbookIcon, styles.lPosition]}
                  contentFit="cover"
                  source={require("../assets/ionbook.png")}
                />
              </View>
            </Pressable>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  avaliabilityIcon: {
    display: "flex",
    height: 170,
    width: 170,
    marginBottom: -90,
    marginLeft: (screenWidth / 2) * 1.34,
    zIndex: 1,
    maxHeight: "100%",
    maxWidth: "100%",
  },
  iconsSection: {
    marginTop: 25,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
  },
  summaryContainer: {
    maxHeight: 250, // ou qualquer outra altura desejada
  },
  viewWithBorder: {
    // borderWidth: 5, // Define a largura da borda como 5 pixels
    // borderColor: "red", // Define a cor da borda como preto
    marginTop: 5,
  },
  contIcons: {
    flexDirection: "row",
    alignSelf: "center",
    padding: 10,
    top: 30,
    marginBottom: 20,
  },
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
    // borderWidth: 5, // Define a largura da borda como 5 pixels
    // borderColor: "white", // Define a cor da borda como preto
    marginTop: 15,
    fontSize: FontSize.size_sm,
    color: Color.colorWhite,
    textAlign: "center",
  },
  containerTypo1: {
    marginTop: 17,
    fontSize: FontSize.size_sm,
    color: Color.colorWhite,
    textAlign: "center",
  },
  iconoirpageFlipPosition: {
    height: 24,
    width: 24,
    overflow: "hidden",
  },
  ctaLayout: {
    alignSelf: "center",
    height: 45,
    borderRadius: Border.br_3xs,
    width: 302,
  },
  irAlLibroTypo: {
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_base,
  },
  lPosition: {
    marginTop: 3,
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
    marginTop: -35,
    height: 302,
    width: 302,
    alignSelf: "center",
    borderRadius: Border.br_mini,
  },
  pachinko: {
    marginTop: 25,
    width: 300,
    fontSize: FontSize.size_5xl,
    lineHeight: 30,
    color: Color.colorWhite,
    textAlign: "center",
    fontFamily: FontFamily.rosarivoRegular,
  },
  minJinLee: {
    // borderWidth: 5, // Define a largura da borda como 5 pixels
    // borderColor: "black", // Define a cor da borda como preto
    lineHeight: 24,
    fontSize: 18,
    color: Color.colorBlanchedalmond_100,
    textAlign: "center",
    fontFamily: FontFamily.rosarivoRegular,
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
    color: "#FFF",
    fontFamily: "Open Sans",
    fontSize: 12,
    textDecorationLine: "none",
  },
  aSingleEspressoContainer: {
    alignSelf: "center",
    marginTop: 0,
    lineHeight: 17,
    // height: 100,
    fontSize: FontSize.size_xs,
    width: 302,
  },
  cuentoNovela: {
    fontFamily: FontFamily.rosarivoRegular,
  },
  cuentoNovelaContainer: {
    marginTop: -80,
    alignSelf: "center",
    lineHeight: 22,
  },
  biuploadIcon: {
    height: 24,
    width: 24,
    overflow: "hidden",
  },
  solarstarOutlineIcon: {
    marginLeft: 8,
    marginRight: 8,
  },
  iconoirpageFlip: {},
  cta: {
    marginTop: 15,
    marginBottom: 35,
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
  scrollContainer:{
    flexGrow: 1,
  },
  cta1: {
    top: 80,
    borderStyle: "solid",
    borderColor: Color.colorBlanchedalmond_100,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 50,
    paddingTop: 10,
    paddingBottom: Padding.p_smi,
  },
  irAlLibro: {
    color: Color.colorGray_100,
    height: 25,
  },
  ionbookIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  irAlLibroParent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "center",
  },
  BookDetailScreen: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    width: "100%",
    overflow: "hidden",
    backgroundColor: Color.colorGray_200,
    minHeight: screenHeight * 1.1
  },
});

export default BookDetailScreen;
