import React, { useState, useEffect } from 'react';
import TrackPlayer from 'react-native-track-player';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {shuffle} from '../utils'

const styles = StyleSheet.create({
    stationContainer: {
        display: 'flex',
        flex: 1,
        height: 200,
        width: 200,
        marginTop: 150,
        marginBottom: 200,
        borderRightColor: 'ivory',
        borderRightWidth: 1,

        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    stationTitle: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'Inter',
        color: 'white',
    },
    idle: {
        opacity: 0.5,
    },
    playing: {
        opacity: 1,
    },
    stationDescription: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '400',
        fontSize: 12,
        fontStyle: 'italic'
    },
    highlight: {
        fontWeight: '700',
    },
    compressedView: {
        height: 30,
        width: 200,
        marginTop: 12,
        marginBottom: 10,
    },
    expandedView: {
        height: 200,
        width: 200,
        marginTop: 150,
        marginBottom: 200,
    }
});

//-- make a copy of the array
const stations = [...require('../stations.json')]

function Station({ station, id, current, updateOffset, bandwidth }) {
    const [tunedState, setTunedState] = useState('')

    useEffect(() => {
        if(current === id)
            tuneIn()
        else
            setTunedState('idle')
    }, [current])

    const handleLayout = (e) => {
        updateOffset({id: id, position: e.nativeEvent.layout.y})
    }

    async function tuneIn() {
        console.log(`tuning in to: ${station.title}`);
        const shadow = shuffle(stations)

        await TrackPlayer.reset()
        await TrackPlayer.add(shadow)
        await TrackPlayer.add(station, 0)
        await TrackPlayer.skip(0)
        await TrackPlayer.play()
        setTunedState('tuned in')
    }

    return (
        <View style={[styles.stationContainer, current == id ? styles.playing : styles.idle, bandwidth === "narrow" ? styles.compressedView : styles.expandedView]}
            onLayout={handleLayout}>
            <Text
                onPress={() => { tuneIn }}
                style={styles.stationTitle}>
                {station.title}
            </Text>
            <Text
                style={[styles.stationDescription]}>
                { tunedState }
            </Text>
        </View>
    );
};


export default Station;