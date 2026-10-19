(() => {
  'use strict';
  const key = 'minha-evangeline-mural-carinho-v1';
  const $ = id => document.getElementById(id);
  const form = $('carinhoForm'), name = $('carinhoName'), message = $('carinhoMessage');
  if (!form) return;
  const count = $('carinhoCount'), error = $('carinhoError'), status = $('carinhoStatus');
  const list = $('carinhoList'), empty = $('carinhoEmpty'), submit = $('carinhoSubmit');
  const cancel = $('carinhoCancel'), mode = $('carinhoEditMode');
  let notes = [], editingId = null, pendingDelete = null;
  const uid = () => (globalThis.crypto && crypto.randomUUID) ? crypto.randomUUID() : `recado-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  try {
    const raw = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(raw)) {
      let changed = false;
      notes = raw.filter(x => x && typeof x.name === 'string' && typeof x.message === 'string' && typeof x.date === 'string').slice(0, 300).map(x => {
        if (!x.id || typeof x.id !== 'string') { changed = true; return { ...x, id: uid() }; }
        return x;
      });
      if (changed) { try { localStorage.setItem(key, JSON.stringify(notes)); } catch (_) { /* keep data in memory */ } }
    }
  } catch (_) { error.textContent = 'Não foi possível ler os recados salvos neste navegador.'; }
  function persist(next) {
    try { localStorage.setItem(key, JSON.stringify(next)); return true; }
    catch (_) { error.textContent = 'Não foi possível salvar. Verifique o armazenamento do navegador.'; return false; }
  }
  function setMode(id = null) {
    editingId = id;
    const editing = id !== null;
    mode.hidden = !editing;
    submit.textContent = editing ? 'Salvar alterações' : 'Guardar no mural';
    cancel.hidden = !editing;
  }
  function updateCount() { count.textContent = `${message.value.length} / 500`; }
  function announce(text) { status.textContent = text; error.textContent = ''; }
  function button(text, className, onClick) {
    const el = document.createElement('button');
    el.type = 'button'; el.textContent = text; el.className = className;
    el.addEventListener('click', onClick); return el;
  }
  function render() {
    list.replaceChildren();
    const ordered = [...notes].sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
    empty.hidden = ordered.length > 0;
    for (const note of ordered) {
      const article = document.createElement('article'); article.className = 'carinho-note';
      article.dataset.noteId = note.id;
      const tape = document.createElement('span'); tape.className = 'carinho-note-tape'; tape.setAttribute('aria-hidden', 'true'); article.append(tape);
      const stamp = document.createElement('span'); stamp.className = 'carinho-note-stamp'; stamp.setAttribute('aria-hidden', 'true'); stamp.textContent = '✦'; article.append(stamp);
      const head = document.createElement('div'); head.className = 'carinho-note-head';
      const who = document.createElement('strong'); who.className = 'carinho-note-name'; who.textContent = note.name;
      const date = document.createElement('time'); date.className = 'carinho-note-date';
      const d = new Date(note.date); date.textContent = Number.isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(d);
      date.dateTime = note.date;
      const body = document.createElement('p'); body.className = 'carinho-note-text'; body.textContent = note.message;
      const actions = document.createElement('div'); actions.className = 'carinho-note-actions';
      actions.append(button('✎  Editar', 'carinho-edit', () => {
        pendingDelete = null;
        setMode(note.id); name.value = note.name; message.value = note.message;
        updateCount(); announce('Editando este recadinho.');
        form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
        name.focus({ preventScroll: true });
      }));
      const remove = button('×  Apagar', 'carinho-delete', () => {
        pendingDelete = note.id;
        confirmRow.hidden = false;
        confirmRow.querySelector('.carinho-confirm-text').textContent = `Apagar o recado de ${note.name}?`;
        confirmRow.querySelector('.carinho-confirm-yes').focus();
      });
      actions.append(remove);
      const confirmRow = document.createElement('div'); confirmRow.className = 'carinho-confirm'; confirmRow.hidden = true;
      const question = document.createElement('span'); question.className = 'carinho-confirm-text';
      const yes = button('Sim, apagar', 'carinho-confirm-yes', () => {
        if (pendingDelete !== note.id) return;
        const next = notes.filter(x => x.id !== note.id);
        if (!persist(next)) { confirmRow.hidden = true; return; }
        notes = next; pendingDelete = null;
        if (editingId === note.id) { form.reset(); setMode(); updateCount(); }
        announce('Recadinho apagado.'); render();
      });
      const no = button('Cancelar', 'carinho-confirm-no', () => { pendingDelete = null; confirmRow.hidden = true; remove.focus(); });
      confirmRow.append(question, yes, no);
      head.append(who, date); article.append(head, body, actions, confirmRow); list.append(article);
    }
  }
  name.addEventListener('input', () => { error.textContent = ''; });
  message.addEventListener('input', () => { updateCount(); error.textContent = ''; });
  cancel.addEventListener('click', () => { form.reset(); setMode(); updateCount(); announce('Edição cancelada. Nenhuma alteração foi feita.'); });
  form.addEventListener('submit', event => {
    event.preventDefault(); status.textContent = '';
    const n = name.value.trim(), m = message.value.trim();
    if (!n || !m) { error.textContent = 'Preencha o nome e a mensagem.'; (!n ? name : message).focus(); return; }
    if (n.length > 60 || m.length > 500) { error.textContent = 'Confira o limite de caracteres.'; return; }
    let next;
    if (editingId) {
      if (!notes.some(x => x.id === editingId)) { error.textContent = 'Este recado não está mais disponível.'; return; }
      next = notes.map(x => x.id === editingId ? { ...x, name: n, message: m } : x);
    } else {
      next = [{ id: uid(), name: n, message: m, date: new Date().toISOString() }, ...notes].slice(0, 300);
    }
    if (!persist(next)) return; // do not erase typed text if saving fails
    const wasEditing = !!editingId;
    notes = next; form.reset(); setMode(); updateCount();
    announce(wasEditing ? 'Alterações salvas com carinho!' : 'Recadinho guardado com carinho!');
    render();
  });
  setMode(); updateCount(); render();
})();
