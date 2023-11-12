import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { BlurView } from 'expo-blur';

const LoadingScreen = ({ isVisible }) => {
  return (
    <Modal isVisible={isVisible} backdropOpacity={0.8} animationIn="fadeIn" animationOut="fadeOut">
      <View className="flex-1 justify-center items-center">
        <View className="absolute items-center justify-center">
          <ActivityIndicator size="big" color="#db2777" />
        </View>
      </View>
    </Modal>
  );
};

export default LoadingScreen;
