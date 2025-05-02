# SeekerNaut Chat

## Visão Geral

Este é o repositório do frontend da aplicação SeekerNaut Chat, uma interface de chat moderna e responsiva construída com React, TypeScript e Material Design 3. O objetivo principal é fornecer uma experiência de conversação fluida e intuitiva para os usuários interagirem com um Large Language Model (LLM) rodando em um backend Spring WebFlux.

A aplicação oferece as seguintes funcionalidades principais:

* **Interface de Chat Amigável:** Campo de entrada de mensagens claro e área de exibição de conversas organizada.
* **Envio de Mensagens:** Permite aos usuários enviar mensagens de texto para o LLM.
* **Recebimento de Respostas em Tempo Real (Streaming):** Exibe as respostas do LLM à medida que são geradas, proporcionando uma experiência interativa.
* **Histórico de Conversas:** Mantém o contexto da conversa ao enviar mensagens subsequentes.
* **Design Moderno:** Utiliza os componentes e o estilo do Material Design 3 para uma interface de usuário atraente e consistente.

## Tecnologias Utilizadas

* **React:** Uma biblioteca JavaScript para construir interfaces de usuário.
* **TypeScript:** Um superset de JavaScript que adiciona tipagem estática.
* **Material Design 3:** Um sistema de design criado pelo Google, implementado aqui através da biblioteca `@mui/material` para React.
* **`@mui/material`:** Uma biblioteca de componentes de interface de usuário que implementa as diretrizes do Material Design 3.
* **`@emotion/react` e `@emotion/styled`:** Bibliotecas para estilização de componentes React usadas por `@mui/material`.
* **`@mui/icons-material`:** Uma biblioteca de ícones SVG do Material Design.
* **`fetch` API (ou Axios):** Para comunicação HTTP com o backend.
* **`EventSource` API:** Para lidar com o streaming de eventos do backend.

## Pré-requisitos

* **Node.js** (versão >= 18)
* **npm** ou **yarn** instalado

## Como Rodar a Aplicação

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd chat-frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure a URL do Backend:**
    Você precisará configurar a URL do seu backend Spring WebFlux na aplicação frontend. Geralmente, isso é feito em um arquivo de configuração (por exemplo, `.env` ou diretamente no código em um arquivo de constantes). Certifique-se de que a variável de ambiente ou a constante `REACT_APP_BACKEND_URL` (ou similar) esteja definida com a URL correta do seu backend.

4.  **Inicie a aplicação:**
    ```bash
    npm start
    # ou
    yarn start
    ```

    Isso iniciará o servidor de desenvolvimento do React e abrirá a aplicação no seu navegador (geralmente em `http://localhost:3000`).

## Estrutura de Pastas (Exemplo)

seekernaut-front/
├── public/
├── src/
│   ├── components/
│   │   ├── ChatInput.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── MessageItem.tsx
│   │   └── MessageList.tsx
│   ├── App.tsx
│   ├── index.tsx
│   ├── react-app-env.d.ts
│   ├── ...
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
└── ...

## Próximos Passos e Contribuições

Este projeto está em desenvolvimento contínuo. Contribuições são bem-vindas! Se você tiver sugestões de melhorias, relatar bugs ou quiser contribuir com código, por favor, abra uma issue ou envie um pull request.

## Licença

[ADICIONE A LICENÇA AQUI]