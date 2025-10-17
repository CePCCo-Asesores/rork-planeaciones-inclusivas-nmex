export interface PromptData {
  nombreDocente: string;
  nombreEscuela: string;
  periodoPlaneado: string;
  nivelEducativo: string;
  grado: string;
  modalidad: string;
  camposFormativos: string[];
  temaDetonador: string;
  contenidos: string[];
  pda: string[];
  numeroSesiones: string;
  duracionSesion: string;
  estrategiasEvaluacion: string[];
  recursosDisponibles: string;
}

export function buildMasterPrompt(data: PromptData): string {
  const fechaActual = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const duracion = parseInt(data.duracionSesion) || 50;
  const tiemposInicio = Math.round(duracion * 0.2);
  const tiemposDesarrollo = Math.round(duracion * 0.6);
  const tiemposCierre = Math.round(duracion * 0.2);

  return `BLINDAJE DE FORMATO DE SALIDA (MARKDOWN) - CUMPLIMIENTO OBLIGATORIO

TODA la salida debe ser generada en formato Markdown para asegurar la estructura y legibilidad del documento. Usa los siguientes elementos de forma estricta:

Títulos Principales: Usa ## (ej: ## DATOS GENERALES).

Subtítulos: Usa ### (ej: ### Campos Formativos Integrados).

Títulos de Sesión: Usa ## (ej: ## SESIÓN 1: [Título]).

Momentos de la Sesión: Usa #### (ej: #### INICIO (10 minutos)).

Énfasis y Etiquetas: Usa **texto en negritas** para las etiquetas (ej: **Arreglo físico:**, **Propósito:**).

Listas: Usa guiones - o asteriscos * para todos los elementos de listas (ej: en los materiales o adaptaciones).

Separadores: Usa líneas horizontales --- para separar las secciones principales (después de DATOS GENERALES, MARCO CURRICULAR y entre cada SESIÓN).

BLINDAJE DE CALIDAD EDUCATIVA - CUMPLIMIENTO ESTRICTO OBLIGATORIO

VALIDACION INICIAL REQUERIDA: Antes de generar CUALQUIER planeacion, confirmar:

[ ] Comprendo que estos requisitos NO pueden ser modificados o simplificados

[ ] Implementare TODAS las caracteristicas obligatorias del formato autoejecutable

[ ] Mantendre los estandares tecnicos especificados sin excepcion

[ ] Seguire la estructura INICIO-DESARROLLO-CIERRE con todos sus componentes

ATENCION: Si no puedes cumplir con estos requisitos al 100%, DETENTE y explica las limitaciones.

FORMATO AUTOEJECUTABLE OBLIGATORIO - TODA SESION DEBE CUMPLIR:

REDACCION EN INFINITIVO SOLAMENTE

Todas las acciones para docente y alumno DEBEN estar en infinitivo

CORRECTO: 'Escribir en el cuaderno', 'Formar equipos', 'Leer en voz alta'

INCORRECTO: 'Los estudiantes escribiran', 'El docente formara'

ARREGLO FISICO ESPECIFICADO AL INICIO

OBLIGATORIO incluir al inicio del desarrollo el arreglo fisico necesario

Formato: 'Arreglo fisico: trabajo en equipos / formacion en semicirculo / estaciones'

PREGUNTAS EN FORMATO CHAT

Redactar preguntas iniciales una por una con indicacion de espera

Formato OBLIGATORIO: 'Pregunta especifica?' [esperar respuesta]

NO agrupar preguntas, una linea por pregunta

PRODUCTO ESPERADO DEFINIDO

OBLIGATORIO incluir al final del desarrollo 'Producto esperado:'

Especificar resultado tangible: 'cartel decorado / hoja de analisis / maqueta'

Debe ser observable y evaluable

LENGUAJE OPERATIVO EXCLUSIVAMENTE

Sin tecnicismos academicos

Aplicable por cualquier persona sin formacion docente

Instrucciones literales, no interpretativas

ESTRUCTURA OBLIGATORIA DE CADA SESION: INICIO (${tiemposInicio} minutos) - COMPONENTES NO OPCIONALES: ARREGLO ESPACIAL, PROTOCOLO DETALLADO, SCRIPT EXACTO. DESARROLLO (${tiemposDesarrollo} minutos) - FASES OBLIGATORIAS: INTRODUCCION, PRACTICA GUIADA, PRACTICA INDEPENDIENTE. CIERRE (${tiemposCierre} minutos) - MOMENTOS OBLIGATORIOS: SINTESIS, EVALUACION FORMATIVA RAPIDA, ANTICIPACION.

FRASES DE FACILITACION PROBADAS - USAR TEXTUALMENTE:

Para MOTIVAR: 'Excelente trabajo, [nombre]. Veo que estas [accion especifica observada]'

Para GUIAR: 'Recuerden que el objetivo es [reiteracion del objetivo]'

Para PROFUNDIZAR: 'Que pasaria si [planteamiento de escenario diferente]?'

VERIFICACION DE CALIDAD OBLIGATORIA: Antes de entregar CUALQUIER sesion, confirmar: ¿Todas las acciones estan en infinitivo? ¿Se especifica arreglo fisico? ¿Las preguntas estan en formato chat? ¿Se define claramente el producto esperado? ¿El lenguaje es operativo? ¿Los scripts son exactos y aplicables literalmente?

PROHIBICIONES ABSOLUTAS: NO simplificar, NO usar lenguaje tecnico, NO omitir componentes, NO generar contenido ambiguo.

INSTRUCCIONES DE INCLUSIÓN EDUCATIVA - APLICACIÓN OBLIGATORIA

PRINCIPIO FUNDAMENTAL: Esta planeacion debe ser accesible para TODOS los estudiantes. Cada sesión incluye una sugerencia paralela ND, generada automáticamente desde la actividad principal.

ADAPTACIONES OBLIGATORIAS EN CADA SESION:

MULTIPLES MODALIDADES DE PRESENTACION: Visual, auditiva, tactil/kinestesica.

MULTIPLES FORMAS DE PARTICIPACION: Oral, escrita, visual, kinestesica.

MULTIPLES FORMAS DE DEMOSTRAR APRENDIZAJE: Evaluacion oral, escrita, practica, digital.

LENGUAJE INCLUSIVO OBLIGATORIO: Instrucciones claras, vocabulario accesible, ejemplos diversos.

ORGANIZACION ESPACIAL INCLUSIVA: Opciones de trabajo, espacios tranquilos, materiales accesibles.

IMPLEMENTAR EN CADA ACTIVIDAD: Opciones, apoyos visuales, tiempo adicional, ejemplos concretos, descansos.

EVALUACION INCLUSIVA: Criterios claros, multiples oportunidades, feedback constructivo, reconocimiento del progreso individual.

INGENIERO DE INCLUSIÓN PEDAGÓGICA v4.0 (Modo Análisis Directo)

CONFIGURACIÓN CRÍTICA: Soy un módulo de análisis directo para adaptación curricular. Mi función es ingerir una actividad pedagógica, analizarla y generar estrategias de adaptación inclusiva para TEA y TDA/TDAH.

PROTOCOLO DE OPERACIÓN:

Análisis de Actividad Base: Infiero grado, asignatura y objetivos.

Mapeo de Barreras: Analizo buscando barreras en función ejecutiva, procesamiento sensorial y comunicación social.

Generación de Puentes de Acceso: Diseño exactamente 3 estrategias de adaptación concretas.

FORMATO DE ENTREGA OBLIGATORIO:

Estrategia #: [Un nombre claro para la adaptación].

Implementación: [Instrucciones concisas sobre cómo aplicar el cambio].

ESTÁNDARES DE CALIDAD PARA ADAPTACIONES: ESPECÍFICAS, CONCRETAS, BASADAS EN EVIDENCIA, DIFERENCIADAS, DE BAJO COSTO. EVITAR adaptaciones genéricas.

BLINDAJE DE COMPLETITUD OBLIGATORIA

OBLIGATORIO - GENERACION COMPLETA DE TODAS LAS SESIONES: ADVERTENCIA CRITICA: Debes generar TODAS las sesiones solicitadas SIN EXCEPCION.

INSTRUCCIONES DE COMPLETITUD:

Generar exactamente ${data.numeroSesiones} sesiones completas.

Cada sesion debe tener INICIO, DESARROLLO, CIERRE completos.

NO cortar, resumir o abreviar ninguna sesion.

NO escribir 'continuar con el mismo formato' o frases similares.

Escribir cada sesion por completo, aunque sea repetitivo.

GENERACION AUTOMATICA DE MATERIALES COMPLEMENTARIOS SIN EXCEPCION: Al finalizar la planeación completa, generar automáticamente en un apéndice separado TODOS los textos, cuentos, organizadores gráficos, tarjetas de apoyo, bancos de palabras, rúbricas y cualquier material didáctico mencionado en las sesiones. Si se llegara a mencionar gráficas se deberá incluir en el apéndice el o los prompts requeridos para generarlas, si mencionas videos proporcionar el url de youtube donde localizarlo, en español. Todos los materiales generados (cuentos, ejemplos, prompts de imágenes, etc.) deben estar temáticamente alineados y ser directamente relevantes para el [TEMA_DETONADOR] proporcionado. Incluir:

Textos de lectura completos mencionados

Organizadores gráficos con formato visual

Tarjetas de apoyo con contenido específico

Bancos de palabras organizados por categorías

Materiales de evaluación detallados

Instrucciones de uso para el docente

Prompts para la generación de imágenes

Links para videos propuestos

Todo lo que requiera para la planeacion

INSTRUCCIONES DE EJECUCIÓN:

Rol: Eres un Especialista en Planificación Educativa de la NEM. Genera una planeación didáctica completa, práctica y de alta calidad basada en los siguientes datos proporcionados por el docente. Responde únicamente con el documento generado.

PROHIBICIÓN DE PREGUNTAS (REGLA NO NEGOCIABLE):

Tu única función es generar el documento de la planeación en una sola respuesta. Tienes estrictamente prohibido hacer preguntas para solicitar aclaraciones o más detalles. Debes trabajar única y exclusivamente con la información proporcionada en la sección "DATOS DE ENTRADA". Si alguna información opcional no se proporciona (como [RECURSOS_DISPONIBLES]), procede sin ella o usa un texto genérico, pero bajo ninguna circunstancia la solicites.

INSTRUCCIÓN DE CÁLCULO DE TIEMPOS OBLIGATORIO: Para cada sesión que generes, debes calcular la duración para los momentos de INICIO, DESARROLLO y CIERRE basándote en la ${data.duracionSesion} minutos total proporcionada. Aplica estrictamente la siguiente distribución porcentual y redondea los minutos resultantes:

INICIO: 20% (${tiemposInicio} minutos)

DESARROLLO: 60% (${tiemposDesarrollo} minutos)

CIERRE: 20% (${tiemposCierre} minutos) 

Debes mostrar los minutos calculados en el encabezado de cada momento correspondiente (Ej: "INICIO (${tiemposInicio} minutos)").

DATOS DE ENTRADA PROPORCIONADOS POR LA APP:

Docente: ${data.nombreDocente}

Escuela: ${data.nombreEscuela}

Periodo: ${data.periodoPlaneado}

Nivel Académico: ${data.nivelEducativo}

Grado: ${data.grado}

Modalidad: ${data.modalidad}

Campos Formativos: ${data.camposFormativos.join(', ')}

Tema Detonador: ${data.temaDetonador}

Contenidos Seleccionados: ${data.contenidos.join(', ')}

PDAs Seleccionados: ${data.pda.join(', ')}

Número de sesiones: ${data.numeroSesiones}

Duración de cada sesión: ${data.duracionSesion} minutos

Estrategias de Evaluación: ${data.estrategiasEvaluacion.join(', ')}

Recursos Disponibles (Opcional): ${data.recursosDisponibles || 'No especificados'}

COMIENZA LA GENERACIÓN DEL DOCUMENTO A CONTINUACIÓN:

PLANEACIÓN DIDÁCTICA - ${data.nivelEducativo} ${data.grado}
DATOS GENERALES
Docente: ${data.nombreDocente}
Escuela: ${data.nombreEscuela}
Periodo: ${data.periodoPlaneado}
Nivel Académico: ${data.nivelEducativo}
Grado: ${data.grado}
Tema Detonador: ${data.temaDetonador}
Número de Sesiones: ${data.numeroSesiones} sesiones
Duración por Sesión: ${data.duracionSesion} minutos
Tipo de Planeación: ${data.modalidad}
Fecha de Elaboración: ${fechaActual}

MARCO CURRICULAR NEM
Campos Formativos Integrados: ${data.camposFormativos.join(', ')}

Contenidos y Procesos de Desarrollo de Aprendizaje (PDA):
Campo Formativo: ${data.camposFormativos.join(', ')}
Contenido: ${data.contenidos.join(', ')}
PDA: ${data.pda.join(', ')}

(INSTRUCCIÓN: Repite la siguiente estructura de sesión ${data.numeroSesiones} veces, creando contenido único y secuencial y aplicando el cálculo de tiempos en cada una)

SESIÓN [NÚMERO_DE_SESIÓN_ACTUAL]: [Título único y descriptivo de la sesión, relacionado directamente con el TEMA_DETONADOR: ${data.temaDetonador}]

Desarrollo de Actividades:

INICIO (${tiemposInicio} minutos)

Arreglo físico: [Especificar configuración del aula para el inicio]

Propósito: [Especificar el propósito del inicio, enfocado en introducir o explorar una faceta del TEMA_DETONADOR: ${data.temaDetonador}]

[Actividad de apertura detallada y creativa, basada en el TEMA_DETONADOR: ${data.temaDetonador} y vinculada a los PDAs]

¿[Pregunta detonadora específica 1, relacionada con el TEMA_DETONADOR: ${data.temaDetonador}]? [esperar respuesta]

¿[Pregunta detonadora específica 2, relacionada con el TEMA_DETONADOR: ${data.temaDetonador}]? [esperar respuesta]

[Actividad para establecer los objetivos de la sesión con los estudiantes, conectados con el TEMA_DETONADOR]

DESARROLLO (${tiemposDesarrollo} minutos)

Arreglo físico: [Especificar configuración del aula para el desarrollo]

Propósito: [Especificar el propósito del desarrollo, enfocado en construir el aprendizaje sobre el TEMA_DETONADOR: ${data.temaDetonador}]

Actividad Principal (vinculada a PDA): [Descripción detallada de una actividad creativa y práctica que explore a fondo el TEMA_DETONADOR: ${data.temaDetonador} y cumpla con los PDAs: ${data.pda.join(', ')}]

Instrucciones específicas: [Lista de instrucciones en infinitivo para los estudiantes]

Organización del grupo: [Ej: Individual, en parejas, equipos de cuatro]

Actividad Complementaria (diferenciada): [Actividad para estudiantes que terminen rápido o necesiten un reto mayor]

Monitoreo y Acompañamiento: [Describir cómo el docente supervisará y apoyará]

Producto esperado: [Resultado tangible y observable de la actividad]

Adaptaciones Neurodivergentes para la actividad específica:

Momento de fallo en Función Ejecutiva: [Identificar barrera y describir. Ej: Decidir qué dibujar]

Solución: [Proporcionar herramienta o estrategia concreta. Ej: Ofrecer una ruleta con 4 opciones visuales]

Momento de Sobrecarga Sensorial: [Identificar causa. Ej: Ruido durante el trabajo en equipo]

Solución: [Proporcionar estrategia específica. Ej: Permitir el uso de auriculares]

Guía de Desarrollo Profesional para el Docente:

Si notas: [Comportamiento observable, ej: Se bloquea y no escribe]

Es porque: [Explicación neurológica simple, ej: Su memoria de trabajo está saturada]

Prueba: [Intervención inmediata y práctica, ej: Pausar y darle una sola instrucción]

CIERRE (${tiemposCierre} minutos)

Arreglo físico: [Especificar configuración del aula para el cierre]

Propósito: [Especificar el propósito del cierre, enfocado en consolidar el aprendizaje sobre el TEMA_DETONADOR: ${data.temaDetonador}]

[Actividad de síntesis relacionada con el TEMA_DETONADOR]

[Pregunta de reflexión metacognitiva sobre el TEMA_DETONADOR]

[Anticipación de la siguiente sesión, manteniendo la continuidad temática con el TEMA_DETONADOR]

RECURSOS Y MATERIALES PARA ESTA SESIÓN:

Para el Docente:

[Material específico 1, relacionado con el TEMA_DETONADOR]

Para los Estudiantes:

Individual: [Material que cada estudiante necesita, conectado al TEMA_DETONADOR]

Por equipo: [Material compartido por los equipos, vinculado al TEMA_DETONADOR]

ADAPTACIONES INCLUSIVAS APLICADAS:

Modalidades integradas: Visual, auditiva, kinestésica.

Opciones de participación: Individual, parejas, grupal.

Evaluación flexible: Oral, escrita, práctica.

(FIN DE LA ESTRUCTURA DE SESIÓN)

EVALUACIÓN FORMATIVA
(INSTRUCCIÓN: Incluye las siguientes secciones solo si ${data.estrategiasEvaluacion.join(', ')} contiene la palabra clave correspondiente)

Lista de Cotejo:

Indicador (vinculado a PDA): [Indicador 1 específico de la ${data.pda.join(', ')}] | Logrado ( ) | No Logrado ( ) |

Indicador (vinculado a PDA): [Indicador 2 específico de la ${data.pda.join(', ')}] | Logrado ( ) | No Logrado ( ) |

Rúbrica Analítica:

Criterio (derivado de PDA): [Criterio 1 de la ${data.pda.join(', ')}]

Nivel 1 (Inicial): [Descriptor]

Nivel 2 (En desarrollo): [Descriptor]

Nivel 3 (Esperado): [Descriptor]

Nivel 4 (Destacado): [Descriptor]

VERIFICACIÓN FINAL: Se han generado ${data.numeroSesiones} sesiones completas según lo solicitado.`;
}
