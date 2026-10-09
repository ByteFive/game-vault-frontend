# Game Vault — Front-end

Plataforma web para **avaliar, organizar e descobrir jogos**. Cada pessoa constrói o próprio perfil de jogador: avalia jogos de 1 a 5 estrelas, monta uma biblioteca com status, escolhe um Top 5, descobre o seu **Game DNA** (um retrato automático do seu gosto) e recebe recomendações baseadas nele.

Este repositório contém **apenas o front-end** (interface da aplicação, exibida no navegador como **GameDNA**). Os dados dos jogos, as contas e tudo o que é salvo vêm do **back-end** do projeto, que precisa estar rodando para a maior parte dos recursos funcionar (veja [Como usar](#como-usar)).

## Participantes

- Darllan Cabral Sousa
- Gustavo Travassos Barbosa
- José Alison Barbosa da Silva
- Renan dos Reis Pimentel
- Rodrigo Silveira Silva

## Como o front-end funciona

O front é uma aplicação de página única (SPA) feita em React. Toda a comunicação com o servidor acontece por **GraphQL**: todas as chamadas são enviadas por `POST /graphql`.

### Páginas

| Página | Rota | Precisa de login? | O que faz |
|---|---|---|---|
| Home | `/` | Não | Jogos populares. Quando logado, mostra também os jogos avaliados recentemente e recomendações baseadas no seu gosto. |
| Explorar | `/explorar` | Não | Busca por título e filtros por gênero, plataforma, ano e nota, com ordenação. |
| Jogo | `/jogo/:id` | Ver: não. Agir: sim | Detalhes do jogo (descrição, gêneros, plataformas, desenvolvedora, nota). Logado, dá para avaliar com estrelas, adicionar à biblioteca, mudar o status e adicionar ao Top 5. |
| Meu Top 5 | `/meu-top-5` | Sim | Cinco posições, com opção de subir, descer e remover jogos. Não aceita mais de cinco. |
| Meus Jogos | `/meus-jogos` | Sim | Biblioteca pessoal com status (Quero jogar, Jogando, Zerei, Abandonei) e filtros por status, gênero e plataforma. |
| Avaliações | `/avaliacoes` | Sim | Todas as suas avaliações, ordenáveis por mais recentes, melhor avaliados, pior avaliados ou nome. |
| Game DNA | `/game-dna` | Sim | Análise do seu gosto: gêneros e tags favoritos, preferência single-player/multiplayer, texto de perfil, evolução do gosto e recomendações. |
| Comparar | `/comparar` | Sim | Compara o seu Top 5 com o de outros perfis: jogos em comum, diferenças e posições. |
| Perfil | `/perfil` | Sim | Seu resumo: estatísticas, Top 5, Game DNA resumido e avaliações recentes. Permite editar nome, descrição e avatar. |
| Login / Registrar | `/login`, `/registrar` | Não | Entrada e criação de conta. |

As páginas que exigem login são protegidas por uma rota privada: quem não está autenticado é enviado para a tela de login.

### Fluxo dos dados

- `src/services/` concentra as chamadas ao back-end, um arquivo por assunto (`authApi`, `gameApi`, `libraryApi`, `ratingApi`, `top5Api`).
- `src/context/AuthContext.tsx` guarda quem está logado. Ao abrir o site, o front pergunta ao back (`me`) se já existe uma sessão ativa.
- `src/context/AppContext.tsx` guarda a biblioteca, as avaliações e o Top 5 da pessoa logada, carregados do back sempre que a sessão muda.
- `src/utils/dna.ts` e `src/utils/recommendations.ts` calculam o Game DNA e as recomendações no próprio front, a partir das suas avaliações e dos dados dos jogos.
- A autenticação usa **cookie** definido pelo back-end. O front envia o cookie em todas as chamadas.
- Em desenvolvimento, o Vite redireciona `/graphql` para o endereço do back-end (variável `API_URL`), então o navegador conversa sempre com o mesmo endereço do front.

### Como o Game DNA funciona

Cada avaliação contribui para os gêneros e tags do jogo, com peso proporcional à nota. Notas altas pesam mais, e o resultado é normalizado em porcentagens. Disso saem as barras de gêneros e estilos, a afinidade single-player/multiplayer e o texto de perfil. As recomendações pontuam os jogos que você ainda não avaliou por gêneros, tags e plataformas em comum com os que você avaliou com 4 ou 5 estrelas, mais um bônus para jogos bem avaliados.

### Observações importantes

- **Busca e filtros do Explorar** são aplicados no próprio front sobre a lista de jogos que o back-end devolve.
- **Comparar** usa perfis de demonstração (João, Marina e Lucas). O back-end só entrega o Top 5 da pessoa logada, então os Top 5 desses perfis são montados a partir da lista de jogos carregada.
- **"Como seu gosto evoluiu?"** usa as datas das suas avaliações. Enquanto não houver avaliações em pelo menos dois anos diferentes, a seção mostra um exemplo ilustrativo.
- **Perfil:** nome, descrição e avatar editados na página de perfil ficam salvos apenas no navegador (`localStorage`), por usuário. Biblioteca, avaliações e Top 5 ficam no back-end.
- **Sair** encerra a sessão no front. O cookie de autenticação só expira no tempo definido no back-end, então, ao recarregar a página, a sessão pode ser retomada.

## Tecnologias utilizadas

- **React 18**: interface em componentes, com Context API para o estado global
- **TypeScript**: tipagem de todo o código
- **Vite 5**: servidor de desenvolvimento e build
- **Tailwind CSS 3** (com PostCSS e Autoprefixer): estilização
- **React Router DOM 6**: navegação entre páginas e rotas protegidas
- **Lucide React**: ícones
- **GraphQL**: comunicação com o back-end, via `fetch`
- **localStorage**: dados de exibição do perfil
- **Google Fonts**: Space Grotesk, Inter e JetBrains Mono

## Como usar

### Pré-requisitos

- **Node.js 18 ou superior** e **npm**
- O **back-end do Game Vault** instalado e rodando (veja abaixo)

### 1. Suba o back-end

Vários recursos dependem da API. Siga o README do repositório do back-end e deixe-o rodando, por padrão em `http://localhost:8080`. Ele precisa de um banco **MongoDB** e de uma chave da **API da RAWG** configurados no `.env` dele.

**O que depende do back-end:**

| Recurso | Precisa do back-end? |
|---|---|
| Criar conta, entrar e manter a sessão | Sim |
| Listar, buscar e ver detalhes de jogos (Home, Explorar, Jogo) | Sim |
| Avaliar jogos | Sim |
| Biblioteca e status dos jogos | Sim |
| Top 5 e reorganização | Sim |
| Game DNA, recomendações, estatísticas do perfil | Sim (dependem das suas avaliações, que vêm do back) |
| Abrir o site e navegar pelas telas | Não (mas as telas ficam sem dados) |
| Editar nome, descrição e avatar | Salvo no navegador, mas a página de perfil só abre com a sessão ativa (que vem do back-end) |

Sem o back-end rodando, a interface abre, mas a lista de jogos não carrega e não é possível entrar nem registrar.

### 2. Configure e rode o front-end

```bash
npm install
```

Confira o arquivo `.env` na raiz do projeto (há um `.env.example` de modelo):

```
API_URL=http://localhost:8080
```

`API_URL` deve apontar para o endereço onde o back-end está rodando. Se você alterar esse arquivo, reinicie o servidor de desenvolvimento.

Inicie o projeto:

```bash
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

### 3. Passo a passo de uso

1. Em **Registrar**, crie sua conta. Depois do cadastro, o login é feito automaticamente.
2. Em **Explorar**, busque jogos e use os filtros. Clique em um jogo para ver os detalhes.
3. Na página do jogo, dê uma nota de 1 a 5 estrelas, adicione-o à biblioteca e, se quiser, ao Top 5.
4. Em **Meus Jogos**, troque o status de cada jogo. Em **Meu Top 5**, reorganize as posições.
5. Quanto mais jogos você avaliar, mais preciso fica o **Game DNA**. Avalie alguns com 4 ou 5 estrelas para receber recomendações.
6. Em **Comparar**, veja o seu Top 5 lado a lado com o de outros perfis.
7. Em **Perfil**, confira o resumo e edite nome, descrição e avatar.

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Verifica os tipos e gera a versão de produção em `dist/` |
| `npm run preview` | Serve a versão de produção localmente |

## Estrutura do projeto

```
src/
├── components/   componentes reutilizáveis (Navbar, GameCard, StarRating, DNAChart...)
├── context/      estado global (autenticação e dados da pessoa logada)
├── data/         perfis de demonstração usados em Comparar
├── hooks/        hooks personalizados
├── layouts/      layout principal das páginas
├── pages/        uma página por arquivo
├── services/     chamadas ao back-end (GraphQL)
├── types/        tipos TypeScript
├── utils/        cálculo do Game DNA e das recomendações
├── App.tsx       rotas
└── main.tsx      ponto de entrada
```

## Licença

Distribuído sob a licença MIT. Veja o arquivo `LICENSE`.
