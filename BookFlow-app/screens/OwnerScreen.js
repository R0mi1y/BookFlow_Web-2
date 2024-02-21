import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, FontSize, Border, Padding } from "../GlobalStyles";
import * as SecureStore from "expo-secure-store";
import getAccessToken from "../components/auxiliarFunctions";
import CustomPopup from "../components/CustomPopup";
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
            <TouchableOpacity onPress={toggleBiography}>
              <Text style={styles.toggleBiography}>
                {showFullBiography ? "Ver menos" : "Ver mais"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.title}>Localização:</Text>

              <View style={styles.content}>
            <Text style={styles.content2}>
              <Text style={styles.title}>Rua: </Text> {owner.street}
            </Text>
            <Text style={styles.content2}>
              <Text style={styles.title}>Bairro: </Text>
              {owner.district}
            </Text>
            <Text style={styles.content2}>
              <Text style={styles.title}>Cidade: </Text>
              {owner.city}
            </Text>
            <Text style={styles.content2}>
              <Text style={styles.title}>Estado: </Text>
              {owner.state}
            </Text>
            <Text style={styles.content2}>
              <Text style={styles.title}>Código Postal: </Text>{" "}
              {owner.postal_code}
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
    borderRadius: 200,
    bottom: "2%",
    top: "1%",
  },
  texts: {
    top: "2%",
  },
  title: {
    fontSize: 17,
    color: Color.colorBlanchedalmond_100,
    fontFamily: "Rosarivo-Regular",
    marginBottom: 2,
  },
  content: {
    marginBottom: 15,
    color: "white",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansLight,
    padding: 8,
    borderRadius: Border.br_3xs,
    borderWidth: 1, // Define a largura da borda como 5 pixels
    borderColor: "white",
    width: 302,
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
    marginTop: 10,
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
