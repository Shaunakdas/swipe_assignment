import React, { Component } from 'react';
import { 
  TouchableOpacity, View, Animated, PanResponder,
  Dimensions, LayoutAnimation, UIManager, Text
} from 'react-native';
import { Card, Button } from 'react-native-elements';


class Deck extends Component {

	renderUpperCard() {
    return (
      <Card
        image={{ }}
        title={`Card #1`}
      >
        <Text>
          I can customize the Card further.
        </Text>
        <TouchableOpacity
          style={styles.button} >
           <Text>View Now!</Text>
        </TouchableOpacity>
      </Card>
    );
  }

	render() {
    return (
      <View>
        {this.renderUpperCard()}
      </View>
    );
  }
}

const styles = {
  button: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10
  },
};

export default Deck;