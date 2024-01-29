// import * as React from "react";
// import { useEffect, useState } from "react";
// import Constants from "expo-constants";
// import {
//     StyleSheet,
//     TextInput,
//     Text,
//     View,
//     Pressable,
//     Image,
//     Dimensions,
//     FlatList,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { FontFamily, FontSize, Color, Border, Padding } from "../GlobalStyles";
// import * as ImagePicker from 'expo-image-picker';
// import * as SecureStore from 'expo-secure-store';
// import CustomPopup from '../components/CustomPopup';
// import getAccessToken from '../components/auxiliarFunctions';
// import axios from 'axios';
// import TopComponent from '../components/topComponent';

// const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// const RegisterLocation = ({ route }) => {
//     const book = route.params?.book || null;

//     const navigation = useNavigation();
//     const apiUrl = Constants.expoConfig.extra.apiUrl;

//     const [popupVisible, setPopupVisible] = React.useState(false);
//     const [messagePopup, setPopupTexto] = React.useState("");

//     const togglePopup = (message = null) => {
//         setPopupVisible(false);
//         if (message != null) {
//             setPopupTexto(message);
//             setPopupVisible(true);
//         }
//     };

//     var user = null;

//     const [selectedImage, setSelectedImage] = useState(`${apiUrl}/static/img/default_cover.jpg`);

//     const [CEP, setCEP] = useState("");
//     const [estado, setEstado] = useState("");
//     const [cidade, setCidade] = useState("");
//     const [bairro, setBairro] = useState("");
//     const [rua, setRua] = useState(false);
//     const [nmrCasa, setNmrCasa] = useState(false);
//     const [registering, setRegistering] = useState(false);
//     const [searchElements, setSearchElements] = useState(false);
//     const [isTituloSelected, setIsTituloSelected] = useState(false);

//     useEffect(() => {
//         if (book) {
//             setTitulo(book.title);
//             setAutor(book.author);
//             setGenero(book.genre);
//             setResumo(book.summary);
//             setSelectedImage(book.cover ?? apiUrl + "/static/img/default_cover.jpg");
//         }
//     }, []);

//     const send_book = async () => {
//         if (titulo == '' || resumo == '' || autor == '' || genero == '') {
//             togglePopup("Preencha todos os campos!");
//             return;
//         }

//         togglePopup("Loading");
//         if (registering) return;
//         setRegistering(true);

//         const accessToken = await getAccessToken(navigation);

//         try {
//             const formData = new FormData();
//             if (hasImagem) {
//                 formData.append('cover', {
//                     uri: selectedImage,
//                     type: 'image/jpeg', // Ajuste conforme o tipo de arquivo
//                     name: 'cover.jpg',
//                 });
//             }

//             formData.append('title', titulo);
//             formData.append('author', autor);
//             formData.append('summary', resumo);
//             formData.append('genre', genero);
//             formData.append('owner', user.id);
//             formData.append('cover', "");

//             var response;

//             if (book) {
//                 response = await axios.put(`${apiUrl}/api/book/${book.id}/`, formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                         Authorization: "Bearer " + accessToken,
//                     },
//                 });
//             } else {
//                 response = await axios.post(`${apiUrl}/api/book/`, formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                         Authorization: "Bearer " + accessToken,
//                     },
//                 });
//             }

//             console.log(response.data);
//             togglePopup();

//             if (response.data?.id != null) {
//                 console.log("Livro cadastrado com sucesso: ", response.data);
//                 togglePopup("Livro cadastrado com sucesso!");

//                 if (book) {
//                     navigation.goBack();
//                 } else {
//                     navigation.navigate("HomeScreen", { message: ["Livro cadastrado com sucesso!"] });
//                 }

//             } else {
//                 if (response.data?.message) {
//                     console.error("Erro no cadastro:", response.data.message);
//                 }
//             }
//         } catch (error) {
//             console.error(error.response);
//             console.error(error);
//             togglePopup("Erro, tente novamente mais tarde!");
//         } finally {
//             setRegistering(false);
//         }
//     };

//     const searchBook = (text) => {
//         setTitulo(text);
//         var elements = [];

//         fetch(`https://www.googleapis.com/books/v1/volumes?q=${text}`)
//             .then((response) => response.json())
//             .then((response) => {
//                 var books = response.items;
//                 if (books) {
//                     setSearchElements(books);
//                 }
//             });
//     };


