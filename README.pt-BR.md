# X-uitter Frontend

[🇺🇸 English Version](./README.md)

## 🌐 Descrição

**X-uitter Frontend** é o cliente web em Vue.js do MVP X-uitter, um projeto de rede social inspirado no Twitter/X.

Esta aplicação consome a **X-uitter API** e fornece uma interface para autenticação, visualização do feed personalizado, criação de xweets, interação com publicações e exploração de recursos de perfil/social.

O projeto foi construído como uma prova de conceito frontend para o MVP backend existente, usando uma estrutura simples e de fácil manutenção organizada em **components**, **pages**, **composables**, **router**, **services**, **config** e **utils**.

### Links do Projeto

| Recurso | Link |
|---|---|
| Repositório Frontend | [GitHub](https://github.com/jfan-dev/X-witter-4-growdev-front) |
| Deploy Frontend | [Vercel](https://x-witter-4-growdev-front.vercel.app/) |
| Repositório Backend | [GitHub](https://github.com/jfan-dev/X-witter-4-growdev) |
| Deploy Backend | [Vercel](https://x-witter-4-growdev.vercel.app/) |
| Documentação Swagger Backend | [Swagger](https://x-witter-4-growdev.vercel.app/docs) |

## 🌐 Pré-requisitos para executar o projeto

- Frontend: **Vue.js 3 + TypeScript**
- Ferramenta de build: **Vite**
- Rotas: **Vue Router**
- Gerenciador de pacotes: **npm**
- Backend API: **X-uitter API rodando localmente ou em produção**
- Ambiente recomendado: **Ubuntu 22.04 ou superior**

### Clonando o repositório

```bash
> git clone https://github.com/jfan-dev/X-witter-4-growdev-front.git
> cd X-witter-4-growdev-front
```

> Se a URL do seu repositório frontend for diferente, substitua a URL acima pela correta.

### Instalando as dependências

```bash
> npm install
```

### Configurando as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
> touch .env
```

Exemplo de configuração para ambiente local:

```env
VITE_API_URL=http://localhost:3002
```

Exemplo de configuração para produção:

```env
VITE_API_URL=https://x-witter-4-growdev.vercel.app
```

> Não adicione barra no final de `VITE_API_URL`. Use `https://example.com`, e não `https://example.com/`, porque o serviço de API do frontend já adiciona os caminhos das rotas, como `/auth/signin`.

> Nunca envie o arquivo `.env` para o GitHub. Mantenha apenas o arquivo `.env.example` versionado.

### Executando o Frontend

```bash
# Iniciar o servidor de desenvolvimento
> npm run dev
```

Depois de iniciar o servidor, o Vite exibirá a URL local no terminal, geralmente:

```bash
http://localhost:5173
```

### Gerando o build de produção

```bash
> npm run build
```

Este comando executa as verificações de TypeScript com `vue-tsc` e depois gera o build de produção com o Vite.

### Visualizando o build de produção localmente

```bash
> npm run preview
```

Use este comando depois de `npm run build` para testar localmente o build de produção.

## 🧱 Estrutura do Projeto

```bash
X-UITTER-FRONT/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── composables/
│   ├── config/
│   ├── pages/
│   ├── router/
│   ├── services/
│   ├── utils/
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── .env.example
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── README.pt-BR.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### Principais pastas

| Pasta | Responsabilidade |
|---|---|
| `src/assets` | Arquivos estáticos usados pelo frontend. |
| `src/components` | Componentes Vue reutilizáveis, como layout, cards, formulários e áreas de feed/perfil. |
| `src/composables` | Lógicas reutilizáveis usando Composition API, como estado de autenticação. |
| `src/config` | Configurações da aplicação, links e constantes baseadas em ambiente. |
| `src/pages` | Páginas principais renderizadas pelo Vue Router. |
| `src/router` | Definições de rotas frontend e configuração de navegação. |
| `src/services` | Camada de comunicação com a API backend. |
| `src/utils` | Funções auxiliares compartilhadas. |

## ✍🏻️ Funcionalidades

| 🔐 Autenticação | 📰 Feed personalizado | 🐦 Criação de xweets |
| --- | --- | --- |
| Usuários podem criar conta, entrar, manter token local de sessão e sair. | A aplicação consome o endpoint de feed do backend para exibir xweets do usuário e de pessoas seguidas. | Usuários autenticados podem publicar novos xweets pela interface frontend. |

| 👤 Área de perfil | 🤝 Interações sociais | 🌐 Pronto para deploy |
| --- | --- | --- |
| A interface inclui áreas de perfil e informações do usuário autenticado. | O frontend está preparado para consumir recursos do backend como likes, replies, follow e unfollow. | O projeto usa variáveis de ambiente do Vite e pode ser publicado na Vercel. |

## ✍🏻️ Recursos e Tecnologias Utilizadas

| Tecnologia | Uso | Site |
|---|---|---|
| Vue.js | Framework frontend usado para construir a interface | [Link](https://vuejs.org/) |
| TypeScript | Tipagem estática para código frontend mais seguro e claro | [Link](https://www.typescriptlang.org/) |
| Vite | Servidor de desenvolvimento e ferramenta de build de produção | [Link](https://vite.dev/) |
| Vue Router | Rotas no lado do cliente para páginas Vue | [Link](https://router.vuejs.org/) |
| npm | Gerenciador de pacotes usado para instalar dependências e rodar scripts | [Link](https://www.npmjs.com/) |
| Vercel | Plataforma de deploy do frontend | [Link](https://vercel.com/) |
| GitHub | Versionamento e hospedagem pública do repositório | [Link](https://github.com/) |

## 🔗 Integração com a API Backend

Este frontend consome a **X-uitter API**.

Backend local:

```bash
http://localhost:3002
```

Backend em produção:

```bash
https://x-witter-4-growdev.vercel.app
```

Documentação Swagger do backend:

```bash
https://x-witter-4-growdev.vercel.app/docs
```

O serviço de API do frontend lê a URL base através de:

```env
VITE_API_URL
```

Ele envia requisições JSON e, quando existe um token salvo no `localStorage`, adiciona automaticamente o cabeçalho de autorização:

```bash
Authorization: Bearer SEU_TOKEN_AQUI
```

### Principais rotas do backend consumidas

| Método | Rota | Uso no frontend |
|---|---|---|
| POST | `/auth/signup` | Criar uma nova conta |
| POST | `/auth/signin` | Fazer login e receber o token JWT |
| GET | `/feed` | Carregar o feed do usuário autenticado |
| POST | `/xweets` | Criar um novo xweet |
| POST | `/xweets/:id/reply` | Responder a um xweet |
| POST | `/xweets/:id/like` | Curtir um xweet |
| DELETE | `/xweets/:id/like` | Remover uma curtida |
| GET | `/users/:id` | Carregar o perfil de um usuário |
| POST | `/users/:id/follow` | Seguir um usuário |
| DELETE | `/users/:id/follow` | Deixar de seguir um usuário |

> Todas as rotas privadas exigem um Bearer Token válido. Apenas cadastro e login são públicas.

## 🔐 Fluxo de Autenticação

1. O usuário cria uma conta ou faz login.
2. O backend retorna um token JWT.
3. O frontend armazena o token localmente.
4. As requisições para a API leem o token salvo.
5. Rotas protegidas do backend recebem o token pelo cabeçalho `Authorization`.
6. Ao sair da conta, a sessão local é limpa e o usuário é redirecionado para a página de autenticação.

## 🛠 Desafios e Soluções

### CORS e barras duplicadas nas URLs da API

- Durante o deploy, requisições com barra duplicada entre a URL do backend e o caminho da rota podem causar problemas de redirecionamento no preflight do navegador.
- A solução é manter `VITE_API_URL` sem barra no final e deixar o serviço de API do frontend adicionar os caminhos das rotas normalmente.

Correto:

```env
VITE_API_URL=https://x-witter-4-growdev.vercel.app
```

Evite:

```env
VITE_API_URL=https://x-witter-4-growdev.vercel.app/
```

### Separação entre deploy frontend e backend

- O frontend e o backend são publicados como aplicações separadas.
- A solução é configurar o deploy do frontend com a URL de produção do backend usando `VITE_API_URL`.

### Segurança dos arquivos de ambiente

- O arquivo `.env` armazena configurações específicas de ambiente e não deve ser enviado ao repositório.
- A solução é versionar o `.env.example` e configurar as variáveis reais localmente e na Vercel.

## 🚀 Deploy

O frontend pode ser publicado na **Vercel**.

### Configuração na Vercel

| Configuração | Valor |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### Variável de ambiente obrigatória

```env
VITE_API_URL=https://x-witter-4-growdev.vercel.app
```

### Checklist de deploy

- [ ] Confirmar que a API backend está publicada e respondendo
- [ ] Configurar `VITE_API_URL` na Vercel
- [ ] Rodar `npm run build` localmente antes do deploy
- [ ] Importar o repositório frontend na Vercel
- [ ] Fazer o deploy do frontend
- [ ] Testar cadastro em produção
- [ ] Testar login em produção
- [ ] Testar requisições autenticadas em produção
- [ ] Adicionar o link do deploy frontend neste README

## ✅ Status da POC / MVP

| Funcionalidade | Status |
|---|---|
| Configuração Vue + TypeScript | ✅ Implementado |
| Configuração com Vite | ✅ Implementado |
| Estrutura com Vue Router | ✅ Implementado |
| Serviço de API com URL baseada em ambiente | ✅ Implementado |
| Cabeçalhos de requisição com token | ✅ Implementado |
| Fluxo de autenticação na interface | ✅ Implementado |
| Fluxo de feed | ✅ Implementado |
| Fluxo de criação de xweet | ✅ Implementado |
| Área de perfil/follow | ✅ Implementado |
| Comando de build de produção | ✅ Implementado |
| Deploy na Vercel | ✅ Implementado |

## 🧾 Scripts úteis

```bash
# Rodar servidor local de desenvolvimento
> npm run dev

# Verificar tipos e gerar build de produção
> npm run build

# Visualizar o build de produção localmente
> npm run preview
```

## 🐼 Desenvolvido por

**Jaime Fernandes**  
📧 jfernan10@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/jfan-dev)  
🐙 [GitHub](https://github.com/jfan-dev)
