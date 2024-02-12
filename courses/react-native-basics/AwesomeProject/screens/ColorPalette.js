import React from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList } from "react-native";
import ColorBox from "../components/ColorBox";

const ColorPalette = ({ route }) => {
  const { colors, paletteName } = route.params;
  return (
    <FlatList
      style={styles.container}
      data={colors}
      keyExtractor={(item) => item.colorName}
      renderItem={({ item }) => (
        <ColorBox colorName={item.colorName} colorHex={item.hexCode} />
      )}
      ListHeaderComponent={<Text>{paletteName}</Text>}
    />
  );
};

const styles = StyleSheet.create({
  pink: {
    backgroundColor: "pink",
  },
  container: {
    paddingVertical: 10, // similar to padding top/bot since cannot do padding: 10 30 30 10
    paddingHorizontal: 30,
    // paddingTop: 10,
    // paddingBottom: 10,
    // paddingLeft: 30,
    // paddingRight: 30,
    backgroundColor: "white",
  },
  safeArea: {},
});

export default ColorPalette;
