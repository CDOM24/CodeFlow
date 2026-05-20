<?php

namespace Database\Seeders;

use App\Models\DailyChallenge;
use App\Models\LearningLevel;
use Illuminate\Database\Seeder;

class CodeflowLearningSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->levels() as $levelData) {
            $lessons = $levelData['lessons'];
            unset($levelData['lessons']);

            $level = LearningLevel::updateOrCreate(
                ['slug' => $levelData['slug']],
                $levelData
            );

            foreach ($lessons as $lesson) {
                $level->lessons()->updateOrCreate(
                    ['external_id' => $lesson['external_id']],
                    $lesson
                );
            }
        }

        foreach ($this->challenges() as $challenge) {
            DailyChallenge::updateOrCreate(
                ['external_id' => $challenge['external_id']],
                $challenge
            );
        }
    }

    private function levels(): array
    {
        return [
            [
                'slug' => 'nivel-0',
                'name' => 'Nivel 0',
                'title' => 'Nivel 0 - Bloques',
                'description' => 'Aprende programacion armando instrucciones visuales, como en App Inventor.',
                'color' => 'success',
                'icon' => 'blocks',
                'sort_order' => 1,
                'is_unlocked_by_default' => true,
                'lessons' => [
                    [
                        'external_id' => 'n0-intro',
                        'title' => 'Antes de empezar',
                        'description' => 'Que es una instruccion',
                        'xp' => 20,
                        'type' => 'reading',
                        'content' => 'Programar es ordenar pasos. En Nivel 0 usaras bloques para entender la logica antes de escribir codigo.',
                        'objective' => 'Reconocer que un programa es una secuencia de instrucciones.',
                        'instruction' => 'Lee la explicacion y completa la introduccion.',
                        'success_message' => 'Listo. Ya sabes que programar empieza con ordenar instrucciones.',
                        'sort_order' => 1,
                    ],
                    [
                        'external_id' => 'n0-1',
                        'title' => 'Mostrar un mensaje',
                        'description' => 'Arma tu primer programa con bloques',
                        'xp' => 50,
                        'type' => 'blocks',
                        'content' => 'Un bloque representa una instruccion. Para mostrar un mensaje necesitas iniciar el programa y luego usar un bloque de mensaje.',
                        'objective' => 'Crear una secuencia de bloques para mostrar un mensaje.',
                        'instruction' => 'Agrega los bloques en este orden: Inicio, Mostrar mensaje.',
                        'expected_answer' => 'start|show-message',
                        'hint' => 'Todo programa empieza con Inicio. Despues va la accion que quieres hacer.',
                        'success_message' => 'Perfecto. Tu primer programa visual muestra un mensaje.',
                        'blocks' => [
                            ['id' => 'start', 'label' => 'Inicio', 'kind' => 'event'],
                            ['id' => 'show-message', 'label' => 'Mostrar mensaje: Hola, CodeFlow', 'kind' => 'action'],
                            ['id' => 'wait', 'label' => 'Esperar 1 segundo', 'kind' => 'action'],
                        ],
                        'sort_order' => 2,
                    ],
                    [
                        'external_id' => 'n0-2',
                        'title' => 'Guardar un dato',
                        'description' => 'Variables con bloques',
                        'xp' => 50,
                        'type' => 'blocks',
                        'content' => 'Una variable guarda informacion. En bloques, primero creas la variable y luego puedes usarla.',
                        'objective' => 'Guardar tu edad en una variable visual.',
                        'instruction' => 'Agrega los bloques en este orden: Inicio, Crear variable edad, Guardar 25.',
                        'expected_answer' => 'start|create-age|set-age',
                        'hint' => 'Primero crea la variable; despues asigna el valor.',
                        'success_message' => 'Bien. Ahora la variable edad guarda un dato.',
                        'blocks' => [
                            ['id' => 'start', 'label' => 'Inicio', 'kind' => 'event'],
                            ['id' => 'set-age', 'label' => 'Guardar 25 en edad', 'kind' => 'data'],
                            ['id' => 'create-age', 'label' => 'Crear variable edad', 'kind' => 'data'],
                        ],
                        'sort_order' => 3,
                    ],
                    [
                        'external_id' => 'n0-3',
                        'title' => 'Tomar una decision',
                        'description' => 'Condiciones con bloques',
                        'xp' => 70,
                        'type' => 'blocks',
                        'content' => 'Una condicion permite ejecutar una accion solo si algo se cumple.',
                        'objective' => 'Usar una decision visual con si/entonces.',
                        'instruction' => 'Agrega los bloques en este orden: Inicio, Si edad >= 18, Mostrar mayor de edad.',
                        'expected_answer' => 'start|if-adult|show-adult',
                        'hint' => 'La condicion va antes del mensaje porque decide si el mensaje se muestra.',
                        'success_message' => 'Muy bien. Tu programa ya toma una decision.',
                        'blocks' => [
                            ['id' => 'show-adult', 'label' => 'Mostrar: Mayor de edad', 'kind' => 'action'],
                            ['id' => 'start', 'label' => 'Inicio', 'kind' => 'event'],
                            ['id' => 'if-adult', 'label' => 'Si edad >= 18', 'kind' => 'logic'],
                        ],
                        'sort_order' => 4,
                    ],
                ],
            ],
            [
                'slug' => 'nivel-basico',
                'name' => 'Nivel Basico',
                'title' => 'Nivel Basico - Consola',
                'description' => 'Pasa de bloques a codigo escrito con ejercicios cortos y preguntas.',
                'color' => 'primary',
                'icon' => 'terminal',
                'sort_order' => 2,
                'is_unlocked_by_default' => true,
                'lessons' => [
                    [
                        'external_id' => 'nb-intro',
                        'title' => 'Del bloque al codigo',
                        'description' => 'Como se traduce una instruccion visual',
                        'xp' => 30,
                        'type' => 'reading',
                        'content' => 'Los bloques ayudan a entender la logica. En codigo escribes esas mismas instrucciones usando palabras y simbolos.',
                        'objective' => 'Entender que el codigo escrito representa las mismas acciones de los bloques.',
                        'instruction' => 'Lee la introduccion antes de pasar a la consola.',
                        'success_message' => 'Bien. Ya puedes pasar de bloques a codigo.',
                        'sort_order' => 1,
                    ],
                    [
                        'external_id' => 'nb-1',
                        'title' => 'console.log',
                        'description' => 'Muestra un mensaje en consola',
                        'xp' => 60,
                        'type' => 'console',
                        'content' => 'console.log permite mostrar un mensaje. Es una de las primeras instrucciones que se aprende en JavaScript.',
                        'objective' => 'Escribir una instruccion de consola.',
                        'instruction' => 'Escribe el codigo exacto para mostrar Hola, CodeFlow.',
                        'expected_answer' => 'console.log("Hola, CodeFlow");',
                        'hint' => 'Usa console.log, parentesis, comillas y punto y coma.',
                        'success_message' => 'Correcto. La consola puede mostrar tu mensaje.',
                        'sort_order' => 2,
                    ],
                    [
                        'external_id' => 'nb-2',
                        'title' => 'Variables',
                        'description' => 'Guarda informacion con let',
                        'xp' => 60,
                        'type' => 'console',
                        'content' => 'Una variable es un nombre que guarda un valor. Con let puedes crear una variable.',
                        'objective' => 'Crear una variable llamada edad.',
                        'instruction' => 'Crea una variable llamada edad y guarda el numero 25.',
                        'expected_answer' => 'let edad = 25;',
                        'hint' => 'La forma es: let nombre = valor;',
                        'success_message' => 'Correcto. Creaste una variable.',
                        'sort_order' => 3,
                    ],
                    [
                        'external_id' => 'nb-quiz-1',
                        'title' => 'Pregunta rapida',
                        'description' => 'Repasa variables',
                        'xp' => 40,
                        'type' => 'quiz',
                        'content' => 'Elige la opcion correcta.',
                        'objective' => 'Identificar para que sirve una variable.',
                        'instruction' => 'Que hace una variable?',
                        'expected_answer' => 'guardar-datos',
                        'hint' => 'Piensa en una caja con nombre.',
                        'success_message' => 'Exacto. Una variable guarda datos para usarlos despues.',
                        'options' => [
                            ['id' => 'pintar-pantalla', 'label' => 'Pinta toda la pantalla'],
                            ['id' => 'guardar-datos', 'label' => 'Guarda datos con un nombre'],
                            ['id' => 'apagar-computador', 'label' => 'Apaga el computador'],
                        ],
                        'sort_order' => 4,
                    ],
                ],
            ],
            [
                'slug' => 'javascript',
                'name' => 'JavaScript',
                'title' => 'JavaScript - Logica',
                'description' => 'Practica decisiones, funciones y estructuras basicas.',
                'color' => 'warning',
                'icon' => 'zap',
                'sort_order' => 3,
                'is_unlocked_by_default' => false,
                'lessons' => [
                    [
                        'external_id' => 'js-intro',
                        'title' => 'Pensar como programador',
                        'description' => 'Divide problemas en pasos',
                        'xp' => 40,
                        'type' => 'reading',
                        'content' => 'Programar tambien es analizar problemas. Antes de escribir codigo, piensa entradas, proceso y salida.',
                        'objective' => 'Separar un problema en partes pequenas.',
                        'instruction' => 'Lee la introduccion.',
                        'success_message' => 'Listo. Ya estas pensando por pasos.',
                        'sort_order' => 1,
                    ],
                    [
                        'external_id' => 'js-1',
                        'title' => 'Funciones',
                        'description' => 'Reutiliza instrucciones',
                        'xp' => 100,
                        'type' => 'console',
                        'content' => 'Una funcion agrupa instrucciones y permite usarlas varias veces.',
                        'objective' => 'Crear una funcion llamada saludar.',
                        'instruction' => 'Escribe una funcion llamada saludar que muestre Hola.',
                        'expected_answer' => 'function saludar() { console.log("Hola"); }',
                        'hint' => 'Empieza con function saludar().',
                        'success_message' => 'Muy bien. Creaste una funcion reutilizable.',
                        'sort_order' => 2,
                    ],
                ],
            ],
        ];
    }

    private function challenges(): array
    {
        return [
            [
                'external_id' => 'r1',
                'title' => 'Crea una variable con tu nombre',
                'difficulty' => 'Facil',
                'xp' => 30,
                'description' => 'Declara una variable llamada nombre y guarda tu nombre.',
                'expected_answer' => 'let nombre = "Carlos";',
                'sort_order' => 1,
            ],
            [
                'external_id' => 'r2',
                'title' => 'Suma de dos numeros',
                'difficulty' => 'Facil',
                'xp' => 20,
                'description' => 'Escribe una funcion que sume dos numeros.',
                'expected_answer' => 'function sumar(a, b) { return a + b; }',
                'sort_order' => 2,
            ],
            [
                'external_id' => 'r3',
                'title' => 'Mayor de edad',
                'difficulty' => 'Medio',
                'xp' => 30,
                'description' => 'Dada una edad, indica si es mayor de edad.',
                'expected_answer' => 'edad >= 18',
                'sort_order' => 3,
            ],
        ];
    }
}
