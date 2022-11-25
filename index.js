/**
 * @format
 */

import {AppRegistry} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import { PlaybackService } from './PlaybackService'
import {name as appName} from './app.json';
import { LogBox } from "react-native"

LogBox.ignoreAllLogs(true)

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => PlaybackService)