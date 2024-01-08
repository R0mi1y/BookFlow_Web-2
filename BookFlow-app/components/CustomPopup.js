import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomPopup = ({ visible, onClose, message }) => {
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