//     return (
//         <>
//             <CustomPopup
//                 visible={popupVisible}
//                 onClose={() => { togglePopup(null) }}
//                 message={messagePopup}
//             />
//             <View style={styles.RegisterBook}>
//                 <TopComponent
//                     middle={() => {
//                         navigation.navigate("HomeScreen");
//                     }}
//                     searchBtn={false}
//                     text1="Register"
//                     text2="Location"
//                 />

//                 <View style={[styles.cta, styles.ctaLayout]} />
//                 <View style={[styles.cta1, styles.ctaLayout]}>
//                     <TextInput
//                         style={[styles.irAlLibroInput]} // Certifique-se de ter um estilo para seus TextInput
//                         placeholder=" Código Postal (CEP) "
//                         placeholderTextColor={Color.colorBlanchedalmond_101}
//                         value={CEP}
//                         onChangeText={(text) => setCEP(text)}

//                     />
//                 </View>

//                 <View style={[styles.cta2, styles.ctaLayout]}>
//                     <TextInput
//                         style={[styles.irAlLibroInput]} // Certifique-se de ter um estilo para seus TextInput
//                         placeholder="  Estado  "
//                         placeholderTextColor={Color.colorBlanchedalmond_101}
//                         value={estado}
//                         onChangeText={(text) => setEstado(text)}
//                     />
//                 </View>

//                 <View style={[styles.cta3, styles.ctaLayout]}>
//                     <TextInput
//                         style={[styles.irAlLibroInput]} // Certifique-se de ter um estilo para seus TextInput
//                         placeholder="  Cidade  "
//                         placeholderTextColor={Color.colorBlanchedalmond_101}
//                         value={cidade}
//                         onChangeText={(text) => setCidade(text)}
//                     />
//                 </View>

//                 <View style={[styles.cta4, styles.ctaLayout]}>
//                     <TextInput
//                         style={[styles.irAlLibroInput]} // Certifique-se de ter um estilo para seus TextInput
//                         placeholder=" Rua "
//                         placeholderTextColor={Color.colorBlanchedalmond_101}
//                         value={rua}
//                         onChangeText={(text) => setRua(text)}
//                     />
//                 </View>
//                 <View style={[styles.cta5, styles.ctaLayout]}>
//                     <TextInput
//                         style={[styles.irAlLibroInput]} // Certifique-se de ter um estilo para seus TextInput
//                         placeholder=" Número da casa  "
//                         placeholderTextColor={Color.colorBlanchedalmond_101}
//                         value={nmrCasa}
//                         onChangeText={(text) => setNmrCasa(text)}
//                     />
//                 </View>

//                 {/* <View style={[styles.cta5, styles.ctaLayout]}>
//                     <Pressable
//                         onPress={pickDocument}>
//                         <Text style={[styles.contenidoRelacionado, styles.irAlLibroTypo]}>Insira uma imagem</Text>
//                     </Pressable> 
//                 </View> */}

//                 {/* <View style={[styles.android1, styles.androidLayout]} />

//                 <Image source={{ uri: selectedImage }} style={styles.imgBook} />

//                 <View style={[styles.android2, styles.androidLayout]} /> */}
//                 {/* <Pressable onPress={() => {
//           navigation.navigate("SelectMapScreen", { showBooks: true, screen: "Profile" });
//         }}
//           style={[styles.groupView1, styles.saveChanges]}
//         >   */}
//                 <Pressable onPress={() => { navigation.navigate("SelectMapScreen", {showBooks: true, screen:"RegisterLocation"})}}>
//                     <Image
//                         style={styles.pinoDeLocalizacao}
//                         contentFit="cover"
//                         source={require("../assets/pino-de-localizacao.png")}
//                     />
//                 </Pressable>

//                 <Pressable onPress={() => { navigation.navigate("SelectMapScreen", {showBooks: true, screen:"RegisterLocation"})}}>
//                     <Text style={styles.textMaps}>Ir para o maps</Text>
//                 </Pressable>
//                 <Pressable style={styles.irAlLibroParent} onPress={send_book}>
//                     <Text style={[styles.irAlLibro, styles.irAlLibroTypo]}>{book ? "Editar" : "Cadastrar"}</Text>
//                     <Image
//                         style={[styles.ionbookIcon, styles.lPosition]}
//                         contentFit="cover"
//                         source={require("../assets/ionbook.png")}
//                     />
//                 </Pressable>
//             </View>
//         </>
//     );
// };

