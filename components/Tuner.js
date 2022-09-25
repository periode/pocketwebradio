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
        height: 75,
        borderColor: isDarkMode ? 'black' : 'ivory',
        borderWidth: 2,
        backgroundColor: isDarkMode ? 'ivory' : 'black',
    },
    tuneOutText: {
        color: isDarkMode ? 'black' : 'ivory',
        textAlign: 'center',
        fontSize: 20,
        lineHeight: 60,
        height: '100%'
    },
    highlight: {
        fontWeight: '700',
    },
});

const tuneOutText = ">"
const tuneInText = "<"
let isDarkMode = 'dark'
const Tuner = ({ updateLivestream }) => {
    isDarkMode = useColorScheme() === 'dark';
    const maxWidth = 175
    const minWidth = 100
    const [status, setStatus] = useState(tuneOutText)
    const [isTunedIn, setTunedIn] = useState(false)
    const sizeAnim = useRef(new Animated.Value(minWidth)).current

    useEffect(() => {
        Animated.timing(
            sizeAnim,
            {
                toValue: isTunedIn ? maxWidth : minWidth,
                duration: 500,
                useNativeDriver: false
            }
        ).start()
        setStatus(isTunedIn ? tuneOutText : tuneInText)
        updateLivestream(isTunedIn ? 0 : -1)
    }, [sizeAnim, isTunedIn])

    async function handleTuningIn() {
        if(isTunedIn){
            await TrackPlayer.pause()
            await TrackPlayer.reset()
        }
        setTunedIn(!isTunedIn)
        updateLivestream(-1)
    }

    return (
        <Animated.View style={[styles.tuneOut, {
            width: sizeAnim
        }]}>
            <Text style={styles.tuneOutText} onPress={() => { handleTuningIn() }}>{status}</Text>
        </Animated.View>
    )
}

export default Tuner;