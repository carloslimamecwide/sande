# 🔧 Troubleshooting Guide

Guia de resolução de problemas comuns.

## 🐳 Problemas com Docker

### Container não inicia

```bash
# Ver logs do container
docker compose logs backend
docker compose logs frontend
docker compose logs db

# Verificar status
docker compose ps

# Restart de um serviço específico
docker compose restart backend
```

### Base de dados não conecta

**Sintoma:** Backend mostra erro de conexão à BD

**Solução:**

```bash
# 1. Verificar se PostgreSQL está a correr
docker compose ps

# 2. Aguardar healthcheck (pode demorar 10-20s)
docker compose logs db

# 3. Verificar DATABASE_URL no .env
cat .env | grep DATABASE_URL

# 4. Restart do backend
docker compose restart backend
```

### Migrations não executam

```bash
# Entrar no container do backend
docker compose exec backend sh

# Executar migrations manualmente
npx prisma migrate deploy

# Executar seed
npx prisma db seed

# Sair
exit
```

### Porta já em uso

**Sintoma:** "Port 3000/4000/5432 already in use"

**Solução:**

```bash
# Encontrar processo usando a porta
lsof -i :3000  # ou 4000, 5432

# Matar processo
kill -9 [PID]

# Ou alterar porta no docker-compose.yml
ports:
  - "3001:3000"  # Mapear para porta diferente
```

### Container fica em loop de restart

```bash
# Ver logs detalhados
docker compose logs -f backend

# Verificar healthcheck
docker inspect mechanics_backend | grep Health -A 20

# Desativar temporariamente o healthcheck
# (remover healthcheck do docker-compose.yml)
```

## 🔐 Problemas de Autenticação

### Login não funciona

**Verificar:**

1. Super admin foi criado?

```bash
docker compose logs backend | grep "Super admin"
```

2. Credenciais corretas?

```
Email: admin@site.com
Password: ChangeMe123!
```

3. CORS configurado?

```bash
# Verificar .env
cat .env | grep CORS_ORIGIN
# Deve ser: http://localhost:3000
```

### Cookie não é guardado

**Problema:** Frontend não recebe/envia cookie JWT

**Solução:**

```javascript
// Verificar que fetch/axios usa credentials
fetch(url, {
  credentials: "include", // ← IMPORTANTE
});

// Axios
axios.create({
  withCredentials: true, // ← IMPORTANTE
});
```

### 401 Unauthorized

**Causas comuns:**

1. Cookie expirou (7 dias)
2. JWT_SECRET diferente entre requests
3. Cookie não está a ser enviado

**Debug:**

```bash
# Ver cookies no browser (DevTools → Application → Cookies)

# Teste manual
curl http://localhost:4000/api/auth/me \
  -b cookies.txt
```

## 📸 Problemas com Imagens

### Imagens não aparecem

**Verificar:**

1. NEXT_PUBLIC_API_URL correto?

```bash
# Frontend .env.local
echo $NEXT_PUBLIC_API_URL
# Deve ser: http://localhost:4000
```

2. Imagens foram guardadas?

```bash
# Verificar na BD
docker compose exec db psql -U postgres -d mechanics
SELECT COUNT(*) FROM car_images;
\q
```

3. Endpoint responde?

```bash
curl http://localhost:4000/api/images/[IMAGE_ID]
```

### Upload falha

**Erro:** "File too large" ou "Type not allowed"

**Limites:**

- Máx: 2MB por imagem
- Tipos: JPG, PNG, WEBP
- Máx: 10 imagens por carro

**Verificar:**

```bash
# Ver erro exato nos logs
docker compose logs -f backend

# Testar com imagem pequena
curl -X POST http://localhost:4000/api/admin/cars \
  -b cookies.txt \
  -F "images=@small-test.jpg" \
  # ... outros campos
```

### Base64 muito grande

**Problema:** Response muito grande com base64

**Nota:** Os endpoints públicos NÃO retornam base64, apenas IDs!

```javascript
// ✅ Correto - Listagem retorna apenas IDs
{
  images: [{ id: "uuid", filename: "car.jpg", mimeType: "image/jpeg" }];
}

// ✅ Usar endpoint dedicado
<img src={`${API_URL}/api/images/${image.id}`} />;
```

