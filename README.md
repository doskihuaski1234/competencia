# Gestión de Expedientes — Bufete Popular

**Prototipo de aplicación web** desarrollado para  
**AI Code Wars · Tech Day UMG · Quinta Edición**  
**31 de octubre de 2026**

> Datos exclusivamente ficticios. Esta aplicación **no brinda asesoría jurídica**.

---

## 1. Análisis inicial

### Problema, usuario y prioridades

| Aspecto | Descripción |
|---------|-------------|
| **Problema** | El Bufete Popular requiere organizar expedientes de personas de escasos recursos, registrar actividades y consultar el estado e historial de cada caso de forma rápida y confiable. |
| **Usuario** | Personal del bufete (abogados, asistentes o coordinadores) encargado del registro y seguimiento. |
| **Prioridades** | 1. Apertura validada de expedientes<br>2. Listado y búsqueda sencilla<br>3. Registro de actividades y control de estados<br>4. Historial cronológico y persistencia<br>5. Interfaz clara y mensajes comprensibles |

### Datos, reglas y supuestos

**Datos principales**
- `id` (generado automáticamente)
- `person` (nombre o alias)
- `description` (asunto)
- `responsible` (responsable)
- `category` (opcional: Civil / Familiar / Laboral)
- `createdAt`, `status`, `activities[]`, `history[]`
- `closedAt`, `closureReason` (solo cuando está cerrado)

**Reglas de negocio**
- Identificador, fecha/hora y estado inicial `Abierto` se generan automáticamente.
- Campos obligatorios no pueden estar vacíos ni compuestos solo por espacios.
- Transición `Abierto → En seguimiento` requiere acción explícita del usuario.
- Transición `En seguimiento → Cerrado` exige al menos una actividad registrada y un motivo de cierre no vacío.
- Un expediente cerrado permanece disponible para consulta, pero no admite nuevas actividades ni cambios de estado.
- No se implementa edición ni eliminación de expedientes o actividades (según enunciado).

**Supuestos**
- Las fechas se almacenan en formato ISO y se muestran en hora local (`es-GT`).
- Cada navegador conserva su propio almacenamiento (`localStorage`).
- El uso es demostrativo y con datos 100 % ficticios.
- El historial registra eventos independientes (apertura, cambios de estado y actividades).

### Responsabilidades e integración

| Integrante | Responsabilidad principal | Forma de integración |
|------------|---------------------------|----------------------|
| [Nombre 1] | Análisis del problema y README | Commit inicial + revisión de reglas |
| [Nombre 2] | Formularios, validación y mensajes | Integración en rama principal |
| [Nombre 3] | Estados, historial y persistencia | Revisión de casos de prueba |
| [Nombre 4] | Interfaz, listado y búsqueda | Revisión visual y pruebas |
| [Nombre 5] | QA, consolidación y presentación | Commit final y demostración |

> Ajustar nombres y roles según la composición real del equipo. No atribuir trabajo no realizado.

---

## 2. Decisiones y uso razonado de la IA

| Decisión o necesidad | Aporte de la IA | Decisión del equipo y razón | Cómo se comprobó |
|-----------------------|-----------------|-----------------------------|------------------|
| **Persistencia de datos** | Propuso `localStorage` o un backend con base de datos. | Se adoptó **localStorage**. Cumple el requisito de conservación al recargar, no exige configuración adicional y el enunciado indica que un backend no otorga puntos extra. | Se crearon varios expedientes, se recargó la página (F5) y se verificó que los datos e historial permanecían intactos. |
| **Modelo de historial y reglas de estado** | Sugirió un arreglo de eventos tipados (`state` / `activity`) y validaciones explícitas de transición. | Se aceptó el modelo unificado de historial. Permite mostrar una secuencia cronológica clara y distinguir visualmente cambios de estado de actividades. Las reglas de cierre se implementaron tanto en la lógica como en la interfaz. | Se intentó cerrar sin actividad y sin motivo → la aplicación lo rechazó. Se verificó el orden cronológico del historial. |
| **Interfaz de tres paneles** | Propuso un layout de una sola página con formulario, listado y detalle simultáneos. | Se adoptó el diseño de tres columnas. Reduce clics, permite ver el contexto completo y facilita la demostración en 90 segundos. | Se recorrió el flujo completo (apertura → búsqueda → actividad → cierre) sin cambiar de vista. |

