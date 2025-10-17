import { useState, useEffect, useMemo } from 'react';
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
import { Sparkles } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useCurriculumData } from '@/contexts/CurriculumDataContext';
import { CAMPOS_FORMATIVOS_POR_NIVEL, ESTRATEGIAS_EVALUACION } from '@/constants/camposFormativos';
import { GRADOS_POR_NIVEL } from '@/types/user';

type Modalidad = 'Secuencial' | 'Por Proyecto';

interface FormData {
  nombreDocente: string;
  nombreEscuela: string;
  periodoPlaneado: string;
  nivelEducativo: 'Preescolar' | 'Primaria' | 'Secundaria';
  grado: string;
  temaDetonador: string;
  numeroSesiones: string;
  duracionSesion: string;
  modalidad: Modalidad;
  camposFormativos: string[];
  contenidos: string[];
  pda: string[];
  estrategiasEvaluacion: string[];
  recursosDisponibles: string;
}

export default function CreateNewLessonPlanScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { user } = useAuth();
  const { getContenidosByCampos, getPDAByContenidos } = useCurriculumData();
  const [isGenerating, setIsGenerating] = useState(false);

  const [form, setForm] = useState<FormData>({
    nombreDocente: '',
    nombreEscuela: '',
    periodoPlaneado: '',
    nivelEducativo: 'Primaria',
    grado: '1',
    temaDetonador: '',
    numeroSesiones: '',
    duracionSesion: '',
    modalidad: 'Secuencial',
    camposFormativos: [],
    contenidos: [],
    pda: [],
    estrategiasEvaluacion: [],
    recursosDisponibles: '',
  });

  const [showNivelPicker, setShowNivelPicker] = useState(false);
  const [showGradoPicker, setShowGradoPicker] = useState(false);
  const [showCamposPicker, setShowCamposPicker] = useState(false);
  const [showContenidosPicker, setShowContenidosPicker] = useState(false);
  const [showPDAPicker, setShowPDAPicker] = useState(false);
  const [showEstrategiasPicker, setShowEstrategiasPicker] = useState(false);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        nombreDocente: user.nombreCompleto,
        nombreEscuela: user.nombreEscuela,
        nivelEducativo: user.nivelPredeterminado,
        grado: user.gradoPredeterminado,
      }));
    }
  }, [user]);

  useEffect(() => {
    setForm(prev => ({
      ...prev,
      camposFormativos: [],
      contenidos: [],
      pda: [],
    }));
  }, [form.nivelEducativo, form.grado]);

  const gradosDisponibles = useMemo(() => {
    return GRADOS_POR_NIVEL[form.nivelEducativo] || [];
  }, [form.nivelEducativo]);

  const camposFormativosDisponibles = useMemo(() => {
    return CAMPOS_FORMATIVOS_POR_NIVEL[form.nivelEducativo]?.[form.grado] || [];
  }, [form.nivelEducativo, form.grado]);

  const contenidosDisponibles = useMemo(() => {
    const result = getContenidosByCampos(
      form.camposFormativos || [], 
      form.nivelEducativo, 
      form.grado
    );
    console.log('Contenidos disponibles:', result);
    return result;
  }, [form.camposFormativos, form.nivelEducativo, form.grado, getContenidosByCampos]);

  const pdaDisponibles = useMemo(() => {
    const result = getPDAByContenidos(
      form.camposFormativos || [], 
      form.contenidos || [], 
      form.nivelEducativo, 
      form.grado
    );
    console.log('PDAs disponibles:', result);
    return result;
  }, [form.camposFormativos, form.contenidos, form.nivelEducativo, form.grado, getPDAByContenidos]);

  const isCampoMultiple = form.modalidad === 'Por Proyecto';

  const handleToggleCampoFormativo = (campo: string) => {
    if (isCampoMultiple) {
      setForm(prev => ({
        ...prev,
        camposFormativos: prev.camposFormativos.includes(campo)
          ? prev.camposFormativos.filter(c => c !== campo)
          : [...prev.camposFormativos, campo],
      }));
    } else {
      setForm(prev => ({
        ...prev,
        camposFormativos: [campo],
      }));
      setShowCamposPicker(false);
    }
  };

  const isContenidoMultiple = form.modalidad === 'Por Proyecto';

  const handleToggleContenido = (contenido: string) => {
    if (isContenidoMultiple) {
      setForm(prev => ({
        ...prev,
        contenidos: prev.contenidos.includes(contenido)
          ? prev.contenidos.filter(c => c !== contenido)
          : [...prev.contenidos, contenido],
        pda: [],
      }));
    } else {
      setForm(prev => ({
        ...prev,
        contenidos: [contenido],
        pda: [],
      }));
      setShowContenidosPicker(false);
    }
  };

  const handleTogglePDA = (pda: string) => {
    if (pda === 'Seleccionar todos') {
      if (form.pda.length === pdaDisponibles.length) {
        setForm(prev => ({ ...prev, pda: [] }));
      } else {
        setForm(prev => ({ ...prev, pda: [...pdaDisponibles] }));
      }
    } else {
      setForm(prev => ({
        ...prev,
        pda: prev.pda.includes(pda)
          ? prev.pda.filter(p => p !== pda)
          : [...prev.pda, pda],
      }));
    }
  };

  const handleToggleEstrategia = (estrategia: string) => {
    setForm(prev => ({
      ...prev,
      estrategiasEvaluacion: prev.estrategiasEvaluacion.includes(estrategia)
        ? prev.estrategiasEvaluacion.filter(e => e !== estrategia)
        : [...prev.estrategiasEvaluacion, estrategia],
    }));
  };

  const handleGenerar = async () => {
    if (!form.temaDetonador.trim()) {
      const message = 'Por favor ingresa un tema detonador';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Campo requerido', message);
      }
      return;
    }

    if (form.camposFormativos.length === 0) {
      const message = 'Por favor selecciona al menos un campo formativo';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Campo requerido', message);
      }
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      const message = 'Planeación generada correctamente';
      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Éxito', message, [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    }, 2000);
  };

  return (
    <>
      <Stack.Screen options={{
        title: 'Generar Planeación',
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#FFFFFF',
      }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Datos Generales</Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Nombre del Docente</Text>
              <TextInput
                testID="nombre-docente-input"
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={form.nombreDocente}
                onChangeText={(text) => setForm({ ...form, nombreDocente: text })}
                placeholder="Tu nombre"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Escuela</Text>
              <TextInput
                testID="escuela-input"
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={form.nombreEscuela}
                onChangeText={(text) => setForm({ ...form, nombreEscuela: text })}
                placeholder="Nombre de la escuela"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Periodo Planeado</Text>
              <TextInput
                testID="periodo-input"
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={form.periodoPlaneado}
                onChangeText={(text) => setForm({ ...form, periodoPlaneado: text })}
                placeholder="Ej: Enero - Febrero 2025"
                placeholderTextColor={colors.muted}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={[styles.label, { color: colors.text }]}>Nivel Educativo</Text>
                <TouchableOpacity
                  testID="nivel-picker"
                  style={[styles.pickerButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={() => setShowNivelPicker(!showNivelPicker)}
                >
                  <Text style={[styles.pickerButtonText, { color: colors.text }]}>
                    {form.nivelEducativo}
                  </Text>
                </TouchableOpacity>
                {showNivelPicker && (
                  <View style={[styles.pickerDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    {(['Preescolar', 'Primaria', 'Secundaria'] as const).map((nivel) => (
                      <TouchableOpacity
                        key={nivel}
                        testID={`nivel-option-${nivel}`}
                        style={[
                          styles.pickerOption,
                          nivel === form.nivelEducativo && { backgroundColor: colors.primary + '20' }
                        ]}
                        onPress={() => {
                          setForm({ ...form, nivelEducativo: nivel, grado: '1' });
                          setShowNivelPicker(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerOptionText,
                          { color: nivel === form.nivelEducativo ? colors.primary : colors.text }
                        ]}>
                          {nivel}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.halfWidth}>
                <Text style={[styles.label, { color: colors.text }]}>Grado</Text>
                <TouchableOpacity
                  testID="grado-picker"
                  style={[styles.pickerButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={() => setShowGradoPicker(!showGradoPicker)}
                >
                  <Text style={[styles.pickerButtonText, { color: colors.text }]}>
                    {form.grado}
                  </Text>
                </TouchableOpacity>
                {showGradoPicker && (
                  <View style={[styles.pickerDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    {gradosDisponibles.map((grado) => (
                      <TouchableOpacity
                        key={grado}
                        testID={`grado-option-${grado}`}
                        style={[
                          styles.pickerOption,
                          grado === form.grado && { backgroundColor: colors.primary + '20' }
                        ]}
                        onPress={() => {
                          setForm({ ...form, grado });
                          setShowGradoPicker(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerOptionText,
                          { color: grado === form.grado ? colors.primary : colors.text }
                        ]}>
                          {grado}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Tema Detonador</Text>
              <TextInput
                testID="tema-input"
                style={[styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={form.temaDetonador}
                onChangeText={(text) => setForm({ ...form, temaDetonador: text })}
                placeholder="Describe el tema central de la planeación..."
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={[styles.label, { color: colors.text }]}>Número de Sesiones</Text>
                <TextInput
                  testID="sesiones-input"
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={form.numeroSesiones}
                  onChangeText={(text) => setForm({ ...form, numeroSesiones: text })}
                  placeholder="Ej: 5"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.halfWidth}>
                <Text style={[styles.label, { color: colors.text }]}>Duración por Sesión</Text>
                <TextInput
                  testID="duracion-input"
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                  value={form.duracionSesion}
                  onChangeText={(text) => setForm({ ...form, duracionSesion: text })}
                  placeholder="Ej: 50 min"
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Configuración Curricular</Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Modalidad</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  testID="modalidad-secuencial"
                  style={styles.radioOption}
                  onPress={() => setForm({ ...form, modalidad: 'Secuencial', camposFormativos: [] })}
                >
                  <View style={[
                    styles.radioCircle,
                    { borderColor: colors.border },
                    form.modalidad === 'Secuencial' && { borderColor: colors.primary }
                  ]}>
                    {form.modalidad === 'Secuencial' && (
                      <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                  <Text style={[styles.radioText, { color: colors.text }]}>Secuencial</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  testID="modalidad-proyecto"
                  style={styles.radioOption}
                  onPress={() => setForm({ ...form, modalidad: 'Por Proyecto', camposFormativos: [] })}
                >
                  <View style={[
                    styles.radioCircle,
                    { borderColor: colors.border },
                    form.modalidad === 'Por Proyecto' && { borderColor: colors.primary }
                  ]}>
                    {form.modalidad === 'Por Proyecto' && (
                      <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                  <Text style={[styles.radioText, { color: colors.text }]}>Por Proyecto</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>
                {isCampoMultiple ? 'Campos Formativos (múltiple)' : 'Campo Formativo'}
              </Text>
              <TouchableOpacity
                testID="campos-picker"
                style={[styles.pickerButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={() => setShowCamposPicker(!showCamposPicker)}
              >
                <Text style={[styles.pickerButtonText, { color: form.camposFormativos.length > 0 ? colors.text : colors.muted }]}>
                  {form.camposFormativos.length > 0
                    ? form.camposFormativos.join(', ')
                    : 'Selecciona...'}
                </Text>
              </TouchableOpacity>
              {showCamposPicker && (
                <View style={[styles.pickerDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  {camposFormativosDisponibles.map((campo) => (
                    <TouchableOpacity
                      key={campo}
                      testID={`campo-option-${campo}`}
                      style={[
                        styles.pickerOption,
                        form.camposFormativos.includes(campo) && { backgroundColor: colors.primary + '20' }
                      ]}
                      onPress={() => handleToggleCampoFormativo(campo)}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        { color: form.camposFormativos.includes(campo) ? colors.primary : colors.text }
                      ]}>
                        {campo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {form.camposFormativos.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Contenidos y PDA</Text>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Contenidos {contenidosDisponibles.length > 0 && `(${contenidosDisponibles.length} disponibles)`}
                  {isContenidoMultiple ? ' - Selección múltiple' : ' - Selección única'}
                </Text>
                <TouchableOpacity
                  testID="contenidos-picker"
                  style={[styles.pickerButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                  onPress={() => setShowContenidosPicker(!showContenidosPicker)}
                  disabled={contenidosDisponibles.length === 0}
                >
                  <Text style={[styles.pickerButtonText, { color: form.contenidos.length > 0 ? colors.text : colors.muted }]}>
                    {contenidosDisponibles.length === 0
                      ? 'Selecciona primero un campo formativo'
                      : form.contenidos.length > 0
                        ? isContenidoMultiple
                          ? `${form.contenidos.length} seleccionados`
                          : form.contenidos[0]
                        : 'Selecciona...'}
                  </Text>
                </TouchableOpacity>
                {showContenidosPicker && contenidosDisponibles.length > 0 && (
                  <ScrollView style={[styles.pickerDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    {contenidosDisponibles.map((contenido, index) => (
                      <TouchableOpacity
                        key={`${contenido}-${index}`}
                        testID={`contenido-option-${index}`}
                        style={[
                          styles.pickerOption,
                          form.contenidos.includes(contenido) && { backgroundColor: colors.primary + '20' }
                        ]}
                        onPress={() => handleToggleContenido(contenido)}
                      >
                        <Text style={[
                          styles.pickerOptionText,
                          { color: form.contenidos.includes(contenido) ? colors.primary : colors.text }
                        ]}>
                          {contenido}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              {form.contenidos.length > 0 && (
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    PDA - Procesos de Desarrollo de Aprendizaje {pdaDisponibles.length > 0 && `(${pdaDisponibles.length} disponibles)`}
                  </Text>
                  <TouchableOpacity
                    testID="pda-picker"
                    style={[styles.pickerButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                    onPress={() => setShowPDAPicker(!showPDAPicker)}
                    disabled={pdaDisponibles.length === 0}
                  >
                    <Text style={[styles.pickerButtonText, { color: form.pda.length > 0 ? colors.text : colors.muted }]}>
                      {pdaDisponibles.length === 0
                        ? 'Selecciona primero contenidos'
                        : form.pda.length > 0
                          ? `${form.pda.length} de ${pdaDisponibles.length} seleccionados`
                          : 'Selecciona...'}
                    </Text>
                  </TouchableOpacity>
                  {showPDAPicker && pdaDisponibles.length > 0 && (
                    <ScrollView style={[styles.pickerDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
                      <TouchableOpacity
                        testID="pda-option-todos"
                        style={[
                          styles.pickerOption,
                          styles.selectAllOption,
                          { borderBottomWidth: 1, borderBottomColor: colors.border },
                          form.pda.length === pdaDisponibles.length && { backgroundColor: colors.primary + '20' }
                        ]}
                        onPress={() => handleTogglePDA('Seleccionar todos')}
                      >
                        <Text style={[
                          styles.pickerOptionText,
                          styles.selectAllText,
                          { 
                            color: form.pda.length === pdaDisponibles.length ? colors.primary : colors.text,
                            fontWeight: '700' as const
                          }
                        ]}>
                          ✓ Seleccionar todos
                        </Text>
                      </TouchableOpacity>
                      {pdaDisponibles.map((pda, index) => (
                        <TouchableOpacity
                          key={`${pda}-${index}`}
                          testID={`pda-option-${index}`}
                          style={[
                            styles.pickerOption,
                            form.pda.includes(pda) && { backgroundColor: colors.primary + '20' }
                          ]}
                          onPress={() => handleTogglePDA(pda)}
                        >
                          <Text style={[
                            styles.pickerOptionText,
                            { color: form.pda.includes(pda) ? colors.primary : colors.text }
                          ]}>
                            {pda}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              )}
            </View>
          )}

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Personalización Final</Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Estrategias de Evaluación</Text>
              <TouchableOpacity
                testID="estrategias-picker"
                style={[styles.pickerButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={() => setShowEstrategiasPicker(!showEstrategiasPicker)}
              >
                <Text style={[styles.pickerButtonText, { color: form.estrategiasEvaluacion.length > 0 ? colors.text : colors.muted }]}>
                  {form.estrategiasEvaluacion.length > 0
                    ? `${form.estrategiasEvaluacion.length} seleccionadas`
                    : 'Selecciona...'}
                </Text>
              </TouchableOpacity>
              {showEstrategiasPicker && (
                <View style={[styles.pickerDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  {ESTRATEGIAS_EVALUACION.map((estrategia) => (
                    <TouchableOpacity
                      key={estrategia}
                      testID={`estrategia-option-${estrategia}`}
                      style={[
                        styles.pickerOption,
                        form.estrategiasEvaluacion.includes(estrategia) && { backgroundColor: colors.primary + '20' }
                      ]}
                      onPress={() => handleToggleEstrategia(estrategia)}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        { color: form.estrategiasEvaluacion.includes(estrategia) ? colors.primary : colors.text }
                      ]}>
                        {estrategia}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text }]}>Recursos Disponibles (opcional)</Text>
              <TextInput
                testID="recursos-input"
                style={[styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                value={form.recursosDisponibles}
                onChangeText={(text) => setForm({ ...form, recursosDisponibles: text })}
                placeholder="Describe los recursos con los que cuentas..."
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          <TouchableOpacity
            testID="generar-button"
            style={[styles.generateButton, { backgroundColor: colors.primary }]}
            onPress={handleGenerar}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Sparkles size={24} color="#FFFFFF" />
                <Text style={styles.generateButtonText}>Generar Planeación</Text>
              </>
            )}
          </TouchableOpacity>

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
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  pickerButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  pickerButtonText: {
    fontSize: 16,
  },
  pickerDropdown: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    maxHeight: 200,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pickerOptionText: {
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioText: {
    fontSize: 16,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  generateButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  infoText: {
    fontSize: 14,
    fontStyle: 'italic' as const,
    paddingVertical: 12,
  },
  selectAllOption: {
    paddingVertical: 14,
  },
  selectAllText: {
    fontSize: 16,
  },
});
