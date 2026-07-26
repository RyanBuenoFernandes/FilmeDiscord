# Flikz — Escória Club 🍿

Flikz é uma plataforma web criada para gerenciar uma lista de filmes compartilhada entre amigos (carinhosamente chamados de "Escória"). A plataforma permite sugerir filmes, votar nos próximos títulos a serem assistidos, reagir com emojis e marcar quais já foram assistidos.

Desenvolvido com **Next.js**, **Firebase Firestore** e **TMDB API**.

## 🚀 Tecnologias

- **Framework:** Next.js (App Router)
- **Banco de Dados:** Firebase Firestore (via `firebase-admin`)
- **Estilização:** Tailwind CSS & Shadcn UI
- **Integração:** TMDB (The Movie Database) para busca automática de detalhes e posters
- **Ícones:** Lucide React

## 📋 Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Node.js** (v18+)
- **npm** ou **yarn** / **pnpm** / **deno** (dependendo do seu gerenciador preferido)

## 🛠️ Configuração Inicial

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/RyanBuenoFernandes/FilmeDiscord.git
   cd FilmeDiscord
   ```

2. **Instalar Dependências:**
   ```bash
   npm install
   ```

3. **Configurar Variáveis de Ambiente:**
   Copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Abra o `.env.local` e preencha as seguintes chaves:
   - **TMDB_READ_ACCESS_TOKEN**: Token de acesso de leitura da API do TMDB.
   - **FIREBASE_PROJECT_ID**: ID do seu projeto no Firebase.
   - **FIREBASE_CLIENT_EMAIL**: E-mail do cliente do Firebase Service Account.
   - **FIREBASE_PRIVATE_KEY**: Chave privada da conta de serviço do Firebase (incluindo as aspas e quebras de linha).

## 💻 Executando o Projeto Localmente

Para rodar o servidor de desenvolvimento:
```bash
npm run dev
```

Aecele [http://localhost:3000](http://localhost:3000) no seu navegador para ver o aplicativo em execução.

## 🤝 Colaboração

Se você está colaborando neste projeto:
- **Nunca comite chaves privadas ou senhas.** O arquivo `.env.local` já está adicionado ao `.gitignore` para sua segurança.
- Para alterar ou adicionar novas variáveis de ambiente, lembre-se de atualizar também o `.env.example` para que todos os membros da equipe saibam o que configurar.
