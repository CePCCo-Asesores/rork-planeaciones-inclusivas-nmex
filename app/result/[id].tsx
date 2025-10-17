import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
  ActivityIndicator,
  Platform,
  Share,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Copy, Download, Share2, Lock } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useLessonPlans } from '@/contexts/LessonPlansContext';

export default function ResultScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { getLessonPlan } = useLessonPlans();
  const [isLoading, setIsLoading] = useState(false);

  const lessonPlan = getLessonPlan(id || '');

  if (!lessonPlan) {
    return (
      <>
        <Stack.Screen options={{
          title: 'Planeación',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#FFFFFF',
        }} />
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.centerContent}>
            <Text style={[styles.errorText, { color: colors.text }]}>Planeación no encontrada</Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => router.back()}
            >
              <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }

  const isPremium = user?.estado_membresia === 'Premium';

  const handleCopy = async () => {
    if (!isPremium) {
      showUpgradeAlert();
      return;
    }

    try {
      await Clipboard.setStringAsync(lessonPlan.generatedContent || '');
      const message = 'Planeación copiada al portapapeles';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Éxito', message);
      }
    } catch (error) {
      console.error('Error copying:', error);
    }
  };

  const handleDownload = async () => {
    if (!isPremium) {
      showUpgradeAlert();
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const message = 'Funcionalidad de descarga próximamente disponible';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Información', message);
      }
    }, 1000);
  };

  const handleShare = async () => {
    if (!isPremium) {
      showUpgradeAlert();
      return;
    }

    try {
      if (Platform.OS === 'web') {
        alert('Funcionalidad de compartir próximamente disponible');
      } else {
        await Share.share({
          message: lessonPlan.generatedContent || '',
          title: lessonPlan.title,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const showUpgradeAlert = () => {
    const message = 'Esta función está disponible solo para usuarios Premium. Actualiza tu membresía para acceder a todas las funcionalidades.';
    if (Platform.OS === 'web') {
      alert(message);
    } else {
      Alert.alert('Función Premium', message, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Actualizar', onPress: () => router.push('/(tabs)/profile') },
      ]);
    }
  };

  return (
    <>
      <Stack.Screen options={{
        title: 'Resultado',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#FFFFFF',
      }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>{lessonPlan.title}</Text>
            <Text style={[styles.metadata, { color: colors.muted }]}>
              {lessonPlan.grade} • {lessonPlan.subject}
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.contentText, { color: colors.text }]}>
              {lessonPlan.generatedContent}
            </Text>
          </View>

          {!isPremium && (
            <View style={[styles.upsellCard, { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}>
              <Lock size={32} color={colors.primary} />
              <Text style={[styles.upsellTitle, { color: colors.primary }]}>Actualiza a Premium</Text>
              <Text style={[styles.upsellText, { color: colors.text }]}>
                Desbloquea la capacidad de copiar, descargar y compartir tus planeaciones.
              </Text>
              <TouchableOpacity
                style={[styles.upgradeButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/(tabs)/profile')}
              >
                <Text style={styles.upgradeButtonText}>Actualizar Ahora</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              testID="copy-button"
              style={[
                styles.actionButton,
                { backgroundColor: isPremium ? colors.primary : colors.muted },
                !isPremium && styles.disabledButton
              ]}
              onPress={handleCopy}
              disabled={isLoading}
            >
              {!isPremium && (
                <View style={styles.lockIcon}>
                  <Lock size={16} color="#FFFFFF" />
                </View>
              )}
              <Copy size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Copiar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="download-button"
              style={[
                styles.actionButton,
                { backgroundColor: isPremium ? colors.primary : colors.muted },
                !isPremium && styles.disabledButton
              ]}
              onPress={handleDownload}
              disabled={isLoading}
            >
              {!isPremium && (
                <View style={styles.lockIcon}>
                  <Lock size={16} color="#FFFFFF" />
                </View>
              )}
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Download size={20} color="#FFFFFF" />
              )}
              <Text style={styles.actionButtonText}>Descargar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="share-button"
              style={[
                styles.actionButton,
                { backgroundColor: isPremium ? colors.primary : colors.muted },
                !isPremium && styles.disabledButton
              ]}
              onPress={handleShare}
              disabled={isLoading}
            >
              {!isPremium && (
                <View style={styles.lockIcon}>
                  <Lock size={16} color="#FFFFFF" />
                </View>
              )}
              <Share2 size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Compartir</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  metadata: {
    fontSize: 14,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  upsellCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  upsellTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginTop: 12,
    marginBottom: 8,
  },
  upsellText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  disabledButton: {
    opacity: 0.7,
  },
  lockIcon: {
    position: 'absolute' as const,
    top: 4,
    right: 4,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
