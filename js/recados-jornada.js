// Mural público: os recados são sincronizados pelo Cloud Firestore.
// Configuração web é pública; o controle de acesso está nas regras do Firestore.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp, updateDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyC6yM_qgj_8lZIZAefGyeu-UU8qb4QBzxI',
  authDomain: 'arthur-2538d.firebaseapp.com',
  projectId: 'arthur-2538d',
  storageBucket: 'arthur-2538d.firebasestorage.app',
  messagingSenderId: '365819689906',
  appId: '1:365819689906:web:f87b0b5bfe56e6dab882ab'
};
const $ = id => document.getElementById(id);
const form = $('carinhoForm'), name = $('carinhoName'), message = $('carinhoMessage');
const list = $('carinhoList'), status = $('carinhoStatus'), error = $('carinhoError');
const submit = $('carinhoSubmit');
let notes = [];
let currentUser = null;
let editingId = null;
let lastSend = 0;
const localKeys = ['minha-evangeline-mural-carinho-v1', 'evangelineMessages'];
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
onAuthStateChanged(auth, user => { currentUser = user; render(); });
signInAnonymously(auth).catch(e => {
  console.error('Falha ao identificar visitante:', e);
  error.textContent = 'Não foi possível ativar a edição. Ative a autenticação anônima no Firebase Authentication.';
});
const cancel = $('carinhoCancel');
const editMode = $('carinhoEditMode');
function exitEdit() {
  editingId = null;
  form.reset();
  $('carinhoCount').textContent = '0 / 500';
  submit.textContent = 'Publicar recadinho';
  cancel.hidden = true;
  editMode.hidden = true;
}
cancel.addEventListener('click', exitEdit);


function render() {
  list.replaceChildren();
  for (const note of notes) {
    const card = document.createElement('article');
    card.className = 'note-card';
    const title = document.createElement('h3');
    title.textContent = note.nome || 'Um carinho';
    const body = document.createElement('p');
    body.textContent = note.mensagem || '';
    const date = document.createElement('time');
    if (note.criadoEm?.toDate) {
      const d = note.criadoEm.toDate();
      date.dateTime = d.toISOString();
      date.textContent = d.toLocaleDateString('pt-BR');
    }
    card.append(title, body, date);
    if (currentUser && note.autorUid === currentUser.uid) {
      const actions = document.createElement('div');
      actions.className = 'recado-actions';
      const edit = document.createElement('button');
      edit.type = 'button'; edit.textContent = '✏️ Editar'; edit.className = 'recado-action';
      edit.addEventListener('click', () => {
        editingId = note.id;
        name.value = note.nome;
        message.value = note.mensagem;
        $('carinhoCount').textContent = `${message.value.length} / 500`;
        submit.textContent = '💾 Salvar alterações';
        cancel.hidden = false;
        editMode.hidden = false;
        editMode.textContent = 'Editando seu recadinho';
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        name.focus();
      });
      const remove = document.createElement('button');
      remove.type = 'button'; remove.textContent = '🗑️ Excluir'; remove.className = 'recado-action recado-delete';
      remove.addEventListener('click', async () => {
        if (!confirm('Deseja excluir seu recadinho? Essa ação não pode ser desfeita.')) return;
        remove.disabled = true;
        try {
          await deleteDoc(doc(db, 'recadinhos', note.id));
          if (editingId === note.id) exitEdit();
          status.textContent = 'Recadinho excluído. 💚';
        } catch (e) {
          console.error(e);
          error.textContent = 'Não foi possível excluir este recadinho.';
          remove.disabled = false;
        }
      });
      actions.append(edit, remove);
      card.append(actions);
    }
    list.append(card);
  }
  $('carinhoEmpty').hidden = notes.length > 0;
}

message.addEventListener('input', () => {
  $('carinhoCount').textContent = `${message.value.length} / 500`;
});
submit.textContent = 'Publicar recadinho';

const feed = query(collection(db, 'recadinhos'), orderBy('criadoEm', 'desc'), limit(100));
onSnapshot(feed, snapshot => {
  notes = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
  render();
  status.textContent = 'Mural atualizado para todos os visitantes. 💚';
  error.textContent = '';
}, e => {
  console.error('Erro ao carregar recadinhos:', e);
  status.textContent = '';
  error.textContent = 'Não foi possível carregar os recadinhos. Confira a conexão e as regras do Firestore.';
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  const nome = name.value.trim(), mensagem = message.value.trim();
  error.textContent = '';
  if (!nome || !mensagem || nome.length > 40 || mensagem.length > 500) {
    error.textContent = 'Preencha seu nome (até 40 caracteres) e sua mensagem (até 500).';
    return;
  }
  if (Date.now() - lastSend < 15000) {
    error.textContent = 'Aguarde alguns segundos antes de enviar outro recadinho.';
    return;
  }
  if (!currentUser) { error.textContent = 'Aguarde a conexão com o Firebase antes de salvar.'; return; }
  submit.disabled = true;
  status.textContent = editingId ? 'Salvando alterações…' : 'Publicando seu carinho…';
  try {
    if (editingId) {
      await updateDoc(doc(db, 'recadinhos', editingId), { nome, mensagem });
      status.textContent = 'Alterações salvas para todos! 💚';
    } else {
      await addDoc(collection(db, 'recadinhos'), { nome, mensagem, criadoEm: serverTimestamp(), autorUid: currentUser.uid });
      lastSend = Date.now();
      status.textContent = 'Recadinho publicado para todos! 💚';
    }
    exitEdit();
  } catch (e) {
    console.error('Erro ao publicar:', e);
    error.textContent = 'Não foi possível salvar. Confira a autenticação e as regras do Firestore.';
    status.textContent = '';
  } finally {
    submit.disabled = false;
  }
});

// Exporta as mensagens visíveis e uma cópia dos recados antigos deste navegador.
$('exportNotes').addEventListener('click', () => {
  const antigos = {};
  for (const key of localKeys) {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      try { antigos[key] = JSON.parse(raw); } catch { antigos[key] = raw; }
    }
  }
  const data = { recadinhosPublicos: notes.map(n => ({
    nome: n.nome, mensagem: n.mensagem,
    criadoEm: n.criadoEm?.toDate?.()?.toISOString() || null
  })), recadinhosAntigosDesteNavegador: antigos };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'recadinhos-arthur-mirella.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

// Recados antigos não são enviados automaticamente para um mural público.
const oldCount = localKeys.reduce((sum, key) => {
  try { const v = JSON.parse(localStorage.getItem(key) || '[]'); return sum + (Array.isArray(v) ? v.length : 0); }
  catch { return sum; }
}, 0);
if (oldCount) {
  const hint = document.createElement('p');
  hint.className = 'quiet';
  hint.textContent = `Você tem ${oldCount} recadinho(s) antigo(s) salvo(s) neste navegador. Use “Guardar uma cópia dos recados” para preservá-los; eles não foram publicados automaticamente.`;
  $('exportNotes').after(hint);
}
