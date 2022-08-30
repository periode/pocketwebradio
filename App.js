//-- ref
//-- https://reactnative.dev/docs/style
//-- https://reactnative.dev/docs/flexbox (layout) 
//-- https://reactnative.dev/docs/components-and-apis
//-- https://reactnative.dev/docs/navigation
//-- https://reactnative.dev/docs/network

import React, { useState, useRef } from 'react';
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
  const [isLoaded, setLoaded] = useState(false)
  const {sound} = useRef()

  const handlePress = () => {
    tuneRadio(src)
    if (statusText === 'idle') {
      setStatusText('tuning in to ' + src)
    } else {
      setStatusText('idle')
    }
  }

  async function tuneRadio() {
    if (!isLoaded) {
      console.log(`loading ${src}...`);
      try {
        const { sound } = await Audio.Sound.createAsync({ uri: src }, { shouldPlay: true });
        this.sound = sound
        setLoaded(true)
        console.log('loaded!')
      } catch (e) {
        console.log(`missed! ${e}`);
      }
    } else {
      console.log(`unloading ${src}...`);
      try {
        await this.sound.unloadAsync()
        setLoaded(false)
        console.log(`unloaded!`);
      } catch (e) {
        console.log(`failed to unload! ${e}`);
      }
    }
  }

  return (
    <View style={styles.stationContainer}>
      <Text
        onPress={handlePress}
        style={[
          styles.stationTitle,
          {
            fontFamily: 'Inter',
            color: isDarkMode ? 'black' : 'ivory'
          },
        ]}>
        {name}
      </Text>
      <Text
        style={[
          styles.stationDescription,
          {
            color: isDarkMode ? 'black' : 'ivory',
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
            color: isDarkMode ? 'black' : 'ivory'
          },
        ]}>
        webradios
      </Text>
    </View>
  );
};

const App: () => Node = () => {

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'ivory' : 'black',
    flex: 1,
  };


  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? 'ivory' : 'black',
          }}>
          <Header />
          <Station name="france inter paris" src="http://icecast.radiofrance.fr/fip-hifi.aac">

          </Station>
          <Station name="kapital" src="https://radiokapitalpl.out.airtime.pro/radiokapitalpl_a">

          </Station>
          <Station name="mephisto" src="http://radiostream.radio.uni-leipzig.de:8000/mephisto976_livestream.mp3">

          </Station>
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