---

## 3. Lista de comprobación

| Recorrido | Procedimiento realizado | Resultado observado | Estado |
|-----------|-------------------------|---------------------|--------|
| **1. Apertura** | Crear «Caso Aurora» y «Caso Río». Intentar enviar con campos vacíos y solo espacios. | Se generaron dos identificadores distintos. Los campos incompletos fueron rechazados con mensaje claro. | **Cumple** |
| **2. Consulta** | Buscar por ID y por alias. Abrir detalle e historial. Buscar un término inexistente. | Localización correcta. Detalle e historial visibles. Mensaje de “no se encontraron expedientes” cuando no hay coincidencias. | **Cumple** |
| **3. Seguimiento y cierre** | Agregar actividad, pasar a «En seguimiento», intentar cerrar sin motivo y sin actividad, cerrar correctamente y verificar bloqueo. | Transiciones y validaciones funcionaron según las reglas. El expediente cerrado no admite nuevas acciones. | **Cumple** |
| **Persistencia** | Recargar el navegador después de crear y modificar expedientes. | Todos los datos e historial se conservaron. | **Cumple** |

> El jurado podrá repetir las comprobaciones con otros datos ficticios.

---

## 4. Instrucciones de ejecución

**Requisitos**
- Navegador moderno (Chrome, Edge, Firefox o Safari) con JavaScript y `localStorage` habilitados.
- No requiere instalación de paquetes, servidor, base de datos ni conexión a Internet.

**Cómo ejecutar**
1. Abrir el archivo `index.html` directamente en el navegador, **o**
2. Servir la carpeta con un servidor estático simple:
   ```bash
   python -m http.server 8000
   ```
   y visitar `http://localhost:8000`.

**Estructura del proyecto**
```
├── index.html    → Estructura semántica
├── styles.css    → Presentación profesional
├── app.js        → Lógica de negocio y persistencia
└── README.md     → Análisis, decisiones y comprobaciones
```

---

## 5. Datos ficticios para la demostración

Crear manualmente en la interfaz (o usar los generados durante las pruebas):

| # | Alias | Asunto | Responsable | Categoría |
|---|-------|--------|-------------|-----------|
| 1 | **Caso Aurora** | Consulta ficticia sobre acuerdo de arrendamiento | Equipo A | Civil |
| 2 | **Caso Río** | Consulta ficticia sobre condiciones laborales | Equipo B | Laboral |

---

## 6. Limitaciones conocidas

- Los datos se almacenan únicamente en el navegador y dispositivo de la demostración; no hay sincronización entre equipos.
- No se incluye autenticación, edición, eliminación, archivos adjuntos, notificaciones ni reportes (fuera del alcance del reto).
- La búsqueda es de coincidencia simple (contiene texto).
- La aplicación **no constituye asesoría jurídica**.

---

## 7. Stack

| Capa | Tecnología |
|------|------------|
| Estructura | HTML5 semántico + ARIA |
| Estilos | CSS3 (variables, grid, flexbox, responsive) |
| Lógica | JavaScript (ES6+) vanilla |
| Persistencia | `localStorage` |

Decisión deliberada de no usar frameworks para maximizar claridad del código y velocidad de desarrollo dentro del tiempo de la competencia.

---

**Entrega final**  
Repositorio GitHub + identificador del commit de las 9:30 a. m.  
Evaluación a partir de las 9:30 a. m. · Premiación 10:30 a. m.
