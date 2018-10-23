import React from 'react';
import {
  StyleSheet,
  View,
  Keyboard
} from 'react-native';
import { WebBrowser, MapView } from 'expo';
import { SearchBar } from 'react-native-elements'

export default class HomeScreen extends React.Component {

  componentDidMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }
  
  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  static navigationOptions = {
    header: null,
  };

  state = {
    searchQuery: 'Type Here...',
  };
  
  render() {
    const { searchQuery } = this.state;
    return (
      <View style={styles.container}>
          <SearchBar
            lightTheme
            onChangeText={query => { this.setState({ searchQuery: query }); }}
            onClear={this._handleSearch}
            placeholder={searchQuery}
            style={styles.searchBar}
            />
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

  _handlePressMe = () => {
    WebBrowser.openBrowserAsync(
      'https://mmmarco.com'
    );
  };

  _handleSearch = () => {
    console.log('Typing in search...')
  };

  _handleSearchConfirm = () => {
    //  Keyboard.dismiss
    console.log('Search confirm...')
  };


  _keyboardDidShow () {
    console.log('Keyboard Shown');
  };

  _keyboardDidHide () {
    console.log('Keyboard Hidden ');
  };
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: 'red'
  },
  mapContainer: {
    alignItems: 'center',
    flex: 1,
  },
  mapView: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  searchBar: {
    flex: 1,
    position: 'absolute',
    marginTop: 30,
  }
});
