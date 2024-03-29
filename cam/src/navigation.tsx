
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  ImageDetails: undefined;
  CameraScreen: undefined;
  GalleryScreen: undefined;
};

export type ImageDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ImageDetails'
>;

export type CameraScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'CameraScreen'
>;
export type GalleryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GalleryScreen'
>;

export type ImageDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'ImageDetails'
>;
export type CameraScreenRouteProp = RouteProp<
  RootStackParamList,
  'CameraScreen'
>;
export type GalleryScreenRouteProp = RouteProp<
  RootStackParamList,
  'GalleryScreen'
>;