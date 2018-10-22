import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser, MapView } from 'expo';

export default class HomeScreen extends React.Component {

  
  static navigationOptions = {
    header: null,
  };
  
  render() {
    return (
      <View style={styles.container}>
          <View style={styles.mapContainer} >
            <MapView
              style={styles.mapView}
              initialRegion={{
                latitude: 40.7128,
                longitude: -74.0000,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
            </MapView>
          </View>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      return (
        <Text style={styles.developmentModeText}>
          Dev mode ON
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          Dev mode OFF
        </Text>
      );
    }
  }

  _handlePressMe = () => {
    WebBrowser.openBrowserAsync(
      'https://mmmarco.com'
    );
  };
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: 'red'
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  mapContainer: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    alignItems: 'center',
    flex: 1,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  mapView: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  }
});
