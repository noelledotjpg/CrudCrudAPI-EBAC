// app.js
import { Cliente } from './classes.js';
import { criarElementoCliente, atualizarBotaoLimpar } from './utils.js';

const apiBase = 'https://crudcrud.com/api/9aec99eecbb44451ad81b595517879c3/clientes';

const form = document.getElementById('cliente-form');
const lista = document.getElementById('lista-clientes');
const btnLimpar = document.getElementById('btn-apagar-todos');

async function fetchClientes() {
  const resp = await fetch(apiBase);
  const data = await resp.json();
  return data.map(Cliente.fromJson);
}

function renderCliente(cliente) {
  const li = criarElementoCliente(cliente, async () => {
    await fetch(`${apiBase}/${cliente._id}`, { method: 'DELETE' });
    li.remove();
    atualizarBotaoLimpar(lista, btnLimpar);
  });
  lista.appendChild(li);
}

async function carregarClientes() {
  lista.innerHTML = '';
  try {
    const clientes = await fetchClientes();
    clientes.forEach(renderCliente);
  } catch (err) {
    console.error('Erro ao carregar:', err);
  }
  atualizarBotaoLimpar(lista, btnLimpar);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  if (!nome || !email) return;

  const novoCliente = new Cliente(nome, email);

  try {
    const resp = await fetch(apiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoCliente)
    });

    const salvo = Cliente.fromJson(await resp.json());

    const placeholder = lista.querySelector('.placeholder');
    if (placeholder) placeholder.remove();

    renderCliente(salvo);
    form.reset();
    atualizarBotaoLimpar(lista, btnLimpar);
  } catch (err) {
    console.error('Erro ao cadastrar:', err);
  }
});

btnLimpar.addEventListener('click', async () => {
  try {
    const clientes = await fetchClientes();
    await Promise.all(
      clientes.map(c => fetch(`${apiBase}/${c._id}`, { method: 'DELETE' }))
    );
    lista.innerHTML = '';
    atualizarBotaoLimpar(lista, btnLimpar);
  } catch (err) {
    console.error('Erro ao apagar todos:', err);
  }
});

carregarClientes();
