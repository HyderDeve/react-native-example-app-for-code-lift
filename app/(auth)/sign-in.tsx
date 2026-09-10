import '@/global.css';
import { getClerkErrorMessage, normalizeEmail, validateEmail, validatePassword } from '@/lib/auth';
import { useSignIn } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

type SignInStep = 'credentials' | 'second-factor';

const SignIn = () => {
  const { signIn } = useSignIn();
  const router = useRouter();

  const [step, setStep] = useState<SignInStep>('credentials');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; code?: string }>({});
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailValue = useMemo(() => normalizeEmail(emailAddress), [emailAddress]);

  const finishSignIn = async () => {
    const { error } = await signIn.finalize();
    if (error) {
      setStatusMessage(getClerkErrorMessage(error));
      return;
    }

    router.replace('/(tabs)');
  };

  const resetState = async () => {
    setStep('credentials');
    setVerificationCode('');
    setPassword('');
    setFieldErrors({});
    setStatusMessage('');

    if (signIn) {
      await signIn.reset();
    }
  };

  const handleSubmitCredentials = async () => {
    // if (!isLoaded || !signIn) return;

    const nextErrors: { email?: string; password?: string } = {};
    const emailError = validateEmail(emailValue);
    const passwordError = validatePassword(password);

    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;

    setFieldErrors(nextErrors);
    setStatusMessage('');

    if (emailError || passwordError) return;

    setIsSubmitting(true);
    const { error } = await signIn.password({
      emailAddress: emailValue,
      password,
    });
    setIsSubmitting(false);

    if (error) {
      setStatusMessage(getClerkErrorMessage(error));
      return;
    }

    if (signIn.status === 'complete') {
      await finishSignIn();
      return;
    }

    if (signIn.status === 'needs_second_factor') {
      setStep('second-factor');
      setStatusMessage('Two-step verification is required. Enter your authenticator or backup code to continue.');
      return;
    }

    setStatusMessage('We could not finish signing you in. Try again.');
  };

  const handleVerifySecondFactor = async (useBackupCode = false) => {
    // if (!isLoaded || !signIn) return;

    if (!verificationCode.trim()) {
      setFieldErrors({ code: 'Enter the verification code.' });
      return;
    }

    setIsSubmitting(true);
    const { error } = useBackupCode
      ? await signIn.mfa.verifyBackupCode({ code: verificationCode.trim() })
      : await signIn.mfa.verifyTOTP({ code: verificationCode.trim() });
    setIsSubmitting(false);

    if (error) {
      setStatusMessage(getClerkErrorMessage(error));
      return;
    }

    if (signIn.status === 'complete') {
      await finishSignIn();
      return;
    }

    setStatusMessage('Verification completed, but the session is not ready yet. Please try again.');
  };

  // if (!isLoaded) {
  //   return (
  //     <View className="flex-1 items-center justify-center bg-background">
  //       <ActivityIndicator color="#ea7a53" size="large" />
  //     </View>
  //   );
  // }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-background">
      <ScrollView contentContainerClassName="flex-grow justify-center px-5 py-8" keyboardShouldPersistTaps="handled">
        <View className="mx-auto w-full max-w-md">
          <View className="mb-6 flex-row items-center gap-3">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-accent">
              <Text className="font-sans-extrabold text-2xl text-white">R</Text>
            </View>
            <View>
              <Text className="font-sans-extrabold text-3xl text-foreground">Recurly</Text>
              <Text className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Smart billing</Text>
            </View>
          </View>

          <View className="rounded-4xl border border-border bg-card p-5">
            <Text className="text-3xl font-sans-extrabold text-foreground">Welcome back</Text>
            <Text className="mt-2 text-base text-muted-foreground">
              Sign in to continue managing your subscriptions.
            </Text>

            <View className="mt-6 rounded-3xl border border-border bg-white p-4">
              {statusMessage ? (
                <View className="mb-4 rounded-2xl border border-border bg-muted px-4 py-3">
                  <Text className="text-sm text-foreground">{statusMessage}</Text>
                </View>
              ) : null}

              {step === 'credentials' ? (
                <>
                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-sans-semibold text-foreground">Email</Text>
                    <TextInput
                      autoCapitalize="none"
                      autoComplete="email"
                      keyboardType="email-address"
                      placeholder="Enter your email"
                      placeholderTextColor="#7f7058"
                      value={emailAddress}
                      onChangeText={setEmailAddress}
                      className="rounded-2xl border border-border bg-[#fffdf5] px-4 py-3 text-base text-foreground"
                    />
                    {fieldErrors.email ? <Text className="mt-2 text-sm text-destructive">{fieldErrors.email}</Text> : null}
                  </View>

                  <View className="mb-3">
                    <Text className="mb-2 text-sm font-sans-semibold text-foreground">Password</Text>
                    <TextInput
                      autoComplete="password"
                      placeholder="Enter your password"
                      placeholderTextColor="#7f7058"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      className="rounded-2xl border border-border bg-[#fffdf5] px-4 py-3 text-base text-foreground"
                    />
                    {fieldErrors.password ? <Text className="mt-2 text-sm text-destructive">{fieldErrors.password}</Text> : null}
                  </View>

                  <Text className="mb-4 text-xs leading-5 text-muted-foreground">
                    Use the email linked to your account. We&apos;ll keep your session secure on this device.
                  </Text>

                  <Pressable
                    onPress={handleSubmitCredentials}
                    disabled={isSubmitting}
                    className="rounded-2xl bg-accent px-5 py-4"
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-center font-sans-bold text-base text-white">Sign in</Text>
                    )}
                  </Pressable>

                  <View className="mt-4 flex-row justify-center">
                    <Text className="text-sm text-muted-foreground">Need an account? </Text>
                    <Link href="/sign-up" asChild>
                      <Pressable>
                        <Text className="text-sm font-sans-semibold text-accent">Create one</Text>
                      </Pressable>
                    </Link>
                  </View>
                </>
              ) : (
                <>
                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-sans-semibold text-foreground">Verification code</Text>
                    <TextInput
                      autoCapitalize="none"
                      autoComplete="one-time-code"
                      keyboardType="number-pad"
                      placeholder="Enter your code"
                      placeholderTextColor="#7f7058"
                      value={verificationCode}
                      onChangeText={setVerificationCode}
                      className="rounded-2xl border border-border bg-[#fffdf5] px-4 py-3 text-base tracking-[0.24em] text-foreground"
                    />
                    {fieldErrors.code ? <Text className="mt-2 text-sm text-destructive">{fieldErrors.code}</Text> : null}
                  </View>

                  <Pressable
                    onPress={() => handleVerifySecondFactor(false)}
                    disabled={isSubmitting}
                    className="rounded-2xl bg-accent px-5 py-4"
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-center font-sans-bold text-base text-white">Verify code</Text>
                    )}
                  </Pressable>

                  <Pressable
                    onPress={() => handleVerifySecondFactor(true)}
                    disabled={isSubmitting}
                    className="mt-3 rounded-2xl border border-border bg-white px-5 py-4"
                  >
                    <Text className="text-center font-sans-bold text-base text-foreground">Use backup code</Text>
                  </Pressable>

                  <Pressable onPress={resetState} className="mt-4">
                    <Text className="text-center text-sm font-sans-semibold text-accent">Use a different account</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignIn;