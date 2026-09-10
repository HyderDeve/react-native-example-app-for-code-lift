import '@/global.css';
import { getClerkErrorMessage, normalizeEmail, validateEmail, validateName, validatePassword } from '@/lib/auth';
import { useSignUp } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

type SignUpStep = 'details' | 'verify';

const SignUp = () => {
  const { signUp } = useSignUp();
  const router = useRouter();

  const [step, setStep] = useState<SignUpStep>('details');
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string; code?: string }>({});
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailValue = useMemo(() => normalizeEmail(emailAddress), [emailAddress]);

  const finishSignUp = async () => {
    const { error } = await signUp.finalize();
    if (error) {
      setStatusMessage(getClerkErrorMessage(error));
      return;
    }

    router.replace('/(tabs)');
  };

  const startOver = async () => {
    setStep('details');
    setVerificationCode('');
    setStatusMessage('');
    setFieldErrors({});

    if (signUp) {
      await signUp.reset();
    }
  };

  const requestVerificationCode = async () => {
    const { error } = await signUp.verifications.sendEmailCode();
    if (error) {
      setStatusMessage(getClerkErrorMessage(error));
      return false;
    }

    setStep('verify');
    setStatusMessage('We sent a verification code to your email. Enter it to finish creating your account.');
    return true;
  };

  const handleCreateAccount = async () => {
    // if (!isLoaded || !signUp) return;

    const nextErrors: typeof fieldErrors = {};
    const nameError = validateName(fullName);
    const emailError = validateEmail(emailValue);
    const passwordError = validatePassword(password);

    if (nameError) nextErrors.name = nameError;
    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;
    if (confirmPassword !== password) nextErrors.confirmPassword = 'Passwords do not match.';

    setFieldErrors(nextErrors);
    setStatusMessage('');

    if (nameError || emailError || passwordError || confirmPassword !== password) return;

    setIsSubmitting(true);
    const names = fullName.trim().split(/\s+/);
    const firstName = names[0];
    const lastName = names.slice(1).join(' ') || undefined;

    const { error } = await signUp.password({
      emailAddress: emailValue,
      password,
      firstName,
      lastName,
    });
    setIsSubmitting(false);

    if (error) {
      setStatusMessage(getClerkErrorMessage(error));
      return;
    }

    if (signUp.status === 'complete') {
      await finishSignUp();
      return;
    }

    await requestVerificationCode();
  };

  const handleVerifyCode = async () => {
    // if (!isLoaded || !signUp) return;

    if (!verificationCode.trim()) {
      setFieldErrors({ code: 'Enter the verification code.' });
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp.verifications.verifyEmailCode({ code: verificationCode.trim() });
    setIsSubmitting(false);

    if (error) {
      setStatusMessage(getClerkErrorMessage(error));
      return;
    }

    if (signUp.status === 'complete') {
      await finishSignUp();
      return;
    }

    setStatusMessage('Verification succeeded, but the account setup is not finished yet. Please try again.');
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
            <Text className="text-3xl font-sans-extrabold text-foreground">Create your account</Text>
            <Text className="mt-2 text-base text-muted-foreground">
              Start tracking subscriptions with a secure profile and one place for billing.
            </Text>

            <View className="mt-6 rounded-3xl border border-border bg-white p-4">
              {statusMessage ? (
                <View className="mb-4 rounded-2xl border border-border bg-muted px-4 py-3">
                  <Text className="text-sm text-foreground">{statusMessage}</Text>
                </View>
              ) : null}

              {step === 'details' ? (
                <>
                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-sans-semibold text-foreground">Full name</Text>
                    <TextInput
                      autoComplete="name"
                      placeholder="Enter your full name"
                      placeholderTextColor="#7f7058"
                      value={fullName}
                      onChangeText={setFullName}
                      className="rounded-2xl border border-border bg-[#fffdf5] px-4 py-3 text-base text-foreground"
                    />
                    {fieldErrors.name ? <Text className="mt-2 text-sm text-destructive">{fieldErrors.name}</Text> : null}
                  </View>

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

                  <View className="mb-4">
                    <Text className="mb-2 text-sm font-sans-semibold text-foreground">Password</Text>
                    <TextInput
                      autoComplete="new-password"
                      placeholder="Create a password"
                      placeholderTextColor="#7f7058"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      className="rounded-2xl border border-border bg-[#fffdf5] px-4 py-3 text-base text-foreground"
                    />
                    {fieldErrors.password ? <Text className="mt-2 text-sm text-destructive">{fieldErrors.password}</Text> : null}
                  </View>

                  <View className="mb-3">
                    <Text className="mb-2 text-sm font-sans-semibold text-foreground">Confirm password</Text>
                    <TextInput
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      placeholderTextColor="#7f7058"
                      secureTextEntry
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      className="rounded-2xl border border-border bg-[#fffdf5] px-4 py-3 text-base text-foreground"
                    />
                    {fieldErrors.confirmPassword ? <Text className="mt-2 text-sm text-destructive">{fieldErrors.confirmPassword}</Text> : null}
                  </View>

                  <Text className="mb-4 text-xs leading-5 text-muted-foreground">
                    We use your name and email only to secure your account and personalize the experience.
                  </Text>

                  <Pressable
                    onPress={handleCreateAccount}
                    disabled={isSubmitting}
                    className="rounded-2xl bg-accent px-5 py-4"
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-center font-sans-bold text-base text-white">Create account</Text>
                    )}
                  </Pressable>

                  <View className="mt-4 flex-row justify-center">
                    <Text className="text-sm text-muted-foreground">Already have an account? </Text>
                    <Link href="/sign-in" asChild>
                      <Pressable>
                        <Text className="text-sm font-sans-semibold text-accent">Sign in</Text>
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
                    onPress={handleVerifyCode}
                    disabled={isSubmitting}
                    className="rounded-2xl bg-accent px-5 py-4"
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-center font-sans-bold text-base text-white">Verify email</Text>
                    )}
                  </Pressable>

                  <Pressable
                    onPress={requestVerificationCode}
                    disabled={isSubmitting}
                    className="mt-3 rounded-2xl border border-border bg-white px-5 py-4"
                  >
                    <Text className="text-center font-sans-bold text-base text-foreground">Resend code</Text>
                  </Pressable>

                  <Pressable onPress={startOver} className="mt-4">
                    <Text className="text-center text-sm font-sans-semibold text-accent">Edit account details</Text>
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

export default SignUp;