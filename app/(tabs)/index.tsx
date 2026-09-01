import "@/global.css";
// import { Link } from "expo-router";
import { Text, View, Image as RNImage } from "react-native";
import { styled } from 'nativewind';
import {icons} from "@/constants/icons";
import images from '@/constants/images';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { HOME_USER } from "@/constants/data";


const SafeAreaView = styled(RNSafeAreaView);
const Image = styled(RNImage);

export default function App() {
  return (
      <SafeAreaView className="flex-1 bg-background p-5">

        <View className="home-header">
          <View className="home-user">
            <Image source={images.avatar} className="home-avatar"/>
            <Text className="home-user-name">{HOME_USER.name}</Text>
          </View>
          <View>
            <Image source={icons.add} className="home-add-icon"></Image>
          </View>
        </View>

        <View className="home-balance-card">
          <Text className="home-balance-label">Balance</Text>
          <View className="home-balance-row">
            <Text className="home-balance-amount"></Text>
          </View>
        </View>
      
      
      {/* <Text className="text-5xl font-sans-extrabold">Home</Text>
      <Link href="/onboarding" className="mt-4 fonts-sans-bold rounded bg-primary text-white p-4" >Go to Onboarding</Link>
      <Link href="/(auth)/sign-in" className="mt-4 fonts-sans-bold rounded bg-primary text-white p-4" >Go to Sign In</Link>
      <Link href="/(auth)/sign-up" className="mt-4 fonts-sans-bold rounded bg-primary text-white p-4" >Go to Sign Up</Link> */}
      
      
      {/* Dynamic segments like subscriptions/[id].tsx can't be reached with a plain
      string href — "/subscriptions/spotify" isn't a literal route Expo Router knows
      about, only the pattern "/subscriptions/[id]" is. Fill the param via object form: */}
      
      {/* <Link href={{ pathname: '/subscriptions/[id]', params: { id: 'spotify' }}} className = "mt-4 rounded bg-primary text-white p-4">
        Spotify Subscription
      </Link> */}
    </SafeAreaView>
  );
}