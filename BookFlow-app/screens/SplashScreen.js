import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import getAccessToken from '../components/auxiliarFunctions';

const SplashScreen = ({ navigation }) => {
  const apiUrl = Constants.expoConfig.extra.apiUrl;

  useEffect(() => {
    const fetchDataAndRegisterNotifications = async () => {
      try {
        var user = await JSON.parse(await SecureStore.getItemAsync("user"));
        let nameScreen = user !== null ? "HomeScreen" : "LogInScreen";
  
        navigation.reset({
          index: 0,
          routes: [{ name: nameScreen }],
        });
  
        await registerForPushNotificationsAsync(user);
      } catch (error) {
        console.error("Erro lendo o SecureStore:", error);
        navigation.navigate("LogInScreen");
      }
    };
  
    const registerForPushNotificationsAsync = async (user) => {
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
  
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
  
        if (finalStatus !== 'granted') {
          console.log('Permission to receive push notifications denied');
          return;
        }
  
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo Push Token:', token);
  
        await SecureStore.setItemAsync("notification-token", token);
  
        if (user != null) {
          const response = await fetch(`${apiUrl}/api/user/${user.id}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + (await getAccessToken()),
            },
            body: JSON.stringify({
              notification_token: token
            }),
          });
  
          if (!response.ok) {
            console.warn(await response.text());
            console.error('Failed to update notification token:', response.status);
          }
        }
      } catch (error) {
        console.error('Error registering for push notifications:', error);
      }
    };
  
    fetchDataAndRegisterNotifications();
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
    width: 550,
    height: 550,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
