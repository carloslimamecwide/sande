# 📋 Exemplos de Uso da API

Este ficheiro contém exemplos práticos de como usar a API do AutoMecânica.

## 🔐 Autenticação

### Login e obter cookie JWT

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@site.com",
    "password": "ChangeMe123!"
  }' \
  -c cookies.txt \
  -v
```

### Verificar utilizador autenticado

```bash
curl http://localhost:4000/api/auth/me \
  -b cookies.txt
```

### Logout

```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -b cookies.txt
```

## 🚗 Gestão de Carros (Admin)

### Criar carro com 3 imagens

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
  -F "description=Excelente estado. Revisões em dia. Sempre em garagem. Pack M Sport completo." \
  -F "isPublished=true" \
  -F "images=@./car1.jpg" \
  -F "images=@./car2.jpg" \
  -F "images=@./car3.jpg"
```

### Listar todos os carros (admin)

```bash
curl http://localhost:4000/api/admin/cars \
  -b cookies.txt
```

### Atualizar carro (adicionar mais imagens)

```bash
curl -X PUT http://localhost:4000/api/admin/cars/[CAR_ID] \
  -b cookies.txt \
  -F "price=27500.00" \
  -F "description=Preço reduzido! Excelente oportunidade." \
  -F "images=@./car4.jpg" \
  -F "images=@./car5.jpg"
```

### Eliminar uma imagem específica

```bash
curl -X DELETE http://localhost:4000/api/admin/cars/[CAR_ID]/images/[IMAGE_ID] \
  -b cookies.txt
```

### Reordenar imagens

```bash
curl -X PATCH http://localhost:4000/api/admin/cars/[CAR_ID]/images/reorder \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "imageIds": [
      "image-id-3",
      "image-id-1",
      "image-id-2"
    ]
  }'
```

### Eliminar carro

```bash
curl -X DELETE http://localhost:4000/api/admin/cars/[CAR_ID] \
  -b cookies.txt
```

## 🌐 API Pública

### Listar carros com paginação

```bash
curl "http://localhost:4000/api/cars?page=1&pageSize=12"
```

### Pesquisar carros

```bash
curl "http://localhost:4000/api/cars?search=bmw"
```

### Filtrar por marca e ano

```bash
curl "http://localhost:4000/api/cars?make=BMW&year=2020"
```

### Filtrar por preço

```bash
curl "http://localhost:4000/api/cars?minPrice=15000&maxPrice=30000"
```

### Filtros combinados

```bash
curl "http://localhost:4000/api/cars?search=diesel&minPrice=20000&maxPrice=40000&fuel=Diesel&page=1&pageSize=12"
```

### Obter detalhe de um carro

```bash
curl http://localhost:4000/api/cars/[CAR_ID]
```

### Obter uma imagem (guardar em ficheiro)

```bash
curl http://localhost:4000/api/images/[IMAGE_ID] \
  --output car-photo.jpg
```

## 📝 Exemplos com JavaScript/Fetch

### Login no Frontend

```javascript
const response = await fetch("http://localhost:4000/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Importante para cookies
  body: JSON.stringify({
    email: "admin@site.com",
    password: "ChangeMe123!",
  }),
});

const data = await response.json();
console.log("User:", data.user);
```

### Criar carro com FormData

```javascript
const formData = new FormData();
formData.append("title", "BMW 320d Pack M");
formData.append("make", "BMW");
formData.append("model", "320d");
formData.append("year", "2020");
formData.append("price", "28500.00");
formData.append("mileage", "45000");
formData.append("fuel", "Diesel");
formData.append("transmission", "Automática");
formData.append("description", "Excelente estado");
formData.append("isPublished", "true");

// Adicionar imagens
const fileInput = document.querySelector('input[type="file"]');
for (const file of fileInput.files) {
  formData.append("images", file);
}

const response = await fetch("http://localhost:4000/api/admin/cars", {
  method: "POST",
  credentials: "include",
  body: formData,
});

const car = await response.json();
console.log("Carro criado:", car);
```

### Listar carros

```javascript
const response = await fetch("http://localhost:4000/api/cars?page=1&pageSize=12");
const data = await response.json();

console.log("Carros:", data.cars);
console.log("Total:", data.pagination.total);
```

## 🧪 Testar Upload com Postman

1. **Login:**

   - Method: POST
   - URL: `http://localhost:4000/api/auth/login`
   - Body → raw → JSON:
     ```json
     {
       "email": "admin@site.com",
       "password": "ChangeMe123!"
     }
     ```

2. **Criar Carro:**
   - Method: POST
   - URL: `http://localhost:4000/api/admin/cars`
   - Body → form-data:
     - title: "BMW 320d Pack M"
     - make: "BMW"
     - model: "320d"
     - year: "2020"
     - price: "28500.00"
     - mileage: "45000"
     - fuel: "Diesel"
     - transmission: "Automática"
     - description: "Excelente estado"
     - isPublished: "true"
     - images: [selecionar ficheiro] (repetir para múltiplas imagens)

## 📊 Resposta Típica da API

### GET /api/cars

```json
{
  "cars": [
    {
      "id": "uuid-here",
      "title": "BMW 320d Pack M",
      "make": "BMW",
      "model": "320d",
      "year": 2020,
      "price": "28500.00",
      "mileage": 45000,
      "fuel": "Diesel",
      "transmission": "Automática",
      "description": "Excelente estado...",
      "isPublished": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "images": [
        {
          "id": "image-uuid-1",
          "filename": "car1.jpg",
          "mimeType": "image/jpeg",
          "sortOrder": 0
        },
        {
          "id": "image-uuid-2",
          "filename": "car2.jpg",
          "mimeType": "image/jpeg",
          "sortOrder": 1
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 12,
    "total": 25,
    "totalPages": 3
  }
}
```

## 🎯 Notas Importantes

1. **Cookies:** Use `-b cookies.txt` (curl) ou `credentials: 'include'` (fetch)
2. **Multipart:** Para upload de ficheiros, use `Content-Type: multipart/form-data`
3. **Imagens:** O endpoint `/api/images/:id` retorna o buffer da imagem directamente
4. **Base64:** As imagens são guardadas em base64 na BD, mas o endpoint serve como imagem normal
5. **Cache:** O endpoint de imagens usa cache headers para melhor performance

## 🔍 Validações

- Email: formato válido
- Password: mínimo 8 caracteres (no seed)
- Year: 4 dígitos (YYYY)
- Price: formato decimal (ex: 15000.00)
- Mileage: apenas números
- Images: máx 10 ficheiros, 2MB cada
- Tipos aceites: JPG, PNG, WEBP
