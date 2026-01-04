# 📦 Estrutura Completa do Projeto

## 📁 Árvore de Ficheiros

```
sande/
├── README.md                      # Documentação principal
├── SETUP.md                       # Guia de instalação rápida
├── EXAMPLES.md                    # Exemplos de uso da API
├── setup.sh                       # Script de setup automático
├── docker-compose.yml             # Orquestração Docker
├── .env.example                   # Template de variáveis de ambiente
├── .gitignore                     # Ficheiros ignorados pelo Git
│
├── backend/                       # 🔧 Backend Node.js + Express + TypeScript
│   ├── package.json               # Dependências do backend
│   ├── tsconfig.json              # Configuração TypeScript
│   ├── Dockerfile                 # Imagem Docker do backend
│   ├── .env.example               # Template de env do backend
│   ├── .gitignore
│   │
│   ├── prisma/
│   │   ├── schema.prisma          # Schema da base de dados
│   │   └── seed.ts                # Seed (criar super admin)
│   │
│   └── src/
│       ├── server.ts              # Entry point do servidor
│       ├── app.ts                 # Configuração Express
│       │
│       ├── lib/
│       │   ├── prisma.ts          # Cliente Prisma
│       │   └── env.ts             # Validação de env vars
│       │
│       ├── middlewares/
│       │   ├── auth.ts            # Autenticação JWT
│       │   ├── requireRole.ts     # RBAC middleware
│       │   ├── errorHandler.ts    # Tratamento de erros
│       │   └── upload.ts          # Config Multer
│       │
│       ├── controllers/
│       │   ├── authController.ts      # Login/logout/me
│       │   ├── carsController.ts      # Listagem pública
│       │   ├── imageController.ts     # Servir imagens
│       │   └── adminCarsController.ts # CRUD admin
│       │
│       └── routes/
│           ├── auth.ts            # Rotas de autenticação
│           ├── cars.ts            # Rotas públicas
│           ├── images.ts          # Endpoint de imagens
│           └── admin.ts           # Rotas admin
│
└── frontend/                      # 🎨 Frontend Next.js + React + TypeScript
    ├── package.json               # Dependências do frontend
    ├── tsconfig.json              # Configuração TypeScript
    ├── next.config.js             # Configuração Next.js
    ├── tailwind.config.js         # Configuração Tailwind
    ├── postcss.config.js          # PostCSS
    ├── Dockerfile                 # Imagem Docker do frontend
    ├── .env.local.example         # Template de env do frontend
    ├── .gitignore
    │
    └── src/
        ├── app/
        │   ├── layout.tsx         # Layout principal
        │   ├── page.tsx           # Homepage
        │   ├── globals.css        # Estilos globais
        │   │
        │   ├── cars/
        │   │   ├── page.tsx       # Listagem de carros
        │   │   └── [id]/
        │   │       └── page.tsx   # Detalhe do carro
        │   │
        │   └── admin/
        │       ├── page.tsx       # Dashboard admin
        │       ├── login/
        │       │   └── page.tsx   # Login admin
        │       └── cars/
        │           ├── new/
        │           │   └── page.tsx     # Criar carro
        │           └── [id]/
        │               └── edit/
        │                   └── page.tsx # Editar carro
        │
        ├── components/
        │   ├── Providers.tsx      # React Query provider
        │   ├── Header.tsx         # Cabeçalho
        │   ├── Footer.tsx         # Rodapé
        │   └── CarCard.tsx        # Card de carro
        │
        └── lib/
            ├── api.ts             # Cliente Axios
            ├── types.ts           # TypeScript types
            └── utils.ts           # Funções auxiliares
```

## 🎯 Funcionalidades Implementadas

### Backend

