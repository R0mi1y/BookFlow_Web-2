import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Pressable,
  Text,
  View,
  Image,
  Dimensions,
} from "react-native";
import Constants from 'expo-constants';
import MisFavoritosContainer from "../components/MisFavoritosContainer";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import * as SecureStore from 'expo-secure-store';
import starOutlineImage from "../assets/solarstaroutline.png";
import starFilledImage from "../assets/solarstarfilled.png";
import CustomPopup from '../components/CustomPopup';
import TopComponent from '../components/topComponent';


const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const [messagePopup, setPopupTexto] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);

  const messageComing = route.params?.message[0] || '';

  if (messageComing !== '') {
    route.params?.message.pop();
    setPopupTexto(messageComing);
    setPopupVisible(true);
  }

  const togglePopup = (message) => {
    if (message != null) setPopupVisible(true);
    else setPopupVisible(false);
    setPopupTexto(message);
  };

  const [ , setScrollPosition] = useState(0);
  const scrollViewRef = useRef(null);
  const timerRef = useRef(null);

  const itemWidth = screenWidth * 0.85; // Substitua pela largura real do seu item
  const itemCount = 5; // Número total de itens no carrossel

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll(); // Limpa o temporizador na desmontagem
  }, []);

  const startAutoScroll = () => {
    stopAutoScroll();
    timerRef.current = setInterval(() => {
      setScrollPosition(prevPosition => {
        const nextPosition = (prevPosition + itemWidth) % (itemWidth * itemCount);
        scrollViewRef.current?.scrollTo({ x: nextPosition, animated: true });
        return nextPosition;
      });
    }, 4000);
  };

  const stopAutoScroll = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const apiUrl = Constants.expoConfig.extra.apiUrl;

  const [sections, setSections] = useState([
    { title: 'Todos', filter: 'ALL', books: [] },
    { title: 'Pendentes', filter: 'PENDING', books: [] },
    { title: 'Favoritos', filter: 'WISHLIST', books: [] },
  ]);

  const getAccessToken = async () => {
    try {
      const user = JSON.parse(await SecureStore.getItemAsync("user"));

      if (!user) {
        console.error("Usuário não encontrado");
        navigation.reset({
          index: 0,
          routes: [{ name: "LogInScreen" }],
        });
        return;
      }

      const refreshToken = user.refresh_token;

      if (!refreshToken) {
        console.error(refreshToken);
        console.error("Refresh token não encontrado");
        navigation.reset({
          index: 0,
          routes: [{ name: "LogInScreen" }],
        });
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
        navigation.reset({
          index: 0,
          routes: [{ name: "LogInScreen" }],
        });
      }

      const data = await response.json();

      if (!('access' in data)) {
        console.error("Resposta não contém o token de acesso");
        navigation.reset({
          index: 0,
          routes: [{ name: "LogInScreen" }],
        });
        return;
      }

      return data.access;

    } catch (error) {
      console.error("Erro ao obter o token de acesso", error);
      navigation.reset({
        index: 0,
        routes: [{ name: "LogInScreen" }],
      });
    }
  };


  useEffect(() => {
    
    const fetchData = async (section, i) => {
      const user = JSON.parse(await SecureStore.getItemAsync("user"));
      try {
        const accessToken = await getAccessToken();

        if (accessToken) {
          var url = `${apiUrl}/api/book/user/${user.id}?filter=${section}`;

          console.log(url);

          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "Authorization": 'Bearer ' + accessToken,
            },
          });

          if (!response.ok) {
            throw new Error(await response.text());
          }

          const data = await response.json();
          
          var s = sections;
          
          s[i].books = data;

          setSections(s);
          
          console.log(s[i].books);
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "LogInScreen" }],
          });
          console.error("Falha ao obter AccessToken");
        }
      } catch (error) {
        console.error('Erro ooooooooooooooooooooooooooooooooo orrE');
        console.error(error.message);
        console.error('Erro ao buscar livros:', error.message);
      }
    };

    sections.map((section, i) => {
      fetchData(section.filter, i);
      console.log(i);
    });
  }, []);

  return (
    <>
      <CustomPopup
        visible={popupVisible}
        onClose={() => {togglePopup(null)}}
        message={messagePopup}
      />
      <ScrollView style={{backgroundColor: Color.colorGray_200}}>
        <View style={[styles.homeScreen, styles.iconLayout]}>
          {/* BOTÕES SUPERIOSRES DE PESQUISA E MENU */}
          <TopComponent
            middle={() => {
              navigation.navigate("HomeScreen");
            }}
          />
          
          {/* ------------------------------------- */}
          {/* CARROSSEL COMEÇA AQUI */}
          <ScrollView
            ref={scrollViewRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.groupParent}
            onMomentumScrollEnd={(event) => {
              setScrollPosition(event.nativeEvent.contentOffset.x);
            }}
          >
            <View style={[styles.rectangleGroup, styles.rectangleLayout1, styles.firstCarrousel]}>
              <Image
                style={styles.groupChild}
                contentFit="cover"
                source={require("../assets/rectangle-3.png")}
              />
              <Text
                style={[styles.cienciaFiccion, styles.textFlexBox]}
              >{`Ficção Científica`}</Text>
              <Text style={[styles.coleccin, styles.coleccinTypo]}>
                •Coleção•
              </Text>
            </View>
            <View style={[styles.rectangleGroup, styles.rectangleLayout1]}>
              <Image
                style={styles.groupChild}
                contentFit="cover"
                source={require("../assets/rectangle-5.png")}
              />
              <Text style={[styles.crimen, styles.crimenTypo]}>Criminal</Text>
              <Text style={[styles.coleccin1, styles.coleccinTypo]}>
                •Coleção•
              </Text>
            </View>
            <View style={[styles.rectangleGroup, styles.rectangleLayout1]}>
              <Image
                style={styles.groupChild}
                contentFit="cover"
                source={require("../assets/rectangle-4.png")}
              />
              <Text style={[styles.aventura, styles.textFlexBox]}>Aventura</Text>
              <Text style={[styles.coleccin2, styles.coleccinTypo]}>
                •Coleção•
              </Text>
            </View>
            <View style={[styles.rectangleGroup, styles.rectangleLayout1]}>
              <Image
                style={styles.groupChild}
                contentFit="cover"
                source={require("../assets/rectangle-2.png")}
              />
              <Text style={[styles.biografia, styles.crimenTypo]}>BIOGRAFIA</Text>
              <Text style={[styles.coleccin3, styles.coleccinTypo]}>
                •Coleção•
              </Text>
            </View>
            <View style={[styles.rectangleGroup, styles.rectangleLayout1]}>
              <Image
                style={styles.groupChild}
                contentFit="cover"
                source={require("../assets/rectangle-1.png")}
              />
              <View style={{ height: 120 }}/>
              <Text style={styles.infantil}>Infantil</Text>

              <Text style={[styles.coleccin4, styles.coleccinTypo]}>
                •Coleção•
              </Text>
            </View>
          </ScrollView>
          {/*-----------------------------------------------*/}

          <Text style={styles.miBiblioteca}>Minha biblioteca</Text>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            style={{ padding: 15 }}
          >
            <MisFavoritosContainer
              userFavorites={`Fazer\nempréstimo`}
              showSolarstarOutlineIcon
              source={require("../assets/lista_books.png")}
            />
            <MisFavoritosContainer
              onPress={() => navigation.navigate("RegisterBook")}
              userFavorites={`Cadastrar\nLivros`}
              showSolarstarOutlineIcon
              source={require("../assets/books_vetor.png")}
            />
            <MisFavoritosContainer
              onPress={() => navigation.navigate("ListBook", { "dataToSend": "MY_BOOKS" })}
              userFavorites={`Meus\nLivros`}
              showSolarstarOutlineIcon
              source={require("../assets/book_aberto.png")}
            />
            <MisFavoritosContainer
              onPress={() => navigation.navigate("ListBook", { "dataToSend": "MY_BOOKS" })}
              userFavorites={`Empréstimos`}
              showSolarstarOutlineIcon
              source={require("../assets/lista_de_livros.png")}
            />
            <View style={{ width:20 }}/>
          </ScrollView>
          <View style={styles.scrol1}>
            {/* GRUPO 1 LIVROS PENDENTES */}
            {sections.map((section) => (
              <View key={section.title}>
                <Text style={styles.audiolibrosTypo}>{section.title}</Text>

                <View style={styles.groupContainer}>
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollBooks}>
                  {section.books.length === 0 ? (
                    <Text style={[styles.audiolibrosTypo, {fontSize: 15}]}>Nenhum livro disponível nesta seção</Text>
                        ) : 
                      section.books.map((book) => (
                      <Pressable
                        key={book.id}
                        style={styles.groupLayout}
                        onPress={() => navigation.navigate("BookDetailScreen", { bookId: book.id })}
                      >
                        {/* LIVRO 1 */}
                        <View style={[styles.groupChild3, styles.groupLayout]} />
                        <Image
                          style={[styles.groupChild4, styles.groupChildLayout1]}
                          contentFit="cover"
                          source={{
                            uri: apiUrl + (book.cover ? book.cover : "/static/img/default_cover.jpg"),
                          }}
                        />
                        <Text
                          style={[styles.pachinkoNovela, styles.groupChildLayout1]}
                        >{book.title}</Text>

                        <View style={[styles.groupChild5, styles.groupChildLayout]} />
                        <Text style={[styles.text, styles.textTypo]}>STATUS</Text>
                        <View style={[styles.groupChild6, styles.groupChildLayout]} />
                        <View style={styles.groupChild7} />
                        <Image
                          style={[styles.groupChild8, styles.iconGroupLayout]}
                          contentFit="cover"
                          source={
                            book?.is_in_wishlist
                            ? starFilledImage
                            : starOutlineImage
                          }
                        />  
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollBooks:{
    paddingLeft: 20,
    paddingRight: 20,
  },
  myBibSection:{
    top: 20,
    flexDirection: "row",
    // justifyContent: "space-between",
    paddingLeft: screenWidth * 0.05,
    paddingRight: screenWidth * 0.05,
    marginBottom: 40,
    width: (screenWidth * 0.28 + 10) * 4,
    height: 105,
  },
  topLayout: {
    top: 40,
    marginLeft: screenWidth * 0.05,
    marginRight: screenWidth * 0.05,
    width: screenWidth * 0.9,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Define um fundo escuro semi-transparente
  },
  searchContainer: {
    width: '80%',
    top: screenHeight * 0.05,
    padding: 20,
    backgroundColor: 'transparent',
    // backgroundColor: 'white',
    borderRadius: 10,
  },
  searchInput: {
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: 'transparent',
    height: 45,
    marginBottom: 10,
    borderRadius: 10,
    paddingLeft: 15,
    color: Color.colorBeige_100,
    fontFamily: FontFamily.rosarivoRegular,
  },
  iconLayout: {
    width: "100%",
    overflow: "hidden",
  },
  phlistLayout: {
    height: 25,
    width: 25,
    marginTop: 15,
  },
  textFlexBox: {
    textAlign: "left",
    color: Color.colorWhite,
  },
  coleccinTypo: {
    fontFamily: FontFamily.plusJakartaSansLight,
    fontWeight: "300",
    fontSize: FontSize.size_3xs,
    textAlign: "left",
    color: Color.colorWhite,
    position: "absolute",
  },
  rectangleLayout1: {
    width: screenWidth * 0.8,
  },
  crimenTypo: {
    letterSpacing: 2.8,
    fontSize: FontSize.size_21xl,
    textAlign: "left",
    color: Color.colorWhite,
    position: "absolute",
  },
  autoresTypo: {
    textAlign: "center",
    color: Color.colorBlanchedalmond_100,
    fontFamily: FontFamily.rosarivoRegular,
  },
  frameBorder: {
    marginLeft: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 34,
    borderWidth: 1,
    borderColor: Color.colorBlanchedalmond_100,
    borderStyle: "solid",
    borderRadius: Border.br_3xs,
    flexDirection: "row",
  },
  iconGroupLayout: {
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  rectangleLayout: {
    height: 105,
    width: 110,
    // position: "absolute",
  },
  textTypo: {
    fontSize: FontSize.size_base,
    position: "absolute",
  },
  groupLayout: {
    height: 230,
    width: 135,
    marginRight: 20,
  },
  groupChildLayout1: {
    width: 111,
    left: 12,
  },
  groupChildLayout: {
    height: 39,
    borderRadius: Border.br_xs,
    top: 179,
  },
  audiolibrosTypo: {
    marginLeft: 25,
    marginTop: 10,
    letterSpacing: 0.1,
    fontFamily: FontFamily.rosarivoRegular,
    fontSize: FontSize.size_xl,
    textAlign: "left",
    color: Color.colorWhite,
  },
  icon: {
    height: "100%",
    overflow: "hidden",
  },
  groupChild: {
    borderRadius: Border.br_mini,
    left: 0,
    top: 0,
    height: 150,
    width: "100%",
    // position: "absolute",
  },
  cienciaFiccion: {
    top: 43,
    fontFamily: FontFamily.kodchasanSemiBold,
    fontWeight: "600",
    color: Color.colorWhite,
    lineHeight: 25,
    letterSpacing: 1.8,
    fontSize: FontSize.size_6xl,
    position: "absolute",
    left: 21,
  },
  coleccin: {
    top: 27,
    left: 50,
  },
  crimen: {
    top: 35,
    left: 71,
    fontFamily: FontFamily.kameron,
  },
  coleccin1: {
    top: 22,
    left: 125,
  },
  rectangleGroup: {
    marginLeft: screenWidth * 0.05,
  },
  firstCarrousel: {
    marginLeft: screenWidth * 0.1,
  },
  aventura: {
    top: 50,
    left: 173,
    fontFamily: FontFamily.miniver,
    lineHeight: 25,
    letterSpacing: 1.8,
    fontSize: FontSize.size_6xl,
    position: "absolute",
  },
  coleccin2: {
    top: 34,
    left: 197,
  },
  biografia: {
    top: 101,
    left: 154,
    fontFamily: FontFamily.karantinaRegular,
  },
  coleccin3: {
    top: 88,
    left: 184,
  },
  infantil: {
    top: 59,
    left: 36,
    fontFamily: FontFamily.karantinaRegular,
    fontSize: FontSize.size_xl,
    textAlign: "left",
    color: Color.colorWhite,
    position: "absolute",
  },
  coleccin4: {
    top: 46,
    left: 46,
  },
  groupParent: {
    top: 80,
    flexDirection: "row",
    width: "100%",
    // position: "absolute",
  },
  l: {
    fontSize: FontSize.size_11xl,
    color: Color.colorBlanchedalmond_400,
    fontFamily: FontFamily.rosarivoRegular,
  },
  libro: {
    fontSize: FontSize.size_23xl,
    color: Color.colorBlanchedalmond_100,
    fontFamily: FontFamily.rosarivoRegular,
  },
  brandLogo: {
    flexDirection: "row",
    alignItems: "center"
  },
  autores: {
    width: 88,
    height: 16,
    lineHeight: 18,
    fontSize: FontSize.size_sm,
    textAlign: "center",
  },
  autoresWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 34,
    borderWidth: 1,
    borderColor: Color.colorBlanchedalmond_100,
    borderStyle: "solid",
    width: 90,
    borderRadius: Border.br_3xs,
    flexDirection: "row",
  },
  autoresContainer: {
    width: 110,
  },
  autoresFrame: {
    width: 90,
    marginLeft: 15,
  },
  frameView: {
    width: 112,
  },
  autoresWrapper1: {
    width: 87,
  },
  instanceParent: {
    top: 120,
    width: 322,
    left: 43,
    flexDirection: "row",
    position: "absolute",
  },
  miBiblioteca: {
    width: 170,
    height: "auto",
    alignItems: "center",
    lineHeight: 20,
    fontSize: FontSize.size_base,
    left: 22,
    fontFamily: FontFamily.rosarivoRegular,
    textAlign: "left",
    color: Color.colorWhite,
  },
  vectorIcon: {
    height: "2.61%",
    width: "11.11%",
    top: "31.77%",
    right: "15.56%",
    bottom: "66.62%",
    left: "77%",
  },
  rectangleView: {
    backgroundColor: Color.colorDimgray,
    borderRadius: Border.br_3xs,
    width: 95,
    left: 0,
    top: 0,
  },
  iniciarSesin: {
    top: 19,
    lineHeight: 20,
    textAlign: "center",
    color: Color.colorBlanchedalmond_100,
    fontFamily: FontFamily.rosarivoRegular,
    left: 10,
  },
  octiconperson24: {
    left: 48,
    height: 37,
    top: 62,
    width: 54,

    overflow: "hidden",
  },
  rectangleParent2: {
    top: 385,
    left: 17,
  },
  groupChild3: {
    borderRadius: 13,
    backgroundColor: Color.colorGray_300,
    left: 0,
    top: 0,
    position: "absolute",
  },
  groupChild4: {
    height: 111,
    top: 12,
    width: 111,
    borderRadius: Border.br_mini,
    position: "absolute",
  },
  pachinkoNovela: {
    top: 131,
    height: 35,
    lineHeight: 20,
    width: 111,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.rosarivoRegular,
    textAlign: "center",
    color: Color.colorBlanchedalmond_100,
    position: "absolute",
  },
  groupChild5: {
    backgroundColor: Color.colorGray_400,
    width: 111,
    left: 12,
  },
  text: {
    top: 190,
    left: 37,
    fontFamily: FontFamily.openSansRegular,
    width: 100,
    height: 18,
    lineHeight: 18,
    textAlign: "left",
    color: Color.colorWhite,
    fontWeight: "600",
  },
  // groupChild6: {
  //   left: 84,
  //   backgroundColor: Color.colorBlanchedalmond_100,
  //   width: 39,
  // },
  groupIcon: {
    height: "9.37%",
    width: "15.37%",
    top: "81.61%",
    right: "16.74%",
    bottom: "10.83%",
    left: "69%",
  },
  groupChild7: {
    borderTopLeftRadius: Border.br_mini,
    borderBottomRightRadius: Border.br_mini,
    borderBottomLeftRadius: Border.br_12xs,
    backgroundColor: Color.colorDarkslategray,
    width: 41,
    left: 12,
    top: 12,
    height: 20,
    position: "absolute",
  },
  groupChild8: {
    height: "4.35%",
    width: "7.78%",
    top: "7.39%",
    right: "78.89%",
    bottom: "88.26%",
    left: "13.33%",
  },
  text1: {
    top: 13,
    left: 33,
    width: 13,
    height: 14,
    fontSize: FontSize.size_3xs,
    fontFamily: FontFamily.rosarivoRegular,
    color: Color.colorWhite,
  },
  rectangleParent3: {
    marginLeft: 19,
  },
  groupContainer: {
    marginTop: 12,
    flexDirection: "row",
  },

  agregadosRecientemente: {
    marginTop: 12,
  },
  scrol1: {
    width: "100%",
  },
  bgIcon: {
    top: -2,
    right: 70,
    bottom: 16,
    left: 69,
    display: "none",
  },
  batteryIcon: {
    right: 0,
    height: 11,
    top: 0,
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
  // iosstatusBarblack: {
  //   right: 1,
  //   left: 1,
  //   height: 44,
  //   top: 0,
  //   position: "absolute",
  //   overflow: "hidden",
  //   backgroundColor: Color.colorGray_200,
  // },
  homeScreen: {
    // display:"flex",
    top: 0,
    flex: 1,
    flexDirection: "column",
    overflow: "hidden",
  },
});

export default HomeScreen;