// const styles = StyleSheet.create({
//     bookContainer: {
//         padding: 10,
//         margin: 5,
//         borderRadius: 5,
//     },
//     bookTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     searchList: {
//         borderRadius: 10,
//         top: 40,
//         padding: 10,
//         right: 0,
//         backgroundColor: '#ececec',
//         flexDirection: "column",
//         position: "absolute",
//         width: screenWidth * 0.5,
//         height: screenHeight * 0.3,
//         overflow: "scroll",
//         zIndex: 1,
//     },
//     searchText: {
//         color: "white",
//     },
//     android1: {
//         top: 170,
//     },
//     android2: {
//         top: 320,
//     },
//     androidLayout: {
//         height: 1,
//         width: 300,
//         borderTopWidth: 0.5,
//         borderColor: Color.colorBlanchedalmond_200,
//         borderStyle: "solid",
//         alignSelf: "center",
//         position: "absolute",
//     },
//     imgBook: {
//         width: 111,
//         height: 111,
//         borderRadius: Border.br_mini,
//         top: 55,
//         alignSelf: "center",
//     },
//     iconLayout: {
//         width: 25,
//         top: 62,
//         height: 25,
//         position: "absolute",
//         overflow: "hidden",
//     },
//     lTypo: {
//         textAlign: "center",
//         fontFamily: FontFamily.rosarivoRegular,
//     },
//     libroPosition: {
//         top: 0,
//         position: "absolute",
//     },
//     sidePosition: {
//         top: 17,
//         height: 11,
//         position: "absolute",
//     },
//     containerTypo: {
//         fontSize: FontSize.size_xs,
//         color: Color.colorWhite,
//         textAlign: "left",
//         position: "absolute",
//     },
//     iconoirpageFlipPosition: {
//         top: 538,
//         height: 24,
//         width: 24,
//         position: "absolute",
//         overflow: "hidden",
//     },
//     ctaLayout: {
//         alignSelf: "center",
//         justifyContent: "center",
//         height: 45,
//         borderRadius: Border.br_3xs,
//         width: 302,
//         position: "absolute",
//     },
//     irAlLibroTypo: {
//         textAlign: "center",
//         fontFamily: FontFamily.openSansSemiBold,
//         fontWeight: "600",
//         fontSize: FontSize.size_base,
//     },
//     irAlLibroInput: {
//         textAlign: "center",
//         fontFamily: FontFamily.openSansSemiBold,
//         fontWeight: "600",
//         fontSize: FontSize.size_base,
//         color: Color.colorBlanchedalmond_100,
//     },
//     lPosition: {
//         left: 0,
//         position: "absolute",
//     },
//     phlistIcon: {
//         height: 25,
//         left: 27,
//         width: 25,
//         top: 62,
//     },
//     epsearchIcon: {
//         left: 311,
//         height: 25,
//         width: 25,
//         top: 62,
//     },
//     l: {
//         top: 46,
//         fontSize: FontSize.size_29xl,
//         color: Color.colorBlanchedalmond_400,
//         width: 250,
//         height: 50,
//         left: 70,
//         position: "absolute",
//     },
//     libro: {
//         left: 37,
//         fontSize: FontSize.size_23xl,
//         width: 350,
//         height: 50,
//         color: Color.colorBlanchedalmond_100,
//         textAlign: "center",
//         fontFamily: FontFamily.rosarivoRegular,
//     },
//     brandLogo: {
//         top: 49,
//         left: 10,
//         width: 144,
//         height: 52,
//         position: "absolute",
//     },
//     bgIcon: {
//         top: -2,
//         right: 70,
//         bottom: 16,
//         left: 69,
//         maxWidth: "100%",
//         maxHeight: "100%",
//         display: "none",
//         position: "absolute",
//         overflow: "hidden",
//     },
//     batteryIcon: {
//         width: 24,
//         height: 11,
//         right: 0,
//         top: 0,
//         position: "absolute",
//     },
//     wifiIcon: {
//         width: 15,
//         height: 11,
//     },
//     mobileSignalIcon: {
//         width: 17,
//         height: 11,
//     },
//     rightSide: {
//         right: 15,
//         width: 67,
//         height: 11,
//     },
//     leftSideIcon: {
//         left: 34,
//         width: 28,
//         height: 11,
//     },
//     iosstatusBarblack: {
//         left: 2,
//         height: 44,
//         right: 0,
//         top: 0,
//         position: "absolute",
//         overflow: "hidden",
//         backgroundColor: Color.colorGray_200,
//     },
//     productImageIcon: {
//         top: 119,
//         height: 336,
//         width: 302,
//         left: 27,
//         position: "absolute",
//     },
//     pachinko: {
//         top: 482,
//         left: 113,
//         fontSize: FontSize.size_5xl,
//         lineHeight: 30,
//         color: Color.colorWhite,
//         textAlign: "left",
//         fontFamily: FontFamily.rosarivoRegular,
//         position: "absolute",
//     },
//     minJinLee: {
//         top: 512,
//         left: 136,
//         lineHeight: 20,
//         fontSize: FontSize.size_base,
//         color: Color.colorBlanchedalmond_100,
//         textAlign: "left",
//         fontFamily: FontFamily.rosarivoRegular,
//         position: "absolute",
//     },
//     aSingleEspresso: {
//         fontWeight: "300",
//         fontFamily: FontFamily.openSansLight,
//     },
//     text: {
//         fontFamily: FontFamily.openSansRegular,
//     },
//     readMore1: {
//         textDecoration: "underline",
//     },
//     aSingleEspressoContainer: {
//         top: 594,
//         lineHeight: 17,
//         height: 57,
//         left: 29,
//         fontSize: FontSize.size_xs,
//         width: 302,
//     },
//     cuentoNovela: {
//         fontFamily: FontFamily.rosarivoRegular,
//     },
//     cuentoNovelaContainer: {
//         top: 579,
//         left: 101,
//         lineHeight: 15,
//     },
//     biuploadIcon: {
//         top: 537,
//         left: 129,
//         height: 24,
//         width: 24,
//         position: "absolute",
//         overflow: "hidden",
//     },
//     solarstarOutlineIcon: {
//         left: 168,
//     },
//     iconoirpageFlip: {
//         left: 207,
//     },
//     cta: {
//         top: 700,
//         backgroundColor: Color.colorBlanchedalmond_100,
//         shadowColor: "rgba(0, 0, 0, 0.15)",
//         shadowOffset: {
//             width: 2,
//             height: 2,
//         },
//         shadowRadius: 15,
//         elevation: 15,
//         shadowOpacity: 1,
//     },
//     contenidoRelacionado: {
//         color: Color.colorBlanchedalmond_100,
//     },
//     cta1: {
//         top: 200,
//         borderStyle: "solid",
//         borderColor: Color.colorBlanchedalmond_100,
//         borderWidth: 1,
//         flexDirection: "row",
//         paddingHorizontal: 50,
//         paddingTop: 10,
//         paddingBottom: Padding.p_smi,
//     },

