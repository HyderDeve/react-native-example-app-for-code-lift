import "@/global.css";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link href="/onboarding" className="mt-4 rounded bg-primary text-white p-4" >Go to Onboarding</Link>
      <Link href="/(auth)/sign-in" className="mt-4 rounded bg-primary text-white p-4" >Go to Sign In</Link>
      <Link href="/(auth)/sign-up" className="mt-4 rounded bg-primary text-white p-4" >Go to Sign Up</Link>
      {/* Dynamic segments like subscriptions/[id].tsx can't be reached with a plain
      string href — "/subscriptions/spotify" isn't a literal route Expo Router knows
      about, only the pattern "/subscriptions/[id]" is. Fill the param via object form: */}
      <Link href={{ pathname: '/subscriptions/[id]', params: { id: 'spotify' }}} className = "mt-4 rounded bg-primary text-white p-4">
        Spotify Subscription
      </Link>
    </View>
  );
}