import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Edit, Trash2, Calendar, Clock, BookOpen } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLessonPlans } from '@/contexts/LessonPlansContext';

export default function LessonPlanDetailScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getLessonPlan, deleteLessonPlan } = useLessonPlans();

  const plan = typeof id === 'string' ? getLessonPlan(id) : null;

  if (!plan) {
    return (
      <>
        <Stack.Screen options={{ title: 'Planeación no encontrada' }} />
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={[styles.errorText, { color: colors.muted }]}>
            No se encontró la planeación
          </Text>
        </View>
      </>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Planeación',
      '¿Estás seguro de que deseas eliminar esta planeación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteLessonPlan(plan.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{
        title: 'Detalle',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#FFFFFF',
        headerRight: () => (
          <View style={{ flexDirection: 'row', gap: 16, marginRight: 8 }}>
            <TouchableOpacity onPress={() => router.push(`/create?id=${plan.id}` as never)}>
              <Edit size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete}>
              <Trash2 size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ),
      }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{plan.title}</Text>
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>{plan.grade}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
                <Text style={styles.badgeText}>{plan.subject}</Text>
              </View>
            </View>
          </View>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Calendar size={16} color={colors.muted} />
              <Text style={[styles.metaText, { color: colors.muted }]}>
                Creado: {new Date(plan.createdAt).toLocaleDateString('es-MX')}
              </Text>
            </View>
            {plan.duration && (
              <View style={styles.metaItem}>
                <Clock size={16} color={colors.muted} />
                <Text style={[styles.metaText, { color: colors.muted }]}>{plan.duration}</Text>
              </View>
            )}
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <BookOpen size={20} color={colors.primary} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Marco Curricular</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.muted }]}>Campo Formativo:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{plan.campoFormativo}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.muted }]}>Eje Articulador:</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{plan.ejeArticulador}</Text>
              </View>
            </View>
          </View>

          {plan.contenidos && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Contenidos</Text>
              <Text style={[styles.sectionText, { color: colors.text }]}>{plan.contenidos}</Text>
            </View>
          )}

          {plan.procesoDesarrollo && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Proceso de Desarrollo</Text>
              <Text style={[styles.sectionText, { color: colors.text }]}>{plan.procesoDesarrollo}</Text>
            </View>
          )}

          {plan.objectives && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Objetivos de Aprendizaje</Text>
              <Text style={[styles.sectionText, { color: colors.text }]}>{plan.objectives}</Text>
            </View>
          )}

          {plan.activities && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Actividades</Text>
              <Text style={[styles.sectionText, { color: colors.text }]}>{plan.activities}</Text>
            </View>
          )}

          {plan.materials && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Materiales</Text>
              <Text style={[styles.sectionText, { color: colors.text }]}>{plan.materials}</Text>
            </View>
          )}

          {plan.evaluation && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Evaluación</Text>
              <Text style={[styles.sectionText, { color: colors.text }]}>{plan.evaluation}</Text>
            </View>
          )}

          {plan.inclusiveAdaptations && (
            <View style={[styles.card, { backgroundColor: colors.accent, borderColor: colors.accent }]}>
              <Text style={[styles.sectionTitle, { color: '#1A1A1A' }]}>Adaptaciones Inclusivas</Text>
              <Text style={[styles.sectionText, { color: '#1A1A1A' }]}>{plan.inclusiveAdaptations}</Text>
            </View>
          )}

          {plan.notes && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Notas Adicionales</Text>
              <Text style={[styles.sectionText, { color: colors.text }]}>{plan.notes}</Text>
            </View>
          )}

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
  errorText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  metaContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 16,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  cardContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
