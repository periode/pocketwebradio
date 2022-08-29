//-- ref
//-- https://reactnative.dev/docs/style
//-- https://reactnative.dev/docs/flexbox (layout) 
//-- https://reactnative.dev/docs/components-and-apis
//-- https://reactnative.dev/docs/navigation
//-- https://reactnative.dev/docs/network

import React, { useState } from 'react';
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

const Station = ({ name, uri }): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  const [statusText, setStatusText] = useState('idle')
  const handlePress = () => {
    if (statusText === 'idle'){
      setStatusText('tuning in to ' + uri)
      playRadio(uri)
    }else{
      setStatusText('idle')
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

let sound = null
async function playRadio(_uri) {
  if(sound == null){
    console.log('loading', _uri);
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      //-- should be using loadAsync here, cause looks like the sound is not playing back
      sound = await Audio.Sound.createAsync(
        { uri: _uri },
        { shouldPlay: true }
      );
      await sound.playAsync()
      console.log('loaded')
    } catch (e){
      console.log('missed', e);
    }
  }else{
    console.log('unloading');
    try {
      await sound.unloadAsync()
    }catch (e){
      console.log('failed to unload', e);
    }
    
    sound = null
  }
}

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
          <Station name="france inter paris" uri="http://icecast.radiofrance.fr/fip-hifi.aac">

          </Station>
          <Station name="kapital" uri="https://radiokapitalpl.out.airtime.pro/radiokapitalpl_a">

          </Station>
          <Station name="mephisto" uri="http://radiostream.radio.uni-leipzig.de:8000/mephisto976_livestream.mp3">

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
