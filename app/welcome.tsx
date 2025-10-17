import { StyleSheet, Text, View, TouchableOpacity, useColorScheme } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function WelcomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.primary }]}>
        <View style={styles.content}>
          <BookOpen size={80} color="#FFFFFF" />
          <Text style={styles.title}>Planeaciones Didácticas</Text>
          <Text style={styles.subtitle}>Nueva Escuela Mexicana</Text>
          <Text style={styles.description}>
            Sistema de planeaciones inclusivas para docentes
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            testID="login-button"
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => router.push('/login' as never)}
          >
            <Text style={styles.buttonPrimaryText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="register-button"
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => router.push('/register' as never)}
          >
            <Text style={styles.buttonSecondaryText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    gap: 12,
    width: '100%',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#FFFFFF',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  buttonPrimaryText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#2D5F8D',
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
