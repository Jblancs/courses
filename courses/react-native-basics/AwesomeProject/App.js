import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import ColorBox from "./components/ColorBox";

const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, styles.pink]}>
        <Text>Hello World!</Text>
      </View>
      <ColorBox colorName="Cyan" colorHex="cyan"/>
      <ColorBox colorName="Blue" colorHex="blue"/>
      <ColorBox colorName="red" colorHex="red"/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pink: {
    backgroundColor: 'pink',
  },
  container: {
    paddingVertical: 10, // similar to padding top/bot since cannot do padding: 10 30 30 10
    paddingHorizontal: 30,
    // paddingTop: 10,
    // paddingBottom: 10,
    // paddingLeft: 30,
    // paddingRight: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  safeArea: {
    flex:1
  }
})

export default App;
