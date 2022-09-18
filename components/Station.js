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

let isDarkMode = 'dark'
function Station({ name, src, id, updateLivestream, current, tunerOffset }) {
    isDarkMode = useColorScheme() === 'dark';
    const [self, setSelf] = useState(null)
    const track = {
        id: id,
        url: src,
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
        const current = await TrackPlayer.getQueue()
        if (current.length > 0 && current[0].id == track.id) return

        console.log(`switching to ${track.url}`);
        updateLivestream(id)
        await TrackPlayer.reset()
        await TrackPlayer.add(track)
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