//     cta2: {
//         top: 270,
//         borderStyle: "solid",
//         borderColor: Color.colorBlanchedalmond_100,
//         borderWidth: 1,
//         flexDirection: "row",
//         paddingHorizontal: 50,
//         paddingTop: 10,
//         paddingBottom: Padding.p_smi,
//     },
//     cta3: {
//         top: 340,
//         borderStyle: "solid",
//         borderColor: Color.colorBlanchedalmond_100,
//         borderWidth: 1,
//         flexDirection: "row",
//         paddingHorizontal: 50,
//         paddingTop: 10,
//         paddingBottom: Padding.p_smi,
//     },
//     cta4: {
//         top: 410,
//         borderStyle: "solid",
//         borderColor: Color.colorBlanchedalmond_100,
//         borderWidth: 1,
//         flexDirection: "row",
//         paddingHorizontal: 50,
//         paddingTop: 10,
//         paddingBottom: Padding.p_smi,
//     },
//     cta5: {
//         top: 480,
//         borderStyle: "solid",
//         borderColor: Color.colorBlanchedalmond_100,
//         borderWidth: 1,
//         flexDirection: "row",
//         paddingHorizontal: 50,
//         paddingTop: 10,
//         paddingBottom: Padding.p_smi,
//     },


//     irAlLibro: {
//         left: 20,
//         color: Color.colorGray_100,
//         width: 86,
//         top: 0,
//         position: "absolute",
//         height: 25,
//     },
//     ionbookIcon: {
//         top: 2,
//         width: 20,
//         height: 20,
//         overflow: "hidden",
//     },
//     irAlLibroParent: {
//         top: 710,
//         left: 150,
//         width: 106,
//         height: 25,
//         position: "absolute",
//     },
//     RegisterBook: {
//         flex: 1,
//         width: "100%",
//         height: 900,
//         overflow: "hidden",
//         backgroundColor: Color.colorGray_200,
//     },
//     pinoDeLocalizacao: {
//         // flex: 1,
//         width: 40,
//         height: 40,
//         // position: "absolute",
//         position: "absolute",
//         top: 450,
//         left: 185,
//     },
//     textMaps: {
//         position: "absolute",
//         top: 500,
//         color: Color.colorBlanchedalmond_101,
//         left: 160,
//         fontFamily: FontFamily.rosarivoRegular,
//     },
// });

