# Front-end — Sistema de Recebiveis

Interface web para a API de controle e precificacao de recebiveis
(`../teste-sistema-recebiveis`).

## Stack

- React 18 (Create React App / react-scripts)
- React Router 6 (roteamento entre telas)
- React Bootstrap + Bootstrap 5 (UI)
- Axios (cliente HTTP)
- react-cookie (persistencia da sessao)
- ESLint (linter para organizacao do codigo)

## Estrutura do projeto

```
src/
├── index.js                 # Ponto de entrada (Router + CookiesProvider)
├── App.js                   # Estado global, sessao e AppContext.Provider
├── context/
│   └── AppContext.js        # Contexto de variaveis compartilhadas entre telas
├── utils/
│   └── api.js               # Arquivo unico e centralizado de chamadas a API
├── config/
│   └── entities.js          # Configuracao declarativa das telas de CRUD
├── components/
│   ├── Header.jsx           # Cabecalho de navegacao
│   ├── CrudPage/            # Tela de CRUD generica (listar/criar/editar/remover)
│   ├── MessageHolder/       # Fila de mensagens de feedback
│   ├── Message/             # Mensagem individual
│   └── ProtectedRoute/      # Guarda de rotas que exigem sessao
└── pages/
    ├── index.js             # Tabela central de rotas
    ├── LoginPage/           # Autenticacao (JWT)
    ├── HomePage/            # Atalhos das areas
    ├── PrecificacaoPage/    # Precificacao de recebivel
    └── ExtratoLiquidacaoPage/ # Relatorio com filtros e paginacao
```

## Decisoes de arquitetura (conforme solicitado)

- **Centralizacao das chamadas de API**: todo acesso ao back-end passa por
  `src/utils/api.js`. Ele cria a instancia axios, injeta o token `Bearer`
  automaticamente e desembrulha o envelope padrao `ApiResponse` da API.
- **Context para variaveis entre telas**: `src/context/AppContext.js` mantem o
  usuario, o token, o estado do cabecalho e as mensagens de feedback,
  disponibilizados a toda a aplicacao pelo `App.js`.
- **Controle de sessao com o token**: apos o login, o token JWT e guardado em
  cookie (`react-cookie`) e no cliente axios. Ao recarregar a pagina a sessao e
  restaurada a partir do cookie; o logout limpa tudo. Rotas sensiveis sao
  protegidas por `ProtectedRoute`.
- **Linter**: ESLint configurado em `.eslintrc.json` (`npm run lint`).

## Configuracao

Copie/ajuste o arquivo `.env`:

```
REACT_APP_API_URL=
```

Deixe vazio para usar o proxy de desenvolvimento (`package.json` -> `proxy`),
que encaminha as chamadas `/api/...` para `http://localhost:8080`
(porta padrao da API Spring Boot). Assim nao e necessario configurar CORS no
back-end durante o desenvolvimento. Para apontar para outra URL, informe-a
diretamente (ex.: `REACT_APP_API_URL=https://api.exemplo.com`).

## Como executar

```bash
npm install       # instala as dependencias
npm start         # sobe o front em http://localhost:3000
npm run lint      # roda o linter
npm run build     # gera o build de producao
```

Certifique-se de que a API (`../teste-sistema-recebiveis`) esteja rodando em
`http://localhost:8080` antes de fazer login.
