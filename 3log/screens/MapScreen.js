import React from "react";
import { StyleSheet, View } from "react-native";
import { MapView, Location, Permissions, AppLoading } from "expo";

export default class MapScreen extends React.Component {
  state = {
    treeMarkers: [],
    isReady: false
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

  _setupAsync = async () => {
    await Promise.all([this._loadAssetsAsync()]);
    this.setState({ isReady: true });
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
      <View style={styles.container}>
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
      </View>
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
  }
});
