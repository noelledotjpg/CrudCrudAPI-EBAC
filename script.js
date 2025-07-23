const apiBase = "https://crudcrud.com/api/9aec99eecbb44451ad81b595517879c3/clientes"; // trocar apikey 

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

function criarItemCliente(cliente) {
  const li = document.createElement('li');

  const span = document.createElement('span');
  span.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
      <path d="M18 6L17.2 18C17.13 19.06 17.09 19.59 16.87 19.99C16.67 20.34 16.36 20.62 16 20.8C15.59 21 15.06 21 14 21H10C8.94 21 8.41 21 8 20.8C7.63 20.62 7.33 20.34 7.13 19.99C6.91 19.59 6.87 19.06 6.8 18L6 6M4 6H20M16 6L15.73 5.19C15.47 4.4 15.34 4.01 15.09 3.72C14.88 3.46 14.6 3.26 14.29 3.14C13.94 3 13.52 3 12.69 3H11.31C10.48 3 10.06 3 9.71 3.14C9.4 3.26 9.12 3.46 8.91 3.72C8.66 4.01 8.53 4.4 8.27 5.19L8 6" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 10V17M10 10V17" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    ${cliente.nome} - ${cliente.email}
  `;

  const btnExcluir = document.createElement('button');
  btnExcluir.textContent = 'X';
  btnExcluir.classList.add('btn-excluir');
  btnExcluir.title = 'Remover';

  btnExcluir.addEventListener('click', async () => {
    await fetch(`${apiBase}/${cliente._id}`, { method: 'DELETE' });
    li.remove();
    atualizarEstadoBotao();
  });

  li.appendChild(span);
  li.appendChild(btnExcluir);
  return li;
}

async function carregarClientes() {
  lista.innerHTML = '';
  try {
    const resp = await fetch(apiBase);
    const clientes = await resp.json();

    if (clientes.length === 0) {
      atualizarEstadoBotao();
      return;
    }

    clientes.forEach(cliente => {
      const item = criarItemCliente(cliente);
      lista.appendChild(item);
    });
  } catch (err) {
    console.error('Erro ao carregar clientes:', err);
  }

  atualizarEstadoBotao();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  if (!nome || !email) return;

  const novoCliente = { nome, email };

  try {
    const resp = await fetch(apiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoCliente)
    });

    const clienteSalvo = await resp.json();

    const placeholder = lista.querySelector('.placeholder');
    if (placeholder) placeholder.remove();

    const item = criarItemCliente(clienteSalvo);
    lista.appendChild(item);

    form.reset();
    atualizarEstadoBotao();
  } catch (err) {
    console.error('Erro ao cadastrar cliente:', err);
  }
});


btnLimpar.addEventListener('click', async () => {
  const resp = await fetch(apiBase);
  const clientes = await resp.json();

  for (const cliente of clientes) {
    await fetch(`${apiBase}/${cliente._id}`, { method: 'DELETE' });
  }

  lista.innerHTML = '';
  atualizarEstadoBotao();
});

carregarClientes();
