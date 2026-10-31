'use strict';

/**
 * ============================================================
 *  Bufete Popular — Gestión de Expedientes
 *  Prototipo · AI Code Wars · Tech Day UMG · 31 oct 2026
 *
 *  Datos 100 % ficticios. No constituye asesoría jurídica.
 *  Persistencia: localStorage del navegador.
 * ============================================================
 */

/* -------------------- Constantes -------------------- */
const STORAGE_KEY = 'umg_ai_code_wars_expedientes_v1';
const VALID_STATES = Object.freeze(['Abierto', 'En seguimiento', 'Cerrado']);

/* -------------------- Utilidades -------------------- */
const $ = (id) => document.getElementById(id);

const trim = (value) => String(value ?? '').trim();

const nowISO = () => new Date().toISOString();

const formatDate = (iso) =>
  new Date(iso).toLocaleString('es-GT', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

const createEl = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = String(text);
  return el;
};

/* -------------------- Persistencia -------------------- */
function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (r) =>
        r &&
        typeof r.id === 'string' &&
        VALID_STATES.includes(r.status) &&
        Array.isArray(r.history) &&
        Array.isArray(r.activities)
    );
  } catch (err) {
    console.error('[Expedientes] Error al cargar datos:', err);
    return [];
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch (err) {
    console.error('[Expedientes] Error al guardar:', err);
    alert('No se pudieron guardar los datos. Revise el almacenamiento del navegador.');
    return false;
  }
}

/* -------------------- Identificadores -------------------- */
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `EXP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }
  return `EXP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

function uniqueId() {
  let id;
  do {
    id = generateId();
  } while (records.some((r) => r.id === id));
  return id;
}

/* -------------------- Estado de la aplicación -------------------- */
let records = loadRecords();
let selectedId = null;

/* -------------------- Mensajes de UI -------------------- */
function notice(message, isError = false) {
  const el = $('form-message');
  el.textContent = message;
  el.className = `message ${isError ? 'error' : 'success'}`;
}

/* -------------------- Apertura de expediente -------------------- */
$('case-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const person = trim($('person').value);
  const description = trim($('description').value);
  const responsible = trim($('responsible').value);
  const category = $('category').value;

  const missing = [];
  if (!person) missing.push('persona o alias');
  if (!description) missing.push('descripción');
  if (!responsible) missing.push('responsable');

  if (missing.length > 0) {
    notice('Complete los campos obligatorios: ' + missing.join(', ') + '.', true);
    return;
  }

  const createdAt = nowISO();
  const record = {
    id: uniqueId(),
    person,
    description,
    responsible,
    category: category || '',
    createdAt,
    status: 'Abierto',
    activities: [],
    closedAt: null,
    closureReason: null,
    history: [
      {
        at: createdAt,
        kind: 'state',
        detail: 'Apertura del expediente · Estado: Abierto'
      }
    ]
  };

  records.unshift(record);

  if (!persist()) {
    records.shift(); // rollback
    return;
  }

  selectedId = record.id;
  $('case-form').reset();
  $('search').value = '';
  notice(`Expediente ${record.id} creado correctamente.`);
  render();
});

/* -------------------- Búsqueda en tiempo real -------------------- */
$('search').addEventListener('input', renderList);

/* -------------------- Renderizado -------------------- */
function render() {
  renderList();
  renderDetails();
}

function renderList() {
  $('counter').textContent = String(records.length);

  const target = $('cases');
  target.replaceChildren();

  const query = trim($('search').value).toLocaleLowerCase();
  const matches = records.filter(
    (r) =>
      r.id.toLocaleLowerCase().includes(query) ||
      r.person.toLocaleLowerCase().includes(query)
  );

  if (matches.length === 0) {
    const msg = records.length
      ? 'No se encontraron expedientes con ese criterio.'
      : 'Todavía no hay expedientes registrados.';
    target.append(createEl('p', 'empty', msg));
    return;
  }

  matches.forEach((record) => {
    const isActive = record.id === selectedId;
    const item = createEl('button', 'case-item' + (isActive ? ' active' : ''));
    item.type = 'button';
    item.setAttribute('role', 'listitem');
    item.setAttribute('aria-pressed', isActive ? 'true' : 'false');

    item.append(
      createEl('strong', '', record.id),
      createEl('small', '', record.person),
      createEl('small', '', `Responsable: ${record.responsible}`),
      createEl('small', 'status-line', `Estado: ${record.status}`)
    );

    item.addEventListener('click', () => {
      selectedId = record.id;
      render();
    });

    target.append(item);
  });
}

function labeled(parent, label, value) {
  const div = createEl('div');
  const strong = createEl('strong', '', label);
  div.append(strong, document.createTextNode(String(value ?? '—')));
  parent.append(div);
}

