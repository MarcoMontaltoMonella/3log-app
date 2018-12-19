import React from "react";
import { StyleSheet, Text, View, SectionList, Alert } from "react-native";
import Colors from "../constants/Colors";

export default class SavedScreen extends React.Component {
  static navigationOptions = {
    title: "Saved"
  };

  GetSectionListItem = item => {
    Alert.alert(item);
  };

  render() {
    return (
      <View style={styles.container}>
        <SectionList
          sections={[
            {
              title: "Brooklyn, NY",
              data: ["American Hornbeam", "Golden Ash", "Birch"]
            },
            {
              title: "Bronx, NY",
              data: ["Silver Beech", "Blackthorn", "Tilia"]
            },
            {
              title: "Hempstead, NY",
              data: ["American Elm", "Silver Maple", "Sycamore"]
            },
            {
              title: "Manhattan, NY",
              data: ["Cherry", "Elder", "Common Hazel"]
            },
            {
              title: "Queens, NY",
              data: ["English Oak", "Sessile Oak", "Scots Pine"]
            },
            {
              title: "Staten Island, NY",
              data: ["Rowan", "Salix Fragilis", "White Willow"]
            }
          ]}
          renderSectionHeader={({ section }) => (
            <Text style={styles.SectionHeader}> {section.title} </Text>
          )}
          renderItem={({ item }) => (
            <Text
              style={styles.SectionListItemS}
              onPress={this.GetSectionListItem.bind(this, item)}
            >
              {" "}
              {item}{" "}
            </Text>
          )}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: Colors.lightBackground
  },
  SectionHeader: {
    backgroundColor: Colors.tabHeader,
    fontSize: 20,
    padding: 5,
    color: "#fff",
    fontWeight: "bold"
  },
  SectionListItemS: {
    fontSize: 16,
    padding: 6,
    color: "#000",
    backgroundColor: "#F5F5F5",
    borderColor: "black",
    borderWidth: 1.5
  }
});
