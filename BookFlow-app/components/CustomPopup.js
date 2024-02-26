import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, Pressable, Image, ScrollView } from 'react-native';
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";
import Constants from 'expo-constants';
import React from 'react';
import { Asset } from 'expo-asset';

const apiUrl = Constants.expoConfig.extra.apiUrl;

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const CustomPopup = ({ visible, onClose, message, navigation=null, setVisible=null }) => {
  if (typeof message === 'string') {
    if (message == "Loading") {
      const gif = Asset.fromModule(require('../assets/book.gif')).uri;

      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={onClose}
        >
          <View style={styles.centeredView}>
            <Image
              source={{ uri: gif }}
              style={{ width: screenWidth * 0.5, height: screenWidth * 0.3}}
            />
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
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{message}</Text>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  } else if ( typeof message === 'object') {
    let books = (<></>);
    if (message.type == "books") {
      books = message.books.map((book) => (
        <Pressable
          key={book.id}
          style={styles.groupLayout}
          onPress={() => {
            setVisible(false);
            navigation.navigate("BookDetailScreen", { bookId: book.id, fromScreen: false, owner: false });
          }}
        >
          {/* LIVROS */}
          <View style={[styles.groupChild3, styles.groupLayout]}>
            <Image
              style={[styles.groupChild4, styles.groupChildLayout1]}
              resizeMode="cover"
              source={{
                uri: apiUrl + (book.cover ? book.cover : "/static/img/default_cover.jpg"),
              }}
            />
            <View style={styles.bookInfoContainer}>
              <Text style={[styles.titleBook, styles.groupChildLayout1]}>
                {book.title.length > 20
                  ? `${book.title.substring(0, 20)}...`
                  : book.title}
              </Text>
              <Text style={styles.authorBook}>{book.author}</Text>
              <Text style={[styles.genre, styles.genreTypo]}>
                {book.genre.replace(/,/g, " •")}
              </Text>
            </View>
          </View>
        </Pressable>
      ))

      return (
        <>
          <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
          >
            <ScrollView>
              <Pressable onPress={onClose} style={[styles.container, { height: screenHeight * 0.5 }]}/>
              <View style={styles.scrol1Container}>
                <View style={styles.scrol1}>
                  {books}
                </View>
              </View>
            </ScrollView>
          </Modal>
        </>
      );
    }
  }
};

const styles = StyleSheet.create({
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
  bookInfoContainer: {
    top: 12,
    textAlign: "center",
    width: "80%",
  },
  phlistLayout: {
    height: 25,
    width: 25,
    top: 62,
    position: "absolute",
  },
  genreTypo: {
    fontSize: FontSize.size_base,
    position: "absolute",
  },
  groupLayout: {
    height: 110,
    width: "100%",
    marginBottom: 22,
    borderRadius: Border.br_3xs,
  },
  icon: {
    height: "100%",
    overflow: "hidden",
  },
  phlist: {
    left: 26,
    height: 25,
    width: 25,
  },
  phlistLayout: {
    height: 25,
    width: 25,
    top: 62,
    position: "absolute",
  },
  l: {
    top: 9,
    fontSize: FontSize.size_11xl,
    color: Color.colorBlanchedalmond_400,
    height: 43,
    width: 100,
    left: 0,
  },
  book: {
    left: 75,
    fontSize: FontSize.size_23xl,
    width: 105,
    height: 50,
    color: Color.colorBlanchedalmond_100,
    fontFamily: FontFamily.rosarivoRegular,
    textAlign: "left",
    top: 0,
    position: "absolute",
  },
  autores: {
    width: 150,
    height: 16,
    lineHeight: 18,
    fontSize: FontSize.size_sm,
    textAlign: "center",
  },
  groupChild3: {
    backgroundColor: Color.colorGray_300,
    flexDirection: "row",
  },
  groupChild4: {
    height: "100%",
    width: 100,
    top: 0,
    left: 0,
    borderRadius: Border.br_mini,
  },
  authorBook: {
    top: 30,
    fontSize: FontSize.size_base,
    color: Color.colorBlanchedalmond_100,
    alignSelf: "center",
    fontFamily: FontFamily.rosarivoRegular,
    position: "absolute",
  },
  titleBook: {
    alignSelf: "center",
    fontSize: 20,
    fontFamily: FontFamily.rosarivoRegular,
    color: Color.colorBlanchedalmond_100,
  },
  genre: {
    top: 55,
    fontFamily: FontFamily.rosarivoRegular,
    alignSelf: "center",
    lineHeight: 20,
    color: Color.colorWhite,
    fontWeight: "600",
  },
  scrol1Container: {
    backgroundColor: Color.colorGray_200,
    width: screenWidth,
    minHeight: screenHeight * 0.5,
    borderRadius: 40,
    paddingTop: 50,
  },
  scrol1: {
    backgroundColor: Color.colorGray_200,
    width: screenWidth * 0.9,
    margin: screenWidth * 0.05,
    height: "100%",
  },
});

export default CustomPopup;