function renderDetails() {
  const target = $('details');
  target.replaceChildren();

  const record = records.find((r) => r.id === selectedId);

  if (!record) {
    const empty = createEl('div', 'empty-state');
    empty.innerHTML = `
      <div class="empty-icon" aria-hidden="true">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      </div>
      <p>Seleccione un expediente del listado para consultar su detalle e historial.</p>
    `;
    target.append(empty);
    return;
  }

  /* Cabecera */
  const header = createEl('div', 'row');
  header.append(createEl('h2', '', record.id));

  let statusClass = 'tag';
  if (record.status === 'En seguimiento') statusClass = 'tag follow';
  if (record.status === 'Cerrado') statusClass = 'tag closed';

  header.append(createEl('span', statusClass, record.status));
  target.append(header);

  /* Metadatos */
  const meta = createEl('div', 'meta');
  labeled(meta, 'Persona o alias', record.person);
  labeled(meta, 'Descripción', record.description);
  labeled(meta, 'Responsable', record.responsible);
  labeled(meta, 'Categoría', record.category || 'Sin categoría');
  labeled(meta, 'Fecha de apertura', formatDate(record.createdAt));

  if (record.status === 'Cerrado') {
    labeled(meta, 'Fecha de cierre', formatDate(record.closedAt));
    labeled(meta, 'Motivo de cierre', record.closureReason);
  }
  target.append(meta);

  /* Acciones según estado */
  const actions = createEl('div', 'actions');

  if (record.status === 'Abierto') {
    const btn = createEl('button', 'btn btn-secondary btn-sm', 'Pasar a En seguimiento');
    btn.type = 'button';
    btn.addEventListener('click', () => advanceStatus(record.id));
    actions.append(btn);
  }

  if (actions.childNodes.length) {
    target.append(actions);
  }

  /* Formulario de actividad (solo si no está cerrado) */
  if (record.status !== 'Cerrado') {
    const section = createEl('div', 'detail-section');
    section.append(createEl('h3', '', 'Registrar actividad'));

    const form = createEl('form');
    form.noValidate = true;

    const textarea = createEl('textarea');
    textarea.rows = 2;
    textarea.maxLength = 500;
    textarea.placeholder = 'Descripción obligatoria de la actividad';
    textarea.required = true;

    const btn = createEl('button', 'btn btn-primary btn-sm', 'Agregar actividad');
    btn.type = 'submit';

    const errorBox = createEl('div', 'message');
    errorBox.setAttribute('role', 'status');

    form.append(textarea, btn, errorBox);

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const description = trim(textarea.value);

      if (!description) {
        errorBox.textContent = 'Ingrese una descripción de actividad no vacía.';
        errorBox.className = 'message error';
        return;
      }

      addActivity(record.id, description);
    });

    section.append(form);
    target.append(section);
  }

  /* Formulario de cierre (solo en seguimiento) */
  if (record.status === 'En seguimiento') {
    const section = createEl('div', 'detail-section');
    section.append(createEl('h3', '', 'Cerrar expediente'));

    const form = createEl('form');
    form.noValidate = true;

    const textarea = createEl('textarea');
    textarea.rows = 2;
    textarea.maxLength = 500;
    textarea.placeholder = 'Motivo obligatorio de cierre';

    const btn = createEl('button', 'btn btn-danger btn-sm', 'Cerrar expediente');
    btn.type = 'submit';

    const errorBox = createEl('div', 'message');
    errorBox.setAttribute('role', 'status');

    form.append(textarea, btn, errorBox);

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const reason = trim(textarea.value);

      if (!reason) {
        errorBox.textContent = 'Debe ingresar un motivo de cierre.';
        errorBox.className = 'message error';
        return;
      }

      if (record.activities.length === 0) {
        errorBox.textContent = 'Debe registrar al menos una actividad antes de cerrar.';
        errorBox.className = 'message error';
        return;
      }

      closeRecord(record.id, reason);
    });

    section.append(form);
    target.append(section);
  }

  /* Historial cronológico */
  target.append(createEl('hr', 'divider'));
  target.append(createEl('h3', '', 'Historial cronológico'));

  const timeline = createEl('ol', 'timeline');
  const sorted = record.history
    .slice()
    .sort((a, b) => new Date(a.at) - new Date(b.at));

  sorted.forEach((entry) => {
    const li = createEl('li', entry.kind === 'state' ? 'state' : '');
    li.append(
      createEl('strong', '', entry.kind === 'state' ? 'Cambio de estado' : 'Actividad'),
      createEl('div', '', entry.detail),
      createEl('small', '', formatDate(entry.at))
    );
    timeline.append(li);
  });

  target.append(timeline);
}

/* -------------------- Reglas de negocio -------------------- */
function advanceStatus(id) {
  const record = records.find((r) => r.id === id);
  if (!record || record.status !== 'Abierto') return;

  const previousStatus = record.status;
  record.status = 'En seguimiento';
  record.history.push({
    at: nowISO(),
    kind: 'state',
    detail: 'Cambio de estado: Abierto → En seguimiento'
  });

  if (!persist()) {
    record.status = previousStatus;
    record.history.pop();
    return;
  }

  render();
}

function addActivity(id, description) {
  const record = records.find((r) => r.id === id);
  if (!record || record.status === 'Cerrado') return;

  const at = nowISO();
  record.activities.push({ at, description });
  record.history.push({
    at,
    kind: 'activity',
    detail: description
  });

  if (!persist()) {
    record.activities.pop();
    record.history.pop();
    return;
  }

  render();
}

function closeRecord(id, reason) {
  const record = records.find((r) => r.id === id);

  if (
    !record ||
    record.status !== 'En seguimiento' ||
    record.activities.length === 0 ||
    !trim(reason)
  ) {
    return;
  }

  const previous = {
    status: record.status,
    closedAt: record.closedAt,
    closureReason: record.closureReason
  };

  const at = nowISO();
  record.status = 'Cerrado';
  record.closedAt = at;
  record.closureReason = reason;
  record.history.push({
    at,
    kind: 'state',
    detail: 'Cambio de estado: En seguimiento → Cerrado. Motivo: ' + reason
  });

  if (!persist()) {
    record.status = previous.status;
    record.closedAt = previous.closedAt;
    record.closureReason = previous.closureReason;
    record.history.pop();
    return;
  }

  render();
}

/* -------------------- Inicialización -------------------- */
render();
