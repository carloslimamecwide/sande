# 📸 Imagens em BASE64 - Guia Técnico

Este documento explica como as imagens são guardadas em BASE64 na PostgreSQL.

## 🎯 Conceito

**Tradicional:** Upload → Disco → Path na BD → Servir ficheiro
**Neste projeto:** Upload → BASE64 → PostgreSQL → Servir de memória

## ✅ Vantagens

1. **Sem sistema de ficheiros** - Não precisa de volumes
2. **Backup simplificado** - Tudo numa BD
3. **Portabilidade** - Mover BD = mover tudo
4. **Atomicidade** - Transações incluem imagens
5. **Docker friendly** - Sem bind mounts

## ⚠️ Desvantagens

1. **Tamanho da BD** - Cresce mais rápido
2. **Performance** - Queries maiores
3. **Custo** - Mais espaço em BD (mais caro que disco)
4. **Limite prático** - Não ideal para muitas imagens grandes

## 📊 Quando Usar BASE64 na BD

### ✅ BOM para:

- Protótipos e MVPs
- Sistemas com poucas imagens
- Imagens pequenas/médias (< 2MB)
- Necessidade de atomicidade
- Simplificar deployment
- Apps containerizadas

### ❌ NÃO RECOMENDADO para:

- Milhares de imagens grandes
- Imagens > 5MB
- Apps com storage limitado
- Necessidade de CDN
- Performance crítica

## 🔧 Implementação Técnica

### 1. Upload (Backend)

```typescript
// Multer recebe o ficheiro em memória
const storage = multer.memoryStorage();

// Converter para base64
const base64 = file.buffer.toString("base64");

// Guardar na BD
await prisma.carImage.create({
  data: {
    carId: car.id,
    filename: file.originalname,
    mimeType: file.mimetype,
    base64: base64, // ← AQUI
    sortOrder: index,
  },
});
```

### 2. Servir Imagem (Backend)

```typescript
// Ler da BD
const image = await prisma.carImage.findUnique({
  where: { id: imageId },
  select: { base64: true, mimeType: true },
});

// Converter base64 → buffer
const buffer = Buffer.from(image.base64, "base64");

// Responder como imagem
res.setHeader("Content-Type", image.mimeType);
res.send(buffer);
```

### 3. Mostrar no Frontend

```tsx
// Simplesmente usar URL do endpoint
<img src={`${API_URL}/api/images/${imageId}`} />

// O browser faz request normal
// Backend converte base64 → imagem
```

## 📐 Tamanhos de Dados

### BASE64 vs Ficheiro

```
Ficheiro original: 1000 KB (1 MB)
BASE64 encoding:   1333 KB (33% maior)
PostgreSQL TEXT:   ~1333 KB + overhead

Conclusão: BASE64 ocupa ~33% mais espaço
```

### Exemplo Real

```
Imagem JPG:        500 KB
Em BASE64:         666 KB
10 imagens:        6.66 MB
100 carros:        66.6 MB
1000 carros:       666 MB
```

## 🎛️ Configuração PostgreSQL

### Schema

```prisma
model CarImage {
  id        String   @id @default(uuid())
  carId     String
  base64    String   @db.Text  // ← Tipo TEXT (não limitado)
  mimeType  String
  filename  String
  sortOrder Int
  createdAt DateTime @default(now())

  car Car @relation(fields: [carId], references: [id], onDelete: Cascade)
}
```

### Limites

- PostgreSQL TEXT: sem limite prático
- Recomendado: < 10MB por base64
- Nosso limite: 2MB por ficheiro

## 🚀 Otimizações Implementadas

### 1. Cache Headers

```typescript
// Backend responde com:
res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
res.setHeader("ETag", `"${imageId}"`);

// Browser faz cache agressivo
```

### 2. Não Incluir BASE64 em Listagens

```typescript
// ❌ MAU - Retorna base64
const cars = await prisma.car.findMany({
  include: { images: true },
});

// ✅ BOM - Apenas metadata
const cars = await prisma.car.findMany({
  include: {
    images: {
      select: {
        id: true,
        filename: true,
        mimeType: true,
        sortOrder: true,
        // base64: NÃO incluir!
      },
    },
  },
});
```

