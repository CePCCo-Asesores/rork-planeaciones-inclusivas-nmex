import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import Colors from '@/constants/colors';
import { useLessonPlans } from '@/contexts/LessonPlansContext';
import { CAMPOS_FORMATIVOS, EJES_ARTICULADORES, GRADES, CreateLessonPlanInput } from '@/types/lessonPlan';

export default function CreateLessonPlanScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addLessonPlan, updateLessonPlan, getLessonPlan } = useLessonPlans();

  const isEditing = typeof id === 'string' && id !== '';

  const [form, setForm] = useState<CreateLessonPlanInput>({
    title: '',
    grade: GRADES[0] ?? '',
    subject: '',
    campoFormativo: CAMPOS_FORMATIVOS[0] ?? '',
    ejeArticulador: EJES_ARTICULADORES[0] ?? '',
    contenidos: '',
    procesoDesarrollo: '',
    duration: '',
    objectives: '',
    activities: '',
    materials: '',
    evaluation: '',
    inclusiveAdaptations: '',
    notes: '',
  });

  useEffect(() => {
    if (isEditing) {
      const plan = getLessonPlan(id);
      if (plan) {
        setForm({
          title: plan.title,
          grade: plan.grade,
          subject: plan.subject,
          campoFormativo: plan.campoFormativo,
          ejeArticulador: plan.ejeArticulador,
          contenidos: plan.contenidos,
          procesoDesarrollo: plan.procesoDesarrollo,
          duration: plan.duration,
          objectives: plan.objectives,
          activities: plan.activities,
          materials: plan.materials,
          evaluation: plan.evaluation,
          inclusiveAdaptations: plan.inclusiveAdaptations,
          notes: plan.notes,
        });
      }
    }
  }, [isEditing, id, getLessonPlan]);

  const handleSave = () => {
    if (!form.title.trim()) {
      Alert.alert('Error', 'Por favor ingresa un título para la planeación');
      return;
    }
    if (!form.subject.trim()) {
      Alert.alert('Error', 'Por favor ingresa la asignatura');
      return;
    }

    if (isEditing) {
      updateLessonPlan(id, form);
      Alert.alert('Éxito', 'Planeación actualizada correctamente', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } else {
      addLessonPlan(form);
      Alert.alert('Éxito', 'Planeación creada correctamente', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  };

  return (
    <>
      <Stack.Screen options={{
        title: isEditing ? 'Editar Planeación' : 'Nueva Planeación',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#FFFFFF',
      }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Título *</Text>
            <TextInput
              testID="title-input"
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="Ej: Los seres vivos y su hábitat"
              placeholderTextColor={colors.muted}
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.section, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.text }]}>Grado *</Text>
              <View style={[styles.picker, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {GRADES.map((grade) => (
                    <TouchableOpacity
                      key={grade}
                      style={[
                        styles.pickerOption,
                        form.grade === grade && { backgroundColor: colors.primary }
                      ]}
                      onPress={() => setForm({ ...form, grade })}
                    >
                      <Text style={[styles.pickerOptionText, { color: form.grade === grade ? '#FFFFFF' : colors.text }]}>
                        {grade}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={[styles.section, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.text }]}>Duración</Text>
              <TextInput
                testID="duration-input"
                style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                placeholder="Ej: 2 sesiones"
                placeholderTextColor={colors.muted}
                value={form.duration}
                onChangeText={(text) => setForm({ ...form, duration: text })}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Asignatura *</Text>
            <TextInput
              testID="subject-input"
              style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="Ej: Ciencias Naturales"
              placeholderTextColor={colors.muted}
              value={form.subject}
              onChangeText={(text) => setForm({ ...form, subject: text })}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Campo Formativo</Text>
            <View style={[styles.picker, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {CAMPOS_FORMATIVOS.map((campo) => (
                  <TouchableOpacity
                    key={campo}
                    style={[
                      styles.pickerOption,
                      form.campoFormativo === campo && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setForm({ ...form, campoFormativo: campo })}
                  >
                    <Text style={[styles.pickerOptionText, { color: form.campoFormativo === campo ? '#FFFFFF' : colors.text }]}>
                      {campo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Eje Articulador</Text>
            <View style={[styles.picker, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {EJES_ARTICULADORES.map((eje) => (
                  <TouchableOpacity
                    key={eje}
                    style={[
                      styles.pickerOption,
                      form.ejeArticulador === eje && { backgroundColor: colors.secondary }
                    ]}
                    onPress={() => setForm({ ...form, ejeArticulador: eje })}
                  >
                    <Text style={[styles.pickerOptionText, { color: form.ejeArticulador === eje ? '#FFFFFF' : colors.text }]}>
                      {eje}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Contenidos</Text>
            <TextInput
              testID="contenidos-input"
              style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="Describe los contenidos a trabajar..."
              placeholderTextColor={colors.muted}
              value={form.contenidos}
              onChangeText={(text) => setForm({ ...form, contenidos: text })}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Proceso de Desarrollo de Aprendizaje</Text>
            <TextInput
              testID="proceso-input"
              style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="Describe el proceso de aprendizaje..."
              placeholderTextColor={colors.muted}
              value={form.procesoDesarrollo}
              onChangeText={(text) => setForm({ ...form, procesoDesarrollo: text })}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Objetivos de Aprendizaje</Text>
            <TextInput
              testID="objectives-input"
              style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="¿Qué aprenderán los estudiantes?"
              placeholderTextColor={colors.muted}
              value={form.objectives}
              onChangeText={(text) => setForm({ ...form, objectives: text })}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Actividades</Text>
            <TextInput
              testID="activities-input"
              style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="Describe las actividades a realizar..."
              placeholderTextColor={colors.muted}
              value={form.activities}
              onChangeText={(text) => setForm({ ...form, activities: text })}
              multiline
              numberOfLines={6}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Materiales</Text>
            <TextInput
              testID="materials-input"
              style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="Lista de materiales necesarios..."
              placeholderTextColor={colors.muted}
              value={form.materials}
              onChangeText={(text) => setForm({ ...form, materials: text })}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Evaluación</Text>
            <TextInput
              testID="evaluation-input"
              style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="¿Cómo se evaluará el aprendizaje?"
              placeholderTextColor={colors.muted}
              value={form.evaluation}
              onChangeText={(text) => setForm({ ...form, evaluation: text })}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Adaptaciones Inclusivas</Text>
            <TextInput
              testID="adaptations-input"
              style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="Adaptaciones para estudiantes con necesidades especiales..."
              placeholderTextColor={colors.muted}
              value={form.inclusiveAdaptations}
              onChangeText={(text) => setForm({ ...form, inclusiveAdaptations: text })}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Notas Adicionales</Text>
            <TextInput
              testID="notes-input"
              style={[styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              placeholder="Observaciones, recursos adicionales, etc..."
              placeholderTextColor={colors.muted}
              value={form.notes}
              onChangeText={(text) => setForm({ ...form, notes: text })}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            testID="save-button"
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Actualizar Planeación' : 'Guardar Planeación'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
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
  section: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 0,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  picker: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 8,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  pickerOptionText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  saveButton: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
