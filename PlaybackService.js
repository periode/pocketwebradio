import TrackPlayer, { Event } from 'react-native-track-player';

const stations = require('./stations.json')
export async function PlaybackService() {
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemoteNext, () =>{
        console.log('service skip');
        TrackPlayer.add(stations[Math.floor(Math.random() * stations.length)])
        TrackPlayer.skipToNext()
    });
};