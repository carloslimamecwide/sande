# 🚗 AutoMecânica - Projeto Completo ✅

## 📋 Resumo Executivo

Projeto **full-stack** completo para gestão e venda de automóveis, com backend Node.js/TypeScript e frontend Next.js/React, utilizando PostgreSQL para persistência de dados. **Todas as imagens são guardadas em BASE64 na base de dados** (não em ficheiros).

## ⭐ Características Principais

- ✅ **Backend REST API** completo com autenticação JWT
- ✅ **Frontend moderno** com Next.js 14 e Tailwind CSS
- ✅ **Imagens em BASE64** na PostgreSQL (sem sistema de ficheiros)
- ✅ **Admin dashboard** com CRUD completo
- ✅ **Upload múltiplo** de imagens por carro
- ✅ **Docker ready** - deployment em 1 comando
- ✅ **TypeScript** em todo o projeto
- ✅ **Validação robusta** com Zod
- ✅ **Seed automático** do super admin

## 🎯 Stack Tecnológica

| Camada         | Tecnologias                                         |
| -------------- | --------------------------------------------------- |
| **Backend**    | Node.js 20, Express, TypeScript, Prisma, PostgreSQL |
| **Frontend**   | Next.js 14, React 18, TypeScript, Tailwind CSS      |
| **Auth**       | JWT (httpOnly cookies), bcrypt                      |
| **Upload**     | Multer → BASE64 → PostgreSQL                        |
| **Validation** | Zod (backend + frontend)                            |
| **State**      | React Query (TanStack Query)                        |
| **Forms**      | React Hook Form                                     |
| **Deploy**     | Docker, Docker Compose                              |

## 📊 Modelo de Dados

```
User (Super Admin)
  ├── id, email, passwordHash, role, createdAt

Car
  ├── id, title, make, model, year, price
  ├── mileage, fuel, transmission, description
  ├── isPublished, createdAt, updatedAt
  └── images[] → CarImage

CarImage
  ├── id, carId (FK)
  ├── filename, mimeType
  ├── base64 (TEXT) ← IMAGEM AQUI
  └── sortOrder, createdAt
```

## 🗂️ Estrutura do Projeto

```
sande/
├── 📘 README.md              # Documentação completa
├── 🚀 SETUP.md               # Guia rápido
├── 💡 EXAMPLES.md            # Exemplos API
├── 📁 PROJECT_STRUCTURE.md  # Estrutura detalhada
├── 🗺️ ROADMAP.md            # Melhorias futuras
├── ⚙️ setup.sh               # Script automático
├── 🐳 docker-compose.yml     # Orquestração Docker
│
├── backend/                  # Backend Node.js
│   ├── src/
│   │   ├── controllers/      # Lógica de negócio
│   │   ├── routes/           # Definição de rotas
│   │   ├── middlewares/      # Auth, upload, errors
│   │   ├── lib/              # Prisma, env
│   │   ├── app.ts            # Express config
│   │   └── server.ts         # Entry point
│   └── prisma/
│       ├── schema.prisma     # Schema DB
│       └── seed.ts           # Seed admin
│
└── frontend/                 # Frontend Next.js
    └── src/
        ├── app/              # Pages (App Router)
        │   ├── page.tsx      # Home
        │   ├── cars/         # Listagem pública
        │   └── admin/        # Dashboard admin
        ├── components/       # Componentes React
        └── lib/              # API, types, utils
```

## 🚀 Quick Start

### 1. Com Docker (RECOMENDADO)

```bash
# Clone/navegue até ao projeto
cd sande

# Execute o script de setup
./setup.sh

# Ou manualmente:
docker compose up -d --build

# Aguarde ~30 segundos para migrations/seed
```

### 2. Aceda à aplicação

- **Frontend:** http://localhost:3000
- **Admin:** http://localhost:3000/admin/login
- **API:** http://localhost:4000

### 3. Login Admin

```
Email:    admin@site.com
Password: ChangeMe123!
```

## 📡 API Endpoints

### Públicos

```
GET  /api/cars              # Listar (com filtros/paginação)
GET  /api/cars/:id          # Detalhe
GET  /api/images/:imageId   # Obter imagem
```

### Admin (requer JWT)

```
POST   /api/admin/cars                      # Criar
PUT    /api/admin/cars/:id                  # Atualizar
DELETE /api/admin/cars/:id                  # Eliminar
DELETE /api/admin/cars/:id/images/:imageId  # Eliminar imagem
PATCH  /api/admin/cars/:id/images/reorder   # Reordenar
```

### Autenticação

```
POST /api/auth/login   # Login → JWT cookie
POST /api/auth/logout  # Logout
GET  /api/auth/me      # User atual
```

## 💡 Exemplo de Uso

