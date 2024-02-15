import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, } from "react-native";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, FontSize, Border, Padding } from "../GlobalStyles";
import * as SecureStore from "expo-secure-store";
import getAccessToken from "../components/auxiliarFunctions";
import CustomPopup from '../components/CustomPopup';
import TopComponent from '../components/topComponent';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');


const OwnerDetailScreen = ({ route }) => {
    const [showFullBiography, setShowFullBiography] = useState(false);
    const [owner, setOwner] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchOwnerData = async () => {
            try {
                const ownerId = route.params?.ownerId;

                if (!ownerId) {
                    console.error("OwnerId não fornecido.");
                    return;
                }

                const apiUrl = Constants.expoConfig.extra.apiUrl;
                const accessToken = await getAccessToken();

                const response = await fetch(`${apiUrl}/api/user/${ownerId}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const ownerData = await response.json();
                    setOwner(ownerData);
                } else {
                    console.error("Erro ao obter dados do proprietário:", response.statusText);
                }
            } catch (error) {
                console.error("Erro ao obter dados do proprietário:", error.message);
            }
        };

        fetchOwnerData();
    }, [route.params?.ownerId]);
    const toggleBiography = () => {
        setShowFullBiography(!showFullBiography);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {owner && (
                <View style={styles.container}>
                    <TopComponent
                        middle={() => {
                            navigation.navigate("HomeScreen");
                        }}
                        searchBtn={false}
                        text1="Book"
                        text2="Flow"
                    />
                    {console.log(owner.photo)}
                    <Image
                        style={[styles.groupChild4]}
                        resizeMode="cover"
                        source={{
                            uri: owner.photo ? owner.photo : "URL_DA_IMAGEM_PADRAO",
                        }}
                    />
                    <View style={styles.texts}>
                        <Text style={styles.title}>Nome</Text>
                        <Text style={styles.content}>{owner.username}</Text>

                        <Text style={styles.title}>Email</Text>
                        <Text style={styles.content}>{owner.email}</Text>

                        <Text style={styles.biographyTitle}>Biografia</Text>
                        <Text
                            style={[
                                styles.content,
                                styles.biography,
                                { maxHeight: showFullBiography ? "none" : 120 }, // Ajuste conforme necessário
                            ]}
                            numberOfLines={showFullBiography ? 0 : 4} // Número de linhas exibidas quando não expandido
                        >
                            {owner.biography}
                        </Text>
                        <TouchableOpacity onPress={toggleBiography}>
                            <Text style={styles.toggleBiography}>
                                {showFullBiography ? "Ver menos" : "Ver mais"}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.title}>Localização</Text>

                        <Text style={styles.content}>{owner.street}</Text>
                        <Text style={styles.content}>{owner.district}</Text>
                        <Text style={styles.content}>{owner.city}</Text>
                        <Text style={styles.content}> {owner.state}</Text>
                        <Text style={styles.content}> {owner.postal_code}</Text>
                    </View>
                    {/* Adicione outros campos conforme necessário */}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: Color.colorGray_200,
        alignItems: "center",
        height: screenHeight * 1.2,
    },
    groupChild4: {
        height: "30%",
        width: "70%",
        borderRadius: 84,
        bottom: "2%",
        top: "1%",
    },
    texts: {
        top: "2%",
    },
    title: {
        fontSize: 18,
        color: Color.colorBlanchedalmond_100,
        textAlign: "center",
        fontFamily: "Rosarivo-Regular",
    },
    content: {
        marginBottom: 10,
        color: "white",
        fontSize: FontSize.size_sm,
        fontFamily: FontFamily.openSansLight,
        textAlign: "justify",
        alignSelf: "center",

    },
    biographyTitle: {
        marginTop: 10,
        fontSize: 18,
        color: Color.colorBlanchedalmond_100,
        textAlign: "center",
        fontFamily: "Rosarivo-Regular",
    },
    biography: {
        marginTop: 5,
        overflow: "hidden",
        textAlign: "justify",
        alignSelf: "center",
    },
    toggleBiography: {
        color: "white",
        textDecorationLine: "none",
        marginTop: 5,
    },
});

export default OwnerDetailScreen;
