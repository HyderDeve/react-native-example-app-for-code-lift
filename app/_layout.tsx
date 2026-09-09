import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { SplashScreen, Stack } from "expo-router";
import '@/global.css'
import { useEffect } from "react";
import { useFonts } from "expo-font";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add your key to .env.\nRun: 1) clerk auth login  2) clerk link  3) clerk env pull — then restart the dev server.");
}

SplashScreen.preventAutoHideAsync();

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

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack screenOptions = {{headerShown : false}}/>
    </ClerkProvider>
  );
}