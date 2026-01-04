# 🚀 Setup Rápido - AutoMecânica

## Opção 1: Docker (Recomendado)

```bash
# 1. Copiar variáveis de ambiente
cp .env.example .env

# 2. (Opcional) Editar .env com as suas credenciais
nano .env

# 3. Iniciar todos os serviços
docker compose up -d --build

# 4. Aguardar ~30 segundos para as migrações e seed

# 5. Aceder:
# Frontend: http://localhost:3000
# Backend: http://localhost:4000
# Admin: http://localhost:3000/admin/login
```

**Credenciais padrão:**

- Email: `admin@site.com`
- Password: `ChangeMe123!`

---

## Opção 2: Desenvolvimento Local

### Backend

```bash
cd backend

# 1. Instalar dependências
npm install

# 2. Copiar .env
cp .env.example .env

# 3. Iniciar PostgreSQL (Docker)
docker run -d --name postgres-dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mechanics \
  -p 5432:5432 \
  postgres:16-alpine

# 4. Gerar Prisma Client
npm run prisma:generate

# 5. Executar migrations
npm run prisma:migrate

# 6. Seed (criar super admin)
npm run prisma:seed

# 7. Iniciar servidor
npm run dev
```

Backend disponível em: `http://localhost:4000`

### Frontend

```bash
cd frontend

# 1. Instalar dependências
npm install

# 2. Copiar .env.local
cp .env.local.example .env.local

# 3. Iniciar servidor
npm run dev
```

Frontend disponível em: `http://localhost:3000`

---

## 🧪 Testar a API

```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@site.com","password":"ChangeMe123!"}' \
  -c cookies.txt

# Criar carro (precisa de imagens reais)
curl -X POST http://localhost:4000/api/admin/cars \
  -b cookies.txt \
  -F "title=BMW 320d" \
  -F "make=BMW" \
  -F "model=320d" \
  -F "year=2020" \
  -F "price=28500.00" \
  -F "mileage=45000" \
  -F "fuel=Diesel" \
  -F "transmission=Automática" \
  -F "description=Excelente estado" \
  -F "isPublished=true" \
  -F "images=@/caminho/para/imagem.jpg"

# Listar carros públicos
curl http://localhost:4000/api/cars
```

---

## 📱 URLs Úteis

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000
- **Admin Login:** http://localhost:3000/admin/login
- **API Health:** http://localhost:4000/health
- **Prisma Studio:** (apenas dev) `cd backend && npm run prisma:studio`

---

## 🛑 Parar Serviços

### Docker

```bash
docker compose down
```

### Local

```bash
# Backend: Ctrl+C no terminal
# Frontend: Ctrl+C no terminal
# PostgreSQL:
docker stop postgres-dev
```

---

## 🔄 Reset Completo (Dev)

```bash
# Docker
docker compose down -v
docker compose up -d --build

# Local
cd backend
npx prisma migrate reset
npm run prisma:seed
```

---

## ✅ Verificar Instalação

```bash
# Health check do backend
curl http://localhost:4000/health

# Verificar frontend
curl http://localhost:3000

# Testar autenticação
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@site.com","password":"ChangeMe123!"}'
```

Se todos retornarem resposta, está tudo OK! 🎉
