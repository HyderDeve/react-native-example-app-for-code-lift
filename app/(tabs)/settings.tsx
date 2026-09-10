import '@/global.css';
import { useAuth, useUser } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { styled } from 'nativewind';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="mb-6 rounded-[28px] border border-border bg-card p-5">
        <Text className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Account
        </Text>
        <Text className="mt-2 font-sans-extrabold text-3xl text-foreground">
          Settings
        </Text>
        <Text className="mt-2 text-sm text-muted-foreground">
          Manage your profile and session.
        </Text>
      </View>

      <View className="mb-6 rounded-[28px] border border-border bg-white p-5">
        <Text className="text-sm font-sans-semibold text-foreground">Signed in as</Text>
        <Text className="mt-2 text-xl font-sans-bold text-foreground">
          {user?.fullName || 'Your account'}
        </Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          {user?.primaryEmailAddress?.emailAddress || 'No email available'}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleSignOut}
        className="rounded-2xl bg-accent px-5 py-4"
        activeOpacity={0.9}
      >
        <Text className="text-center font-sans-bold text-base text-white">
          Sign out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Settings;