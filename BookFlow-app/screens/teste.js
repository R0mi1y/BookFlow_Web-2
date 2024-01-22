import React, { useState, useEffect } from 'react';
import { View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";


export default function FilePickerComponent() {
    const [selectedImage, setSelectedImage] = useState(null);
    const apiUrl = Constants.expoConfig.extra.apiUrl;
    const navigation = useNavigation();

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
            setSelectedImage(result.uri);
            // Enviar o arquivo para o servidor Django
            uploadFile(result.uri);
        }
        } catch (err) {
        console.error('Erro ao selecionar o documento:', err);
        }
    };

    async function getAccessToken() {
        try {
            const user = JSON.parse(await AsyncStorage.getItem("@user"));
            
            if (!user) {
                console.error("Couldn't find user");
                navigation.navigate("LogInScreen");
                return;
            }

            const refreshToken = user.refresh_token;
        
            if (!refreshToken) {
                console.error("Refresh token não encontrado");
                navigation.navigate("LogInScreen");
                return;
            }
            
            const response = await fetch(
                `${apiUrl}${book.cover}`,
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
                console.error(`Erro na requisição de atualização do token: ${`${apiUrl}/api/token/refresh/`} :${response.statusText}`);
                return;
            }
        
            if (response["code"] == "token_not_valid") {
                console.error("Invalid token: " + response.statusText);
                navigation.navigate("LogInScreen");
            }
    
            const data = await response.json();
            console.log(data);

            if (!'access' in data) {
                console.error("Resposta não contém o token de acesso");
                navigation.navigate("LogInScreen");
                return;
            }

            return data['access'];

        } catch (error) {
            console.error("Erro ao " + error);
            navigation.navigate("LogInScreen");
        }
    }
    
    
    const uploadFile = async (fileUri) => {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: fileUri,
                type: 'image/jpeg', // Ajuste conforme o tipo de arquivo
                name: 'filename.jpg',
            });
            getAccessToken()
                .then((accessToken) => {
                    axios.post(`${apiUrl}/api/book/cover/1/`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': 'Bearer ' + accessToken
                        },
                    })
                    .then((response) => {
                        console.log(`${apiUrl}/api/book/cover/1/`);
                        let data = response.data;
                        console.log('Resposta do servidor Django:', data);
                    })
                    .catch((error) => {
                        console.error('erro:', error.response.data);
                    });
                })
                .catch((err) => {
                    console.error('Erro ao obter o token de acesso:', err);
                });

        } catch (error) {
            console.error('Erro ao enviar o arquivo para o servidor Django:', error);
        }
    };

    return (
        <View>
        <Button title="Selecionar Arquivo" onPress={pickDocument} />
        <Button title="get refresh" onPress={getAccessToken} />
        {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} />}
        </View>
    );
}
