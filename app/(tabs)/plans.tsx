import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, useColorScheme } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Search, Filter, BookOpen } from 'lucide-react-native';
import { useState } from 'react';
import Colors from '@/constants/colors';
import { useFilteredLessonPlans } from '@/contexts/LessonPlansContext';
import { CAMPOS_FORMATIVOS, GRADES } from '@/types/lessonPlan';

export default function PlansScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [campoFilter, setCampoFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPlans = useFilteredLessonPlans(searchQuery, gradeFilter, campoFilter);

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Planeaciones',
      }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Search size={20} color={colors.muted} />
          <TextInput
            testID="search-input"
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar planeaciones..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <Filter size={20} color={showFilters ? colors.primary : colors.muted} />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View style={[styles.filtersContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.filterLabel, { color: colors.text }]}>Grado:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  { backgroundColor: gradeFilter === '' ? colors.primary : colors.background, borderColor: colors.border }
                ]}
                onPress={() => setGradeFilter('')}
              >
                <Text style={[styles.filterChipText, { color: gradeFilter === '' ? '#FFFFFF' : colors.text }]}>
                  Todos
                </Text>
              </TouchableOpacity>
              {GRADES.map((grade) => (
                <TouchableOpacity
                  key={grade}
                  style={[
                    styles.filterChip,
                    { backgroundColor: gradeFilter === grade ? colors.primary : colors.background, borderColor: colors.border }
                  ]}
                  onPress={() => setGradeFilter(grade)}
                >
                  <Text style={[styles.filterChipText, { color: gradeFilter === grade ? '#FFFFFF' : colors.text }]}>
                    {grade}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.filterLabel, { color: colors.text }]}>Campo Formativo:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  { backgroundColor: campoFilter === '' ? colors.primary : colors.background, borderColor: colors.border }
                ]}
                onPress={() => setCampoFilter('')}
              >
                <Text style={[styles.filterChipText, { color: campoFilter === '' ? '#FFFFFF' : colors.text }]}>
                  Todos
                </Text>
              </TouchableOpacity>
              {CAMPOS_FORMATIVOS.map((campo) => (
                <TouchableOpacity
                  key={campo}
                  style={[
                    styles.filterChip,
                    { backgroundColor: campoFilter === campo ? colors.primary : colors.background, borderColor: colors.border }
                  ]}
                  onPress={() => setCampoFilter(campo)}
                >
                  <Text style={[styles.filterChipText, { color: campoFilter === campo ? '#FFFFFF' : colors.text }]}>
                    {campo}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <ScrollView style={styles.listContainer}>
          {filteredPlans.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <BookOpen size={48} color={colors.muted} />
              <Text style={[styles.emptyStateText, { color: colors.muted }]}>
                No se encontraron planeaciones
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.muted }]}>
                Ajusta los filtros o busca otro término
              </Text>
            </View>
          ) : (
            filteredPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                testID={`plan-item-${plan.id}`}
                style={[styles.planCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push(`/plan/${plan.id}` as never)}
              >
                <View style={styles.planCardHeader}>
                  <Text style={[styles.planCardTitle, { color: colors.text }]} numberOfLines={2}>
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
                  <View style={styles.planCardTag}>
                    <Text style={[styles.planCardTagText, { color: colors.secondary }]} numberOfLines={1}>
                      {plan.campoFormativo}
                    </Text>
                  </View>
                  <Text style={[styles.planCardDuration, { color: colors.muted }]}>
                    {plan.duration}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filtersContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginTop: 8,
  },
  filterScroll: {
    marginTop: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed' as const,
    alignItems: 'center',
    gap: 12,
    marginTop: 40,
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
    alignItems: 'flex-start',
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
    marginBottom: 12,
  },
  planCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planCardTag: {
    flex: 1,
  },
  planCardTagText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  planCardDuration: {
    fontSize: 12,
  },
});
