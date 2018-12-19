import React from "react";
import { StyleSheet, SafeAreaView, Text } from "react-native";
import { DangerZone } from "expo";
const { Lottie } = DangerZone;
import BenchLottieFile from "../assets/lottiefiles/bench";
import Layout from "../constants/Layout";

export default class InboxScreen extends React.Component {
  static navigationOptions = {
    title: "Inbox"
  };
  state = {
    animation: null
  };

  componentWillMount() {
    this._playAnimation();
  }

  _playAnimation = () => {
    if (!this.state.animation) {
      this._loadAnimationAsync();
    } else {
      this.animation.reset();
      this.animation.play();
    }
  };

  _loadAnimationAsync = async () => {
    /* Fetch Lotties json from the web
    let result = await fetch(
      "https://cdn.rawgit.com/airbnb/lottie-react-native/635163550b9689529bfffb77e489e4174516f1c0/example/animations/Watermelon.json"
    )
      .then(data => {
        return data.json();
      })
      .catch(error => {
        console.error(error);
      });
    */
    let result = BenchLottieFile;
    this.setState({ animation: result }, this._playAnimation);
  };

  render() {
    return (
      <SafeAreaView style={styles.animationContainer}>
        {this.state.animation && (
          <Lottie
            ref={animation => {
              this.animation = animation;
            }}
            style={{
              width: Layout.window.width,
              height: Layout.window.height,
              backgroundColor: "#fff"
            }}
            source={this.state.animation}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#ff0"
  },
  animationContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  buttonContainer: {
    paddingTop: 20
  }
});
