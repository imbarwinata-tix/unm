import React from 'react';
import {
  ActivityIndicator,
  Button,
  Dimensions,
  Platform,
  ScrollView,
  Text,
  View,
  ToastAndroid,
} from 'react-native';
import {WebView} from 'react-native-webview';
import CookieManager from '@react-native-cookies/cookies';
import {WEBVIEW_URL} from '../config/webview';
import {styles} from './index.style';

// constants
const height = Dimensions.get('window').height;

const WebviewScreen = () => {
  const webviewProps = {
    injectedJavaScript: `(function() {
      window.postMessage = function(data) {
        window.ReactNativeWebView.postMessage(data);
      };
    })()`,
    onMessage: event => {
      const {data, url} = event?.nativeEvent || {};

      if (url?.includes('tiket.com/myaccount')) {
        setIsLoggin(true);
        setIsShowVebview(false);
        ToastAndroid.show('Login succes!', ToastAndroid.BOTTOM);
      }

      if (data && data !== 'undefined') {
        try {
          const dataObj = JSON.parse(data) || {};

          if (dataObj.command === 'closeWebView') {
            setIsShowVebview(false);
          }
        } catch (error) {
          setIsShowVebview(false);
          console.log('Error when call a data', error);
        }
      }
    },
    source: {uri: WEBVIEW_URL},
  };

  const [isLoggin, setIsLoggin] = React.useState(false);
  const [isShowWebview, setIsShowVebview] = React.useState(false);
  const [isLoadingWebview, setIsLoadingVebview] = React.useState(false);

  const handleOpenWebview = () => setIsShowVebview(true);

  const handleClearSession = () => {
    CookieManager.clearAll();
    setIsLoggin(false);
    ToastAndroid.show('Clear session succes!', ToastAndroid.BOTTOM);
  };

  const loginStatus = React.useMemo(
    () => (isLoggin ? 'login' : 'non login'),
    [isLoggin],
  );

  React.useEffect(() => {
    CookieManager.get(WEBVIEW_URL).then(cookies => {
      if (cookies.session_access_token) {
        setIsLoggin(true);
      }
    });
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.navigation} />
        <View style={styles.content}>
          {!isShowWebview && (
            <View style={styles.content_nowebview}>
              <Text style={styles.title}>Welcome to the POC webview</Text>
              <Text style={styles.title}>Status: {loginStatus}</Text>
              <View style={styles.button}>
                <Button title="Show webview" onPress={handleOpenWebview} />
              </View>
              <View style={styles.button}>
                <Button title="Clear session" onPress={handleClearSession} />
              </View>
            </View>
          )}

          {isShowWebview && (
            <WebView
              {...webviewProps}
              onLoadStart={() => setIsLoadingVebview(true)}
              onLoadEnd={() => setIsLoadingVebview(false)}
              onError={error => console.log('Error when open a webview', error)}
              ignoreSslError={true}
              style={{height}}
            />
          )}
        </View>

        {isLoadingWebview && (
          <ActivityIndicator style={styles.loader} size="large" />
        )}
      </View>
    </ScrollView>
  );
};

export default WebviewScreen;
