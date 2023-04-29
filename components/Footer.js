import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

const styles = StyleSheet.create({
    headerContainer: {
      height: 50,
      padding: 6,
      position: "absolute",
      left: 175,
      transform: [{ rotateZ: '-49deg' }]
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
                pocket
            </Text>
            <Text
                style={styles.headerText}>
                web
            </Text>
            <Text
                style={styles.headerText}>
                radio
            </Text>
        </View>
    );
};

export default Header;