### 3. Endpoint Dedicado

```typescript
// Frontend usa endpoint separado
GET /api/images/:imageId

// Não mistura dados com imagens
// Permite cache independente
```

## 📊 Comparação com Alternativas

| Método               | Pros                          | Cons                               | Uso               |
| -------------------- | ----------------------------- | ---------------------------------- | ----------------- |
| **BASE64 na BD**     | Simples, atómico, sem volumes | Tamanho BD, performance            | MVP, protótipos   |
| **Ficheiros locais** | Rápido, barato                | Precisa volumes, backups complexos | Pequeno/médio     |
| **S3/Cloud Storage** | Escalável, CDN, barato        | Complexidade, dependência externa  | Produção, escala  |
| **URL externa**      | Simples                       | Sem controlo, pode desaparecer     | Links temporários |

## 🔄 Migração Futura

### De BASE64 para S3 (se necessário)

```typescript
// 1. Upload para S3
const s3Url = await uploadToS3(Buffer.from(base64, 'base64'));

// 2. Atualizar schema
model CarImage {
  id        String   @id
  carId     String
  s3Url     String?  // ← Novo campo
  base64    String?  // ← Tornar opcional
  // ...
}

// 3. Migração gradual
// Carregar de S3 se existir, senão de base64
```

## 💡 Boas Práticas

### ✅ Fazer

1. **Validar tamanho** antes de converter
2. **Limitar número** de imagens
3. **Comprimir** antes de guardar
4. **Usar cache** agressivo
5. **Não incluir** base64 em listagens
6. **Índices** na BD para queries rápidas

### ❌ Não Fazer

1. Guardar imagens > 5MB em base64
2. Retornar base64 em APIs de listagem
3. Fazer query de base64 sem necessidade
4. Esquecer de validar mimeType
5. Permitir tipos inseguros

## 🧪 Como Verificar

### 1. Ver Imagens na BD

```bash
docker compose exec db psql -U postgres -d mechanics

# Contar imagens
SELECT COUNT(*) FROM car_images;

# Ver tamanhos
SELECT
  id,
  filename,
  LENGTH(base64) as base64_bytes,
  pg_size_pretty(LENGTH(base64)::bigint) as size
FROM car_images;

# Ver total
SELECT
  COUNT(*) as total_images,
  pg_size_pretty(SUM(LENGTH(base64))::bigint) as total_size
FROM car_images;
```

### 2. Teste de Performance

```bash
# Tempo para listar carros (sem base64)
time curl http://localhost:4000/api/cars

# Tempo para obter uma imagem
time curl http://localhost:4000/api/images/[IMAGE_ID] -o /dev/null
```

### 3. Ver Tamanho da BD

```bash
docker compose exec db psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('mechanics'));"
```

## 📈 Escalabilidade

### Pequeno (< 100 carros)

- ✅ BASE64 na BD funciona perfeitamente
- Sem problemas de performance
- Simples de manter

### Médio (100-1000 carros)

- ⚠️ BASE64 ainda viável
- Considerar índices
- Monitorizar tamanho da BD

### Grande (> 1000 carros)

- ❌ Migrar para S3/Cloud Storage
- BASE64 não recomendado
- Custos de BD aumentam muito

## 🎓 Conclusão

Para este projeto (MVP de mecânica):

- ✅ **BASE64 é a escolha certa**
- ✅ Simplifica deployment
- ✅ Perfeito para < 500 carros
- ✅ Fácil migração futura se necessário

**Quando migrar:** Se BD > 10GB ou performance degradar.

---

## 📚 Referências

- [PostgreSQL BYTEA vs TEXT](https://www.postgresql.org/docs/current/datatype-binary.html)
- [BASE64 Encoding](https://en.wikipedia.org/wiki/Base64)
- [Multer Documentation](https://github.com/expressjs/multer)

---

**Implementado em:** backend/src/controllers/adminCarsController.ts
**Servido em:** backend/src/controllers/imageController.ts

Desenvolvido com ❤️ para AutoMecânica 🚗
