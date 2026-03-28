import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mantenerseConectado, setMantenerseConectado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleLogin = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    const result = await login({
      email: email.trim().toLowerCase(),
      password,
      mantenerseConectado,
    });
    setIsLoading(false);

    if (result.success) {
      router.replace('/(tabs)' as never);
    } else {
      if (Platform.OS === 'web') {
        alert(result.error || 'Error al iniciar sesión');
      } else {
        Alert.alert('Error', result.error || 'Error al iniciar sesión');
      }
    }
  };

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Iniciar Sesión',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#FFFFFF',
      }} />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.title, { color: colors.text }]}>Bienvenido</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Inicia sesión para continuar
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Correo Electrónico</Text>
            <TextInput
              testID="email-input"
              style={[styles.input, { 
                backgroundColor: colors.card, 
                color: colors.text,
                borderColor: colors.border,
              }]}
              value={email}
              onChangeText={setEmail}
              placeholder="correo@ejemplo.com"
              placeholderTextColor={colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Contraseña</Text>
            <TextInput
              testID="password-input"
              style={[styles.input, { 
                backgroundColor: colors.card, 
                color: colors.text,
                borderColor: colors.border,
              }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Tu contraseña"
              placeholderTextColor={colors.muted}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              testID="remember-checkbox"
              style={styles.checkboxContainer}
              onPress={() => setMantenerseConectado(!mantenerseConectado)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.checkbox,
                { borderColor: colors.border },
                mantenerseConectado && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}>
                {mantenerseConectado && <Check size={16} color="#FFFFFF" />}
              </View>
              <Text style={[styles.checkboxText, { color: colors.text }]}>
                Mantenerme conectado
              </Text>
            </TouchableOpacity>

            <TouchableOpacity testID="forgot-password">
              <Text style={[styles.forgotText, { color: colors.primary }]}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            testID="submit-button"
            style={[
              styles.submitButton,
              { backgroundColor: isFormValid ? colors.primary : colors.muted }
            ]}
            onPress={handleLogin}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            testID="register-link"
            onPress={() => router.push('/register' as never)}
            style={styles.linkContainer}
          >
            <Text style={[styles.linkText, { color: colors.muted }]}>
              ¿No tienes cuenta?{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' as const }}>
                Regístrate
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxText: {
    fontSize: 14,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
  },
});
