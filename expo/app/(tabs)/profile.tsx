import { useState, useEffect } from 'react';
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
  Image,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, LogOut, User, School } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { NIVELES_EDUCATIVOS, GRADOS_POR_NIVEL } from '@/types/user';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { user, updateProfile, logout } = useAuth();

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [nombreEscuela, setNombreEscuela] = useState('');
  const [nivelPredeterminado, setNivelPredeterminado] = useState<'Preescolar' | 'Primaria' | 'Secundaria'>('Primaria');
  const [gradoPredeterminado, setGradoPredeterminado] = useState('1');
  const [urlLogoEscuela, setUrlLogoEscuela] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [showNivelPicker, setShowNivelPicker] = useState(false);
  const [showGradoPicker, setShowGradoPicker] = useState(false);

  useEffect(() => {
    if (user) {
      setNombreCompleto(user.nombreCompleto);
      setNombreEscuela(user.nombreEscuela);
      setNivelPredeterminado(user.nivelPredeterminado);
      setGradoPredeterminado(user.gradoPredeterminado);
      setUrlLogoEscuela(user.urlLogoEscuela);
    }
  }, [user]);

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        const message = 'Se requiere permiso para acceder a la galería';
        if (Platform.OS === 'web') {
          alert(message);
        } else {
          Alert.alert('Permiso requerido', message);
        }
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUrlLogoEscuela(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      const message = 'Error al seleccionar imagen';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Error', message);
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    await updateProfile({
      nombreCompleto: nombreCompleto.trim(),
      nombreEscuela: nombreEscuela.trim(),
      nivelPredeterminado,
      gradoPredeterminado,
      urlLogoEscuela,
    });
    setIsLoading(false);

    const message = 'Perfil actualizado correctamente';
    if (Platform.OS === 'web') {
      alert(message);
    } else {
      Alert.alert('Éxito', message);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/welcome' as never);
  };

  const gradosDisponibles = GRADOS_POR_NIVEL[nivelPredeterminado] || [];

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Mi Perfil',
      }} />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <View style={styles.avatarContainer}>
            {urlLogoEscuela ? (
              <Image source={{ uri: urlLogoEscuela }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <School size={40} color="#FFFFFF" />
              </View>
            )}
            <TouchableOpacity
              testID="change-logo-button"
              style={[styles.cameraButton, { backgroundColor: colors.primary }]}
              onPress={handlePickImage}
            >
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerName}>{user?.nombreCompleto || 'Usuario'}</Text>
          <Text style={styles.headerEmail}>{user?.email || ''}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Información Personal
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Nombre Completo</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <User size={20} color={colors.muted} />
              <TextInput
                testID="nombre-input"
                style={[styles.input, { color: colors.text }]}
                value={nombreCompleto}
                onChangeText={setNombreCompleto}
                placeholder="Tu nombre completo"
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Nombre de la Escuela</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <School size={20} color={colors.muted} />
              <TextInput
                testID="escuela-input"
                style={[styles.input, { color: colors.text }]}
                value={nombreEscuela}
                onChangeText={setNombreEscuela}
                placeholder="Nombre de tu escuela"
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Configuración Predeterminada
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Nivel Educativo Predeterminado</Text>
            <TouchableOpacity
              testID="nivel-picker-button"
              style={[styles.pickerButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setShowNivelPicker(!showNivelPicker)}
            >
              <Text style={[styles.pickerButtonText, { color: colors.text }]}>
                {nivelPredeterminado}
              </Text>
            </TouchableOpacity>
            {showNivelPicker && (
              <View style={[styles.pickerOptions, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {NIVELES_EDUCATIVOS.map((nivel) => (
                  <TouchableOpacity
                    key={nivel}
                    testID={`nivel-option-${nivel}`}
                    style={[
                      styles.pickerOption,
                      nivel === nivelPredeterminado && { backgroundColor: colors.primary + '20' }
                    ]}
                    onPress={() => {
                      setNivelPredeterminado(nivel);
                      setGradoPredeterminado('1');
                      setShowNivelPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      { color: nivel === nivelPredeterminado ? colors.primary : colors.text }
                    ]}>
                      {nivel}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Grado Predeterminado</Text>
            <TouchableOpacity
              testID="grado-picker-button"
              style={[styles.pickerButton, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setShowGradoPicker(!showGradoPicker)}
            >
              <Text style={[styles.pickerButtonText, { color: colors.text }]}>
                {gradoPredeterminado}
              </Text>
            </TouchableOpacity>
            {showGradoPicker && (
              <View style={[styles.pickerOptions, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {gradosDisponibles.map((grado) => (
                  <TouchableOpacity
                    key={grado}
                    testID={`grado-option-${grado}`}
                    style={[
                      styles.pickerOption,
                      grado === gradoPredeterminado && { backgroundColor: colors.primary + '20' }
                    ]}
                    onPress={() => {
                      setGradoPredeterminado(grado);
                      setShowGradoPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      { color: grado === gradoPredeterminado ? colors.primary : colors.text }
                    ]}>
                      {grado}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          testID="save-button"
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Guardar Cambios</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          testID="logout-button"
          style={[styles.logoutButton, { borderColor: colors.border }]}
          onPress={handleLogout}
        >
          <LogOut size={20} color={colors.text} />
          <Text style={[styles.logoutButtonText, { color: colors.text }]}>
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  headerName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  headerEmail: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  pickerButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  pickerButtonText: {
    fontSize: 16,
  },
  pickerOptions: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
    overflow: 'hidden',
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pickerOptionText: {
    fontSize: 16,
  },
  saveButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
