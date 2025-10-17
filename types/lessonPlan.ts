export interface LessonPlan {
  id: string;
  title: string;
  grade: string;
  subject: string;
  campoFormativo: string;
  ejeArticulador: string;
  contenidos: string;
  procesoDesarrollo: string;
  duration: string;
  objectives: string;
  activities: string;
  materials: string;
  evaluation: string;
  inclusiveAdaptations: string;
  notes: string;
  generatedContent: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateLessonPlanInput = Omit<LessonPlan, 'id' | 'createdAt' | 'updatedAt'>;

export const CAMPOS_FORMATIVOS = [
  'Lenguajes',
  'Saberes y Pensamiento Científico',
  'Ética, Naturaleza y Sociedades',
  'De lo Humano y lo Comunitario',
];

export const EJES_ARTICULADORES = [
  'Inclusión',
  'Pensamiento Crítico',
  'Interculturalidad Crítica',
  'Igualdad de Género',
  'Vida Saludable',
  'Apropiación de las Culturas a través de la Lectura y la Escritura',
  'Artes y Experiencias Estéticas',
];

export const GRADES = [
  'Preescolar 1°',
  'Preescolar 2°',
  'Preescolar 3°',
  'Primaria 1°',
  'Primaria 2°',
  'Primaria 3°',
  'Primaria 4°',
  'Primaria 5°',
  'Primaria 6°',
  'Secundaria 1°',
  'Secundaria 2°',
  'Secundaria 3°',
];
