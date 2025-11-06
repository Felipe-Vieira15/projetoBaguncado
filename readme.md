# 🏪 Loja Bagunçada (projetoBaguncado)

Este é um projeto de aplicação **web front-end** para gerenciar uma **lista de produtos**.  
Ele permite **Criar, Ler, Atualizar e Excluir (CRUD)** produtos e inclui um **formulário de contato funcional**.

O projeto foi desenvolvido com foco em uma **interface moderna e intuitiva**, utilizando componentes como **indicadores de loading**, **notificações (toasts)** e **modais de confirmação**, todos implementados com **JavaScript puro**.

---

## ✨ Funcionalidades Principais

### 🛒 CRUD de Produtos
- Listagem de todos os produtos cadastrados  
- Cadastro de novos produtos (nome e preço)  
- Edição de produtos existentes (com formulário pré-preenchido)  
- Exclusão de produtos com **modal de confirmação**

### 💬 Formulário de Contato
- Página de contato separada com **validação de e-mail**  
- Envio e salvamento das mensagens no **back-end (mock API)**

### 🎨 Interface Moderna (UX)
- **Indicador de Loading:** Exibido durante chamadas de API (`fetch`)  
- **Notificações (Toasts):** Feedback para ações de sucesso ou erro  
- **Modal de Confirmação:** Substitui o `confirm()` nativo, mantendo consistência visual

---

## 🚀 Tecnologias Utilizadas

### 🧩 Front-End
- **HTML5** (semântico)  
- **CSS3** (Flexbox, Animações, Transições, Design responsivo)  
- **JavaScript (ES6+)**
  - `async/await` para chamadas assíncronas  
  - Manipulação direta do **DOM**  
  - `fetch()` para comunicação HTTP

### 🛠️ Back-End (Mock)
- **json-server** – Simula uma API RESTful completa usando o arquivo `db.json`

### ⚙️ Ambiente
- **Node.js** e **npm** – utilizados para executar o `json-server`

---

## 💿 Como Instalar e Executar

### 1️⃣ Clone o Repositório
```bash
git clone https://github.com/Felipe-Vieira15/projetoBaguncado.git
cd projetoBaguncado

# instale as dependências
npm install
```
### 2️⃣ Execute o Back-End (API Mock)

O projeto precisa que o json-server esteja rodando para fornecer os dados dos produtos e salvar os contatos. Na pasta do projeto, execute o seguinte comando no seu terminal:

```bash
npx json-server --watch db.json
```

> O terminal deverá exibir que o servidor está rodando em `http://localhost:3000.` Deixe este terminal aberto.

### 3️⃣ Execute o Front-End (Aplicação)

Como este projeto é feito com HTML, CSS e JS puros, você não precisa de um servidor web. Basta abrir o arquivo index.html diretamente no seu navegador.

```bash
# (No Windows)
start index.html

# (No macOS)
open index.html

# (No Linux)
xdg-open index.html
```

> Nota: Você também pode usar uma extensão como o `"Live Server"` no VS Code, mas abrir o arquivo diretamente funciona perfeitamente, pois a API `(localhost:3000)` e o arquivo (file://...) rodam na mesma máquina.

---

## 📁 Estrutura de Pastas

### O projeto está organizado da seguinte forma:

```
projetoBaguncado/
│
├── assets/
│   └── logo.png             # Logo do projeto
│
├── css/
│   ├── reset.css            # Reset de estilos (CSS Reset)
│   └── style.css            # Estilos principais da aplicação (modals, toasts, layout)
│
├── js/
│   └── main.js              # Lógica principal (API, DOM, eventos)
│
├── contato.html             # Página "Fale Conosco"
├── db.json                  # Banco de dados do json-server
├── index.html               # Página principal (CRUD de Produtos)
├── package.json             # Metadados do projeto
└── README.md                # Este arquivo
```

---

### 📜 Licença
Este projeto está sob a licença ISC.
