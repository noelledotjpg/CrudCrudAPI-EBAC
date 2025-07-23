const API_URL = 'https://crudcrud.com/api/9aec99eecbb44451ad81b595517879c3/clientes';

const form = document.getElementById('cliente-form');
const lista = document.getElementById('lista-clientes');
const btnLimpar = document.getElementById('btn-apagar-todos');

function atualizarEstadoBotao() {
  const temClientes = lista.querySelectorAll('li:not(.placeholder)').length > 0;
  btnLimpar.disabled = !temClientes;

  if (!temClientes && !lista.querySelector('.placeholder')) {
    const placeholder = document.createElement('li');
    placeholder.textContent = '--';
    placeholder.classList.add('placeholder');
    lista.appendChild(placeholder);
  }
}

function criarItemCliente(nome, email) {
  const li = document.createElement('li');

  li.innerHTML = `
    ${nome} - ${email}
    <button class="btn-excluir" title="Remover">X</button>
  `;

  const btnExcluir = li.querySelector('.btn-excluir');
  btnExcluir.addEventListener('click', () => {
    li.remove();
    atualizarEstadoBotao();
  });

  return li;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!nome || !email) return;

  // Remove placeholder se presente
  const placeholder = lista.querySelector('.placeholder');
  if (placeholder) placeholder.remove();

  const item = criarItemCliente(nome, email);
  lista.appendChild(item);
  form.reset();

  atualizarEstadoBotao();
});

btnLimpar.addEventListener('click', () => {
  lista.innerHTML = '';
  atualizarEstadoBotao();
});

// Inicializa o estado da lista e botão ao carregar a página
atualizarEstadoBotao();
