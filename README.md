# LexTrack | AI CODE WARS UMG 2026

Aplicación web académica para gestionar expedientes ficticios del Bufete Popular. La solución permite abrir casos, buscar por identificador o alias, registrar actividades, mover el expediente entre estados válidos, cerrar con motivo y conservar el historial completo, incluyendo la nueva capacidad de reapertura con trazabilidad.

## Instrucciones de ejecución

Requisitos:
- Navegador moderno (Chrome, Edge o Firefox).
- Sin dependencias externas ni backend.

Pasos:
1. Abrir `index.html` directamente en el navegador o ejecutar `python -m http.server 8000` desde esta carpeta y visitar `http://localhost:8000`.
2. Crear un expediente o usar los datos ficticios precargados.
3. Seleccionar un caso desde la lista para ver detalle, actividades y historial.
4. Exportar JSON si se desea respaldo del estado actual.

Los datos persisten en `localStorage` del navegador, conforme a lo solicitado por el enunciado. No hay autenticación ni base de datos externa.

## Estructura del proyecto

- `index.html`: estructura de la plataforma y secciones diferenciadas.
- `styles.css`: identidad visual premium, paneles, tarjetas, estado y responsividad.
- `app.js`: validaciones, almacenamiento local, estados, historial, cierre y reapertura.
- `README.md`: análisis, decisiones con IA, reglas, pruebas y resultados.

## Ficha de análisis y contexto

**Problema:** organizar expedientes ficticios de asistencia legal y mantener seguimiento claro, auditable y usables en un navegador.

**Usuario principal:** personal del bufete ficticio que necesita revisar, filtrar, actualizar y registrar evolución de casos.

**Prioridades:**
1. Apertura segura con validación de datos obligatorios.
2. Consulta rápida por identificador o nombre/alias.
3. Registro de actividades con fecha y hora automáticas.
4. Control de estados y cierre con motivo.
5. Conservación de historial y reapertura con trazabilidad.
6. Experiencia clara, profesional y fácil de operar.

**Datos clave:** `id`, `person`, `responsible`, `category`, `description`, `status`, `createdAt`, `activities`, `history`, `closedAt`, `closureReason`, `closureHistory`.

**Reglas principales:**
- Estado inicial: `Abierto`.
- Transición válida: `Abierto → En seguimiento` con acción explícita del usuario.
- Cierre: `En seguimiento → Cerrado` requiere al menos una actividad y motivo no vacío.
- Expediente cerrado: no se admiten nuevas actividades ni cambios de estado, salvo reapertura explícita.
- Reapertura: `Cerrado → En seguimiento` exige motivo no vacío y conserva todos los cierres previos.
- Historial: guarda apertura, actividades y cambios de estado en secuencia cronológica.
- La categoría es opcional; la información personal real no es necesaria.

**Supuestos:**
- Los datos son ficticios y solo se usan en la competencia.
- No se requiere backend, autenticación ni archivos adjuntos.
- Persistencia local es suficiente y cumple el alcance definido.

## Organización del equipo

| Integrante | Responsabilidad | Integración |
|---|---|---|
| Equipo LexTrack | Análisis de requisitos y reglas de negocio | Revisar el enunciado, validar las transiciones y mantener consistencia |
| Frontend UI | Estructura y estilo de la solución | Paneles, navegación, detalle, formulario y estados visuales |
| Lógica y datos | Validaciones, almacenamiento local y historial | Operaciones de expediente, cierre y reapertura |
| Pruebas | Verificación manual de flujo | Validar cuatro recorridos y documentar observaciones |
| GitHub y entrega | Repositorio y commit final | Publicación y confirmación final del resultado |

## Tres decisiones con IA

| Decisión o necesidad | Aporte de IA | Decisión del equipo y razón | Cómo se comprobó |
|---|---|---|---|
| Elegir persistencia local | Sugerencia de `localStorage` para mantener datos sin backend | Se eligió `localStorage` porque el enunciado permite almacenamiento local y es suficiente para la competencia | Se probó creando, recargando y revisando que la información sigue disponible |
| Diseño de transiciones de estados | Propuso controlar las reglas en lógica y UI | Se validó en ambos niveles: la interfaz y la operación interna para prevenir estados no permitidos | Se intentaron cierres inválidos y cambios entre estados sin cumplimiento de reglas |
| Reapertura con trazabilidad | Se propuso conservar historial previo y anexar la nueva transición | Se implementó con `closureHistory` y un evento nuevo en el historial para conservar cada cierre y su motivo | Se reabrió un caso cerrado, se agregó actividad y se cerró de nuevo verificando la conservación histórica |

## Lista breve de comprobación

| Recorrido | Comprobación esperada | Estado observado |
|---|---|---|
| 1. Apertura | Crear dos expedientes con identificadores distintos; rechazar campos obligatorios incompletos | Cumple |
| 2. Consulta | Buscar por identificador y persona, abrir detalle e historial e informar búsqueda sin resultados | Cumple |
| 3. Seguimiento y cierre | Agregar actividades, pasar a `En seguimiento`, cerrar con actividad previa y motivo; rechazar cierres inválidos y bloquear actividades mientras el expediente esté cerrado | Cumple |
| 4. Reapertura y trazabilidad | Rechazar motivos vacíos y reaperturas en estados incorrectos; reabrir válidamente, agregar actividad y cerrar de nuevo; conservar actividades y ambos cierres con sus fechas y motivos, incluso después de recargar | Cumple |

## Resultados observados

Se validó con un flujo real de prueba:
- Se creó el expediente `EXP-8F2A4D1C` y se mantuvo persistente tras recarga.
- Se revisó el detalle, el historial y la búsqueda por alias/ID.
- Se cerró un caso con actividad previa y motivo no vacío.
- Se reabrió con motivo, se agregó actividad y se cerró nuevamente.
- Se verificó que ambos cierres y motivos se conservan en el historial sin reemplazar el cierre anterior.

## Datos ficticios incluidos

- `Caso Aurora` — categoría `Civil`
- `Caso Berenice` — categoría `Familiar`
- `Caso Cárdenas` — categoría `Laboral`

Estos ejemplares sirven para mostrar el recorrido sin usar información personal real.

## Limitaciones conocidas

- La solución sigue siendo un prototipo cliente-side, sin autenticación ni backend.
- Los datos dependen del navegador y del origen en que se ejecuta la aplicación.
- La exportación JSON es respaldo manual; no existe importación.
- La evolución del caso depende del reloj del dispositivo local.
- La aplicación está pensada para fines académicos y no reemplaza procedimiento legal real.

## Entrega y demostración

La entrega final debe incluir:
1. Código fuente funcional.
2. README con el análisis, decisiones con IA, reglas y comprobaciones.
3. Dos o más expedientes ficticios para demostrar las funciones.
4. Commit final publicado en GitHub.

La demostración del flujo debe mostrar la reapertura y la conservación del historial, además de explicar una decisión relevante de diseño o validación.
