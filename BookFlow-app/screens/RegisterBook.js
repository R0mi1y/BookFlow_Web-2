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
  Switch,
  ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, FontSize, Color, Border, Padding } from "../GlobalStyles";
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import CustomPopup from '../components/CustomPopup';
import getAccessToken from '../components/auxiliarFunctions';
import TopComponent from '../components/topComponent';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const RegisterBook = ({ route }) => {
  const book = route.params?.book || null;
  
  const navigation = useNavigation();
  const apiUrl = Constants.expoConfig.extra.apiUrl;
  const [isAvalible, setIsAvalible] = useState(false);

  const [popupVisible, setPopupVisible] = React.useState(false);
  const [messagePopup, setPopupTexto] = React.useState("");
  const [user, setUser] = React.useState(null);

  const togglePopup = (message=null) => {
    setPopupVisible(false);
    if (message != null) {
      setPopupTexto(message);
      setPopupVisible(true);
    }
  };

  useEffect(() => {
    SecureStore.getItemAsync("user")
      .then(user => {
        setUser(JSON.parse(user));
      });
  }, []);
  
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
      setIsAvalible(book.availability);
    }
  }, []);

  const delete_book = async () => {
    if (book) {
      const accessToken = await getAccessToken(navigation);

      let response = await fetch(`${apiUrl}/api/book/${book.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: "Bearer " + accessToken,
        },
      });

      if(response.ok) {
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeScreen" }],
        });
      } else {
        togglePopup("Erro interno, tente novamente mais tarde!");
      }
    }
  }

  const send_book = async () => {
    try {
      if (![titulo, resumo, autor, genero].every(Boolean)) {
        throw new Error("Preencha todos os campos obrigatórios!");
      }
  
      togglePopup("Loading");
      if (registering) return;
      setRegistering(true);
  
      const accessToken = await getAccessToken(navigation);
  
      const formData = new FormData();
      if (hasImagem) {
        formData.append('cover', {
          uri: selectedImage,
          type: 'image/jpeg',
          name: 'cover.jpg',
        });
      }
  
      formData.append('title', titulo);
      formData.append('author', autor);
      formData.append('summary', resumo);
      formData.append('genre', genero);
      formData.append('owner', user.id);
      formData.append('availability', isAvalible ?? true);

      console.log(formData);
  
      const url = book ? `${apiUrl}/api/book/${book.id}/` : `${apiUrl}/api/book/`;
      const method = book ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        togglePopup("Livro salvo com sucesso");
        navigation.navigate("HomeScreen", { message: [book ? "Livro atualizado com sucesso!" : "Livro cadastrado com sucesso!"] });
      } else {
        const errorMessage = data?.message || response.statusText;
        togglePopup(`Erro no cadastro: ${errorMessage}`);
        console.error("Erro no cadastro:", errorMessage);
      }
    } catch (error) {
      console.error("Erro inesperado:", error.message || error);
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

  const searchBook = (text) => {
    setTitulo(text);
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${text}`)
      .then((response) => response.json())
      .then((response) => {
        let books = response.items;
        if (books) {
          setSearchElements(books);
        }
      });
  };

   const toggleSwitch = () => {
    setIsAvalible((previousState) => !previousState);
  };

  return (
 
    <ScrollView >
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
          text1={book ? "Editar" : "Cadastrar"}
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
            onBlur={() => setTimeout(() => {
              setIsTituloSelected(false);
            }, 2000)}
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
                    setSelectedImage(item.volumeInfo.imageLinks?.thumbnail ?? apiUrl + "/static/img/default_cover.jpg");
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
              keyExtractor={(item) => item.id}
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
            style={[styles.textInput, { height: 120 }]} // Certifique-se de ter um estilo para seus TextInput
            placeholder=" Resumo "
            placeholderTextColor={Color.colorBlanchedalmond_101}
            multiline
            numberOfLines={4}
            value={resumo}
            onChangeText={(text) => setResumo(text)}
          />
          { book && (<View style={styles.switchContainer}><Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isAvalible ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isAvalible}
          /><Text style={[{color: "white"}, styles.irAlLibroTypo]}>{isAvalible ? "Disponível": "Indisponível"}</Text></View>) }
        </View>

      
        <Pressable style={[styles.button, styles.bnt1]} onPress={send_book}>
          <Text style={[styles.irAlLibro, styles.irAlLibroTypo]}>{ book ? "Salvar" :  "Cadastrar" }</Text>
          <Image
            style={[styles.ionbookIcon]}
            contentFit="cover"
            source={require("../assets/ionbook.png")}
          />
        </Pressable>
        { book ? (<>
        <View style={{height:10}}/>
        <Pressable style={[styles.button, styles.delete_bnt,]} onPress={delete_book}>
          <Text style={[styles.irAlLibro, styles.irAlLibroTypo,]}>Deletar Livro</Text>
          <Image
            style={[styles.ionbookIcon]}
            contentFit="cover"
            source={require("../assets/ionbook.png")}
          />
          </Pressable></>) :  (<></>) }
          </View>
      
      </ScrollView>
   
  );
};

const styles = StyleSheet.create({
  summary: {
    height: 40,
  },
  bnt1:{
    marginTop:-35,
  },
  delete_bnt:{
    marginBottom:50,
  },
  switchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    width: "100%",
    alignItems: "center",
    marginBottom: 50,
  },
  searchList: {
    top: -14,
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
    justifyContent: "center",
    textAlign: "left",
    textAlignVertical: "top",
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
    padding: 7,

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
    overflow: "hidden",
    backgroundColor: Color.colorGray_200,
  },
});

export default RegisterBook;