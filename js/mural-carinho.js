(() => {
  'use strict';
  const key = 'minha-evangeline-mural-carinho-v1';
  const $ = id => document.getElementById(id);
  const form = $('carinhoForm'), name = $('carinhoName'), message = $('carinhoMessage');
  if (!form) return;
  const count = $('carinhoCount'), error = $('carinhoError'), status = $('carinhoStatus');
  const list = $('carinhoList'), empty = $('carinhoEmpty'), submit = $('carinhoSubmit');
  const cancel = $('carinhoCancel'), mode = $('carinhoEditMode');
  let notes = [], editingId = null, pendingDelete = null, justAdded = null;
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
  const toast = document.createElement('div'); toast.className = 'carinho-toast'; toast.setAttribute('aria-hidden', 'true'); document.body.append(toast);
  let toastTimer = 0;
  function flash(text) { toast.textContent = text; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2200); }
  const dlg = document.createElement('div'); dlg.className = 'carinho-modal'; dlg.hidden = true;
  dlg.innerHTML = '<div class="carinho-modal-card" role="alertdialog" aria-modal="true" aria-labelledby="cmTitle"><h3 id="cmTitle">Apagar este recado?</h3><p class="carinho-modal-text"></p><div class="carinho-modal-actions"><button type="button" class="carinho-confirm-no">Manter</button><button type="button" class="carinho-confirm-yes">Sim, apagar</button></div></div>';
  document.body.append(dlg);
  const dlgText = dlg.querySelector('.carinho-modal-text'), dlgYes = dlg.querySelector('.carinho-confirm-yes'), dlgNo = dlg.querySelector('.carinho-confirm-no');
  let lastFocus = null;
  function closeDlg() { dlg.hidden = true; pendingDelete = null; if (lastFocus && lastFocus.isConnected) lastFocus.focus(); }
  function askDelete(note, trigger) {
    pendingDelete = note.id; lastFocus = trigger; dlgText.textContent = `O recado de ${note.name} será removido deste navegador.`;
    dlg.hidden = false; dlgNo.focus();
  }
  dlgNo.addEventListener('click', closeDlg);
  dlg.addEventListener('click', e => { if (e.target === dlg) closeDlg(); });
  dlg.addEventListener('keydown', e => { if (e.key === 'Escape') closeDlg(); if (e.key === 'Tab') { const f = [dlgNo, dlgYes]; const i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + 2) % 2].focus(); } });
  dlgYes.addEventListener('click', () => {
    const id = pendingDelete; if (!id) return;
    const next = notes.filter(x => x.id !== id);
    if (!persist(next)) { closeDlg(); return; }
    notes = next; if (editingId === id) { form.reset(); setMode(); updateCount(); }
    pendingDelete = null; dlg.hidden = true; announce('Recadinho apagado.'); flash('Recadinho apagado'); render();
  });
  function render() {
    list.replaceChildren();
    const ordered = [...notes].sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
    empty.hidden = ordered.length > 0;
    for (const note of ordered) {
      const article = document.createElement('article'); article.className = 'carinho-note' + (justAdded === note.id ? ' is-new' : '');
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
      const remove = button('×  Apagar', 'carinho-delete', () => askDelete(note, remove));
      actions.append(remove);
      head.append(who, date); article.append(head, body, actions); list.append(article);
    }
    justAdded = null;
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
      const created = { id: uid(), name: n, message: m, date: new Date().toISOString() }; justAdded = created.id;
      next = [created, ...notes].slice(0, 300);
    }
    if (!persist(next)) return; // do not erase typed text if saving fails
    const wasEditing = !!editingId;
    notes = next; form.reset(); setMode(); updateCount();
    announce(wasEditing ? 'Alterações salvas com carinho!' : 'Recadinho guardado com carinho!'); flash(wasEditing ? 'Alterações salvas ✦' : 'Guardado no mural ✦');
    render();
  });
  setMode(); updateCount(); render();
})();
