import type { User } from "@/context/AuthContext";

export interface Leccion {
  id: string;
  titulo: string;
  descripcion: string;
  xp: number;
  contenido: string;
  objetivo?: string;
  instruccion?: string;
  bloques?: { tipo: string; valor: string }[];
  codigoEsperado?: string;
  pista?: string;
  mensajeExito?: string;
}

export interface Curso {
  id: string;
  nivel: User["nivel"];
  titulo: string;
  descripcion: string;
  color: string;
  icono: string;
  desbloqueado: boolean;
  lecciones: Leccion[];
}

export const cursos: Curso[] = [
  {
    id: "nivel-0",
    nivel: "Nivel 0",
    titulo: "Nivel 0 - Desde cero",
    descripcion: "Aprende lo basico para entender la programacion.",
    color: "success",
    icono: "🌱",
    desbloqueado: true,
    lecciones: [
      {
        id: "n0-1",
        titulo: "Que es programar",
        descripcion: "Tu primer mensaje en codigo",
        xp: 50,
        contenido:
          "Programar es darle instrucciones precisas a una computadora para que realice una tarea. En JavaScript, una forma simple de pedirle que muestre un mensaje es usar console.log().",
        objetivo: "Entender que un programa es una lista de instrucciones paso a paso.",
        instruccion: "Escribe exactamente esta instruccion para mostrar tu primer mensaje:",
        codigoEsperado: 'console.log("Hola, CodeFlow");',
        pista: "Copia la instruccion completa. Respeta las comillas, los parentesis y el punto y coma final.",
        mensajeExito: "Muy bien. Acabas de darle tu primera instruccion a la computadora.",
      },
      {
        id: "n0-2",
        titulo: "Variables",
        descripcion: "Almacena informacion en tu programa",
        xp: 50,
        contenido:
          "Una variable es un espacio con nombre donde guardas un dato. Por ejemplo, puedes guardar una edad para usarla despues.",
        objetivo: "Crear una variable con let y guardar un numero.",
        instruccion: "Crea una variable llamada edad y guarda el numero 25.",
        codigoEsperado: "let edad = 25;",
        pista: "Usa esta forma: let nombre = valor;",
        mensajeExito: "Correcto. La variable edad ahora guarda el valor 25.",
      },
      {
        id: "n0-3",
        titulo: "Condicionales",
        descripcion: "Toma decisiones con codigo",
        xp: 70,
        contenido:
          "Las condicionales permiten que un programa tome decisiones. Si una condicion se cumple, se ejecuta una instruccion.",
        objetivo: "Usar if para ejecutar codigo solo cuando una condicion sea verdadera.",
        instruccion: "Escribe una condicion que muestre un mensaje si edad es mayor o igual a 18.",
        codigoEsperado: 'if (edad >= 18) { console.log("Mayor de edad"); }',
        pista: "Empieza con if, escribe la condicion entre parentesis y luego el mensaje entre llaves.",
        mensajeExito: "Bien. Tu programa ya puede tomar una decision simple.",
      },
      {
        id: "n0-4",
        titulo: "Loops",
        descripcion: "Repite acciones automaticamente",
        xp: 70,
        contenido:
          "Los loops repiten instrucciones sin escribirlas muchas veces. Son utiles para tareas repetitivas.",
        objetivo: "Usar un ciclo for para repetir un mensaje tres veces.",
        instruccion: "Escribe un for que muestre Hola tres veces.",
        codigoEsperado: 'for (let i = 0; i < 3; i++) { console.log("Hola"); }',
        pista: "Un for necesita inicio, condicion y aumento: for (let i = 0; i < 3; i++).",
        mensajeExito: "Excelente. Usaste un loop para repetir una instruccion.",
      },
    ],
  },
  {
    id: "nivel-basico",
    nivel: "Nivel Basico",
    titulo: "Nivel Basico",
    descripcion: "Loops, funciones, HTML, CSS y JavaScript.",
    color: "primary",
    icono: "🚀",
    desbloqueado: true,
    lecciones: [
      {
        id: "nb-1",
        titulo: "Funciones",
        descripcion: "Encapsula logica reutilizable",
        xp: 80,
        contenido: "Una funcion es un bloque de codigo con nombre que puedes ejecutar cuando quieras.",
        objetivo: "Crear una funcion sencilla.",
        instruccion: "Crea una funcion llamada saludar.",
        codigoEsperado: 'function saludar() { console.log("Hola"); }',
        pista: "Empieza con function, luego el nombre y parentesis.",
      },
      {
        id: "nb-2",
        titulo: "HTML basico",
        descripcion: "Estructura de una pagina web",
        xp: 80,
        contenido: "HTML define la estructura de una pagina web mediante etiquetas.",
      },
      {
        id: "nb-3",
        titulo: "CSS basico",
        descripcion: "Dale estilo a tu sitio",
        xp: 80,
        contenido: "CSS controla como se ven los elementos HTML.",
      },
    ],
  },
  {
    id: "javascript",
    nivel: "JavaScript",
    titulo: "JavaScript",
    descripcion: "Profundiza en JS y crea tus primeros proyectos.",
    color: "warning",
    icono: "⚡",
    desbloqueado: false,
    lecciones: [
      {
        id: "js-1",
        titulo: "Arrays y objetos",
        descripcion: "Estructuras de datos",
        xp: 100,
        contenido: "Los arrays y objetos te permiten organizar datos complejos.",
      },
      {
        id: "js-2",
        titulo: "DOM",
        descripcion: "Manipula la pagina web",
        xp: 100,
        contenido: "El DOM es la representacion de la pagina que JavaScript puede modificar.",
      },
    ],
  },
  {
    id: "proyectos",
    nivel: "Proyectos",
    titulo: "Proyectos",
    descripcion: "Aplica lo aprendido en proyectos reales.",
    color: "info",
    icono: "🏗️",
    desbloqueado: false,
    lecciones: [
      {
        id: "pr-1",
        titulo: "App de tareas",
        descripcion: "Tu primer proyecto completo",
        xp: 200,
        contenido: "Construye una app de tareas usando todo lo aprendido.",
      },
    ],
  },
];

