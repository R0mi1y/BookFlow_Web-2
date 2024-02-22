import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  Pressable,
} from "react-native";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, FontSize, Border, Padding } from "../GlobalStyles";
import getAccessToken from "../components/auxiliarFunctions";
import TopComponent from "../components/topComponent";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const OwnerDetailScreen = ({ route }) => {
  const [showFullBiography, setShowFullBiography] = useState(false);
  const [owner, setOwner] = useState(null);
  const navigation = useNavigation();
  const apiUrl = Constants.expoConfig.extra.apiUrl;

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
          console.log(ownerData);
          setOwner(ownerData);
        } else {
          console.error(
            "Erro ao obter dados do proprietário:",
            response.statusText
          );
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

  const handlePress = () => {
    const phoneNumber = owner.phone; // Substitua pelo número de telefone desejado
    const message = 'Olá, estou entrando em contato pois tenho interesse em um dos seus livros!'; // Substitua pela mensagem desejada
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (supported) {
        return Linking.openURL(whatsappUrl);
      } else {
        console.log("Não é possível abrir o WhatsApp. Certifique-se de que o aplicativo está instalado.");
      }
    }).catch(err => console.error('Erro ao verificar suporte ao WhatsApp:', err));
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
              uri: owner.photo
                ? owner.photo.includes("http")
                  ? owner.photo
                  : apiUrl + owner.photo
                : apiUrl + "/static/img/default_perfil.jpg",
            }}
          />
          <View style={styles.texts}>
            <Text style={styles.title}>Nome:</Text>
            <Text style={styles.content}>{owner.username}</Text>

            <Text style={styles.title}>Email:</Text>
            <Text style={styles.content}>{owner.email}</Text>

            <Text style={styles.biographyTitle}>Biografia:</Text>
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
            {owner.biography && owner.biography.length > 200 && (<Pressable onPress={toggleBiography}>
              <Text style={styles.toggleBiography}>{showFullBiography ? "Ver menos." : "Ver mais."}</Text>
            </Pressable>)}


            {owner.street && owner.district && owner.city && owner.state && owner.postal_code && (<><Text style={styles.title}>Localização:</Text>
              <View style={styles.content}>
                {owner.street ? (<Text style={styles.content2}>
                  <Text style={styles.title}>Rua: </Text> {owner.street}
                </Text>) : (<></>)}
                {owner.district ? (<Text style={styles.content2}>
                  <Text style={styles.title}>Bairro: </Text> {owner.district}
                </Text>) : (<></>)}
                {owner.city ? (<Text style={styles.content2}>
                  <Text style={styles.title}>Cidade: </Text> {owner.city}
                </Text>) : (<></>)}
                {owner.state ? (<Text style={styles.content2}>
                  <Text style={styles.title}>Estado: </Text> {owner.state}
                </Text>) : (<></>)}
                {owner.postal_code ? (<Text style={styles.content2}>
                  <Text style={styles.title}>Código Postal: </Text> {owner.postal_code}
                </Text>) : (<></>)}
              </View></>)}

            <Text style={styles.title}>Contato:</Text>

            <View style={styles.content}>
              {owner.phone ? (<Pressable onPress={handlePress}>
                <Text style={styles.content2}>
                  <Text style={styles.title}>Whatsapp: </Text> {owner.phone}
                </Text>
              </Pressable>) : (<></>)}
              <Text style={styles.content2}>
                <Text style={styles.title}>Email: </Text>
                {owner.email}
              </Text>
            </View>
          </View>
          {/* Adicione outros campos conforme necessário */}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    backgroundColor: Color.colorGray_200,
    width: "100%",
    overflow: "hidden",
    minHeight: screenHeight * 1.2,
  },
  groupChild4: {
    height: 250,
    width: 250,
    borderRadius: 200,
    borderWidth: 1,
    borderColor: "white",
    bottom: "2%",
    top: "1%",
  },
  texts: {
    top: "2%",
    width: "70%",
  },
  title: {
    fontSize: 17,
    color: Color.colorBlanchedalmond_100,
    fontFamily: "Rosarivo-Regular",
    marginBottom: 2,
  },
  content: {
    marginBottom: 10,
    color: "white",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansLight,
    padding: 8,
    borderRadius: Border.br_3xs,
    borderWidth: 1, // Define a largura da borda como 5 pixels
    borderColor: "white",
    width: "100%",
  },

  content2: {
    color: "white",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansLight,
    padding: 2,
    width: 302,
  },

  content3: {
    marginBottom: 15,
    color: "white",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansLight,
    textAlign: "center",
    padding: 8,
    borderRadius: Border.br_3xs,
    borderWidth: 1, // Define a largura da borda como 5 pixels
    borderColor: "white",
    width: 302,
  },
  biographyTitle: {
    marginBottom: 2,
    fontSize: 17,
    color: Color.colorBlanchedalmond_100,
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
    marginTop: -3,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default OwnerDetailScreen;
