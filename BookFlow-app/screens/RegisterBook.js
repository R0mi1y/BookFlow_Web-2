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
  Dimensions,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, FontSize, Color, Border, Padding } from "../GlobalStyles";
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import CustomPopup from '../components/CustomPopup';
import getAccessToken from '../components/auxiliarFunctions';
import axios from 'axios';
import TopComponent from '../components/topComponent';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const RegisterBook = ({ route }) => {
  const book = route.params?.book || null;
  
  const navigation = useNavigation();
  const apiUrl = Constants.expoConfig.extra.apiUrl;

  const [popupVisible, setPopupVisible] = React.useState(false);
  const [messagePopup, setPopupTexto] = React.useState("");

  const togglePopup = (message=null) => {
    setPopupVisible(false);
    if (message != null) {
      setPopupTexto(message);
      setPopupVisible(true);
    }
  };

  var user = null;

  const [selectedImage, setSelectedImage] = useState(`${apiUrl}/static/img/default_cover.jpg`);

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [genero, setGenero] = useState("");
  const [resumo, setResumo] = useState("");
  const [hasImagem, setHasImagem] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [searchElements, setSearchElements] = useState(false);
  const [isTituloSelected, setIsTituloSelected] = useState(false);

  useEffect(() => {
    if (book) {
      setTitulo(book.title);
      setAutor(book.author);
      setGenero(book.genre);
      setResumo(book.summary);
      setSelectedImage(book.cover ?? apiUrl + "/static/img/default_cover.jpg");
    }
  }, []);

  const send_book = async () => {
    if (titulo == '' || resumo == '' || autor == '' || genero == '') {
      togglePopup("Preencha todos os campos!");
      return;
    }

    togglePopup("Loading");
    if (registering) return;
    setRegistering(true);
    
    const accessToken = await getAccessToken(navigation);

    try {
      const formData = new FormData();
      if (hasImagem) {
        formData.append('cover', {
          uri: selectedImage,
          type: 'image/jpeg', // Ajuste conforme o tipo de arquivo
          name: 'cover.jpg',
        });
      }

      formData.append('title', titulo);
      formData.append('author', autor);
      formData.append('summary', resumo);
      formData.append('genre', genero);
      formData.append('owner', user.id);
      formData.append('cover', "");

      var response;

      if (book) {
        response = await axios.put(`${apiUrl}/api/book/${book.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer " + accessToken,
          },
        });
      } else {
        response = await axios.post(`${apiUrl}/api/book/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer " + accessToken,
          },
        });
      }

      console.log(response.data);
      togglePopup();

      if (response.data?.id != null) {
        console.log("Livro cadastrado com sucesso: ", response.data);
        togglePopup("Livro cadastrado com sucesso!");

        if (book) {
          navigation.goBack();
        } else {
          navigation.navigate("HomeScreen", { message: ["Livro cadastrado com sucesso!"] });
        }

      } else {
        if (response.data?.message) {
          console.error("Erro no cadastro:", response.data.message);
        }
      }
    } catch (error) {
      console.error(error.response);
      console.error(error);
      togglePopup("Erro, tente novamente mais tarde!");
    } finally {
      setRegistering(false);
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
        setSelectedImage(result.assets[0].uri);
        console.log(result.assets[0].uri);
        console.log(selectedImage);
        setHasImagem(true);
      }
    } catch (err) {
    console.error('Erro ao selecionar o documento:', err);
    }
  };

  const getLimitedStr = (str) => {
    return (str?.length && str?.length) > 33 ? str.slice(0, 30) + "..." : str;
  };

  const searchBook = (text) => {
    setTitulo(text);
    var elements = [];
  
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${text}`)
      .then((response) => response.json())
      .then((response) => {
        var books = response.items;
        if (books) {
          setSearchElements(books);
        }
      });
  };
  

  return (
    <>
      <CustomPopup
        visible={popupVisible}
        onClose={() => {togglePopup(null)}}
        message={messagePopup}
      />
      <View style={styles.RegisterBook}>
        <TopComponent
          middle={() => {
            navigation.navigate("HomeScreen");
          }}
          searchBtn={false}
          text1="Cadastro"
          text2="Livro"
        />

        <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.imgBook}/>
        </View>

        <Pressable style={[styles.textInput]}
        onPress={pickDocument}>
          <Text style={[styles.contenidoRelacionado, styles.irAlLibroTypo]}>Insira uma imagem</Text>
        </Pressable>

        <TextInput
          style={[styles.textInput]}
          placeholder=" Título "
          placeholderTextColor={Color.colorBlanchedalmond_101}
          value={titulo}
          onChangeText={(text) => {
            searchBook(text);
          }}
          onFocus={() => setIsTituloSelected(true)}
          onBlur={() => setIsTituloSelected(false)}
        />
        {isTituloSelected && searchElements.length > 0 && (
        <View style={{display:"flex", alignItems:"center"}}>
          <FlatList
            style={[styles.searchList, { position: 'absolute' }]}
            data={searchElements}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  console.log(item);

                  const t = item.volumeInfo.title ? item.volumeInfo.title : titulo;
                  const authors = item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : "";
                  const categories = item.volumeInfo.categories ? item.volumeInfo.categories.join(", ") : "";
                  const description = item.volumeInfo.description ? item.volumeInfo.description : "";

                  setTitulo(t);
                  setAutor(authors);
                  setGenero(categories);
                  setResumo(description);
                  setSelectedImage(item.volumeInfo.imageLinks?.thumbnail);
                  setHasImagem(true);

                  setIsTituloSelected(false);
                }}
                style={{ zIndex: 1 }}
              >
                <Text style={{ color: "black", marginBottom: 10, borderBottomColor: "black", zIndex: 1 }}>
                  {item.volumeInfo.title}
                </Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.volumeInfo.title}
          />
        </View>
        )}

        <TextInput
          style={[styles.textInput]} // Certifique-se de ter um estilo para seus TextInput
          placeholder="  Autor  "
          placeholderTextColor={Color.colorBlanchedalmond_101}
          value={autor}
          onChangeText={(text) => setAutor(text)}
        />
        <TextInput
          style={[styles.textInput]} // Certifique-se de ter um estilo para seus TextInput
          placeholder="  Genêro  "
          placeholderTextColor={Color.colorBlanchedalmond_101}
          value={genero}
          onChangeText={(text) => setGenero(text)}
        />
        <TextInput
          style={[styles.textInput]} // Certifique-se de ter um estilo para seus TextInput
          placeholder=" Resumo "
          placeholderTextColor={Color.colorBlanchedalmond_101}
          value={resumo}
          onChangeText={(text) => setResumo(text)}
        />
        </View>

        <Pressable style={styles.button} onPress={send_book}>
          <Text style={[styles.irAlLibro, styles.irAlLibroTypo]}>{ book ? "Editar" :  "Cadastrar" }</Text>
          <Image
            style={[styles.ionbookIcon]}
            contentFit="cover"
            source={require("../assets/ionbook.png")}
          />
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginBottom: 200,
  },
  searchList: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#ececec',
    flexDirection: "column",
    width: "60%",
    height: screenHeight * 0.3,
    overflow: "scroll",
    zIndex: 1,
  },
  imgBook:{
    width: 111,
    height: 111,
    borderRadius: Border.br_mini,
    alignSelf:"center",
  },
  irAlLibroTypo: {
    textAlign: "center",
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_base,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.colorBlanchedalmond_100,
    width: "70%",
    height:45,
    borderRadius: Border.br_3xs,
  },
  imageContainer: {
    height:180,
    justifyContent: "center",
    marginBottom: 30, 
    marginTop: 20, 
    width: "70%",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderBottomColor: Color.colorBlanchedalmond_100,
    borderTopColor: Color.colorBlanchedalmond_100,
  },
  textInput: {
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_base,
    color: Color.colorBlanchedalmond_100,
    width: "70%",
    borderStyle: "solid",
    borderColor: Color.colorBlanchedalmond_100,
    borderWidth: 1,
    borderRadius: Border.br_3xs,
    height: 45,

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
  contenidoRelacionado: {
    color: Color.colorBlanchedalmond_100,
  },
  irAlLibro: {
    color: Color.colorGray_100,
    marginRight: 10,
  },
  ionbookIcon: {
    top: 5,
    width: 20,
    height: 20,
    overflow: "hidden",
  },
  RegisterBook: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    width: "100%",
    height: 900,
    overflow: "hidden",
    backgroundColor: Color.colorGray_200,
  },
});

export default RegisterBook;