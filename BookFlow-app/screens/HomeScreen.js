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
import getAccessToken from '../components/auxiliarFunctions';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const [messagePopup, setPopupTexto] = useState('Loading');
  const [popupVisible, setPopupVisible] = useState(true);

  const messageComing = route.params?.message[0] || '';

  if (messageComing !== '') {
    route.params?.message.pop();
    setPopupTexto(messageComing);
    setPopupVisible(true);
  }

  const togglePopup = (message=null) => {
    setPopupVisible(false);
    if (message != null) {
      setPopupTexto(message);
      setPopupVisible(true);
    }
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

  useEffect(() => {
    let count = 0;
    const fetchData = async (section, i) => {
      const user = JSON.parse(await SecureStore.getItemAsync("user"));
      try {
        const accessToken = await getAccessToken(navigation);

        if (accessToken) {
          var url = `${apiUrl}/api/book/user/${user.id}?filter=${section}`;
          console.log("Buscando em " + url);

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
          
          if (sections.length - 1 == i) togglePopup();
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: "LogInScreen" }],
          });
          console.error("Falha ao obter AccessToken");
        }
        count = 0;
      } catch (error) {
        if (count < 5) {
          count ++;
          fetchData(section, i);
        } else count = 0;
        console.error(error.message);
        console.error('Erro ao buscar livros:', error.message);
      }
    };

    sections.map((section, i) => {
      fetchData(section.filter, i);
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
            <View style={[styles.rectangleGroup]}>
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
            <View style={[styles.rectangleGroup]}>
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
            <View style={[styles.rectangleGroup]}>
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
            <View style={[styles.rectangleGroup]}>
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
            <View style={{ width: screenWidth * 0.1 }}/>
          </ScrollView>

          <Text style={styles.miBiblioteca}>Minha biblioteca</Text>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            style={{ padding: 15 }}
          >
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
            <MisFavoritosContainer
              onPress={() => navigation.navigate("SelectMapScreen", { screen: "HomeScreen", showBooks: true })}
              userFavorites={`Mapa de Livros`}
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

                        {/* <View style={[styles.groupChild5, styles.groupChildLayout]} />
                        <Text style={[styles.text, styles.textTypo]}>STATUS</Text> */}
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
  iconLayout: {
    width: "100%",
    overflow: "hidden",
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
  },
  crimenTypo: {
    letterSpacing: 2.8,
    fontSize: FontSize.size_21xl,
    textAlign: "left",
    color: Color.colorWhite,
    position: "absolute",
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
    width: screenWidth * 0.8,
    height: 180,
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
    marginTop: 20,
    flexDirection: "row",
    width: "100%",
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
    // height: 35,
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
  groupContainer: {
    marginTop: 12,
    flexDirection: "row",
  },
  scrol1: {
    width: "100%",
  },
  homeScreen: {
    flex: 1,
    flexDirection: "column",
    overflow: "hidden",
  },
});

export default HomeScreen;
