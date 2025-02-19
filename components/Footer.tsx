import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const Footer = () => {
    return (
        <View style={styles.footer}>
            <View style={styles.iconWrapper}>
                <TouchableOpacity style={styles.iconContainer}>
                    <Image source={require("../assets/icon.png")} style={styles.icon} />

                </TouchableOpacity>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    footer: {
        backgroundColor: '#1D3C6B', // Footer dark gradient
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    iconWrapper: {
        position: 'absolute',
        top: -20, // Position the icon slightly above the footer
        alignSelf: 'center',
        zIndex: 2, // Ensure it is above the footer
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25, // Make the icon circular
        backgroundColor: '#fff', // Background for the icon
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5, // For Android shadow
      },
    iconAnimation: {
        width: 40,
        height: 40,
    },
    icon: {
        width: 40,
        height: 40,
        // resizeMode: "contain",
    },
});

export default Footer;
