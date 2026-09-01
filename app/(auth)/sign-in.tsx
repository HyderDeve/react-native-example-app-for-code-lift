import { View, Text } from 'react-native'
import { Link } from 'expo-router'

// Route convention: folders wrapped in parentheses, e.g. (auth), are Expo Router
// "groups" — they organize files but are NOT part of the URL. So this screen's
// actual route is /sign-in, not /(auth)/sign-in. Curly braces {auth} would NOT
// work here — that creates a literal /{auth}/ path segment instead of a group.
// File names must stay lowercase-kebab-case to match the href strings used in
// <Link>, since Expo Router's generated types are case-sensitive.
const SignIn = () => {
  return (
    <View>
      <Text>SignIn</Text>
      <Link href="/sign-up">Don&apos;t have an account? Sign up</Link>
    </View>
  )
}

export default SignIn