## 🌐 Problemas de Rede

### CORS Error

**Sintoma:** "CORS policy blocked"

**Solução:**

```bash
# 1. Verificar CORS_ORIGIN no backend .env
cat backend/.env | grep CORS_ORIGIN
# Deve corresponder ao URL do frontend

# 2. Reiniciar backend
docker compose restart backend

# 3. Limpar cache do browser (Ctrl+Shift+R)
```

### Cannot reach backend

**Verificar:**

```bash
# 1. Backend está a correr?
curl http://localhost:4000/health

# 2. Verificar logs
docker compose logs backend

# 3. Verificar portas
docker compose ps
```

## 💾 Problemas com Base de Dados

### Migrations falharam

```bash
# Reset completo (DEV ONLY - perde dados!)
docker compose down -v
docker compose up -d --build

# Ou manual:
docker compose exec backend npx prisma migrate reset
```

### Dados inconsistentes

```bash
# Aceder ao Prisma Studio
cd backend
npm run prisma:studio
# Abrir http://localhost:5555

# Ou PostgreSQL direto
docker compose exec db psql -U postgres -d mechanics
SELECT * FROM cars;
\q
```

### BD cheia / performance

```bash
# Ver tamanho
docker compose exec db psql -U postgres -d mechanics \
  -c "SELECT pg_size_pretty(pg_database_size('mechanics'));"

# Analisar tabelas grandes
docker compose exec db psql -U postgres -d mechanics \
  -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC LIMIT 10;"
```

## 🏗️ Problemas de Build

### Backend não compila

```bash
# Ver erro completo
cd backend
npm run build

# Verificar TypeScript
npx tsc --noEmit

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Frontend não compila

```bash
cd frontend
npm run build

# Verificar erros TypeScript
npx tsc --noEmit

# Limpar cache Next.js
rm -rf .next
npm run build
```

### Docker build falha

```bash
# Build com output detalhado
docker compose build --progress=plain backend

# Build sem cache
docker compose build --no-cache backend

# Verificar Dockerfile
cat backend/Dockerfile
```

## 🔍 Debug Geral

### Ver todos os logs

```bash
docker compose logs -f
```

### Ver logs de serviço específico

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### Entrar no container

```bash
# Backend
docker compose exec backend sh

# Frontend
docker compose exec frontend sh

# PostgreSQL
docker compose exec db psql -U postgres -d mechanics
```

### Verificar variáveis de ambiente

```bash
# Backend
docker compose exec backend env | grep -E "DATABASE_URL|JWT_SECRET|CORS"

# Frontend
docker compose exec frontend env | grep NEXT_PUBLIC
```

### Reset completo

```bash
# ⚠️ ATENÇÃO: Isto remove TUDO (incluindo dados)
docker compose down -v
rm -rf backend/node_modules frontend/node_modules
docker compose up -d --build
```

## 📊 Verificar Health

```bash
# Health check backend
curl http://localhost:4000/health

# Verificar se PostgreSQL está a aceitar conexões
docker compose exec db pg_isready -U postgres

# Verificar containers
docker compose ps

# Verificar uso de recursos
docker stats
```

## 🆘 Ainda com Problemas?

1. **Verificar documentação:**

   - [README.md](README.md) - Info geral
   - [SETUP.md](SETUP.md) - Instalação
   - [EXAMPLES.md](EXAMPLES.md) - Exemplos

2. **Logs detalhados:**

   ```bash
   docker compose logs -f > debug.log
   ```

3. **Reset e tentar novamente:**

   ```bash
   docker compose down -v
   ./setup.sh
   ```

4. **Verificar requisitos:**
   - Docker e Docker Compose instalados e atualizados
   - Portas 3000, 4000, 5432 disponíveis
   - Espaço em disco suficiente

## 📝 Reportar Problemas

Ao reportar problemas, incluir:

- Sistema operativo
- Versões (Docker, Node.js)
- Logs relevantes
- Passos para reproduzir
- Comportamento esperado vs atual

---

**Dica:** 90% dos problemas resolvem-se com `docker compose down -v && docker compose up -d --build` 😊