- ✅ API REST completa
- ✅ Autenticação JWT com cookies httpOnly
- ✅ RBAC (Super Admin)
- ✅ Upload de imagens em base64 na PostgreSQL
- ✅ CRUD completo de carros
- ✅ Gestão de múltiplas imagens por carro
- ✅ Endpoints públicos com paginação e filtros
- ✅ Validação com Zod
- ✅ Prisma ORM
- ✅ Seed automático do super admin
- ✅ Error handling centralizado
- ✅ Middlewares de segurança (helmet, cors)

### Frontend

- ✅ Next.js 14 com App Router
- ✅ Páginas públicas (home, listagem, detalhe)
- ✅ Admin dashboard completo
- ✅ Criar e editar carros
- ✅ Upload de múltiplas imagens
- ✅ Galeria de imagens no detalhe
- ✅ Pesquisa e filtros
- ✅ Paginação
- ✅ React Query para cache
- ✅ React Hook Form + Zod
- ✅ Tailwind CSS
- ✅ Responsive design

### Docker

- ✅ Dockerfile para backend
- ✅ Dockerfile para frontend
- ✅ docker-compose.yml completo
- ✅ PostgreSQL containerizado
- ✅ Volumes persistentes
- ✅ Healthchecks
- ✅ Migrations automáticas
- ✅ Seed automático

## 📊 Modelo de Dados

### User

```typescript
{
  id: uuid;
  email: string(unique);
  passwordHash: string;
  role: "SUPER_ADMIN";
  createdAt: DateTime;
}
```

### Car

```typescript
{
  id: uuid
  title: string
  make: string
  model: string
  year: int
  price: Decimal
  mileage: int
  fuel: string
  transmission: string
  description: text
  isPublished: boolean
  createdAt: DateTime
  updatedAt: DateTime
  images: CarImage[]
}
```

### CarImage

```typescript
{
  id: uuid;
  carId: uuid(FK);
  filename: string;
  mimeType: string;
  base64: text; // ⭐ Imagem em BASE64
  sortOrder: int;
  createdAt: DateTime;
}
```

## 🔑 Endpoints da API

### Públicos

- `GET /api/cars` - Listar carros
- `GET /api/cars/:id` - Detalhe do carro
- `GET /api/images/:imageId` - Obter imagem

### Autenticação

- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Utilizador atual

### Admin (requer SUPER_ADMIN)

- `GET /api/admin/cars` - Listar todos
- `POST /api/admin/cars` - Criar carro
- `PUT /api/admin/cars/:id` - Atualizar carro
- `DELETE /api/admin/cars/:id` - Eliminar carro
- `DELETE /api/admin/cars/:id/images/:imageId` - Eliminar imagem
- `PATCH /api/admin/cars/:id/images/reorder` - Reordenar imagens

## 🚀 Como Iniciar

### Rápido (Docker)

```bash
./setup.sh
```

### Manual

Ver [SETUP.md](SETUP.md) para instruções detalhadas.

## 📚 Documentação

- **README.md** - Documentação completa
- **SETUP.md** - Guia de instalação
- **EXAMPLES.md** - Exemplos de API

## 🔐 Segurança

- JWT em cookies httpOnly (não acessível por JavaScript)
- Helmet para headers de segurança
- CORS configurável
- Validação de entrada com Zod
- Limitação de tamanho de ficheiros
- Tipos de ficheiro restritos

## 🎨 Stack Tecnológica

**Backend:**

- Node.js 20
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT + bcrypt
- Multer
- Zod

**Frontend:**

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Query
- React Hook Form
- Axios

**DevOps:**

- Docker
- Docker Compose
- PostgreSQL 16

## ✅ Pronto para Produção

- ✅ Variáveis de ambiente configuráveis
- ✅ Docker multi-stage builds
- ✅ Healthchecks
- ✅ Graceful shutdown
- ✅ Error handling robusto
- ✅ Logging apropriado
- ✅ TypeScript estrito
- ✅ Sem volumes de ficheiros (tudo na BD)

---

**Desenvolvido para AutoMecânica** 🚗
