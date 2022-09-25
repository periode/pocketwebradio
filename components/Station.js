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

const stations = [...require('../stations.json')]
let isDarkMode = 'dark'

function Station({ station, id, current, updateOffset }) {
    isDarkMode = useColorScheme() === 'dark';

    useEffect(() => {
        if(current === id)
            tuneIn()

    }, [current])

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
        updateOffset({id: id, position: event.nativeEvent.layout.y})
    }

    async function tuneIn() {
        console.log(`playing: ${station.title}`);
        const shadow = shuffle(stations)

        await TrackPlayer.reset()
        await TrackPlayer.add(shadow)
        await TrackPlayer.add(station, 0)
        await TrackPlayer.skip(0)
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