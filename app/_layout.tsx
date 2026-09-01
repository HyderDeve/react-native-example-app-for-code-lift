import { SplashScreen, Stack } from "expo-router";
import '@/global.css'
import { useEffect } from "react";
import { useFonts } from "expo-font";

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    'sans-regular' : require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold' : require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-semibold' : require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-medium' : require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-light' : require('../assets/fonts/PlusJakartaSans-Light.ttf'),
    'sans-extrabold' : require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
  }) 

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }), [fontsLoaded]

  if (!fontsLoaded) return null; //if fonts are not loaded we cannot show our application

  return <Stack screenOptions = {{headerShown : false}}/>;
}
