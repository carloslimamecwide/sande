# 🚀 Deploy em Produção - VPS com Docker

Este guia descreve como fazer deploy da aplicação num VPS usando Docker Compose com Caddy como reverse proxy externo.

## 📋 Pré-requisitos no VPS

- Docker e Docker Compose instalados
- Caddy a correr num container global
- Rede Docker `web` criada: `docker network create web`
- Acesso SSH ao servidor

## 🔧 Configuração Inicial

### 1. Clonar o repositório

```bash
git clone <repo-url> /opt/sande
cd /opt/sande
```

### 2. Criar ficheiro .env

```bash
cp .env.example .env
nano .env
```

Editar as variáveis:

```bash
POSTGRES_PASSWORD=senha_forte_aqui_min_16_chars
JWT_SECRET=chave_jwt_super_secreta_min_32_chars
CORS_ORIGIN=*
SUPER_ADMIN_EMAIL=admin@seudominio.com
SUPER_ADMIN_PASSWORD=SuaSenhaForte123!
```

### 3. Criar rede Docker (se não existir)

```bash
docker network create web
```

## 🐳 Deploy com Docker Compose

### Build e iniciar containers

```bash
docker compose up -d --build
```

Este comando irá:

- ✅ Construir as imagens do frontend e backend
- ✅ Criar o container PostgreSQL com volume persistente
- ✅ Executar migrations do Prisma automaticamente
- ✅ Iniciar todos os serviços

### Verificar status dos containers

```bash
docker compose ps
```

Deve mostrar:

- `sande-db` - running (healthy)
- `sande-backend` - running (healthy)
- `sande-frontend` - running (healthy)

### Ver logs

```bash
# Todos os serviços
docker compose logs -f

# Apenas backend
docker compose logs -f sande-backend

# Apenas frontend
docker compose logs -f sande-frontend

# Últimas 50 linhas
docker compose logs --tail=50 sande-backend
```

## 🔄 Atualizações e Manutenção

### Fazer pull das alterações

```bash
cd /opt/sande
git pull
docker compose up -d --build
```

### Executar migrations manualmente (se necessário)

```bash
docker compose exec sande-backend npx prisma migrate deploy
```

### Reiniciar serviços

```bash
# Reiniciar tudo
docker compose restart

# Reiniciar apenas um serviço
docker compose restart sande-backend
```

### Parar containers

```bash
docker compose down
```

### Parar e remover volumes (⚠️ APAGA DADOS!)

```bash
docker compose down -v
```

## 🌐 Configuração do Caddy (Proxy Reverso)

O Caddy deve estar configurado para encaminhar requests.

**⚠️ IMPORTANTE**: A ordem das directivas é crucial! O `handle_path /api/*` deve vir ANTES do `reverse_proxy` genérico.

**Caddyfile para produção sem domínio (apenas IP):**

```caddyfile
:80 {
    # Backend API (PRIMEIRO para não ser capturado pelo frontend)
    handle_path /api/* {
        reverse_proxy sande-backend:4000
    }

    # Frontend (captura tudo o resto)
    reverse_proxy sande-frontend:3000
}
```

**Caddyfile com domínio e SSL automático:**

```caddyfile
seudominio.com {
    # Backend API (PRIMEIRO)
    handle_path /api/* {
        reverse_proxy sande-backend:4000
    }

    # Frontend (tudo o resto)
    reverse_proxy sande-frontend:3000
}
```

Recarregar Caddy após alterações:

```bash
docker exec -w /etc/caddy caddy caddy reload
```

## ✅ Testar a Aplicação

### 1. Verificar health checks

```bash
# Backend (via IP do VPS)
curl http://SEU_IP/api/health
# Deve retornar: {"ok":true,"status":"ok","timestamp":"..."}

# Ou via domínio público (se configurado)
curl https://seudominio.com/api/health
```

### 2. Testar endpoints

```bash
# Listar carros
curl http://SEU_IP/api/cars

# Login admin
curl -X POST http://SEU_IP/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@seudominio.com","password":"SuaSenhaForte123!"}'
```

### 3. Aceder à aplicação

**Sem domínio (via IP):**

- **Frontend**: http://SEU_IP
- **Admin**: http://SEU_IP/admin/login
- **API Health**: http://SEU_IP/api/health

**Com domínio configurado:**

- **Frontend**: https://seudominio.com
- **Admin**: https://seudominio.com/admin/login
- **API Health**: https://seudominio.com/api/health

## 🗄️ Backup da Base de Dados

### Criar backup

```bash
docker compose exec sande-db pg_dump -U appuser appdb > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restaurar backup

```bash
cat backup_20260104_120000.sql | docker compose exec -T sande-db psql -U appuser appdb
```

## 🔒 Segurança

### Variáveis sensíveis

✅ **Nunca** commitar o ficheiro `.env` ao git
✅ Usar senhas fortes (min 16 caracteres)
✅ Trocar `SUPER_ADMIN_PASSWORD` após primeiro login
✅ JWT_SECRET deve ter pelo menos 32 caracteres aleatórios

### Gerar senhas seguras

```bash
# Linux/macOS
openssl rand -base64 32

# Ou
head -c 32 /dev/urandom | base64
```

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker compose logs sande-backend

# Verificar se a rede existe
docker network ls | grep web

# Recrear container
docker compose up -d --force-recreate sande-backend
```

### Erro de conexão à DB

```bash
# Verificar se DB está healthy
docker compose ps sande-db

# Testar conexão manualmente
docker compose exec sande-backend sh -c 'npx prisma db pull'
```

### Migrations não aplicadas

```bash
# Executar migrations manualmente
docker compose exec sande-backend npx prisma migrate deploy

# Ver status das migrations
docker compose exec sande-backend npx prisma migrate status
```

### Reset completo (⚠️ APAGA TUDO!)

```bash
docker compose down -v
docker compose up -d --build
```

## 📊 Monitorização

### Ver uso de recursos

```bash
docker stats sande-frontend sande-backend sande-db
```

### Espaço em disco

```bash
# Ver tamanho dos volumes
docker system df -v

# Limpar containers/imagens não usadas
docker system prune -a
```

## 🔗 Arquitetura da Rede

```
Internet
   ↓
Caddy (rede: web)
   ├── / → sande-frontend:3000 (rede: web)
   └── /api/* → sande-backend:4000 (redes: web, internal)
                      ↓
                 sande-db:5432 (rede: internal)
```

- **Rede `web`**: Permite Caddy comunicar com frontend e backend
- **Rede `internal`**: Isola a DB (apenas backend acede)
- **Sem portas expostas**: Segurança adicional

## 📝 Checklist de Deploy

- [ ] Rede `web` criada
- [ ] Ficheiro `.env` configurado com senhas fortes
- [ ] `docker compose up -d --build` executado
- [ ] Todos containers `healthy`
- [ ] Caddy configurado e recarregado
- [ ] `/api/health` responde com `{"ok":true}`
- [ ] Login admin funciona
- [ ] Backup automático configurado (opcional)

---

**Suporte**: Ver [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) para mais detalhes
