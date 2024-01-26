import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import * as SecureStore from 'expo-secure-store';


const SplashScreen = ({ navigation }) => {

  useEffect(() => {

      const fetchData = async () => {
        try {
          const user = await await SecureStore.getItemAsync("user");
  
          if (user !== null) {
            nameScreen = "HomeScreen";
          } else {
            nameScreen = "LogInScreen";
          }

          navigation.reset({
            index: 0,
            routes: [{ name: nameScreen }],
          });

        } catch (error) {
          console.log("Erro");

          console.log("Erro lendo o SecureStore: " + error);
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
