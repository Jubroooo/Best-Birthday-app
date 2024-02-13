import  React, {useRef,useEffect,useState} from 'react';
import { WebView } from 'react-native-webview';
import { SafeAreaView, StatusBar,BackHandler,ToastAndroid, Platform, Linking } from 'react-native';

const toastWithDurationHandler = () => {
    ToastAndroid.show("'뒤로' 버튼을  한번 더 누르시면 종료됩니다.", ToastAndroid.SHORT);
  };

export default function App() {
  const INJECTED_JAVASCRIPT = `(function() {
  const meta = document.createElement('meta'); meta.setAttribute('content', 'initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
})();`;
  
  const [mainUrl, setMainUrl] = useState(''); 

  const onUrlChange = (ref) => {
    setMainUrl(ref);
  }
  
  //뒤로가기 처리
  const webview = useRef(null);
  let time = 0;
  const onAndroidBackPress = () => {
    if (mainUrl === '/') {
      console.log('나갈 수 있는 상태');
      time += 1;
      toastWithDurationHandler(); // 뒤로가기 토스트 바 
      if (time === 1) {
        setTimeout(() => time = 0, 2000);
      }
      else if (time === 2) {
        console.log('어플종료');
        BackHandler.exitApp();
        return false;
      }
    } else {
      console.log('뒤로가기')
      webview.current.goBack();
      return true;
    }
    return true;
  };
  //뒤로가기 처리
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
    };
    
  }, [mainUrl]);

  return (
    <>
        <StatusBar barStyle="black-content" hidden />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <WebView
          source={{ uri: 'https://bestbirthday.co.kr/'}}
          originWhitelist={['http://*', 'https://*', 'intent://*', 'kakaotalk://*', 'itms-apps://*']}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          userAgent={mainUrl === '/users/login/' ? 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36' : null}
          ref={webview}
          allowsbackforwardnavigationgestures={true}
          scalesPageToFit={true}
          onNavigationStateChange={(navState) => {
            // Keep track of going back navigation within component
            onUrlChange(navState.url.split('https://bestbirthday.co.kr')[1]);
          }}
          onShouldStartLoadWithRequest={(request) => {
            if (request.url.startsWith('intent') || request.url.startsWith('kakaotalk') || request.url.startsWith('itms-apps')) {
              Linking.openURL(request.url);
              return false;
            }
            return true;
          }}
          allowsBackForwardNavigationGestures={true}
        />
        </SafeAreaView>
    </>
  );
}