// export default RegisterLocation;

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

const RegisterLocation = ({ route }) => {
    const book = route.params?.book || null;

    const navigation = useNavigation();
    const apiUrl = Constants.expoConfig.extra.apiUrl;

    const [popupVisible, setPopupVisible] = React.useState(false);
    const [messagePopup, setPopupTexto] = React.useState("");

    const togglePopup = (message = null) => {
        setPopupVisible(false);
        if (message != null) {
            setPopupTexto(message);
            setPopupVisible(true);
        }
    };

    var user = null;

    const [selectedImage, setSelectedImage] = useState(`${apiUrl}/static/img/default_cover.jpg`);

    const [CEP, setCEP] = useState("");
    const [estado, setEstado] = useState("");
    const [cidade, setCidade] = useState("");
    const [bairro, setBairro] = useState("");
    const [rua, setRua] = useState("");
    const [nmrCasa, setNmrCasa] = useState("");
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
                onClose={() => { togglePopup(null) }}
                message={messagePopup}
            />
            <View style={styles.RegisterBook}>
                <TopComponent
                    middle={() => {
                        navigation.navigate("HomeScreen");
                    }}
                    searchBtn={false}
                    text1="Register"
                    text2="Location"
                />

                <TextInput
                    style={[styles.textInput, styles.textInputnputTop]}
                    placeholder=" Código Postal (CEP) "
                    placeholderTextColor={Color.colorBlanchedalmond_101}
                    value={CEP}
                    onChangeText={(text) => setCEP(text)}
                />
                <TextInput
                    style={[styles.textInput]} // Certifique-se de ter um estilo para seus TextInput
                    placeholder="  Estado  "
                    placeholderTextColor={Color.colorBlanchedalmond_101}
                    value={estado}
                    onChangeText={(text) => setEstado(text)}
                />
                <TextInput
                    style={[styles.textInput]} // Certifique-se de ter um estilo para seus TextInput
                    placeholder="  Cidade  "
                    placeholderTextColor={Color.colorBlanchedalmond_101}
                    value={cidade}
                    onChangeText={(text) => setCidade(text)}
                />
                <TextInput
                    style={[styles.textInput]} // Certifique-se de ter um estilo para seus TextInput
                    placeholder=" Bairro "
                    placeholderTextColor={Color.colorBlanchedalmond_101}
                    value={bairro}
                    onChangeText={(text) => setBairro(text)}
                />
                <TextInput
                    style={[styles.textInput]} // Certifique-se de ter um estilo para seus TextInput
                    placeholder=" Rua "
                    placeholderTextColor={Color.colorBlanchedalmond_101}
                    value={rua}
                    onChangeText={(text) => setRua(text)}
                />
                <TextInput
                    style={[styles.textInput]} // Certifique-se de ter um estilo para seus TextInput
                    placeholder=" Número da Casa "
                    placeholderTextColor={Color.colorBlanchedalmond_101}
                    value={nmrCasa}
                    onChangeText={(text) => setNmrCasa(text)}
                />

                <Pressable onPress={() => { navigation.navigate("SelectMapScreen", { showBooks: true, screen: "RegisterLocation" }) }}>
                    <Image
                        style={styles.pinoDeLocalizacao}
                        contentFit="cover"
                        source={require("../assets/pino-de-localizacao.png")}
                    />
                </Pressable>

                <Pressable onPress={() => { navigation.navigate("SelectMapScreen", { showBooks: true, screen: "RegisterLocation" }) }}>
                    <Text style={styles.textMaps}>Ir para o maps</Text>
                </Pressable>


                <Pressable style={styles.button} onPress={send_book}>
                    <Text style={[styles.irAlLibro, styles.irAlLibroTypo]}>{book ? "Editar" : "Cadastrar"}</Text>
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
    imgBook: {
        width: 111,
        height: 111,
        borderRadius: Border.br_mini,
        alignSelf: "center",
    },
    irAlLibroTypo: {
        textAlign: "center",
        fontFamily: FontFamily.openSansSemiBold,
        fontWeight: "600",
        fontSize: FontSize.size_base,
    },
    pinoDeLocalizacao: {
        display: "flex",
        width: 45,
        height: 45,
    },
    textMaps: {
        display:"flex",
        color: Color.colorBlanchedalmond_101,
        fontFamily: FontFamily.rosarivoRegular,
        marginBottom: 20,
        marginTop: 10,
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
    },
    imageContainer: {
        height: 180,
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
        // marginTop: 15,
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
    textInputnputTop: {
        marginTop: 50,
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

export default RegisterLocation;