### Criar carro com imagens

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
  -F "description=Excelente estado" \
  -F "isPublished=true" \
  -F "images=@car1.jpg" \
  -F "images=@car2.jpg" \
  -F "images=@car3.jpg"
```

## 🔒 Segurança

- ✅ JWT em cookies httpOnly (não acessível via JS)
- ✅ RBAC (Role-Based Access Control)
- ✅ Helmet para security headers
- ✅ CORS configurável
- ✅ Validação de inputs (Zod)
- ✅ Limitação de tamanho de ficheiros (2MB)
- ✅ Tipos de imagem restritos (JPG, PNG, WEBP)
- ✅ Máximo 10 imagens por carro

## 📦 Ficheiros Criados

| Ficheiro                    | Descrição                                |
| --------------------------- | ---------------------------------------- |
| `README.md`                 | Documentação completa do projeto         |
| `SETUP.md`                  | Guia de instalação rápida                |
| `EXAMPLES.md`               | Exemplos práticos de uso da API          |
| `PROJECT_STRUCTURE.md`      | Estrutura detalhada do projeto           |
| `ROADMAP.md`                | Melhorias e funcionalidades futuras      |
| `setup.sh`                  | Script automático de deployment          |
| `docker-compose.yml`        | Orquestração de containers               |
| **Backend (19 ficheiros)**  | API completa com auth, CRUD, upload      |
| **Frontend (13 ficheiros)** | App Next.js com páginas públicas e admin |

**Total:** ~40 ficheiros criados ✅

## ✅ Pronto para Produção

- ✅ Docker multi-stage builds
- ✅ Variáveis de ambiente configuráveis
- ✅ Healthchecks
- ✅ Graceful shutdown
- ✅ Error handling robusto
- ✅ TypeScript strict mode
- ✅ Prisma migrations
- ✅ Seed automático

## 📚 Documentação

| Documento              | Link                                         |
| ---------------------- | -------------------------------------------- |
| Documentação Principal | [README.md](README.md)                       |
| Guia de Instalação     | [SETUP.md](SETUP.md)                         |
| Exemplos de API        | [EXAMPLES.md](EXAMPLES.md)                   |
| Estrutura do Projeto   | [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) |
| Roadmap                | [ROADMAP.md](ROADMAP.md)                     |

## 🛠️ Comandos Úteis

```bash
# Iniciar (Docker)
docker compose up -d --build

# Ver logs
docker compose logs -f

# Parar
docker compose down

# Parar e remover volumes
docker compose down -v

# Aceder ao Prisma Studio (dev)
cd backend && npm run prisma:studio
```

## 🎯 Funcionalidades Implementadas

### Público

- [x] Homepage com call-to-action
- [x] Listagem de carros com filtros
- [x] Pesquisa
- [x] Paginação
- [x] Detalhe do carro com galeria
- [x] Responsive design

### Admin

- [x] Login com JWT
- [x] Dashboard com lista de carros
- [x] Criar carro (multipart upload)
- [x] Editar carro
- [x] Adicionar mais imagens
- [x] Eliminar imagens individuais
- [x] Reordenar imagens
- [x] Eliminar carro
- [x] Publicar/despublicar

### Backend

- [x] API REST completa
- [x] Autenticação JWT
- [x] Upload em BASE64
- [x] CRUD completo
- [x] Filtros e paginação
- [x] Validação robusta
- [x] Error handling
- [x] Migrations automáticas
- [x] Seed automático

## ⚡ Performance

- **Imagens:** Servidas com cache headers (ETag, max-age)
- **Queries:** Otimizadas com Prisma
- **Frontend:** React Query para cache
- **Build:** Multi-stage Docker builds para menor tamanho

## 🔮 Próximos Passos

Ver [ROADMAP.md](ROADMAP.md) para lista completa de melhorias futuras:

- Rate limiting
- Redis cache
- Testes automatizados
- CI/CD pipeline
- Sistema de contacto
- SEO otimização
- Analytics
- E muito mais...

## 📞 Suporte

Para questões ou problemas:

1. Verificar [README.md](README.md) - Documentação completa
2. Verificar [EXAMPLES.md](EXAMPLES.md) - Exemplos práticos
3. Verificar logs: `docker compose logs -f`

---

## ✨ Projeto Concluído

**Status:** ✅ **COMPLETO E FUNCIONAL**

Todos os requisitos foram implementados:

- ✅ Backend completo
- ✅ Frontend completo
- ✅ Imagens em BASE64 na BD
- ✅ Docker setup
- ✅ Documentação completa
- ✅ Exemplos e guias
- ✅ Pronto para deployment

**Total de ficheiros criados:** ~40
**Linhas de código:** ~3000+
**Tempo estimado:** 8-12 horas de desenvolvimento manual

---

**Desenvolvido com ❤️ para AutoMecânica** 🚗

_Última atualização: 4 de Janeiro de 2026_
