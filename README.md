# 🚗 AutoMecânica - Site de Venda de Automóveis

Projeto full-stack completo com backend Node.js/Express/TypeScript e frontend Next.js/React/TypeScript para gestão e venda de automóveis.

## 📚 Documentação

- **[📖 Índice Completo](INDEX.md)** - Navegue por toda a documentação
- **[⚡ Setup Rápido](SETUP.md)** - Instale em minutos
- **[📋 Resumo Executivo](SUMMARY.md)** - Visão geral do projeto
- **[💡 Exemplos de API](EXAMPLES.md)** - Exemplos práticos
- **[📁 Estrutura](PROJECT_STRUCTURE.md)** - Arquitetura detalhada
- **[🔧 Troubleshooting](TROUBLESHOOTING.md)** - Resolução de problemas
- **[🗺️ Roadmap](ROADMAP.md)** - Próximas funcionalidades

---

## 📋 Características

- ✅ Backend REST API com Node.js + Express + TypeScript
- ✅ Frontend Next.js 14 (App Router) + React + TypeScript + Tailwind CSS
- ✅ PostgreSQL como base de dados
- ✅ **Imagens guardadas em BASE64 na base de dados** (não em ficheiros)
- ✅ Autenticação JWT com cookies httpOnly
- ✅ RBAC: Super Admin
- ✅ Upload de múltiplas imagens por carro (multipart/form-data)
- ✅ Validação com Zod
- ✅ Prisma ORM
- ✅ Docker ready (docker-compose)
- ✅ Seed automático do super admin

## 🏗️ Estrutura do Projeto

```
sande/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── lib/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start - Desenvolvimento

### Pré-requisitos

- Node.js 20+
- PostgreSQL 16+ (ou Docker)
- npm ou yarn

### 1. Clonar e configurar variáveis de ambiente

```bash
# Backend
cd backend
cp .env.example .env
# Editar .env com as suas configurações

# Frontend
cd frontend
cp .env.local.example .env.local
# Editar .env.local
```

### 2. Iniciar PostgreSQL (com Docker)

```bash
docker run -d \
  --name postgres-dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mechanics \
  -p 5432:5432 \
  postgres:16-alpine
```

### 3. Backend

```bash
cd backend

# Instalar dependências
npm install

# Gerar Prisma Client
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# Seed (criar super admin)
npm run prisma:seed

# Iniciar servidor de desenvolvimento
npm run dev
```

Backend estará disponível em: `http://localhost:4000`

### 4. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Frontend estará disponível em: `http://localhost:3000`

## 🐳 Produção com Docker

### 1. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Editar .env com valores de produção
```

### 2. Iniciar todos os serviços

```bash
docker compose up -d --build
```

### 3. Verificar logs

```bash
docker compose logs -f
```

### 4. Parar serviços

```bash
docker compose down
```

### 5. Parar e remover volumes

```bash
docker compose down -v
```

## 📡 API Endpoints

### Autenticação

```bash
# Login (recebe JWT cookie)
POST /api/auth/login
Content-Type: application/json
{
  "email": "admin@site.com",
  "password": "ChangeMe123!"
}

# Logout
POST /api/auth/logout

# User actual
GET /api/auth/me
```

### Público - Carros

```bash
# Listar carros (com paginação e filtros)
GET /api/cars?page=1&pageSize=12&search=bmw&minPrice=10000&maxPrice=30000&make=BMW&year=2020

# Detalhe de um carro
GET /api/cars/:id
```

### Público - Imagens

```bash
# Obter imagem (retorna buffer da imagem)
GET /api/images/:imageId
```

### Admin - Carros (requer autenticação + SUPER_ADMIN)

```bash
# Listar todos os carros (incluindo não publicados)
GET /api/admin/cars

# Criar carro com imagens
POST /api/admin/cars
Content-Type: multipart/form-data
- title: string
- make: string
- model: string
- year: string (YYYY)
- price: string (decimal)
- mileage: string (int)
- fuel: string
- transmission: string
- description: string
- isPublished: string ("true" | "false")
- images: File[] (máx 10, 2MB cada)

# Atualizar carro (adicionar novas imagens)
PUT /api/admin/cars/:id
Content-Type: multipart/form-data
(mesmos campos, todos opcionais)