export const retosDiarios = [
  {
    id: "r1",
    titulo: "Crea una variable con tu nombre",
    dificultad: "Facil",
    xp: 30,
    descripcion: "Declara una variable llamada nombre y guarda tu nombre.",
  },
  {
    id: "r2",
    titulo: "Suma de dos numeros",
    dificultad: "Facil",
    xp: 20,
    descripcion: "Escribe una funcion que sume dos numeros.",
  },
  {
    id: "r3",
    titulo: "Mayor de edad",
    dificultad: "Medio",
    xp: 30,
    descripcion: "Dada una edad, indica si es mayor de edad.",
  },
  {
    id: "r4",
    titulo: "Par o impar",
    dificultad: "Facil",
    xp: 20,
    descripcion: "Determina si un numero es par o impar.",
  },
  {
    id: "r5",
    titulo: "Invertir cadena",
    dificultad: "Medio",
    xp: 40,
    descripcion: "Invierte el orden de los caracteres de un texto.",
  },
];

export const logrosCatalogo = [
  { id: "primer-paso", titulo: "Primer paso", descripcion: "Completaste tu primera leccion", icono: "🏆", color: "warning" },
  { id: "racha-7", titulo: "7 dias seguidos", descripcion: "Manten la racha de 7 dias", icono: "🔥", color: "primary" },
  { id: "aprendiz-rapido", titulo: "Aprendiz rapido", descripcion: "Completa 10 lecciones", icono: "⚡", color: "success" },
  { id: "explorador", titulo: "Explorador", descripcion: "Visita todas las secciones", icono: "🧭", color: "info" },
];

export const progresoSemanal = [
  { dia: "Lun", xp: 60 },
  { dia: "Mar", xp: 120 },
  { dia: "Mie", xp: 80 },
  { dia: "Jue", xp: 150 },
  { dia: "Vie", xp: 100 },
  { dia: "Sab", xp: 180 },
  { dia: "Dom", xp: 140 },
];

export function getLeccion(id: string) {
  for (const c of cursos) {
    const l = c.lecciones.find((x) => x.id === id);
    if (l) return { curso: c, leccion: l };
  }
  return null;
}
