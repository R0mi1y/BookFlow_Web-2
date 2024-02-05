import * as React from "react";
import { useState, useEffect } from "react";
import {
    StyleSheet,
    ScrollView,
    Text,
    View,
    Pressable,
    Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, FontSize, Color, Border, Padding } from "../GlobalStyles";
import Constants from "expo-constants";
import starOutlineImage from "../assets/solarstaroutline.png";
import starFilledImage from "../assets/solarstarfilled.png";
import * as SecureStore from 'expo-secure-store';
import TopComponent from '../components/topComponent';
import CustomPopup from '../components/CustomPopup';
import getAccessToken from '../components/auxiliarFunctions';


const OwnerScreen = ({ route }) => {
    const { ownerId } = route.params;
    const [owner, setOwner] = useState(null);

    useEffect(() => {
        const fetchOwnerData = async () => {
            try {
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
    }, [ownerId]);

    return (
        <View style={styles.container}>
            {owner ? (
                <>
                    <Text>Nome: {owner.username}</Text>
                    <Text>Email: {owner.email}</Text>
                    {/* Adicione outros campos conforme necessário */}
                </>
            ) : (
                <Text>Carregando informações do proprietário...</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default OwnerScreen;

