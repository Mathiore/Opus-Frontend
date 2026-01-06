# Serviços da API

Este diretório contém todos os serviços para interagir com a API do backend.

## Estrutura

- `authService.ts` - Autenticação (login, registro, logout)
- `jobsService.ts` - Trabalhos (listar, criar, cancelar)
- `offersService.ts` - Ofertas (criar, listar, aceitar)
- `paymentsService.ts` - Pagamentos (checkout)
- `walletService.ts` - Carteira (saldo, transações, saques)
- `reviewsService.ts` - Avaliações (criar, listar, resumo)
- `providerService.ts` - Prestadores (onboarding, aprovação)
- `userService.ts` - Usuário (atualizar perfil)

## Uso

### Importar serviços diretamente:

```typescript
import { getJobs, createJob } from '@/services/jobsService';
import { createOffer, acceptOffer } from '@/services/offersService';
import { getWallet } from '@/services/walletService';
```

### Usar hooks customizados:

```typescript
import { useJobs } from '@/hooks/useJobs';
import { useOffers } from '@/hooks/useOffers';
import { useWallet } from '@/hooks/useWallet';

function MyComponent() {
  const { getJobs, createJob, loading, error } = useJobs();
  const { createOffer, acceptOffer } = useOffers();
  const { getWallet } = useWallet();

  // Usar as funções...
}
```

## Exemplos

### Buscar trabalhos próximos:

```typescript
import { getJobs } from '@/services/jobsService';

const jobs = await getJobs({
  lat: -23.5505,
  lng: -46.6333,
  radius_km: 10,
  category_id: 1,
  status: 'open',
  limit: 20,
});
```

### Criar um trabalho:

```typescript
import { createJob } from '@/services/jobsService';

const job = await createJob({
  category_id: 1,
  title: 'Preciso de um encanador',
  description: 'Vazamento no banheiro',
  address_text: 'Rua Exemplo, 123',
  lat: -23.5505,
  lng: -46.6333,
  photo_urls: ['https://...'],
});
```

### Criar uma oferta:

```typescript
import { createOffer } from '@/services/offersService';

const offer = await createOffer('job-id', {
  amount_cents: 50000, // R$ 500,00
  currency: 'BRL',
  message: 'Posso fazer hoje mesmo!',
});
```

### Buscar carteira:

```typescript
import { getWallet } from '@/services/walletService';

const wallet = await getWallet();
console.log(`Saldo disponível: R$ ${wallet.available_cents / 100}`);
```

### Criar avaliação:

```typescript
import { createReview } from '@/services/reviewsService';

const review = await createReview({
  job_id: 'job-id',
  rating: 5,
  comment: 'Excelente serviço!',
  direction: 'consumer_to_provider',
});
```

## Tratamento de Erros

Todos os serviços lançam erros que podem ser capturados:

```typescript
try {
  const job = await createJob(data);
} catch (error) {
  console.error('Erro:', error.message);
  // error.message contém a mensagem de erro da API
}
```

## Autenticação

Todos os serviços que requerem autenticação automaticamente:
1. Buscam o token do AsyncStorage
2. Adicionam o header `Authorization: Bearer <token>`
3. Lançam erro se o token não estiver disponível

## Tipos TypeScript

Todos os tipos estão definidos em `@/types/api.ts`:

```typescript
import type { Job, CreateJobRequest, Offer } from '@/types/api';
```


