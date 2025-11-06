/**
 * Ponto de entrada principal do JavaScript.
 * Verifica em qual página estamos e inicializa os componentes corretos.
 */
document.addEventListener("DOMContentLoaded", () => {
  const loadingOverlay = document.getElementById("loading-overlay");

  function showLoader() {
    if (loadingOverlay) {
      loadingOverlay.classList.remove("hidden");
    }
  }

  function hideLoader() {
    if (loadingOverlay) {
      loadingOverlay.classList.add("hidden");
    }
  }

  const toastContainer = document.getElementById("toast-container");

  /**
   * Exibe uma notificação toast.
   * @param {string} message - A mensagem a ser exibida.
   * @param {string} type - 'success' (verde) ou 'error' (vermelho).
   * @param {number} duration - Duração em milissegundos.
   */
  function showToast(message, type = "success", duration = 3000) {
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("hidden");
    }, duration);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, duration + 500);
  }

  const confirmModal = document.getElementById("confirm-modal");
  const confirmMessage = document.getElementById("confirm-message");
  const btnModalConfirmar = document.getElementById("modal-btn-confirmar");
  const btnModalCancelar = document.getElementById("modal-btn-cancelar");

  /**
   * Exibe um modal de confirmação e retorna uma Promise.
   * @param {string} message - A pergunta de confirmação.
   * @returns {Promise<boolean>} - Resolve true se confirmado, false se cancelado.
   */
  function showConfirm(message) {
    return new Promise((resolve) => {
      if (!confirmModal || !confirmMessage || !btnModalConfirmar || !btnModalCancelar) {
          resolve(false);
          return;
      }
      
      confirmMessage.textContent = message;
      confirmModal.classList.remove("hidden");

      const newBtnConfirmar = btnModalConfirmar.cloneNode(true);
      btnModalConfirmar.parentNode.replaceChild(newBtnConfirmar, btnModalConfirmar);
      
      const newBtnCancelar = btnModalCancelar.cloneNode(true);
      btnModalCancelar.parentNode.replaceChild(newBtnCancelar, btnModalCancelar);

      const btnConfirmar = document.getElementById("modal-btn-confirmar");
      const btnCancelar = document.getElementById("modal-btn-cancelar");

      btnConfirmar.onclick = () => {
        confirmModal.classList.add("hidden");
        resolve(true);
      };

      btnCancelar.onclick = () => {
        confirmModal.classList.add("hidden");
        resolve(false);
      };
    });
  }

  // Se o elemento 'lista-produtos' existir, estamos na 'index.html'
  if (document.getElementById("lista-produtos")) {
    initIndexPage(showLoader, hideLoader, showToast, showConfirm);
  }

  // Se o elemento 'form-contato' existir, estamos na 'contato.html'
  if (document.getElementById("form-contato")) {
    initContatoPage(showLoader, hideLoader, showToast);
  }
});

/**
 * Funções da Página de Produtos (index.html)
 */