# Eliminar carro
DELETE /api/admin/cars/:id

# Eliminar uma imagem
DELETE /api/admin/cars/:id/images/:imageId

# Reordenar imagens
PATCH /api/admin/cars/:id/images/reorder
Content-Type: application/json
{
  "imageIds": ["uuid1", "uuid2", "uuid3"]
}
```

## 💡 Exemplos cURL

### Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@site.com",
    "password": "ChangeMe123!"
  }' \
  -c cookies.txt
```

### Criar carro com múltiplas imagens

```bash
curl -X POST http://localhost:4000/api/admin/cars \
  -b cookies.txt \
  -F "title=BMW 320d Pack M" \
  -F "make=BMW" \
  -F "model=320d" \
  -F "year=2020" \
  -F "price=28500.00" \
  -F "mileage=45000" \
  -F "fuel=Diesel" \
  -F "transmission=Automática" \
  -F "description=Excelente estado, sempre em garagem" \
  -F "isPublished=true" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "images=@/path/to/image3.jpg"
```

### Listar carros públicos

```bash
curl http://localhost:4000/api/cars?page=1&pageSize=12
```

### Obter uma imagem

```bash
curl http://localhost:4000/api/images/:imageId --output car-image.jpg
```

## 🗄️ Schema da Base de Dados

### User

- `id` (UUID)
- `email` (unique)
- `passwordHash`
- `role` (SUPER_ADMIN)
- `createdAt`

### Car

- `id` (UUID)
- `title`
- `make`
- `model`
- `year` (int)
- `price` (decimal)
- `mileage` (int)
- `fuel`
- `transmission`
- `description` (text)
- `isPublished` (boolean)
- `createdAt`, `updatedAt`

### CarImage

- `id` (UUID)
- `carId` (FK → Car, cascade delete)
- `filename`
- `mimeType` (image/jpeg, image/png, image/webp)
- `base64` (text) - **Imagem guardada em BASE64**
- `sortOrder` (int)
- `createdAt`

## 🔐 Autenticação

- JWT guardado em cookie `httpOnly`
- Expiração: 7 dias
- Super admin criado automaticamente no seed

**Credenciais padrão:**

- Email: `admin@site.com`
- Password: `ChangeMe123!`

⚠️ **IMPORTANTE:** Alterar em produção via variáveis de ambiente.

## 📦 Tecnologias

### Backend

- Node.js 20
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- multer
- zod
- helmet, cors

### Frontend

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- React Query (TanStack Query)
- React Hook Form
- zod
- axios

## 🎨 Features do Frontend

### Público

- `/` - Homepage
- `/cars` - Listagem com pesquisa e paginação
- `/cars/[id]` - Detalhe com galeria de imagens

### Admin

- `/admin/login` - Login
- `/admin` - Dashboard (lista todos os carros)
- `/admin/cars/new` - Criar novo carro
- `/admin/cars/[id]/edit` - Editar carro existente

## 📝 Notas Importantes

### Imagens em Base64

- ✅ Todas as imagens são convertidas para BASE64 e guardadas na tabela `CarImage`
- ✅ Endpoint `/api/images/:imageId` serve as imagens (converte base64 → buffer)
- ✅ Cache headers (ETag, Cache-Control) para performance
- ✅ Listagens não incluem base64 (apenas metadata)

### Limites

- Máx. 10 imagens por carro
- Máx. 2MB por imagem
- Tipos aceites: JPG, PNG, WEBP

## 🛠️ Scripts Úteis

### Backend

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Prisma Studio (GUI da BD)
npm run prisma:studio

# Criar migration
npx prisma migrate dev --name nome_da_migration

# Reset BD (dev)
npx prisma migrate reset
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Lint
npm run lint
```

## 🔧 Troubleshooting

### Erro de conexão à BD

Verificar que PostgreSQL está a correr e `DATABASE_URL` está correto.

### Imagens não aparecem

Verificar que `NEXT_PUBLIC_API_URL` no frontend aponta para o backend correto.

### Erro 401 no admin

Fazer login novamente em `/admin/login`.

### Docker: Backend não inicia

Verificar logs: `docker compose logs backend`
Geralmente é problema de conexão à BD (aguardar healthcheck).

## 📄 Licença

ISC

## 👨‍💻 Autor

Desenvolvido para AutoMecânica
