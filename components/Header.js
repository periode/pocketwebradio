import React from 'react';
import {
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

const styles = StyleSheet.create({
    foregroundStyle: {
      backgroundColor: isDarkMode ? 'black' : 'ivory',
    },
    backgroundStyle: {
      backgroundColor: isDarkMode ? 'black' : 'ivory',
      flex: 1,
    },
    headerContainer: {
      padding: 6,
      transform: [{ translateX: 200 }, { translateY: -50 }, { rotateZ: '-49deg' }]
    },
    headerText: {
      color: isDarkMode ? 'ivory' : 'black',
      fontSize: 11,
    }
})

let isDarkMode = 'dark'
const Header = () => {
    isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.headerContainer}>
            <Text
                style={styles.headerText}>
                webradios
            </Text>
            <Text
                style={styles.headerText}>
                webradios
            </Text>
            <Text
                style={styles.headerText}>
                webradios
            </Text>
        </View>
    );
};

export default Header;