import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  Platform,
  StatusBar
} from "react-native";
import { MapView, Location, Permissions, AppLoading } from "expo";
import Icon from "react-native-vector-icons/Ionicons";
import Labels from "../constants/Labels";

export default class MapScreen extends React.Component {
  state = {
    treeMarkers: [],
    isReady: false,
    searchText: Labels.SEARCH_DEFAULT
  };

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this._getLocationAsync();
  }

  componentWillMount() {
    this._setupAsync();
  }

  _loadAssetsAsync = async () => {
    await Expo.Asset.loadAsync([
      require("../assets/images/simple_tree.png"),
      require("../assets/images/user_location.png")
    ]);
  };

  _setHeaderHeightAsync = async () => {
    this.startHeaderHeight = 80;
    if (Platform.OS == "android") {
      this.startHeaderHeight = 100 + StatusBar.currentHeight;
    }
  };

  _setupAsync = async () => {
    await Promise.all([this._loadAssetsAsync(), this._setHeaderHeightAsync()]);
    this.setState({ isReady: true });
  };

  _performSearch = async () => {
    console.log(this.state.searchText);
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== "granted") {
      console.error("Location permission not granted!");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    // Extra mockup locations
    let tandon = (await Location.geocodeAsync("6 Metrotech"))[0];
    let brc = (await Location.geocodeAsync("25 Jay St."))[0];

    this.setState({
      location,
      treeMarkers: {
        tandon,
        brc
      }
    });
  };

  render() {
    if (!this.state.location) {
      return <AppLoading />;
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="ios-search" size={20} style={{ marginRight: 10 }} />
            <TextInput
              placeholder={this.state.searchText}
              placeholderTextColor="grey"
              style={styles.searchBarText}
              onChangeText={text => {
                formattedText = text.trim();
                if (formattedText === "") {
                  formattedText = Labels.SEARCH_DEFAULT;
                }
                this.setState({ searchText: formattedText });
              }}
              onSubmitEditing={this._performSearch}
            />
          </View>
        </View>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.mapView}
            initialRegion={{
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
              latitudeDelta: 0.0922 / 2,
              longitudeDelta: 0.0421 / 2
            }}
          >
            <MapView.Marker
              coordinate={this.state.location.coords}
              title="You are here!"
              description="Your location"
              image={require("../assets/images/user_location.png")}
            />

            <MapView.Marker
              coordinate={this.state.treeMarkers.tandon}
              title="Tandon School of Engineering"
              description="NYU Engineering Campus"
              image={require("../assets/images/simple_tree.png")}
            />

            <MapView.Marker
              coordinate={this.state.treeMarkers.brc}
              title="Brooklyn Roasting Company"
              description="Best coffee in Brooklyn"
              image={require("../assets/images/simple_tree.png")}
            />
          </MapView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "red"
  },
  mapContainer: {
    alignItems: "center",
    flex: 1
  },
  mapView: {
    flex: 1,
    ...StyleSheet.absoluteFillObject
  },
  searchContainer: {
    flex: 0.07,
    height: this.startHeaderHeight,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  searchBar: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    marginHorizontal: 20,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 1,
    marginTop: Platform.OS == "android" ? 30 : null
  },
  searchBarText: {
    flex: 1,
    fontWeight: "700",
    backgroundColor: "white"
  }
});
