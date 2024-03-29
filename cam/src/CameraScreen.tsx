import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { useEffect, useRef, useState } from "react";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import GalleryComponent from "./GalleryScreen";
import { Alert, Linking, View, Text, SafeAreaView, Image, Pressable, Button, StyleSheet, Dimensions, PermissionsAndroid, Platform } from "react-native";
import axios from "axios";
import Geolocation from '@react-native-community/geolocation';
import { RootStackParamList } from "./navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

const { width, height } = Dimensions.get('window');
interface CameraProps {
  navigation?: StackNavigationProp<RootStackParamList, 'CameraScreen'>;
  route?: RouteProp<RootStackParamList, 'CameraScreen'>;
}
const CameraScreen :React.FC<CameraProps> =({ navigation, route }) => {
  
    const { requestPermission, hasPermission } = useCameraPermission();
    const camera = useRef<Camera>(null);
   
    const [isCameraVisible, setIsCameraVisible] = useState(false);
    const [isGallery, setIsGallery] = useState(false);

    const [capturedImage, setCapturedImage] = useState<null | string>(null);

    const [
        currentLongitude,
        setCurrentLongitude
      ] = useState('');
      const [
        currentLatitude,
        setCurrentLatitude
      ] = useState('');
      const [
        locationStatus,
        setLocationStatus,
      ] = useState('');


    const openCamera = () => setIsCameraVisible(true);
    const closeCamera = () => setIsCameraVisible(false);
    const device = useCameraDevice("back");


    useEffect(() => {
        const requestLocationPermission = async () => {
          if (Platform.OS === 'ios') {
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getOneTimeLocation();
                subscribeLocationLocation();
              } else {
                setLocationStatus('Permission Denied');
              }
            } catch (err) {
              console.warn(err);
            }
          }
        };

        requestLocationPermission();
     
      }, []);


    const handleCameraPermission = async () => {
    const isAccessGranted = await requestPermission();
  
      if (!isAccessGranted) {
        Alert.alert("Permission required", "Open settings to grant permission", [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Open settings",
            style: "default",
            onPress: async () => {
              await Linking.openSettings();
            },
          },
        ]);
        return;
      }
      openCamera();
    };
  
    const takePhoto = async () => {
      const photo = await camera.current?.takePhoto();
      setCapturedImage(`file://${photo!.path}`);
      closeCamera();
    };
  
    const backToCamera = async () => {
      setIsGallery(false);
      setCapturedImage(null);
    }
  
      const addImage = async (name: string,latitude:string,longitude:string) => {

        try {
          const response = await axios.post('https://660533ea2ca9478ea17fac25.mockapi.io/api/Photos/Photos', { name:name , latitude:latitude,longitude:longitude });
        } catch (error) {
        }
      };
  
    const saveImage = async () => {
        
      try {
        if (!capturedImage) {
          throw new Error('Captured image is null or undefined');
        }

        await CameraRoll?.saveAsset(capturedImage, { type: 'photo' });

        Alert.alert('Success', `Image saved to gallery successfully.`, [
          { style: 'cancel', text: 'Cancel' },
          {
            text: 'Open Photos',
            onPress: async () => {
     
              addImage(capturedImage,currentLatitude,currentLongitude);
              setIsGallery(true);
  
          },
          },
        ]);
      } catch (error) {
      }
    };
  
    const getOneTimeLocation = () => {
        setLocationStatus('Getting Location ...');
        Geolocation.getCurrentPosition(
          (position:any) => {
            setLocationStatus('You are Here');
                const currentLongitude = 
              JSON.stringify(position.coords.longitude);
                const currentLatitude = 
              JSON.stringify(position.coords.latitude);
                setCurrentLongitude(currentLongitude);
                        setCurrentLatitude(currentLatitude);
          },
          (error:any) => {
            setLocationStatus(error.message);
          },
          {
            enableHighAccuracy: false,
            timeout: 30000,
            maximumAge: 1000
          },
        );
      };
    
      const subscribeLocationLocation = () => {
        const watchID = Geolocation.watchPosition(
          (position:any) => {
            setLocationStatus('You are Here');
                const currentLongitude =
              JSON.stringify(position.coords.longitude);
                const currentLatitude = 
              JSON.stringify(position.coords.latitude);
                setCurrentLongitude(currentLongitude);
            setCurrentLatitude(currentLatitude);
          },
          (error:any) => {
            setLocationStatus(error.message);
          },
          {
            enableHighAccuracy: false,
            maximumAge: 1000
          },
        );
      };
    if (device === null) {
      return (
        <View >
          <Text style={{ fontSize: 20, color: "red" }}>
            Camera feature not supported
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
      {!isCameraVisible && !capturedImage && (
          <SafeAreaView style={styles.content}>
              <Pressable
                  onPress={handleCameraPermission}
                  style={({ pressed }) => [
                      styles.button,
                      {
                          backgroundColor: pressed ? "#001833" : "#007aff",
                          transform: [{ scale: pressed ? 1.1 : 1 }],
                      },
                  ]}
              >
                  <Text style={styles.buttonText}>
                      {hasPermission ? "Open Camera" : "Request Camera Access"}
                  </Text>
              </Pressable>
          </SafeAreaView>
      )}

      {isCameraVisible && (
          <><Camera
            ref={camera}
            style={styles.camera}
            device={device!}
            isActive={true} /><View style={styles.buttonContainer}>
              <Pressable onPress={takePhoto} style={styles.captureButton}>
                <Text style={styles.captureButtonText}>Click</Text>
              </Pressable>
            </View></>
      )}

      {!!capturedImage && (
          <View style={styles.previewContainer}>
              <Image source={{ uri: capturedImage }} style={styles.previewImage} />
              <View style={styles.buttonContainer}>
                  <Pressable onPress={saveImage} style={styles.saveButton}>
                      <Text style={styles.saveButtonText}>Save to Camera Roll</Text>
                  </Pressable>
              </View>
          </View>
      )}
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#808080',
  justifyContent: 'center',
  alignItems: 'center',
},
content: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
button: {
  padding: 16,
  backgroundColor: '#40E0D0',
  borderRadius: 8,
},
buttonText: {
  fontSize: 20,
  color: '#808080',
},
camera: {
  width: width,
  height: height,
},
buttonContainer: {
  position: 'absolute',
  bottom: 20,
  alignSelf: 'center',
},
captureButton: {
  padding: 16,
  backgroundColor: '#40E0D0',
  borderRadius: 8,
},
captureButtonText: {
  fontSize: 20,
  color: '#808080',
},
previewContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
previewImage: {
  width: width - 40,
  height: height - 200,
  borderRadius: 10,
  marginBottom: 20,
},
saveButton: {
  padding: 16,
  backgroundColor: '#40E0D0',
  borderRadius: 8,
},
saveButtonText: {
  fontSize: 20,
  color: '#808080',
},
});

export default CameraScreen;