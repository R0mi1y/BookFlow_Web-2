import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Color, FontFamily, FontSize } from "../GlobalStyles";


const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permissão negada para acessar a biblioteca de mídia');
      }
    })();
  }, []);

  useEffect(() => {
      const fetchData = async () => {
        try {
          await AsyncStorage.removeItem("@user");
          // await new Promise(resolve => setTimeout(resolve, 3000));
          const user = await AsyncStorage.getItem("@user");
  
          if (user !== null) {
            navigation.navigate("HomeScreen");
          } else {
            navigation.navigate("LogInScreen");
          }
        } catch (error) {
          console.log("Erro lendo o AsyncStorage: " + error);
          navigation.navigate("LogInScreen");
        }
      };
  
      fetchData();
    }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.colorGray_200,
  },
  logo: {
    width: 600,
    height: 600,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
