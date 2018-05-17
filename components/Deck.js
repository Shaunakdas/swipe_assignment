import React, { Component } from 'react';
import { 
  TouchableOpacity, View, Animated, PanResponder,
  Dimensions, LayoutAnimation, UIManager, Text
} from 'react-native';
import { Card, Button } from 'react-native-elements';

const WINDOW_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = WINDOW_WIDTH/4;

class Deck extends Component {

	constructor(props) {
    super(props);
    
    //Animated.ValueXY is hooked with given vector-type component to handle aniation
    const position = new Animated.ValueXY();
    
    //PandResponder object is needed to reconcile several touches into a single gesture
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      
      //The accumulated gesture distance since becoming responder is gestureState.d{x,y}
      onPanResponderMove: (event, gesture) => {
        //binding with Animated.ValueXY to track position change
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      
      //After user releases all the touches
      onPanResponderRelease: (event, gesture) => {
        //Track distance from original location and compare with threshold values
        if (gesture.dx > SWIPE_THRESHOLD) {
          
        }
      }
    });
    
    //Storing Animated Value and PanResponder so that cards can be moved accordingly
    this.state = { panResponder, position, index: 0 };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ index: 0 });
    }
  }

  componentWillUpdate() {
    //[Android]Automatically animates views to their new positions when the next layout happens.
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

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