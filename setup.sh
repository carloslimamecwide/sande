#!/bin/bash

echo "🚀 AutoMecânica - Setup Script"
echo "================================"
echo ""

# Verificar se docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Por favor instale o Docker primeiro."
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado."
    exit 1
fi

echo "✅ Docker encontrado"
echo ""

# Criar .env se não existir
if [ ! -f .env ]; then
    echo "📝 A criar ficheiro .env..."
    cp .env.example .env
    echo "✅ Ficheiro .env criado"
else
    echo "ℹ️  Ficheiro .env já existe"
fi

echo ""
echo "🐳 A iniciar serviços com Docker Compose..."
echo "   Isto pode demorar alguns minutos na primeira vez..."
echo ""

docker compose up -d --build

echo ""
echo "⏳ A aguardar que os serviços fiquem prontos..."
sleep 10

# Verificar se backend está ready
echo "🔍 A verificar backend..."
for i in {1..30}; do
    if curl -s http://localhost:4000/health > /dev/null 2>&1; then
        echo "✅ Backend está online!"
        break
    fi
    echo "   Tentativa $i/30..."
    sleep 2
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Setup concluído com sucesso!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 URLs:"
echo "   Frontend:    http://localhost:3000"
echo "   Backend API: http://localhost:4000"
echo "   Admin:       http://localhost:3000/admin/login"
echo ""
echo "🔐 Credenciais padrão:"
echo "   Email:    admin@site.com"
echo "   Password: ChangeMe123!"
echo ""
echo "📚 Documentação:"
echo "   README.md  - Documentação completa"
echo "   SETUP.md   - Guia de instalação"
echo "   EXAMPLES.md - Exemplos de API"
echo ""
echo "🛑 Para parar os serviços:"
echo "   docker compose down"
echo ""
echo "📊 Ver logs:"
echo "   docker compose logs -f"
echo ""
