import React, { useState, useEffect, useRef } from 'react';
import TrackPlayer, { Capability, State } from 'react-native-track-player';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import Station from './components/Station';
import Tuner from './components/Tuner';
import Header from './components/Header'

import { shuffle } from './utils'

//-- currentLivestream
//
// null - player not setup
// -1 - player setup, tuned out
// 0 - player setup, tuned in
// [1+] - player setup, playing

let isDarkMode = 'dark'
const REMOTE_ENDPOINT = "https://static.enframed.net/stations.json"
const stations = [...require('./stations.json')]

const App = () => {
  const [log, setLog] = useState(String)
  const [stationsList, setStationsList] = useState(Array)
  const [currentLivestream, setCurrentLivestream] = useState(null)
  const [currentOffset, setCurrentOffset] = useState(null)
  const [offsets, setOffsets] = useState([])
  const scrollViewRef = useRef(null)
  isDarkMode = useColorScheme() === 'dark';


  useEffect(() => {
    setup()
    setStationsList(shuffle(stations))
    fetchStations()
  }, [])

  async function setup() {
    try {
      // this method will only reject if player has not been setup yet
      await TrackPlayer.getCurrentTrack()
    } catch {
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
      if(scrollViewRef.current)
        scrollViewRef.current.scrollToEnd()
    }
  }

  const fetchStations = () => {
    fetch(`${REMOTE_ENDPOINT}?q=${Math.floor(Math.random() * 2046)}`)
      .then(res => {
        if (res.ok)
          return res.json()
        else
          setStationsList(shuffle(stations))
      })
      .then(data => {
        console.log(`fetched ${data.length} stations`)
        setStationsList(shuffle(data))
      })
      .catch(err => {
        setLog(err)
        console.log(`failed, loading the backup list`)
        setStationsList(shuffle(stations))
      })
  }

  useEffect(() => {
    if(currentLivestream >= 0)
      tuneIn()
  }, [currentOffset, currentLivestream])

  //-- tuneIn checks which stream to set based on the current tuner position on the screen
  const tuneIn = async() => {
    if (currentLivestream == -1) return

    const state = await TrackPlayer.getState()
    if (state === State.Buffering) return

    let stream = 0
    for (let i = 0; i < offsets.length; i++) {
      const pos = offsets[i].position;
      if (currentOffset > pos - 50 && currentOffset < pos + 140)
        stream = offsets[i].id
    }

    setCurrentLivestream(stream)
  }

  const handleScroll = async (event) => {
    setCurrentOffset(event.nativeEvent.contentOffset.y + 300)
  }

  //-- when given a value of -1, used for tuning out
  const updateLivestream = (_stream) => {
    setCurrentLivestream(_stream)
  }

  //-- on first layout, store the offset of each station
  const handleStationOffset = (_offset) => {
    setOffsets([
      ...offsets,
      _offset
    ])
  }

  let stationElements = []
  for (let i = 0; i < stationsList.length; i++) {
    stationElements.push(<Station station={stationsList[i]} key={i + 1} id={i + 1} current={currentLivestream} updateOffset={handleStationOffset}></Station>)
  }

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        ref={scrollViewRef}
        style={styles.backgroundStyle}
        onScroll={handleScroll}>
        <View style={[styles.foregroundStyle, styles.stationsContainer]}>
          <Header />
          {stationElements}
        </View>
      </ScrollView>
      <Tuner updateLivestream={updateLivestream} current={currentLivestream} isPlaying={currentLivestream !== -1}></Tuner>
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
  stationsContainer: {
    paddingBottom: 600,
  }
});

export default App;