function initIndexPage(showLoader, hideLoader, showToast, showConfirm) {
  const API_URL = "http://localhost:3000/produtos";

  const lista = document.getElementById("lista-produtos");
  const form = document.getElementById("form-produto");
  const idField = document.getElementById("produto-id");
  const btnCancelar = document.getElementById("btn-cancelar");

  // Carrega os produtos ao iniciar
  carregarProdutos(true);

  // Adiciona o listener ao formulário para salvar (Criar ou Atualizar)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = idField.value;
    const nome = form.nome.value;
    const preco = form.preco.value;

    const produto = { nome, preco: parseFloat(preco) || 0 };

    showLoader();

    let toastMessage = "";
    let toastType = "success";

    try {
      await salvarProduto(produto, id);
      
      toastMessage = id ? "Produto atualizado!" : "Produto salvo!";
      toastType = "success";
      
      form.reset();
      await carregarProdutos(false);

    } catch (error) {
      console.error("Erro ao salvar produto:", error.message);
      toastMessage = `Erro ao salvar produto: ${error.message}`;
      toastType = "error";
    } finally {
      hideLoader();
      if (toastMessage) {
        showToast(toastMessage, toastType);
      }
    }
  });

  // Listener para o botão 'Cancelar Edição'
  btnCancelar.addEventListener("click", () => {
    form.reset();
  });

  // Limpa o formulário quando resetado (oculta o botão cancelar)
  form.addEventListener("reset", () => {
    idField.value = ""; // Limpa o ID oculto
    btnCancelar.classList.add("hidden");
  });

  /**
   * (GET) Carrega todos os produtos da API e os renderiza na tela
   */
  async function carregarProdutos(isInitialLoad = false) {
    if (isInitialLoad) showLoader();
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Erro ao buscar produtos");
      const produtos = await response.json();

      lista.innerHTML = "";

      if (produtos.length === 0) {
        lista.innerHTML =
          '<p class="mensagem-lista">Nenhum produto cadastrado no momento.</p>';
      } else {
        produtos.forEach(renderProdutoCard);
      }
    } catch (error) {
      console.error("Falha ao carregar produtos:", error);
      lista.innerHTML =
        '<p class="mensagem-lista erro">Erro ao carregar produtos.</p>';
    } finally {
      if (isInitialLoad) hideLoader();
    }
  }

  /**
   * (POST / PATCH) Apenas envia o produto para a API e lança erro se falhar.
   */
  async function salvarProduto(produto, id = null) {
    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `[${response.status}] ${errorText || "Erro no servidor"}`
      );
    }
  }

  /**
   * (DELETE) Exclui um produto da API
   */
  async function excluirProduto(id) {
    const confirmado = await showConfirm(
      "Tem certeza que deseja excluir este produto?"
    );
    if (!confirmado) {
      return;
    }

    showLoader();

    let toastMessage = "";
    let toastType = "success";

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `[${response.status}] ${errorText || "Erro no servidor"}`
        );
      }
      
      toastMessage = "Produto excluído!";
      toastType = "success";

      await carregarProdutos(false);

    } catch (error) {
      console.error("Falha ao excluir:", error);
      toastMessage = `Erro ao excluir produto: ${error.message}`;
      toastType = "error";
    } finally {
      hideLoader();
      if (toastMessage) {
        showToast(toastMessage, toastType);
      }
    }
  }

  /**
   * Preenche o formulário para edição
   */
  function prepararEdicao(produto) {
    idField.value = produto.id;
    form.nome.value = produto.nome;
    form.preco.value = produto.preco;

    btnCancelar.classList.remove("hidden");
    form.nome.focus();
    window.scrollTo(0, 0);
  }

  /**
   * Cria o HTML para um card de produto e o adiciona na lista
   */
  function renderProdutoCard(produto) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = produto.id;

    const precoNumerico = parseFloat(produto.preco) || 0;
    const precoFormatado = precoNumerico.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    card.innerHTML = `
      <span class="title">${produto.nome}</span>
      <span class="price">${precoFormatado}</span>
      <div class="botoes">
        <button class="btn-edit">Editar</button>
        <button class="btn-delete">Excluir</button>
      </div>
    `;

    card
      .querySelector(".btn-edit")
      .addEventListener("click", () => prepararEdicao(produto));
    card
      .querySelector(".btn-delete")
      .addEventListener("click", () => excluirProduto(produto.id));

    lista.appendChild(card);
  }
}

/**
 * Funções da Página de Contato (contato.html)
 */
function initContatoPage(showLoader, hideLoader, showToast) {
  const API_URL = "http://localhost:3000/contatos";
  const form = document.getElementById("form-contato");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value;
    if (email.indexOf("@") === -1) {
      showToast("Email inválido", "error");
      return;
    }

    const dados = {
      nome: form.nome.value,
      email: email,
      mensagem: form.mensagem.value,
      data: new Date().toISOString(),
    };

    showLoader();

    let toastMessage = "";
    let toastType = "success";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `[${response.status}] ${errorText || "Erro no servidor"}`
        );
      }

      toastMessage = "Mensagem enviada com sucesso!";
      toastType = "success";
      form.reset();

    } catch (error) {
      console.error("Falha ao enviar contato:", error);
      toastMessage = `Erro ao enviar mensagem: ${error.message}`;
      toastType = "error";
    } finally {
      hideLoader();
      if (toastMessage) {
        showToast(toastMessage, toastType);
      }
    }
  });
}
