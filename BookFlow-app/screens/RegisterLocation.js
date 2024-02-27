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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, FontSize, Color, Border, Padding } from "../GlobalStyles";
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import CustomPopup from '../components/CustomPopup';
import getAccessToken from '../components/auxiliarFunctions';
import TopComponent from '../components/topComponent';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const RegisterLocation = ({ route }) => {
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

    const [user, setUser] = useState(null);
    const [CEP, setCEP] = useState("");
    const [estado, setEstado] = useState("");
    const [cidade, setCidade] = useState("");
    const [bairro, setBairro] = useState("");
    const [rua, setRua] = useState("");
    const [nmrCasa, setNmrCasa] = useState("");
    const [lat, setLat] = useState(false);
    const [lon, setLon] = useState(false);

    useEffect(() => {
        if (route.params && route.params.selectedLocation && route.params.selectedLocation.latitude && route.params.selectedLocation.longitude) {
            let longitude = route.params.selectedLocation.longitude;
            let latitude = route.params.selectedLocation.latitude;
            setLat(latitude);
            setLon(longitude);

            const fetchData = async () => {
                let response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
                    method: "GET",
                });
                let data = await response.json();
                
                setCEP(data.address.postcode);
                setEstado(data.address.state);
                setCidade(data.address.city_district);
                setBairro(data.address.suburb);
                setRua(data.address.road);
            }
            fetchData();
        }
    });

    useEffect(() => {
        const fetchData = async () => {
          try {
            const storedUser = JSON.parse(await SecureStore.getItem('user'));
            setUser(storedUser);
      
            if (storedUser) {
              setCEP(storedUser.postal_code);
              setEstado(storedUser.state);
              setCidade(storedUser.city);
              setBairro(storedUser.district);
              setRua(storedUser.street);
              setNmrCasa(storedUser.house_number);
              setLat(storedUser.lat);
              setLon(storedUser.lon);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
      
        fetchData();
      }, []); 
      
      const updateUserData = async () => {
        try {
            togglePopup("Loading");
            const accessToken = await getAccessToken(navigation);
    
            let id = user.id;
            let url = `${apiUrl}/api/user/${id}/`;
            console.log(url);
    
            const formData = {
                postal_code: CEP,
                state: estado,
                city: cidade,
                district: bairro,
                street: rua,
                house_number: nmrCasa,
                lat: lat,
                lon: lon,
            };
    
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",  // Ajuste para application/json
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(formData),  // Converta o objeto para JSON
            });
    
            if (response.ok) {
                const updatedUser = await response.json();
    
                if (updatedUser.id) {
                    try {
                        SecureStore.setItem("user", JSON.stringify(updatedUser));
                        console.log(updatedUser);
                        togglePopup("Dados atualizados com sucesso");
                    } catch (e) {
                        console.error(e.message);
                    }
                } else {
                    console.error(updatedUser);
                    togglePopup("Error");
                }
            } else {
                console.error(
                    "Erro ao atualizar dados do usuário:",
                    await response.text()
                );
                togglePopup("Error");
            }
        } catch (error) {
            console.error("Erro ao atualizar dados do usuário:", error.message);
        }
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
                    backBtn={true}
                    text1=""
                    text2="Endereço"
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

                <Pressable onPress={() => { navigation.navigate("SelectMapScreen", { showBooks: false, screen: "RegisterLocation" }) }}>
                    <Image
                        style={styles.pinoDeLocalizacao}
                        contentFit="cover"
                        source={require("../assets/pino-de-localizacao.png")}
                    />
                </Pressable>

                <Pressable onPress={() => { navigation.navigate("SelectMapScreen", { showBooks: false, screen: "RegisterLocation" }) }}>
                    <Text style={styles.textMaps}>Ir para o maps</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={() => updateUserData()}>
                    <Text style={[styles.irAlLibro, styles.irAlLibroTypo]}>Atualizar</Text>
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