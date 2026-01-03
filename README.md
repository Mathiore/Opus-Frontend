# Opus Frontend

Plataforma mobile para conexão entre clientes e profissionais de serviços, desenvolvida com React Native e Expo Router.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Configuração](#configuração)
- [Arquitetura](#arquitetura)
- [Componentes](#componentes)
- [Context API](#context-api)
- [Navegação](#navegação)
- [Tipos TypeScript](#tipos-typescript)
- [Desenvolvimento](#desenvolvimento)
- [Build](#build)

## 🎯 Sobre o Projeto

Opus é uma aplicação mobile que conecta clientes que precisam de serviços (eletricista, encanador, faxina, pedreiro, pintor, etc.) com profissionais qualificados. A plataforma permite que clientes publiquem pedidos de serviço, recebam propostas de profissionais, conversem em tempo real e gerenciem seus pedidos.

### Principais Características

- 🗺️ Visualização de serviços em mapa
- 📝 Publicação de pedidos de serviço
- 💬 Sistema de mensagens em tempo real
- 📋 Gerenciamento de pedidos e propostas
- 👤 Perfil do usuário
- 💳 Processo de pagamento
- 🎨 Interface moderna e intuitiva

## 🛠️ Tecnologias

### Core
- **React Native** 0.81.4
- **React** 19.1.0
- **Expo** 54.0.10
- **Expo Router** 6.0.8 (roteamento baseado em arquivos)
- **TypeScript** 5.9.2

### Navegação
- **@react-navigation/native** 7.0.14
- **@react-navigation/bottom-tabs** 7.2.0

### UI/UX
- **lucide-react-native** 0.544.0 (ícones)
- **expo-linear-gradient** 15.0.7
- **expo-blur** 15.0.7
- **react-native-reanimated** 4.1.1
- **react-native-gesture-handler** 2.28.0

### Funcionalidades
- **expo-camera** 17.0.8 (câmera para fotos)
- **expo-linking** 8.0.8 (deep linking)
- **expo-haptics** 15.0.7 (feedback háptico)
- **react-native-webview** 13.15.0

### Backend/Estado
- **@supabase/supabase-js** 2.58.0 (preparado para integração)
- Context API (gerenciamento de estado)

## 📦 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Expo CLI** (instalado globalmente ou via npx)
- **Git**

Para desenvolvimento mobile:
- **Expo Go** (app no celular para testes)
- **Android Studio** (para emulador Android)
- **Xcode** (para simulador iOS - apenas macOS)

## 🚀 Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd Opus-Frontend-main
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npx expo start
   ```

4. **Execute a aplicação**
   - Escaneie o QR code com o Expo Go (Android) ou Camera (iOS)
   - Ou pressione `a` para abrir no emulador Android
   - Ou pressione `i` para abrir no simulador iOS
   - Ou pressione `w` para abrir no navegador web

## 📁 Estrutura do Projeto

```
Opus-Frontend-main/
├── app/                      # Rotas da aplicação (Expo Router)
│   ├── _layout.tsx          # Layout raiz da aplicação
│   ├── index.tsx            # Tela inicial (redirecionamento)
│   ├── login.tsx            # Tela de login
│   ├── onboarding/          # Tela de onboarding
│   │   └── index.tsx
│   ├── (tabs)/              # Navegação por abas
│   │   ├── _layout.tsx      # Layout das abas
│   │   ├── index.tsx        # Home (mapa e categorias)
│   │   ├── orders.tsx       # Lista de pedidos
│   │   ├── messages.tsx     # Lista de conversas
│   │   └── profile.tsx      # Perfil do usuário
│   ├── publish/             # Publicar serviço
│   │   └── index.tsx
│   ├── orders/              # Detalhes do pedido
│   │   └── [id].tsx
│   ├── chat/                # Chat com profissional
│   │   └── [id].tsx
│   ├── payment/             # Processo de pagamento
│   │   └── [id].tsx
│   └── +not-found.tsx       # Página 404
├── components/              # Componentes reutilizáveis
│   ├── BottomSheet.tsx      # Componente de bottom sheet
│   ├── Button.tsx           # Botão customizado
│   ├── CategoryChip.tsx    # Chip de categoria
│   ├── Input.tsx            # Input customizado
│   ├── MapView.tsx          # Visualização de mapa
│   └── StatusBadge.tsx      # Badge de status
├── context/                 # Context API
│   └── AppContext.tsx       # Contexto global da aplicação
├── data/                    # Dados mockados
│   └── mockData.ts          # Dados de exemplo
├── hooks/                   # Custom hooks
│   └── useFrameworkReady.ts # Hook para inicialização
├── types/                   # Definições TypeScript
│   └── index.ts             # Tipos e interfaces
├── assets/                  # Recursos estáticos
│   └── images/              # Imagens e ícones
├── app.json                 # Configuração do Expo
├── package.json             # Dependências e scripts
└── tsconfig.json            # Configuração TypeScript
```

## ✨ Funcionalidades

### 1. Autenticação
- Login de usuário
- Onboarding para novos usuários
- Gerenciamento de sessão

### 2. Home (Mapa)
- Visualização de serviços disponíveis no mapa
- Busca por serviço ou endereço
- Seleção de localização
- Categorias de serviços (chips horizontais)
- Botão flutuante para publicar serviço

### 3. Publicar Serviço
- Seleção de categoria
- Descrição do serviço
- Endereço e localização (mapa)
- Data e duração estimada
- Fotos opcionais
- Observações adicionais

### 4. Pedidos
- Lista de pedidos do usuário
- Status dos pedidos:
  - `published` - Publicado
  - `proposals` - Recebendo propostas
  - `confirmed` - Confirmado
  - `in_progress` - Em andamento
  - `completed` - Concluído
  - `cancelled` - Cancelado
- Visualização de detalhes
- Visualização de propostas recebidas
- Aceitar proposta de profissional

### 5. Mensagens
- Lista de conversas
- Chat individual com profissionais
- Contador de mensagens não lidas
- Timestamp das mensagens
- Indicador de mensagens enviadas/recebidas

### 6. Perfil
- Informações do usuário
- Configurações
- Histórico de serviços

### 7. Pagamento
- Processo de pagamento para pedidos confirmados
- Integração com gateway de pagamento (preparado)

## 📜 Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para web
npm run build:web

# Verificar tipos TypeScript
npm run typecheck

# Executar linter
npm run lint
```

## ⚙️ Configuração

### app.json
Configurações principais do Expo:
- **name**: Nome da aplicação
- **slug**: Identificador único
- **version**: Versão da aplicação
- **orientation**: Orientação (portrait)
- **newArchEnabled**: Nova arquitetura do React Native habilitada
- **plugins**: Plugins do Expo configurados

### tsconfig.json
- TypeScript em modo strict
- Path aliases configurados (`@/*` aponta para raiz)
- Suporte para arquivos `.ts` e `.tsx`

## 🏗️ Arquitetura

### Gerenciamento de Estado
A aplicação utiliza **Context API** para gerenciamento de estado global:

- `AppContext`: Gerencia usuário, pedidos, conversas e categorias
- Funções disponíveis:
  - `login()` / `logout()` - Autenticação
  - `createOrder()` - Criar novo pedido
  - `acceptProposal()` - Aceitar proposta
  - `updateOrderStatus()` - Atualizar status do pedido
  - `sendMessage()` - Enviar mensagem
  - `getOrderById()` - Buscar pedido por ID
  - `getConversationById()` - Buscar conversa por ID

### Roteamento
Utiliza **Expo Router** com roteamento baseado em arquivos:
- Rotas estáticas: `/login`, `/onboarding`
- Rotas dinâmicas: `/orders/[id]`, `/chat/[id]`, `/payment/[id]`
- Navegação por abas: `(tabs)/`
- Stack navigation para telas modais

### Dados Mockados
Atualmente, a aplicação utiliza dados mockados em `data/mockData.ts`:
- Categorias de serviços
- Pedidos de exemplo
- Conversas de exemplo
- Usuário mockado

**Nota**: A aplicação está preparada para integração com Supabase (dependência já instalada).

## 🧩 Componentes

### BottomSheet
Componente de bottom sheet para exibir conteúdo deslizável.

### Button
Botão customizado com estilos consistentes.

### CategoryChip
Chip para exibir categorias de serviços com ícone.

### Input
Input customizado com validação.

### MapView
Visualização de mapa com marcadores de serviços.

### StatusBadge
Badge para exibir status de pedidos com cores diferentes.

## 🔌 Context API

### AppContext
Contexto global que fornece:

**Estado:**
- `user`: Usuário atual
- `categories`: Lista de categorias
- `orders`: Lista de pedidos
- `conversations`: Lista de conversas
- `isAuthenticated`: Status de autenticação

**Métodos:**
- `login(email, password)`: Autenticar usuário
- `logout()`: Fazer logout
- `createOrder(orderData)`: Criar novo pedido
- `acceptProposal(orderId, proposalId)`: Aceitar proposta
- `updateOrderStatus(orderId, status)`: Atualizar status
- `sendMessage(conversationId, text)`: Enviar mensagem
- `getOrderById(id)`: Buscar pedido
- `getConversationById(id)`: Buscar conversa

**Uso:**
```typescript
import { useApp } from '@/context/AppContext';

function MyComponent() {
  const { user, orders, createOrder } = useApp();
  // ...
}
```

## 🧭 Navegação

### Estrutura de Navegação

```
Root Stack
├── Onboarding (Stack.Screen)
├── Login (Stack.Screen)
├── Tabs (Stack.Screen)
│   ├── Home (Tab)
│   ├── Orders (Tab)
│   ├── Messages (Tab)
│   └── Profile (Tab)
├── Publish (Stack.Screen)
├── Orders/[id] (Stack.Screen)
├── Chat/[id] (Stack.Screen)
└── Payment/[id] (Stack.Screen)
```

### Navegação Programática
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navegar para uma rota
router.push('/orders/123');

// Navegar com parâmetros
router.push({
  pathname: '/publish',
  params: { categoryId: '1', categoryName: 'Eletricista' }
});
```

## 📝 Tipos TypeScript

### Principais Interfaces

**Category**
```typescript
interface Category {
  id: string;
  name: string;
  icon: string;
}
```

**Order**
```typescript
interface Order {
  id: string;
  categoryId: string;
  categoryName: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  date: Date;
  duration: number;
  observations?: string;
  photos?: string[];
  status: OrderStatus;
  proposals: Proposal[];
  createdAt: Date;
}
```

**Proposal**
```typescript
interface Proposal {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalRating: number;
  professionalAvatar: string;
  price: number;
  message: string;
  createdAt: Date;
  accepted?: boolean;
}
```

**Conversation**
```typescript
interface Conversation {
  id: string;
  orderId: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}
```

**OrderStatus**
```typescript
type OrderStatus =
  | 'published'
  | 'proposals'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';
```

## 💻 Desenvolvimento

### Adicionar Nova Tela
1. Crie um arquivo `.tsx` na pasta `app/`
2. Exporte um componente React como default
3. A rota será criada automaticamente pelo Expo Router

### Adicionar Novo Componente
1. Crie o arquivo na pasta `components/`
2. Exporte o componente
3. Importe onde necessário: `import { ComponentName } from '@/components/ComponentName'`

### Adicionar Novo Tipo
1. Adicione a interface/type em `types/index.ts`
2. Exporte o tipo
3. Importe onde necessário: `import { TypeName } from '@/types'`

### Path Aliases
O projeto usa path aliases configurados:
- `@/*` aponta para a raiz do projeto
- Exemplo: `import { useApp } from '@/context/AppContext'`

## 🏗️ Build

### Build para Web
```bash
npm run build:web
```

### Build para Produção
Para gerar builds nativos, use o EAS Build do Expo:
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Configurar projeto
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```

## 🔮 Próximos Passos

- [ ] Integração com backend
- [ ] Autenticação Clerk
- [ ] Notificações push
- [ ] Integração com gateway de pagamento
- [ ] Sistema de avaliações
- [ ] Geolocalização em tempo real
- [ ] Upload de imagens para storage
- [ ] Testes unitários e de integração
- [ ] CI/CD pipeline

## 📄 Licença

Este projeto é privado.

