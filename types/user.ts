export interface User {
  userId: string;
  nombreCompleto: string;
  email: string;
  estado_membresia: 'Gratuita' | 'Premium';
  nombreEscuela: string;
  nivelPredeterminado: 'Preescolar' | 'Primaria' | 'Secundaria';
  gradoPredeterminado: string;
  urlLogoEscuela?: string;
  mantenerseConectado?: boolean;
}

export type CreateUserInput = {
  nombreCompleto: string;
  email: string;
  password: string;
  aceptaTerminos: boolean;
};

export type LoginInput = {
  email: string;
  password: string;
  mantenerseConectado: boolean;
};

export const NIVELES_EDUCATIVOS = ['Preescolar', 'Primaria', 'Secundaria'] as const;

export const GRADOS_POR_NIVEL: Record<string, string[]> = {
  'Preescolar': ['1', '2', '3'],
  'Primaria': ['1', '2', '3', '4', '5', '6'],
  'Secundaria': ['1', '2', '3'],
};
