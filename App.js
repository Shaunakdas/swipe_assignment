import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Deck from './components/Deck';

const cardData = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
];

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Deck
          data={cardData}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#fff'
  },
});
