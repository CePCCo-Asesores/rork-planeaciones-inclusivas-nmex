import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LessonPlansProvider } from "@/contexts/LessonPlansContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CurriculumDataProvider } from "@/contexts/CurriculumDataContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)' || segments[0] === 'create' || segments[0] === 'create-new' || segments[0] === 'plan' || segments[0] === 'result';

    if (!isAuthenticated && inAuthGroup) {
      router.replace('/welcome' as never);
    } else if (isAuthenticated && !inAuthGroup) {
      router.replace('/(tabs)' as never);
    }
  }, [isAuthenticated, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerBackTitle: "Atrás" }}>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: true }} />
      <Stack.Screen name="register" options={{ headerShown: true }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="create" options={{ headerShown: true }} />
      <Stack.Screen name="create-new" options={{ headerShown: true }} />
      <Stack.Screen name="plan/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="result/[id]" options={{ headerShown: true }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurriculumDataProvider>
          <LessonPlansProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </LessonPlansProvider>
        </CurriculumDataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
