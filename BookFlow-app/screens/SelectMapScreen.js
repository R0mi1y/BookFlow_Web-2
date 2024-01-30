// BookMap.js
import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from "@react-navigation/native";
import CustomPopup from "../components/CustomPopup";
import TopComponent from '../components/topComponent';
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import getAccessToken from '../components/auxiliarFunctions';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.apiUrl;

const BookMap = ({ route }) => {
    const [messagePopup, setPopupTexto] = useState("");
    const [popupVisible, setPopupVisible] = useState(false);
    const [showBooks, setShowBooks] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectPlace, setSelectPlace] = useState(false);
  
    const togglePopup = (message = null) => {
        setPopupVisible(false);
        if (message != null) {
            setPopupTexto(message);
            setPopupVisible(true);
        }
    };

    const screen = route.params?.screen;

    useEffect(() => {
        if (route.params?.showBooks) {
            setSelectPlace(false);
            togglePopup("Loading");
            let cont = 0;
            const fetchData = async () => {
                var url = `${apiUrl}/api/book/maps/`;
                console.log(url);
                
                try {
                const accessToken = await getAccessToken();
        
                if (accessToken) {
                    const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + accessToken,
                    },
                    });
        
                    if (!response.ok) {
                    throw new Error(await response.text());
                    }
        
                    const data = await response.json();
                    
                    setUsers(data);
                    setShowBooks(true);
                    togglePopup();
                } else {
                    navigation.reset({
                    index: 0,
                    routes: [{ name: "LogInScreen" }],
                    });
                    console.error("Falha ao obter AccessToken");
                }
                } catch (error) {
                    console.error("Erro ao buscar livros:", error);
                    console.log(url);
                    if (cont < 5) {
                        cont ++;
                        fetchData();
                    } else {
                        cont = 0;
                    }
                }
            }
            fetchData();
        } else {
            setShowBooks(false);
        }
    }, []);

    const [location, setLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permissão de localização não concedida!');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation.coords);
        })();
    }, []);

    const handleMapPress = (event) => {
        setSelectedLocation({
            latitude: event.nativeEvent.coordinate.latitude,
            longitude: event.nativeEvent.coordinate.longitude,
        });

        setSelectPlace(true);
    };

    const getLimitedStr = (str) => {
        return (str?.length && str?.length) > 93 ? str.slice(0, 90) + "...    " : str;
    };

    return (
        <>
            <CustomPopup
                visible={popupVisible}
                onClose={() => {
                togglePopup(null);
                }}
                message={messagePopup}
                navigation={navigation}
                setVisible={setPopupVisible}
            />
            <View style={styles.container}>
                <View style={{backgroundColor: Color.colorGray_200,}}>
                    <TopComponent
                        middle={() => {
                        navigation.navigate("HomeScreen");
                        }}
                        text1="Liv"
                        text2="ros"
                    />
                </View>
                {location && (
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        onPress={handleMapPress}
                    >
                    {!showBooks && selectedLocation && (
                        <Marker
                            coordinate={{
                                latitude: selectedLocation.latitude,
                                longitude: selectedLocation.longitude,
                            }}
                            title="Local Selecionado"
                        />
                    )}
                    {showBooks ? users.map((u, userIndex) => (
                        <Marker
                            key={`${userIndex}`}
                            coordinate={{
                                latitude: parseFloat(u.lat),
                                longitude: parseFloat(u.lon),
                            }}
                            description={getLimitedStr(u.books.map((book, i) => book.title).join(", "))}
                            title={u.username}
                            onPress={() => {
                                togglePopup({type:"books", books: u.books})
                            }}
                        />
                    )) : (<></>)}
                    </MapView>
                )}
                {selectPlace && !showBooks && <TouchableOpacity
                    style={styles.selectLocationButton}
                    onPress={() => {
                        if (selectedLocation) navigation.navigate(screen, {selectedLocation});
                    }}
                >
                    <Text style={{color: "white",}}>Selecionar Local</Text>
                </TouchableOpacity>}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  selectLocationButton: {
    backgroundColor: Color.colorGray_200,
    padding: 10,
    alignItems: 'center',
  },
});

export default BookMap;
