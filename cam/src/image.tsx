import React, { useState, useEffect } from 'react';
import { IImage } from './AppContent';
import { Image, TouchableOpacity, Text, StyleSheet, Dimensions, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');

const ImageComponent = (image: IImage, navigation?: any) => {
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 3000, 
        useNativeDriver: true,
      }
    ).start();
  }, []);

  const handleDelete = () => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 0,
        duration: 500, 
        useNativeDriver: true,
      }
    ).start(() => {
      image.handleDelete?.(image.id ?? '');
    });
  };

  return (   
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity onPress={() => image.onClickFunction?.(image.id ?? '')}>
        <Image style={styles.img} source={{ uri: image.name }} />       
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  img: {   
    flex: 1,
    width: width / 3,
    height: height / 4,
  },
  deleteText: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: 'red',
    fontSize: 16,
  },
});

export default ImageComponent;
