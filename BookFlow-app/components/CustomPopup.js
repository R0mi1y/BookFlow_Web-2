import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import React, { useRef, useEffect } from 'react';

const CustomPopup = ({ visible, onClose, message }) => {
  if (message == "Loading") {
    const rotationValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      // Configura a animação para fazer uma rotação de 360 graus
      Animated.loop(
        Animated.timing(rotationValue, {
          toValue: 1,
          duration: 2000, // Duração da animação em milissegundos
          useNativeDriver: true,
        })
      ).start();
    }, [rotationValue]);

    // Interpola o valor da animação para converter de 0 a 1 para 0 a 360 graus
    const rotate = rotationValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={popup_styles.centeredView}>
          {/* <Animated.Image source={require('../assets/loading.png')} style={[popup_styles.square, { transform: [{ rotate }] }]} /> */}
          <Animated.View style={[popup_styles.square, { transform: [{ rotate }] }]} />
        </View>
      </Modal>
    );
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={popup_styles.centeredView}>
        <View style={popup_styles.modalView}>
          <Text style={popup_styles.modalText}>{message}</Text>
          <TouchableOpacity style={popup_styles.button} onPress={onClose}>
            <Text style={popup_styles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

  const popup_styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    square: {
      width: 100,
      height: 100,
      backgroundColor: 'white', // Cor de fundo do quadrado
      borderWidth: 1,
      borderColor: 'black', // Cor da borda do quadrado (opcional)
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
    },
    modalView: {
      margin: 20,
      backgroundColor: '#50372d', // Fundo semi-transparente
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      borderColor: 'white',
      borderWidth: 1,
      borderRadius: 5,
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      color: 'white',
    },
    button: {
      borderRadius: 5,
      padding: 10,
      elevation: 2,
      backgroundColor: 'white', // Cor do botão
    },
    buttonText: {
      color: '#50372d',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
  
  export default CustomPopup;