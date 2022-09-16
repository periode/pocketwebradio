//-- ref
//-- https://reactnative.dev/docs/style
//-- https://reactnative.dev/docs/flexbox (layout) 
//-- https://reactnative.dev/docs/components-and-apis
//-- https://reactnative.dev/docs/navigation
//-- https://reactnative.dev/docs/network

import React, { useState, useRef, createContext } from 'react';
import { Audio } from 'expo-av';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

const Station = ({ name, src }): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  const [statusText, setStatusText] = useState('idle')

  const handlePlay = (_stream) => {
    tuneRadio(_stream)
    if (statusText === 'idle') {
      setStatusText('tuning in to ' + src)
    } else {
      setStatusText('idle')
    }
  }

  async function tuneRadio(_stream) {
    const soundStatus = await _stream.getStatusAsync()

    if (!soundStatus.isLoaded) {
      console.log(`loading ${src}...`);
      try {
        //-- add properties to play audio when in bg and locked
        await _stream.loadAsync({ uri: src }, { shouldPlay: true })
        console.log('loaded!')
      } catch (e) {
        console.log(`missed! ${e}`);
      }
    } else {
      console.log(`unloading ${src}...`);
      try {
        await _stream.unloadAsync()
        console.log(`unloaded!`);
      } catch (e) {
        console.log(`failed to unload! ${e}`);
      }
    }
  }

  return (
    <View style={styles.stationContainer}>
      <Tuner.Consumer>
        {stream => (
          <Text
          onPress={() => {handlePlay(stream)}}
            style={[
              styles.stationTitle,
              {
                fontFamily: 'Inter',
                color: isDarkMode ? 'ivory' : 'black'
              },
            ]}>
            {name}
          </Text>
        )}
      </Tuner.Consumer>
      <Text
        style={[
          styles.stationDescription,
          {
            color: isDarkMode ? 'ivory' : 'black',
            fontSize: 12,
            fontStyle: 'italic'
          },
        ]}>
        {statusText}
      </Text>
    </View>
  );
};

const Header = (): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.headerContainer}>
      <Text
        style={[
          styles.headerText,
          {
            color: isDarkMode ? 'ivory' : 'black'
          },
        ]}>
        webradios
      </Text>
    </View>
  );
};

const Tuner = createContext()
const App: () => Node = () => {

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'ivory',
    flex: 1,
  };

  const stream = new Audio.Sound()

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? 'black' : 'ivory',
          }}>
          <Header />
          <Tuner.Provider value={stream}>
            <Station name="france inter paris" src="http://icecast.radiofrance.fr/fip-hifi.aac">

            </Station>
            <Station name="kapital" src="https://radiokapitalpl.out.airtime.pro/radiokapitalpl_a">

            </Station>
            <Station name="mephisto" src="http://radiostream.radio.uni-leipzig.de:8000/mephisto976_livestream.mp3">

            </Station>
          </Tuner.Provider>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 6
  },
  stationContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  stationTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  stationDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
