document.addEventListener('DOMContentLoaded', () => {
  // ================= Função de Toast =================
  function showToast(mensagem) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = mensagem;
    document.body.appendChild(toast);

    // Mostra com animação
    setTimeout(() => toast.classList.add('show'), 10);

    // Desaparece depois de 3 segundos
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ================= Seleção de elementos =================
  const toggleButton = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const closeSidebar = document.getElementById('close-sidebar');
  const links = sidebar.querySelectorAll('a[data-section]');
  const cardapio = document.getElementById('cardapio');
  const historia = document.getElementById('historia');
  const contato = document.getElementById('contato');
  const evento = document.getElementById('evento');
  const carrinhoSection = document.getElementById('carrinho');
  const finalizarBtn = document.getElementById('finalizar-carrinho');

  const carrinhoContainer = document.getElementById('carrinho-itens');
  const carrinhoTotal = document.getElementById('carrinho-total');
  const enderecoInput = document.getElementById('carrinho-endereco');
  const pagamentoSelect = document.getElementById('carrinho-pagamento');

  const pizzaItems = document.querySelectorAll('.pizza-item');

  // ================= Estado do carrinho =================
  let carrinho = []; // { nome, preco, img, quantidade }

  // ================= Funções =================
  function atualizarCarrinho() {
    carrinhoContainer.innerHTML = '';
    let total = 0;

    carrinho.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('carrinho-item');

      itemDiv.innerHTML = `
        <img src="${item.img}" alt="${item.nome}">
        <h3>${item.nome}</h3>
        <input type="number" min="0" value="${item.quantidade}" data-index="${index}">
        <span>$${(item.preco * item.quantidade).toFixed(2)}</span>
      `;

      carrinhoContainer.appendChild(itemDiv);
      total += item.preco * item.quantidade;
    });

    carrinhoTotal.textContent = `Total: $${total.toFixed(2)}`;

    // Adiciona listener para inputs de quantidade
    const quantidadeInputs = carrinhoContainer.querySelectorAll('input[type="number"]');
    quantidadeInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = parseInt(e.target.dataset.index);
        let val = parseInt(e.target.value);

        if (val <= 0) {
          // Remove do carrinho se quantidade for 0
          carrinho.splice(idx, 1);
        } else {
          carrinho[idx].quantidade = val;
        }

        atualizarCarrinho();
      });
    });
  }

  function mostrarSecao(secao) {
    // Esconder todas
    [cardapio, historia, contato, evento, carrinhoSection].forEach(s => s.classList.remove('active'));
    secao.classList.add('active');
    sidebar.classList.remove('active');
  }

  // ================= Eventos =================
  toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });

  closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('active');
  });

  // Navegação sidebar
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sec = e.target.dataset.section;
      if (sec === 'cardapio') mostrarSecao(cardapio);
      if (sec === 'historia') mostrarSecao(historia);
      if (sec === 'contato') mostrarSecao(contato);
      if (sec === 'evento') mostrarSecao(evento);
      if (sec === 'carrinho') {
        mostrarSecao(carrinhoSection);
        atualizarCarrinho();
      }
    });
  });

  // Adicionar pizza ao carrinho
  pizzaItems.forEach(item => {
    item.addEventListener('click', () => {
      const nome = item.dataset.nome;
      const preco = parseFloat(item.dataset.preco);
      const img = item.dataset.img;

      const existente = carrinho.find(p => p.nome === nome);
      if (existente) {
        existente.quantidade += 1;
      } else {
        carrinho.push({ nome, preco, img, quantidade: 1 });
      }

      showToast(`${nome} adicionado ao carrinho!`);
    });
  });

  // Finalizar pedido
  finalizarBtn.addEventListener('click', () => {
    if (carrinho.length === 0) {
      showToast('Carrinho vazio!');
      return;
    }

    if (!pagamentoSelect.value) {
      showToast('Escolha uma forma de pagamento!');
      return;
    }

    if (!enderecoInput.value) {
      showToast('Digite seu endereço!');
      return;
    }

    showToast(`Pedido realizado com sucesso! 🍕 Total: ${carrinhoTotal.textContent}`);
    carrinho = [];
    atualizarCarrinho();
    mostrarSecao(cardapio);
    pagamentoSelect.value = '';
    enderecoInput.value = '';
  });

  // Envio formulário evento
  const formEvento = document.getElementById('form-evento');
  if (formEvento) {
    formEvento.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('🎉 Pedido de evento enviado com sucesso! Em breve entraremos em contato.');
      formEvento.reset();
    });
  }

  // Inicializa seção Cardápio
  mostrarSecao(cardapio);
});