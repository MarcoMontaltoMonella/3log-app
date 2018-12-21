import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  Platform,
  StatusBar,
  Image
} from "react-native";
import { MapView, Location, Permissions, AppLoading } from "expo";
import Icon from "react-native-vector-icons/Ionicons";
import Search from "../constants/Search";
import APIs from "../constants/APIs";
import Layout from "../constants/Layout";

export default class MapScreen extends React.Component {
  state = {
    treeMarkers: [],
    isReady: false,
    searchText: Search.SEARCH_TEXT_DEFAULT,
    region: null,
    treeIcons: []
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
      require("../assets/images/user_location.png"),
      require("../assets/images/tree-1.png"),
      require("../assets/images/tree-2.png"),
      require("../assets/images/tree-3.png"),
      require("../assets/images/tree-4.png"),
      require("../assets/images/tree-5.png"),
      require("../assets/images/tree-6.png"),
      require("../assets/images/tree-7.png"),
      require("../assets/images/tree-8.png"),
      require("../assets/images/tree-9.png")
    ]);
    const tree1 = require("../assets/images/tree-1.png");
    const tree2 = require("../assets/images/tree-2.png");
    const tree3 = require("../assets/images/tree-3.png");
    const tree4 = require("../assets/images/tree-4.png");
    const tree5 = require("../assets/images/tree-5.png");
    const tree6 = require("../assets/images/tree-6.png");
    const tree7 = require("../assets/images/tree-7.png");
    const tree8 = require("../assets/images/tree-8.png");
    const tree9 = require("../assets/images/tree-9.png");
    this.setState({
      treeIcons: [tree1, tree2, tree3, tree4, tree5, tree6, tree7, tree8, tree9]
    });
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
    if (this.state.searchText === Search.SEARCH_TEXT_DEFAULT) {
      return;
    }
    let searchLocation = (await Location.geocodeAsync(
      this.state.searchText
    ))[0];
    if (!searchLocation) {
      alert("Location not found!");
      return;
    }
    reversedGeoLocation = (await Location.reverseGeocodeAsync(
      searchLocation
    ))[0];
    console.log(reversedGeoLocation);
    updatedSearchLabel = `${this.state.searchText}, ${
      reversedGeoLocation.region ? reversedGeoLocation.region : null
    }, ${
      reversedGeoLocation.isoCountryCode
        ? reversedGeoLocation.isoCountryCode
        : null
    }`;
    this._searchInputComponent.setNativeProps({ text: updatedSearchLabel });

    searchLocation = {
      ...searchLocation,
      latitudeDelta: Search.LATITUDE_DELTA_DEFAULT,
      longitudeDelta: Search.LONGITUDE_DELTA_DEFAULT
    };

    this.setState({ region: searchLocation });

    // Get trees
    console.log(
      `GET Request: ${APIs.treesEndpoint}/near-me?latitude=${
        searchLocation.latitude
      }&longitude=${searchLocation.longitude}&radius=1.0`
    );

    fetch(
      `${APIs.treesEndpoint}/near-me?latitude=${
        searchLocation.latitude
      }&longitude=${searchLocation.longitude}&radius=3.0&limit=100`
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.trees) {
          let i = 1;
          let trees = responseJson.trees.map(tree => {
            i = (i % 9) + 1;
            let treeIcon = this.state.treeIcons[0];
            let coord = {
              latitude: tree.location.lat,
              longitude: tree.location.lon
            };
            let spc_common = tree.spc_common;
            let spc_latin = tree.spc_latin;
            return spc_common ? (
              <MapView.Marker
                key={`${spc_common} - ${tree.tree_id}`}
                coordinate={coord}
                title={`${spc_common} - ${tree.tree_id}`}
                description={spc_latin}
              >
                <Image source={treeIcon} style={{ width: 50, height: 50 }} />
              </MapView.Marker>
            ) : null;
          });
          // console.log(trees);
          this.setState({ treeMarkers: trees });
        } else {
          alert("No tree found!");
        }
      });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== "granted") {
      console.error("Location permission not granted!");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    // Extra mockup locations
    // let bwm = (await Location.geocodeAsync("Brooklyn War Memorial"))[0];
    // let brc = (await Location.geocodeAsync("25 Jay St."))[0];

    this.setState({
      location,
      treeMarkers: []
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
                  formattedText = Search.SEARCH_TEXT_DEFAULT;
                }
                this.setState({ searchText: formattedText });
              }}
              onSubmitEditing={this._performSearch}
              clearButtonMode="always"
              ref={component => (this._searchInputComponent = component)}
            />
          </View>
        </View>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.mapView}
            region={this.state.region}
            initialRegion={{
              latitude: this.state.location.coords.latitude,
              longitude: this.state.location.coords.longitude,
              latitudeDelta: Search.LATITUDE_DELTA_DEFAULT,
              longitudeDelta: Search.LONGITUDE_DELTA_DEFAULT
            }}
            onRegionChange={region => {
              //console.log(region);
            }}
          >
            <MapView.Marker
              coordinate={this.state.location.coords}
              title="You are here!"
              description="Your location"
              image={require("../assets/images/user_location.png")}
            />
            {this.state.treeMarkers}
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
    ...StyleSheet.absoluteFillObject,
    zIndex: -1
  },
  searchContainer: {
    flex: 0.07,
    height: this.startHeaderHeight,
    backgroundColor: "transparent",
    position: "absolute",
    marginTop: 40,
    width: Layout.window.width,
    zIndex: 1
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
