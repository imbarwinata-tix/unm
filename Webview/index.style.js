import {Dimensions, Platform, StyleSheet} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

// constants
const isIOS = Platform.OS === 'ios';
const heightStatusBar = isIOS ? getStatusBarHeight() : getStatusBarHeight(true);
const height = Dimensions.get('window').height;
const width = Dimensions.get('screen').width - 44;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: height / 2,
    left: width / 2,
  },
  navigation: {
    height: heightStatusBar,
  },
  content: {
    height: height - heightStatusBar - (height <= 640 ? 24 : 0),
  },
  content_nowebview: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
});
