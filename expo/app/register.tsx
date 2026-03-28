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

export default function RegisterScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { register } = useAuth();

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = nombreCompleto.trim() !== '' && 
    email.trim() !== '' && 
    password.trim() !== '' && 
    aceptaTerminos;

  const handleRegister = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    const result = await register({
      nombreCompleto: nombreCompleto.trim(),
      email: email.trim().toLowerCase(),
      password,
      aceptaTerminos,
    });
    setIsLoading(false);

    if (result.success) {
      router.replace('/(tabs)' as never);
    } else {
      if (Platform.OS === 'web') {
        alert(result.error || 'Error al registrar');
      } else {
        Alert.alert('Error', result.error || 'Error al registrar');
      }
    }
  };

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Registrarse',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#FFFFFF',
      }} />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.title, { color: colors.text }]}>Crear Cuenta</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Completa tus datos para comenzar
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Nombre Completo</Text>
            <TextInput
              testID="nombre-input"
              style={[styles.input, { 
                backgroundColor: colors.card, 
                color: colors.text,
                borderColor: colors.border,
              }]}
              value={nombreCompleto}
              onChangeText={setNombreCompleto}
              placeholder="Tu nombre completo"
              placeholderTextColor={colors.muted}
              autoCapitalize="words"
            />
          </View>

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
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor={colors.muted}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            testID="terms-checkbox"
            style={styles.checkboxContainer}
            onPress={() => setAceptaTerminos(!aceptaTerminos)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkbox,
              { borderColor: colors.border },
              aceptaTerminos && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}>
              {aceptaTerminos && <Check size={16} color="#FFFFFF" />}
            </View>
            <Text style={[styles.checkboxText, { color: colors.text }]}>
              Acepto los{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' as const }}>
                Términos y Condiciones
              </Text>
              {' '}y la{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' as const }}>
                Política de Privacidad
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="submit-button"
            style={[
              styles.submitButton,
              { backgroundColor: isFormValid ? colors.primary : colors.muted }
            ]}
            onPress={handleRegister}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Registrarse</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            testID="login-link"
            onPress={() => router.back()}
            style={styles.linkContainer}
          >
            <Text style={[styles.linkText, { color: colors.muted }]}>
              ¿Ya tienes cuenta?{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' as const }}>
                Inicia Sesión
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
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
