import React, { useState, useRef, useEffect } from 'react';
import TrackPlayer from 'react-native-track-player';
import {
    Animated,
    StyleSheet,
    Text,
    useColorScheme,
} from 'react-native';

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
        padding: 10,
        height: 55,
        borderColor: isDarkMode ? 'black' : 'ivory',
        borderWidth: 2,
        backgroundColor: isDarkMode ? 'ivory' : 'black',
    },
    tuneOutText: {
        color: isDarkMode ? 'black' : 'ivory',
        textAlign: 'center',
        fontSize: 20,
    },
    highlight: {
        fontWeight: '700',
    },
});

const tuneOutText = "//"
let isDarkMode = 'dark'
const Tuner = ({ updateLivestream, isPlaying }) => {
    isDarkMode = useColorScheme() === 'dark';
    const maxWidth = 175
    const [status, setStatus] = useState(tuneOutText)
    const sizeAnim = useRef(new Animated.Value(1)).current

    useEffect(() => {
        Animated.timing(
            sizeAnim,
            {
                toValue: isPlaying ? maxWidth : 1,
                duration: 500,
                useNativeDriver: false
            }
        ).start()
        setStatus(isPlaying ? tuneOutText : "")
    }, [sizeAnim, isPlaying])

    async function handleTuneOut() {
        await TrackPlayer.pause()
        Animated.timing(
            sizeAnim,
            {
                toValue: 1,
                duration: 500,
                useNativeDriver: false
            }
        ).start()
        await TrackPlayer.reset()
        updateLivestream(-1)
    }

    return (
        <Animated.View style={[styles.tuneOut, {
            width: sizeAnim
        }]}>
            <Text style={styles.tuneOutText} onPress={() => { handleTuneOut() }}>{status}</Text>
        </Animated.View>
    )
}

export default Tuner;