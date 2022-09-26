import React, { useState, useRef, useEffect } from 'react';
import TrackPlayer from 'react-native-track-player';
import {
    Animated,
    StyleSheet,
    Text,
} from 'react-native';

const styles = StyleSheet.create({
    tuneOut: {
        position: 'absolute',
        right: 0,
        top: 300,
        textAlign: 'center',
        fontSize: 24,
        margin: 20,
        height: 75,
        borderColor: 'ivory',
        borderWidth: 2,
    },
    tuneOutText: {
        textAlign: 'center',
        fontSize: 20,
        lineHeight: 60,
        height: '100%'
    },
    idle: {
        opacity: 0.75,
    },
    playing: {
        opacity: 1,
    },
});

const tuneOutText = ""
const tuneInText = "<"

const Tuner = ({ updateLivestream, current }) => {
    const maxWidth = 175
    const minWidth = 100
    const [status, setStatus] = useState(tuneOutText)
    const [isTunedIn, setTunedIn] = useState(false)
    const sizeAnim = useRef(new Animated.Value(minWidth)).current

    useEffect(() => {
        if (current === -1)
            setTunedIn(false)
        else if (current === 0){
            async function stop() {
                await TrackPlayer.pause()
                await TrackPlayer.reset()
            }
            stop()
        }
    }, [current])

    useEffect(() => {
        if (!isTunedIn) {
            async function stop() {
                await TrackPlayer.pause()
                await TrackPlayer.reset()
            }
            stop()
        }

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

    function handleTuningIn() {
        setTunedIn(!isTunedIn)
    }

    return (
        <Animated.View style={[styles.tuneOut, 
            current > 0 ? styles.playing : styles.idle,
            {
            width: sizeAnim
        }]}>
            <Text style={styles.tuneOutText} onPress={() => { handleTuningIn() }}>{status}</Text>
        </Animated.View>
    )
}

export default Tuner;