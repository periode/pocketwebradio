import React, { useState, useEffect } from 'react';
import TrackPlayer, { Capability } from 'react-native-track-player';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import Station from './components/Station';
import Tuner from './components/Tuner';
import Header from './components/Header'



let isDarkMode = 'dark'
const REMOTE_ENDPOINT = "https://static.enframed.net/stations.json"

const App = () => {
  const [log, setLog] = useState(String)
  const [stationsList, setStationsList] = useState(Array)
  const [currentLivestream, setCurrentLivestream] = useState(null)
  const [offset, setOffset] = useState(0)

  isDarkMode = useColorScheme() === 'dark';

  const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  useEffect(() => {
    setup()
    setStationsList(shuffle(require('./stations.json')))
    // fetchStations()
  }, [])

  async function setup() {
    try {
      // this method will only reject if player has not been setup yet
      await TrackPlayer.getCurrentTrack()
      console.log('already set up');
    } catch {
      console.log('setting up new...');
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        stoppingAppPausesPlayback: true,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Skip,
          Capability.SkipToNext,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Skip,
          Capability.SkipToNext
        ],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
        ],
      });
      setCurrentLivestream(-1)
    } finally {
      console.log('finished setup check');
    }
  }

  const fetchStations = () => {
    fetch(REMOTE_ENDPOINT)
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        else { 
          setStationsList(shuffle(require('./stations.json')))
        }
      })
      .then(data => {
        console.log(`fetched ${data.length} stations`)
        setStationsList(shuffle(data))
      })
      .catch(err => {
        setLog(err)
        console.log(`failed, loading the backup list`)
        setStationsList(shuffle(require('./stations.json')))
      })
      .finally(() => {
        console.log('finished loading')
      })
  }

  const handleScroll = (event) => {
    setOffset(event.nativeEvent.contentOffset.y + 300)
  }

  const updateLivestream = (_stream) => {
    setCurrentLivestream(_stream)
  }

  let stationElements = []
  for (let i = 0; i < stationsList.length; i++) {
    stationElements.push(<Station station={stationsList[i]} key={i+1} id={i+1} updateLivestream={updateLivestream} current={currentLivestream} tunerOffset={offset}></Station>)
  }

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.backgroundStyle} onScroll={handleScroll}>
        <View
          style={styles.foregroundStyle}>
          <Header />
          {stationElements}
        </View>
      </ScrollView>
      <Tuner updateLivestream={updateLivestream} isPlaying={currentLivestream !== -1}></Tuner>
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
  tuneOut: {
    position: 'absolute',
    right: 0,
    top: 300,
    textAlign: 'center',
    fontSize: 24,
    margin: 20,
    padding: 20,
    height: 80,
    borderColor: isDarkMode ? 'ivory' : 'black',
    borderWidth: 2,
    backgroundColor: 'black',
  },
  tuneOutText: {
    color: isDarkMode ? 'ivory' : 'black',
    textAlign: 'center',
    fontSize: 24,
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
