import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default class SavedScreen extends React.Component {
  static navigationOptions = {
    title: "Saved"
  };

  render() {
    return <ScrollView style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#f0f"
  }
});
