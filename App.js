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
      setStatusText('tuning in')
    } else {
      setStatusText('idle')
    }
  }

  // the switch behavior should be always setting the source to something new (unload, then load)
  // and there should be a button at the button to tune out
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
      console.log(`unloading first ${src}...`);
      try {
        await _stream.unloadAsync()
        console.log(`unloaded!`);
      } catch (e) {
        console.log(`failed to unload! ${e}`);
      }

      console.log(`loading ${src}...`);
      try {
        //-- add properties to play audio when in bg and locked
        await _stream.loadAsync({ uri: src }, { shouldPlay: true })
        console.log('loaded!')
      } catch (e) {
        console.log(`missed! ${e}`);
      }
    }
  }

  return (
    <View style={styles.stationContainer}>
      <Tuner.Consumer>
        {stream => (
          <Text
            onPress={() => { handlePlay(stream) }}
            style={[styles.stationTitle]}>
            {name}
          </Text>
        )}
      </Tuner.Consumer>
      <Text
        style={[styles.stationDescription]}>
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
        style={[styles.headerText]}>
        webradios
      </Text>
      <Text
        style={[styles.headerText]}>
        webradios
      </Text>
      <Text
        style={[styles.headerText]}>
        webradios
      </Text>
    </View>
  );
};

const stations = [
  {
    name: "fip",
    src: "http://icecast.radiofrance.fr/fip-hifi.aac"
  },
  {
    name: "kapital",
    src: "https://radiokapitalpl.out.airtime.pro/radiokapitalpl_a"
  },
  {
    name: "mephisto",
    src: "http://radiostream.radio.uni-leipzig.de:8000/mephisto976_livestream.mp3"
  }
]

let isDarkMode = 'dark'
const Tuner = createContext()
const App: () => Node = () => {

  isDarkMode = useColorScheme() === 'dark';

  const setupStream = async () => {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: false
    })
  }

  async function handleTuneOut(_stream) {
    const soundStatus = await _stream.getStatusAsync()
    console.log(`tuning out...`);

    if (soundStatus.isLoaded) {
      try {
        await stream.unloadAsync()
        console.log(`unloaded!`);
      } catch (e) {
        console.log(`failed to unload! ${e}`);
      }
    }
  }

  setupStream()

  const stream = new Audio.Sound()

  let stationElements = []
  for (let i = 0; i < stations.length; i++) {
    stationElements.push(<Station name={stations[i].name} src={stations[i].src} key={stations[i].name}></Station>)
  }

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Tuner.Provider value={stream}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.backgroundStyle}>
          <View
            style={styles.foregroundStyle}>
            <Header />

            {stationElements}

          </View>
        </ScrollView>

        <Tuner.Consumer>{_stream => (
          <View style={styles.tuneOut}>
            <Text style={styles.tuneOutText} onPress={() => { handleTuneOut(_stream) }}>tune out</Text>
          </View>
        )}
        </Tuner.Consumer>

      </Tuner.Provider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  foregroundStyle: {
    backgroundColor: isDarkMode ? 'black' : 'ivory',
  },
  backgroundStyle: {
    backgroundColor: isDarkMode ? 'black' : 'ivory',
    flex: 1,
  },
  headerContainer: {
    padding: 6,
    transform: [{ translateX: 200 }, { translateY: 120 }, { rotateZ: '-49deg' }]
  },
  headerText: {
    color: isDarkMode ? 'ivory' : 'black',
    fontSize: 11,
  },
  stationContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  stationTitle: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Inter',
    color: isDarkMode ? 'ivory' : 'black'
  },
  stationDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: isDarkMode ? 'ivory' : 'black',
    fontSize: 12,
    fontStyle: 'italic'
  },
  tuneOut: {
    textAlign: 'center',
    fontSize: 24,
    margin: 20,
    padding: 20,
    backgroundColor: isDarkMode ? 'ivory' : 'black',
  },
  tuneOutText: {
    color: isDarkMode ? 'black' : 'ivory',
    textAlign: 'center',
    fontSize: 24,
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
