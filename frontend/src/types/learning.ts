export interface Bloque {
  id: string;
  label: string;
  kind: "event" | "action" | "data" | "logic" | string;
}

export interface Opcion {
  id: string;
  label: string;
}

export interface Leccion {
  id: string;
  titulo: string;
  descripcion: string;
  xp: number;
  tipo: "reading" | "blocks" | "console" | "quiz" | string;
  contenido: string;
  objetivo?: string | null;
  instruccion?: string | null;
  codigoEsperado?: string | null;
  pista?: string | null;
  mensajeExito?: string | null;
  bloques: Bloque[];
  opciones: Opcion[];
}

export interface Curso {
  id: string;
  nivel: string;
  titulo: string;
  descripcion: string;
  color: string;
  icono: string;
  desbloqueado: boolean;
  sortOrder: number;
  lecciones: Leccion[];
}

export interface RetoDiario {
  id: string;
  titulo: string;
  dificultad: string;
  xp: number;
  descripcion: string;
}

export interface LearningPayload {
  levels: Curso[];
  challenges: RetoDiario[];
}

export interface CompleteLessonPayload {
  answer?: string;
  blocks?: string[];
  selectedOption?: string;
}
