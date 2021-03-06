import React, { Component } from 'react';
import { 
  TouchableOpacity, View, Animated, PanResponder,
  Dimensions, LayoutAnimation, UIManager, Text
} from 'react-native';
import { Card, Button } from 'react-native-elements';

const WINDOW_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = WINDOW_WIDTH/4;
const SWIPE_OUT_DURATION = 250;

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
          const x = -WINDOW_WIDTH;
          this.forceSwipe(x);
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          const x = WINDOW_WIDTH;
          this.forceSwipe(x);
        } else {
          this.resetPosition();
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

  //Force Swipe card to the end of window (left or right)
  forceSwipe(finalX) {
    Animated.timing(this.state.position, {
      toValue: { finalX, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeFinish());
  }

  //Modify State variables index and position after card is swiped
  onSwipeFinish() {
    //Resetting position to track position of next card
    this.state.position.setValue({ x: 0, y: 0 });
    //Updating state.index after a card is swiped out of window
    this.setState({ index: this.state.index + 1 });
  }

  //Change rotation angle based on distance from starting position
  getTiltStyle() {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-WINDOW_WIDTH, 0, WINDOW_WIDTH],
      outputRange: ['-80deg', '0deg', '80deg']
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  }

  //If user doesn't swipe card to the end of window on either side
  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

	renderUpperCard(item) {
    return (
      <Card
        image={{ }}
        key={item.id}
        title={`Card #${item.id}`}
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
  
  renderLastCard() {
    return (
      <Card title="All Done!">
        <Text>
          There's no more content here!
        </Text>
        <TouchableOpacity
          style={styles.button} >
           <Text>Get More</Text>
        </TouchableOpacity>
      </Card>
    );
  }

  renderCards() {
  	// If all the cards are already swiped, index will overflow than data array length
    if (this.state.index >= this.props.data.length) {
      return this.renderLastCard();
    }

  	return this.props.data.map((item, i) => {
  		if (i < this.state.index) { return null; }

  		// If current card index is same as state index, this is the uppermost card visible now
      if (i === this.state.index) {
	    	return (
	          //Topmost card
	          <Animated.View
	            key={item.id}
	            style={[this.getTiltStyle(), styles.cardStyle, { zIndex: 99 }]}
	            {...this.state.panResponder.panHandlers}
	          >
	            {this.renderUpperCard(item)}
	          </Animated.View>
	        );
	    }

	    return (
        //Cards behind front card
        <Animated.View
          key={item.id}
          //For hidden cards, give a stacked deck appearance
          style={[styles.cardStyle, { top: 10 * (i - this.state.index), zIndex: 5 }]}
        >
          {this.renderUpperCard(item)}
        </Animated.View>
      );
    }).reverse();
  }
	render() {
    return (
      <View>
        {this.renderCards()}
      </View>
    );
  }
}

const styles = {
	cardStyle: {
    position: 'absolute',
    width: WINDOW_WIDTH
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10
  },
};

export default Deck;