import React, { useState, useRef, useEffect } from 'react';
import TrackPlayer from 'react-native-track-player';
import {
    Animated,
    TouchableHighlight,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const styles = StyleSheet.create({
    tunerContainer: {
        position: 'absolute',
        right: 0,
        top: 300,
        paddingTop: 40,
        paddingBottom: 40,
    },
    tuneOut: {
        textAlign: 'center',
        fontSize: 24,
        margin: 20,
        height: 15,
        borderColor: 'ivory',
        borderWidth: 1,
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
    const maxWidth = 170
    const minWidth = 75
    const [status, setStatus] = useState(tuneOutText)
    const [isTunedIn, setTunedIn] = useState(false)
    const sizeAnim = useRef(new Animated.Value(minWidth)).current

    async function stop() {
        try {
            await TrackPlayer.pause()
            await TrackPlayer.reset()
        } catch {
            console.log('not stopping, since not setup');
        }
    }

    useEffect(() => {
        if (current === -1) {
            setTunedIn(false)
            stop()
        } else if (current === 0) {
            stop()
        }
    }, [current])

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

    function handleTuningIn() {
        setTunedIn(!isTunedIn)
    }

    return (
        <TouchableHighlight style={styles.tunerContainer} onPress={() => { handleTuningIn() }}>
            <Animated.View style={[styles.tuneOut,
            current > 0 ? styles.playing : styles.idle,
            {
                width: sizeAnim
            }]}>
                <Text style={styles.tuneOutText}>{status}</Text>
            </Animated.View>
        </TouchableHighlight>
    )
}

export default Tuner;