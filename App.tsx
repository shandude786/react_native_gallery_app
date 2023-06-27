import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  request,
  PERMISSIONS,
  Permission,
  check,
} from 'react-native-permissions';
import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';

type Props = {};

const App = (props: Props) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [photoList, setPhotoList] = useState<PhotoIdentifier[]>([]);

  const requestGalleryPermission = async (permission: Permission) => {
    try {
      request(permission).then(result => {
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the gallery', result);
          setHasPermission(true);
        } else {
          console.log('Gallery permission denied');
          setHasPermission(false);
        }
      });
    } catch (error) {
      console.log('Error while Request Gallery Permission', error);
    }
  };

  const getCheckPermissionPromise = async (permission: Permission) => {
    try {
      check(permission).then(result => {
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('CheckPermissionResultIf', result);
          setHasPermission(true);
        } else {
          console.log('CheckPermissionResultElse', result);
          setHasPermission(false);
        }
      });
    } catch (error) {
      console.log('Error while checking Gallery Permission', error);
    }
  };

  const hasAndroidPermission = async () => {
    let permission: Permission =
      (Platform.Version as number) >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

    await getCheckPermissionPromise(permission);

    await (hasPermission === false && requestGalleryPermission(permission));
  };

  const getAllPhotos = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
      .then(r => {
        console.log('object', JSON.stringify(r.edges));
        setPhotoList(r.edges);
      })
      .catch(err => {
        console.log('Error while checking Fetching photos from Gallery', err);
      });
  };
  useEffect(() => {
    hasAndroidPermission();
  }, []);

  console.log('hasPermission', hasPermission);
  return (
    <View style={{flex: 1}}>
      <View style={{width: '100%', alignItems: 'center'}}>
        <FlatList
          data={photoList}
          numColumns={2}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: Dimensions.get('window').width / 2 - 20,
                  height: 200,
                  borderRadius: 10,
                  backgroundColor: '#F7BBBB',
                  margin: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={{uri: item.node.image.uri}}
                  style={{width: '95%', height: '95%'}}
                />
              </View>
            );
          }}
        />
      </View>
      <TouchableOpacity
        style={{
          width: '90%',
          height: 50,
          borderRadius: 10,
          backgroundColor: '#4054EB',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          position: 'absolute',
          bottom: 20,
        }}
        onPress={() => getAllPhotos()}>
        <Text style={{color: '#fff'}}>Sync photos from Gallery</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
