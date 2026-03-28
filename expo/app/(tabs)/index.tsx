import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { BookOpen, Plus, TrendingUp, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useLessonPlans, useLessonPlanStats } from '@/contexts/LessonPlansContext';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { lessonPlans } = useLessonPlans();
  const stats = useLessonPlanStats();

  const recentPlans = lessonPlans
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Inicio',
      }} />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Planeaciones Didácticas
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Sistema de planeación inclusiva
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.primary }]}>
            <BookOpen size={32} color="#FFFFFF" />
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Planeaciones</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.secondary }]}>
            <Calendar size={32} color="#FFFFFF" />
            <Text style={styles.statNumber}>{Object.keys(stats.byGrade).length}</Text>
            <Text style={styles.statLabel}>Grados</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.accent }]}>
            <TrendingUp size={32} color="#FFFFFF" />
            <Text style={styles.statNumber}>{Object.keys(stats.byCampo).length}</Text>
            <Text style={styles.statLabel}>Campos</Text>
          </View>
        </View>

        <TouchableOpacity
          testID="create-lesson-plan-button"
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/create-new' as never)}
        >
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Nueva Planeación</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Planeaciones Recientes
          </Text>
          {recentPlans.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <BookOpen size={48} color={colors.muted} />
              <Text style={[styles.emptyStateText, { color: colors.muted }]}>
                No hay planeaciones aún
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.muted }]}>
                Crea tu primera planeación didáctica
              </Text>
            </View>
          ) : (
            recentPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                testID={`lesson-plan-${plan.id}`}
                style={[styles.planCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push(`/plan/${plan.id}` as never)}
              >
                <View style={styles.planCardHeader}>
                  <Text style={[styles.planCardTitle, { color: colors.text }]} numberOfLines={1}>
                    {plan.title}
                  </Text>
                  <View style={[styles.gradeBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.gradeBadgeText}>{plan.grade}</Text>
                  </View>
                </View>
                <Text style={[styles.planCardSubject, { color: colors.muted }]} numberOfLines={1}>
                  {plan.subject}
                </Text>
                <View style={styles.planCardFooter}>
                  <Text style={[styles.planCardLabel, { color: colors.muted }]} numberOfLines={1}>
                    {plan.campoFormativo}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600' as const,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed' as const,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  emptyStateSubtext: {
    fontSize: 14,
  },
  planCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  planCardTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    flex: 1,
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gradeBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  planCardSubject: {
    fontSize: 14,
    marginBottom: 8,
  },
  planCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planCardLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
});
