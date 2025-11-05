/**
 * Ponto de entrada principal do JavaScript.
 * Verifica em qual página estamos e inicializa os componentes corretos.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Se o elemento 'lista-produtos' existir, estamos na 'index.html'
  if (document.getElementById("lista-produtos")) {
    initIndexPage();
  }

  // Se o elemento 'form-contato' existir, estamos na 'contato.html'
  if (document.getElementById("form-contato")) {
    initContatoPage();
  }
});

/**
 * Funções da Página de Produtos (index.html)
 */
function initIndexPage() {
  // URL da nossa API (json-server)
  const API_URL = "http://localhost:3000/produtos";

  // Seleciona os elementos do DOM
  const lista = document.getElementById("lista-produtos");
  const form = document.getElementById("form-produto");
  const idField = document.getElementById("produto-id");
  const btnCancelar = document.getElementById("btn-cancelar");

  // Carrega os produtos ao iniciar
  carregarProdutos();

  // Adiciona o listener ao formulário para salvar (Criar ou Atualizar)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = idField.value;
    const nome = form.nome.value;
    const preco = form.preco.value;

    const produto = { nome, preco: parseFloat(preco) || 0 };

    try {
      if (id) {
        await salvarProduto(produto, id);
      } else {
        await salvarProduto(produto);
      }

      form.reset();
      await carregarProdutos();
    } catch (error) {
      console.error("Erro ao salvar produto:", error.message);
      alert(`Erro ao salvar produto: ${error.message}`);
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
  async function carregarProdutos() {
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
    }
  }

  /**
   * (POST / PATCH) Envia o produto para a API
   * @param {object} produto - O objeto do produto {nome, preco}
   * @param {string|null} id - O ID do produto (para edição)
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

    alert(id ? "Produto atualizado!" : "Produto salvo!");
  }

  /**
   * (DELETE) Exclui um produto da API
   * @param {string} id - O ID do produto a ser excluído
   */
  async function excluirProduto(id) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) {
      return;
    }

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
      alert("Produto excluído!");
      await carregarProdutos();
    } catch (error) {
      console.error("Falha ao excluir:", error);
      alert(`Erro ao excluir produto: ${error.message}`);
    }
  }

  /**
   * Preenche o formulário para edição
   * @param {object} produto - O objeto do produto a ser editado
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
   * @param {object} produto - O objeto do produto
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
function initContatoPage() {
  const API_URL = "http://localhost:3000/contatos";
  const form = document.getElementById("form-contato");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value;
    if (email.indexOf("@") === -1) {
      alert("Email inválido");
      return;
    }

    const dados = {
      nome: form.nome.value,
      email: email,
      mensagem: form.mensagem.value,
      data: new Date().toISOString(),
    };

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

      alert("Mensagem enviada com sucesso!");
      form.reset();
    } catch (error) {
      console.error("Falha ao enviar contato:", error);
      alert(`Erro ao enviar mensagem: ${error.message}`);
    }
  });
}
