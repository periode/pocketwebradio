import React, { useState, useRef, createContext, useEffect } from 'react';
import TrackPlayer, {Capability} from 'react-native-track-player';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

const Station = ({ name, src, id, updateLivestream, current }) => {
  const track = {
    url: src,
    title: name,
    artist: name
  }

  const handlePlay = () => {
    tuneIn()
    updateLivestream(id)
  }

  // the switch behavior should be always setting the source to something new (unload, then load)
  // and there should be a button at the button to tune out
  async function tuneIn() {
    console.log(`switching to ${track.url}`);
    await TrackPlayer.reset()
    await TrackPlayer.add(track)
    await TrackPlayer.play()
  }

  return (
    <View style={styles.stationContainer}>
      <Tuner.Consumer>
        {stream => (
          <Text
            onPress={() => { handlePlay(stream) }}
            style={[styles.stationTitle, current == id ? styles.streamPlaying : styles.streamIdle]}>
            {name}
          </Text>
        )}
      </Tuner.Consumer>
      <Text
        style={[styles.stationDescription]}>
        {current == id ? 'tuned in' : 'idle'}
      </Text>
    </View>
  );
};

const Header = () => {
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

const TuneButton = ({updateLivestream}) => {
  const [status, setStatus] = useState("tune out")
  const sizeAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.timing(
      sizeAnim,
      {
        toValue: 350,
        duration: 1000,
        useNativeDriver: false
      }
    ).start()
  }, [sizeAnim])

  async function handleTuneOut() {
    await TrackPlayer.pause()
    // Animated.timing(
    //   sizeAnim,
    //   {
    //     toValue: 10,
    //     duration: 1000,
    //     useNativeDriver: false
    //   }
    // ).start()
    updateLivestream(-1)
  }

  return(
    <Animated.View style={[styles.tuneOut,{
      width: sizeAnim
    }]}>
    <Text style={styles.tuneOutText} onPress={() => { handleTuneOut() }}>x</Text>
  </Animated.View>
  )
}

let isDarkMode = 'dark'
const Tuner = createContext()
const REMOTE_ENDPOINT = "https://static.enframed.net/stations.json"
const App = () => {
  const [log, setLog] = useState(String)
  const [stationsList, setStationsList] = useState(Array)
  const [currentLivestream, setCurrentLivestram] = useState(-1)

  useEffect(() => {
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
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,
          ],
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SeekTo,
          ],
        });
        setCurrentLivestram(-1)
      } finally {
        console.log('finished setup check');
      }
    }

    setup()

    fetch(REMOTE_ENDPOINT)
    .then(res => {
      if(res.ok) return res.json()
      else setLog("Error fetching remote information")
    })
    .then(data => {
      setLog(`fetched ${data.length} stations`)
      setStationsList(data)
    })
    .catch(err => {
      setLog(err)
      console.log(`failed, loading the backup list`)
      setStationsList(require('./stations.json'))
    })
    .finally(() => {
      console.log('finished loading')
    })
  }, [])

  isDarkMode = useColorScheme() === 'dark';

  const updateLivestream = (_stream) => {
    console.log(`updating ${_stream}`)
    setCurrentLivestram(_stream)
  }

  let stationElements = []
  for (let i = 0; i < stationsList.length; i++) {
    stationElements.push(<Station name={stationsList[i].name} src={stationsList[i].src} key={stationsList[i].name} id={i} updateLivestream={updateLivestream} current={currentLivestream}></Station>)
  }

  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.backgroundStyle}>
        <View
          style={styles.foregroundStyle}>
          <Header />
          {stationElements}
        </View>
      </ScrollView>
    <TuneButton updateLivestream={updateLivestream}></TuneButton>
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
  },
  streamIdle: {
    opacity: 0.7
  },
  streamPlaying: {
    color: isDarkMode ? 'ivory' : 'black'
  },
  stationDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
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
