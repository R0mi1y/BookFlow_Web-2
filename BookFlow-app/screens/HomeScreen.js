import React, { useState, useCallback } from "react";
import { Image } from "expo-image";
import { StyleSheet, Pressable, Text, View, Modal } from "react-native";
import AndroidLarge3 from "../components/AndroidLarge3";
import MisFavoritosContainer from "../components/MisFavoritosContainer";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, FontSize, Border } from "../GlobalStyles";

const AndroidLarge1 = () => {
  const [phlistIconVisible, setPhlistIconVisible] = useState(false);
  const navigation = useNavigation();

  const openPhlistIcon = useCallback(() => {
    setPhlistIconVisible(true);
  }, []);

  const closePhlistIcon = useCallback(() => {
    setPhlistIconVisible(false);
  }, []);

  return (
    <>
      <View style={[styles.androidLarge1, styles.iconLayout]}>
        <Pressable
          style={[styles.phlist, styles.phlistLayout]}
          onPress={openPhlistIcon}
        >
          <Image
            style={[styles.icon, styles.iconLayout]}
            contentFit="cover"
            source={require("../assets/phlist.png")}
          />
        </Pressable>
        <Image
          style={[styles.epsearchIcon, styles.phlistLayout]}
          contentFit="cover"
          source={require("../assets/epsearch.png")}
        />
        <View style={styles.groupParent}>
          <View style={styles.rectangleLayout1}>
            <Image
              style={styles.groupChild}
              contentFit="cover"
              source={require("../assets/rectangle-3.png")}
            />
            <Text style={[styles.cienciaFiccion, styles.textFlexBox]}>{`CIENCIA
FICCION`}</Text>
            <Text style={[styles.coleccin, styles.coleccinTypo]}>
              •colección•
            </Text>
          </View>
          <View style={[styles.rectangleGroup, styles.rectangleLayout1]}>
            <Image
              style={styles.groupChild}
              contentFit="cover"
              source={require("../assets/rectangle-5.png")}
            />
            <Text style={[styles.crimen, styles.crimenTypo]}>CRIMEN</Text>
            <Text style={[styles.coleccin1, styles.coleccinTypo]}>
              •colección•
            </Text>
          </View>
          <View style={[styles.rectangleGroup, styles.rectangleLayout1]}>
            <Image
              style={styles.groupChild}
              contentFit="cover"
              source={require("../assets/rectangle-4.png")}
            />
            <Text style={[styles.aventura, styles.textFlexBox]}>Aventura</Text>
            <Text style={[styles.coleccin2, styles.coleccinTypo]}>
              •colección•
            </Text>
          </View>
          <View style={[styles.rectangleGroup, styles.rectangleLayout1]}>
            <Image
              style={styles.groupChild}
              contentFit="cover"
              source={require("../assets/rectangle-2.png")}
            />
            <Text style={[styles.biografia, styles.crimenTypo]}>BIOGRAFIA</Text>
            <Text style={[styles.coleccin3, styles.coleccinTypo]}>
              •colección•
            </Text>
          </View>
          <View style={[styles.rectangleGroup, styles.rectangleLayout1]}>
            <Image
              style={styles.groupChild}
              contentFit="cover"
              source={require("../assets/rectangle-1.png")}
            />
            <Image
              style={styles.groupChild}
              contentFit="cover"
              source={require("../assets/rectangle-1.png")}
            />
            <Text style={styles.infantil}>Infantil</Text>
            <Text style={[styles.coleccin4, styles.coleccinTypo]}>
              •colección•
            </Text>
          </View>
        </View>
        <View style={styles.brandLogo}>
          <Text style={[styles.l, styles.lTypo]}>Lé</Text>
          <Text style={styles.libro}>Libro</Text>
        </View>
        <View style={styles.instanceParent}>
          <View style={styles.autoresWrapper}>
            <Text style={[styles.autores, styles.autoresTypo]}>Autores</Text>
          </View>
          <View style={[styles.autoresContainer, styles.frameBorder]}>
            <Text style={[styles.autores, styles.autoresTypo]}>
              Audiolibros
            </Text>
          </View>
          <View style={[styles.autoresFrame, styles.frameBorder]}>
            <Text style={[styles.autores, styles.autoresTypo]}>Cuentos</Text>
          </View>
          <View style={[styles.frameView, styles.frameBorder]}>
            <Text style={[styles.autores, styles.autoresTypo]}>
              Diccionarios
            </Text>
          </View>
          <View style={[styles.autoresWrapper1, styles.frameBorder]}>
            <Text style={[styles.autores, styles.autoresTypo]}>Novelas</Text>
          </View>
        </View>
        <Text style={styles.miBiblioteca}>Mi biblioteca</Text>
        <Image
          style={[styles.vectorIcon, styles.iconGroupLayout]}
          contentFit="cover"
          source={require("../assets/vector.png")}
        />
        <View style={[styles.rectangleParent2, styles.rectangleLayout]}>
          <View style={[styles.rectangleView, styles.rectangleLayout]} />
          <Text style={[styles.iniciarSesin, styles.textTypo]}>{`Iniciar
Sesión`}</Text>
          <Image
            style={[styles.octiconperson24, styles.batteryIconLayout]}
            contentFit="cover"
            source={require("../assets/octiconperson24.png")}
          />
        </View>
        <MisFavoritosContainer
          userFavorites={`Mis
Favoritos`}
          showSolarstarOutlineIcon
          propLeft={133}
          propLeft1={13}
        />
        <MisFavoritosContainer
          userFavorites={`Mi
Historial`}
          showSolarstarOutlineIcon={false}
          propLeft={245}
          propLeft1={14}
        />
        <View style={styles.scrol1}>
          <Text style={styles.audiolibrosTypo}>Audiolibros</Text>
          <View style={styles.groupContainer}>
            <Pressable
              style={styles.groupLayout}
              onPress={() => navigation.navigate("AndroidLarge2")}
            >
              <View style={[styles.groupChild3, styles.groupLayout]} />
              <Image
                style={[styles.groupChild4, styles.groupChildLayout1]}
                contentFit="cover"
                source={require("../assets/rectangle-174.png")}
              />
              <Text
                style={[styles.pachinkoNovela, styles.groupChildLayout1]}
              >{`Pachinko
Novela`}</Text>
              <View style={[styles.groupChild5, styles.groupChildLayout]} />
              <Text style={[styles.text, styles.textTypo]}>2017</Text>
              <View style={[styles.groupChild6, styles.groupChildLayout]} />
              <Image
                style={[styles.groupIcon, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group.png")}
              />
              <View style={styles.groupChild7} />
              <Image
                style={[styles.groupChild8, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group-102.png")}
              />
              <Text style={[styles.text1, styles.lTypo]}>4.5</Text>
            </Pressable>
            <View style={[styles.rectangleParent3, styles.groupLayout]}>
              <View style={[styles.groupChild3, styles.groupLayout]} />
              <Image
                style={[styles.groupChild4, styles.groupChildLayout1]}
                contentFit="cover"
                source={require("../assets/rectangle-174.png")}
              />
              <Text
                style={[styles.pachinkoNovela, styles.groupChildLayout1]}
              >{`Pachinko
Novela`}</Text>
              <View style={[styles.groupChild5, styles.groupChildLayout]} />
              <Text style={[styles.text, styles.textTypo]}>2017</Text>
              <View style={[styles.groupChild6, styles.groupChildLayout]} />
              <Image
                style={[styles.groupIcon, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group.png")}
              />
              <View style={styles.groupChild7} />
              <Image
                style={[styles.groupChild8, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group-102.png")}
              />
              <Text style={[styles.text1, styles.lTypo]}>4.5</Text>
            </View>
            <View style={[styles.rectangleParent3, styles.groupLayout]}>
              <View style={[styles.groupChild3, styles.groupLayout]} />
              <Image
                style={[styles.groupChild4, styles.groupChildLayout1]}
                contentFit="cover"
                source={require("../assets/rectangle-174.png")}
              />
              <Text
                style={[styles.pachinkoNovela, styles.groupChildLayout1]}
              >{`Pachinko
Novela`}</Text>
              <View style={[styles.groupChild5, styles.groupChildLayout]} />
              <Text style={[styles.text, styles.textTypo]}>2017</Text>
              <View style={[styles.groupChild6, styles.groupChildLayout]} />
              <Image
                style={[styles.groupIcon, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group.png")}
              />
              <View style={styles.groupChild7} />
              <Image
                style={[styles.groupChild8, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group-102.png")}
              />
              <Text style={[styles.text1, styles.lTypo]}>4.5</Text>
            </View>
            <View style={[styles.rectangleParent3, styles.groupLayout]}>
              <View style={[styles.groupChild3, styles.groupLayout]} />
              <Image
                style={[styles.groupChild4, styles.groupChildLayout1]}
                contentFit="cover"
                source={require("../assets/rectangle-174.png")}
              />
              <Text
                style={[styles.pachinkoNovela, styles.groupChildLayout1]}
              >{`Pachinko
Novela`}</Text>
              <View style={[styles.groupChild5, styles.groupChildLayout]} />
              <Text style={[styles.text, styles.textTypo]}>2017</Text>
              <View style={[styles.groupChild6, styles.groupChildLayout]} />
              <Image
                style={[styles.groupIcon, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group.png")}
              />
              <View style={styles.groupChild7} />
              <Image
                style={[styles.groupChild8, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group-102.png")}
              />
              <Text style={[styles.text1, styles.lTypo]}>4.5</Text>
            </View>
          </View>
          <Text style={[styles.agregadosRecientemente, styles.audiolibrosTypo]}>
            Agregados recientemente
          </Text>
          <View style={styles.groupContainer}>
            <View style={styles.groupLayout}>
              <View style={[styles.groupChild3, styles.groupLayout]} />
              <Image
                style={[styles.groupChild4, styles.groupChildLayout1]}
                contentFit="cover"
                source={require("../assets/rectangle-174.png")}
              />
              <Text
                style={[styles.pachinkoNovela, styles.groupChildLayout1]}
              >{`Pachinko
Novela`}</Text>
              <View style={[styles.groupChild5, styles.groupChildLayout]} />
              <Text style={[styles.text, styles.textTypo]}>2017</Text>
              <View style={[styles.groupChild6, styles.groupChildLayout]} />
              <Image
                style={[styles.groupIcon, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group.png")}
              />
              <View style={styles.groupChild7} />
              <Image
                style={[styles.groupChild8, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group-102.png")}
              />
              <Text style={[styles.text1, styles.lTypo]}>4.5</Text>
            </View>
            <View style={[styles.rectangleParent3, styles.groupLayout]}>
              <View style={[styles.groupChild3, styles.groupLayout]} />
              <Image
                style={[styles.groupChild4, styles.groupChildLayout1]}
                contentFit="cover"
                source={require("../assets/rectangle-174.png")}
              />
              <Text
                style={[styles.pachinkoNovela, styles.groupChildLayout1]}
              >{`Pachinko
Novela`}</Text>
              <View style={[styles.groupChild5, styles.groupChildLayout]} />
              <Text style={[styles.text, styles.textTypo]}>2017</Text>
              <View style={[styles.groupChild6, styles.groupChildLayout]} />
              <Image
                style={[styles.groupIcon, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group.png")}
              />
              <View style={styles.groupChild7} />
              <Image
                style={[styles.groupChild8, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group-102.png")}
              />
              <Text style={[styles.text1, styles.lTypo]}>4.5</Text>
            </View>
            <View style={[styles.rectangleParent3, styles.groupLayout]}>
              <View style={[styles.groupChild3, styles.groupLayout]} />
              <Image
                style={[styles.groupChild4, styles.groupChildLayout1]}
                contentFit="cover"
                source={require("../assets/rectangle-174.png")}
              />
              <Text
                style={[styles.pachinkoNovela, styles.groupChildLayout1]}
              >{`Pachinko
Novela`}</Text>
              <View style={[styles.groupChild5, styles.groupChildLayout]} />
              <Text style={[styles.text, styles.textTypo]}>2017</Text>
              <View style={[styles.groupChild6, styles.groupChildLayout]} />
              <Image
                style={[styles.groupIcon, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group.png")}
              />
              <View style={styles.groupChild7} />
              <Image
                style={[styles.groupChild8, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group-102.png")}
              />
              <Text style={[styles.text1, styles.lTypo]}>4.5</Text>
            </View>
            <View style={[styles.rectangleParent3, styles.groupLayout]}>
              <View style={[styles.groupChild3, styles.groupLayout]} />
              <Image
                style={[styles.groupChild4, styles.groupChildLayout1]}
                contentFit="cover"
                source={require("../assets/rectangle-174.png")}
              />
              <Text
                style={[styles.pachinkoNovela, styles.groupChildLayout1]}
              >{`Pachinko
Novela`}</Text>
              <View style={[styles.groupChild5, styles.groupChildLayout]} />
              <Text style={[styles.text, styles.textTypo]}>2017</Text>
              <View style={[styles.groupChild6, styles.groupChildLayout]} />
              <Image
                style={[styles.groupIcon, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group.png")}
              />
              <View style={styles.groupChild7} />
              <Image
                style={[styles.groupChild8, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group-102.png")}
              />
              <Text style={[styles.text1, styles.lTypo]}>4.5</Text>
            </View>
          </View>
          <Text style={[styles.agregadosRecientemente, styles.audiolibrosTypo]}>
            Recomendados
          </Text>
          <View style={styles.groupContainer}>
            <View style={styles.groupLayout}>
              <View style={[styles.groupChild3, styles.groupLayout]} />
              <Image
                style={[styles.groupChild4, styles.groupChildLayout1]}
                contentFit="cover"
                source={require("../assets/rectangle-174.png")}
              />
              <Text
                style={[styles.pachinkoNovela, styles.groupChildLayout1]}
              >{`Pachinko
Novela`}</Text>
              <View style={[styles.groupChild5, styles.groupChildLayout]} />
              <Text style={[styles.text, styles.textTypo]}>2017</Text>
              <View style={[styles.groupChild6, styles.groupChildLayout]} />
              <Image
                style={[styles.groupIcon, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group.png")}
              />
              <View style={styles.groupChild7} />
              <Image
                style={[styles.groupChild8, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group-102.png")}
              />
              <Text style={[styles.text1, styles.lTypo]}>4.5</Text>
            </View>
            <View style={[styles.rectangleParent3, styles.groupLayout]}>
              <View style={[styles.groupChild3, styles.groupLayout]} />
              <Image
                style={[styles.groupChild4, styles.groupChildLayout1]}
                contentFit="cover"
                source={require("../assets/rectangle-174.png")}
              />
              <Text
                style={[styles.pachinkoNovela, styles.groupChildLayout1]}
              >{`Pachinko
Novela`}</Text>
              <View style={[styles.groupChild5, styles.groupChildLayout]} />
              <Text style={[styles.text, styles.textTypo]}>2017</Text>
              <View style={[styles.groupChild6, styles.groupChildLayout]} />
              <Image
                style={[styles.groupIcon, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group.png")}
              />
              <View style={styles.groupChild7} />
              <Image
                style={[styles.groupChild8, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group-102.png")}
              />
              <Text style={[styles.text1, styles.lTypo]}>4.5</Text>
            </View>
            <View style={[styles.rectangleParent3, styles.groupLayout]}>
              <View style={[styles.groupChild3, styles.groupLayout]} />
              <Image
                style={[styles.groupChild4, styles.groupChildLayout1]}
                contentFit="cover"
                source={require("../assets/rectangle-174.png")}
              />
              <Text
                style={[styles.pachinkoNovela, styles.groupChildLayout1]}
              >{`Pachinko
Novela`}</Text>
              <View style={[styles.groupChild5, styles.groupChildLayout]} />
              <Text style={[styles.text, styles.textTypo]}>2017</Text>
              <View style={[styles.groupChild6, styles.groupChildLayout]} />
              <Image
                style={[styles.groupIcon, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group.png")}
              />
              <View style={styles.groupChild7} />
              <Image
                style={[styles.groupChild8, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group-102.png")}
              />
              <Text style={[styles.text1, styles.lTypo]}>4.5</Text>
            </View>
            <View style={[styles.rectangleParent3, styles.groupLayout]}>
              <View style={[styles.groupChild3, styles.groupLayout]} />
              <Image
                style={[styles.groupChild4, styles.groupChildLayout1]}
                contentFit="cover"
                source={require("../assets/rectangle-174.png")}
              />
              <Text
                style={[styles.pachinkoNovela, styles.groupChildLayout1]}
              >{`Pachinko
Novela`}</Text>
              <View style={[styles.groupChild5, styles.groupChildLayout]} />
              <Text style={[styles.text, styles.textTypo]}>2017</Text>
              <View style={[styles.groupChild6, styles.groupChildLayout]} />
              <Image
                style={[styles.groupIcon, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group.png")}
              />
              <View style={styles.groupChild7} />
              <Image
                style={[styles.groupChild8, styles.iconGroupLayout]}
                contentFit="cover"
                source={require("../assets/group-102.png")}
              />
              <Text style={[styles.text1, styles.lTypo]}>4.5</Text>
            </View>
          </View>
        </View>
        <View style={styles.iosstatusBarblack}>
          <Image
            style={[styles.bgIcon, styles.iconGroupLayout]}
            contentFit="cover"
            source={require("../assets/bg.png")}
          />
          <View style={[styles.rightSide, styles.sidePosition]}>
            <Image
              style={[styles.batteryIcon, styles.batteryIconLayout]}
              contentFit="cover"
              source={require("../assets/battery.png")}
            />
            <Image
              style={styles.wifiIcon}
              contentFit="cover"
              source={require("../assets/wifi.png")}
            />
            <Image
              style={styles.mobileSignalIcon}
              contentFit="cover"
              source={require("../assets/mobile-signal.png")}
            />
          </View>
          <Image
            style={[styles.leftSideIcon, styles.sidePosition]}
            contentFit="cover"
            source={require("../assets/left-side.png")}
          />
        </View>
      </View>

      <Modal animationType="fade" transparent visible={phlistIconVisible}>
        <View style={styles.phlistIconOverlay}>
          <Pressable style={styles.phlistIconBg} onPress={closePhlistIcon} />
          <AndroidLarge3 onClose={closePhlistIcon} />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  iconLayout: {
    width: "100%",
    overflow: "hidden",
  },
  phlistLayout: {
    height: 25,
    width: 25,
    top: 62,
    position: "absolute",
  },
  textFlexBox: {
    textAlign: "left",
    color: Color.colorWhite,
  },
  coleccinTypo: {
    fontFamily: FontFamily.plusJakartaSansLight,
    fontWeight: "300",
    fontSize: FontSize.size_3xs,
    textAlign: "left",
    color: Color.colorWhite,
    position: "absolute",
  },
  rectangleLayout1: {
    height: 150,
    width: 309,
  },
  crimenTypo: {
    letterSpacing: 2.8,
    fontSize: FontSize.size_21xl,
    textAlign: "left",
    color: Color.colorWhite,
    position: "absolute",
  },
  lTypo: {
    fontFamily: FontFamily.rosarivoRegular,
    textAlign: "left",
    position: "absolute",
  },
  autoresTypo: {
    textAlign: "center",
    color: Color.colorBlanchedalmond_100,
    fontFamily: FontFamily.rosarivoRegular,
  },
  frameBorder: {
    marginLeft: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 34,
    borderWidth: 1,
    borderColor: Color.colorBlanchedalmond_100,
    borderStyle: "solid",
    borderRadius: Border.br_3xs,
    flexDirection: "row",
  },
  iconGroupLayout: {
    maxHeight: "100%",
    maxWidth: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  rectangleLayout: {
    height: 105,
    width: 95,
    position: "absolute",
  },
  textTypo: {
    fontSize: FontSize.size_base,
    position: "absolute",
  },
  batteryIconLayout: {
    width: 24,
    position: "absolute",
  },
  groupLayout: {
    height: 230,
    width: 135,
  },
  groupChildLayout1: {
    width: 111,
    left: 12,
  },
  groupChildLayout: {
    height: 39,
    borderRadius: Border.br_xs,
    top: 179,
    position: "absolute",
  },
  audiolibrosTypo: {
    letterSpacing: 0.1,
    fontFamily: FontFamily.rosarivoRegular,
    fontSize: FontSize.size_xl,
    textAlign: "left",
    color: Color.colorWhite,
  },
  sidePosition: {
    top: 17,
    height: 11,
    position: "absolute",
  },
  phlistIconOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(113, 113, 113, 0.3)",
  },
  phlistIconBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
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
  epsearchIcon: {
    left: 310,
    overflow: "hidden",
  },
  groupChild: {
    borderRadius: Border.br_mini,
    left: 0,
    top: 0,
    height: 150,
    width: 309,
    position: "absolute",
  },
  cienciaFiccion: {
    top: 43,
    fontFamily: FontFamily.kodchasanSemiBold,
    fontWeight: "600",
    color: Color.colorWhite,
    lineHeight: 25,
    letterSpacing: 1.8,
    fontSize: FontSize.size_6xl,
    position: "absolute",
    left: 21,
  },
  coleccin: {
    top: 27,
    left: 50,
  },
  crimen: {
    top: 35,
    left: 71,
    fontFamily: FontFamily.kameron,
  },
  coleccin1: {
    top: 22,
    left: 125,
  },
  rectangleGroup: {
    marginLeft: 20,
  },
  aventura: {
    top: 50,
    left: 173,
    fontFamily: FontFamily.miniver,
    lineHeight: 25,
    letterSpacing: 1.8,
    fontSize: FontSize.size_6xl,
    position: "absolute",
  },
  coleccin2: {
    top: 34,
    left: 197,
  },
  biografia: {
    top: 101,
    left: 154,
    fontFamily: FontFamily.karantinaRegular,
  },
  coleccin3: {
    top: 88,
    left: 184,
  },
  infantil: {
    top: 59,
    left: 36,
    fontFamily: FontFamily.jejuHallasan,
    fontSize: FontSize.size_xl,
    textAlign: "left",
    color: Color.colorWhite,
    position: "absolute",
  },
  coleccin4: {
    top: 46,
    left: 46,
  },
  groupParent: {
    top: 186,
    flexDirection: "row",
    width: 309,
    left: 26,
    position: "absolute",
  },
  l: {
    top: 9,
    fontSize: FontSize.size_11xl,
    color: Color.colorBlanchedalmond_400,
    height: 43,
    width: 39,
    left: 0,
  },
  libro: {
    left: 39,
    fontSize: FontSize.size_23xl,
    width: 105,
    height: 50,
    color: Color.colorBlanchedalmond_100,
    fontFamily: FontFamily.rosarivoRegular,
    textAlign: "left",
    top: 0,
    position: "absolute",
  },
  brandLogo: {
    top: 49,
    left: 109,
    width: 144,
    height: 52,
    position: "absolute",
  },
  autores: {
    width: 88,
    height: 16,
    lineHeight: 18,
    fontSize: FontSize.size_sm,
    textAlign: "center",
  },
  autoresWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    height: 34,
    borderWidth: 1,
    borderColor: Color.colorBlanchedalmond_100,
    borderStyle: "solid",
    width: 90,
    borderRadius: Border.br_3xs,
    flexDirection: "row",
  },
  autoresContainer: {
    width: 110,
  },
  autoresFrame: {
    width: 90,
    marginLeft: 15,
  },
  frameView: {
    width: 112,
  },
  autoresWrapper1: {
    width: 87,
  },
  instanceParent: {
    top: 120,
    width: 322,
    left: 22,
    flexDirection: "row",
    position: "absolute",
  },
  miBiblioteca: {
    top: 354,
    width: 170,
    height: 20,
    lineHeight: 20,
    fontSize: FontSize.size_base,
    left: 22,
    fontFamily: FontFamily.rosarivoRegular,
    textAlign: "left",
    color: Color.colorWhite,
    position: "absolute",
  },
  vectorIcon: {
    height: "1.61%",
    width: "6.11%",
    top: "31.77%",
    right: "15.56%",
    bottom: "66.62%",
    left: "78.33%",
  },
  rectangleView: {
    backgroundColor: Color.colorDimgray,
    borderRadius: Border.br_3xs,
    width: 95,
    left: 0,
    top: 0,
  },
  iniciarSesin: {
    top: 19,
    lineHeight: 18,
    textAlign: "center",
    color: Color.colorBlanchedalmond_100,
    fontFamily: FontFamily.rosarivoRegular,
    left: 22,
  },
  octiconperson24: {
    left: 35,
    height: 24,
    top: 62,
    width: 24,
    overflow: "hidden",
  },
  rectangleParent2: {
    top: 385,
    left: 21,
  },
  groupChild3: {
    borderRadius: 13,
    backgroundColor: Color.colorGray_300,
    left: 0,
    top: 0,
    position: "absolute",
  },
  groupChild4: {
    height: 111,
    top: 12,
    width: 111,
    borderRadius: Border.br_mini,
    position: "absolute",
  },
  pachinkoNovela: {
    top: 131,
    height: 35,
    lineHeight: 20,
    width: 111,
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.rosarivoRegular,
    textAlign: "left",
    color: Color.colorWhite,
    position: "absolute",
  },
  groupChild5: {
    backgroundColor: Color.colorGray_400,
    width: 111,
    left: 12,
  },
  text: {
    top: 190,
    left: 24,
    fontFamily: FontFamily.openSansSemiBold,
    width: 38,
    height: 18,
    lineHeight: 18,
    textAlign: "left",
    color: Color.colorWhite,
    fontWeight: "600",
  },
  groupChild6: {
    left: 84,
    backgroundColor: Color.colorBlanchedalmond_100,
    width: 39,
  },
  groupIcon: {
    height: "6.57%",
    width: "14.37%",
    top: "82.61%",
    right: "16.74%",
    bottom: "10.83%",
    left: "68.89%",
  },
  groupChild7: {
    borderTopLeftRadius: Border.br_mini,
    borderBottomRightRadius: Border.br_mini,
    borderBottomLeftRadius: Border.br_12xs,
    backgroundColor: Color.colorDarkslategray,
    width: 41,
    left: 12,
    top: 12,
    height: 20,
    position: "absolute",
  },
  groupChild8: {
    height: "4.35%",
    width: "7.78%",
    top: "7.39%",
    right: "78.89%",
    bottom: "88.26%",
    left: "13.33%",
  },
  text1: {
    top: 13,
    left: 33,
    width: 13,
    height: 14,
    fontSize: FontSize.size_3xs,
    fontFamily: FontFamily.rosarivoRegular,
    color: Color.colorWhite,
  },
  rectangleParent3: {
    marginLeft: 19,
  },
  groupContainer: {
    width: 295,
    marginTop: 12,
    flexDirection: "row",
  },
  agregadosRecientemente: {
    marginTop: 12,
  },
  scrol1: {
    top: 518,
    width: 343,
    left: 21,
    position: "absolute",
  },
  bgIcon: {
    top: -2,
    right: 70,
    bottom: 16,
    left: 69,
    display: "none",
  },
  batteryIcon: {
    right: 0,
    height: 11,
    top: 0,
  },
  wifiIcon: {
    width: 15,
    height: 11,
  },
  mobileSignalIcon: {
    width: 17,
    height: 11,
  },
  rightSide: {
    right: 15,
    width: 67,
    height: 11,
  },
  leftSideIcon: {
    left: 34,
    width: 28,
    height: 11,
  },
  iosstatusBarblack: {
    right: 1,
    left: 1,
    height: 44,
    top: 0,
    position: "absolute",
    overflow: "hidden",
    backgroundColor: Color.colorGray_200,
  },
  androidLarge1: {
    flex: 1,
    height: 1410,
    overflow: "hidden",
    backgroundColor: Color.colorGray_200,
  },
});

export default AndroidLarge1;
