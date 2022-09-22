import React, { useState, useEffect } from 'react';
import TrackPlayer from 'react-native-track-player';
import {
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

const styles = StyleSheet.create({
    stationContainer: {
        display: 'flex',
        flex: 1,
        height: 200,
        width: 200,
        marginTop: 150,
        marginBottom: 200,
        borderRightColor: 'ivory',
        borderRightWidth: 2,

        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    stationTitle: {
        fontSize: 24,
        fontWeight: '600',
        fontFamily: 'Inter',
        color: isDarkMode ? 'black' : 'ivory'
    },
    streamIdle: {
        opacity: 0.75,
    },
    streamPlaying: {
        opacity: 1,
    },
    stationDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        fontSize: 12,
        fontStyle: 'italic'
    },
    highlight: {
        fontWeight: '700',
    },
});

const stations = require('../stations.json')

let isDarkMode = 'dark'
function Station({ name, url, id, updateLivestream, current, tunerOffset }) {
    isDarkMode = useColorScheme() === 'dark';
    const [self, setSelf] = useState(null)
    const track = {
        id: id,
        url: url,
        title: name,
        artist: name
    }

    useEffect(() => {
        if (!self) return

        if (tunerOffset > self && tunerOffset < self + 120) {
            handlePlay()
        }
    }, [tunerOffset])

    const handlePlay = () => {
        tuneIn()
    }

    const handleLayout = (event) => {
        setSelf(event.nativeEvent.layout.y)
    }

    async function tuneIn() {
        // shuffle stations here
        const r = Math.floor(Math.random() * stations.length -1)
        const shadow = {
            id: id,
            url: stations[r].url,
            title: stations[r].name,
            artist: stations[r].name,
        }

        // rather get state: if it's buffering, don't load the new track
        const current = await TrackPlayer.getQueue()
        if (current.length > 0 && (current[0].id == track.id || current[0].url == track.url)) return

        console.log(`switching to ${track.title} -> ${stations[r].name}`);
        updateLivestream(id)
        await TrackPlayer.reset()
        await TrackPlayer.add(track, 0)
        await TrackPlayer.add(shadow, 1)
        await TrackPlayer.play()
    }

    return (
        <View style={styles.stationContainer}
            onLayout={handleLayout}>
            <Text
                onPress={() => { handlePlay }}
                style={[styles.stationTitle, current == id ? styles.streamPlaying : styles.streamIdle]}>
                {name}
            </Text>
            <Text
                style={[styles.stationDescription]}>
                {current == id ? 'tuned in' : 'idle'}
            </Text>
        </View>
    );
};


export default Station;