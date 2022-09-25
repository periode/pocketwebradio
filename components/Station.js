import React, { useState, useEffect } from 'react';
import TrackPlayer, { State } from 'react-native-track-player';
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

const stations = [...require('../stations.json')]

let isDarkMode = 'dark'
function Station({ station, id, updateLivestream, current, tunerOffset }) {
    isDarkMode = useColorScheme() === 'dark';
    const [self, setSelf] = useState(null)

    useEffect(() => {
        if (!self) return

        if (tunerOffset > self - 50 && tunerOffset < self + 140 && current != -1)
            tuneIn()

    }, [tunerOffset, current])

    const shuffle = (array) => {
        let currentIndex = array.length, randomIndex;

        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }


    const handleLayout = (event) => {
        setSelf(event.nativeEvent.layout.y)
    }

    async function tuneIn() {
        const shadow = shuffle(stations)

        const q = await TrackPlayer.getQueue()
        const state = await TrackPlayer.getState()
        if ((state === State.Playing && q[0].url === station.url) || state === State.Buffering) return

        // console.log(`switching to ${station.title} -> ${stations[0].title}`);
        updateLivestream(id)
        await TrackPlayer.reset()
        await TrackPlayer.add(shadow)
        await TrackPlayer.add(station, 0)
        await TrackPlayer.play()
    }

    return (
        <View style={styles.stationContainer}
            onLayout={handleLayout}>
            <Text
                onPress={() => { tuneIn }}
                style={[styles.stationTitle, current == id ? styles.streamPlaying : styles.streamIdle]}>
                {station.title}
            </Text>
            <Text
                style={[styles.stationDescription]}>
                {current == id ? 'tuned in' : 'idle'}
            </Text>
        </View>
    );
};


export default Station;