import React from 'react';
import {
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';

const styles = StyleSheet.create({
    headerContainer: {
      height: 300,
      padding: 6,
      transform: [{ translateX: 200 }, { translateY: -50 }, { rotateZ: '-49deg' }]
    },
    headerText: {
      fontSize: 11,
    }
})

const Header = () => {
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