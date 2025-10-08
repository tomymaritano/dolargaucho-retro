#!/bin/bash

# Script para testear todos los endpoints de la API
# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Auditando Endpoints de API..."
echo "================================="
echo ""

# Función para testear endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}

    echo -n "Testing $name... "
    response=$(curl -sL -o /dev/null -w "%{http_code}" "$url")

    if [ "$response" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $response, expected $expected_status)"
        return 1
    fi
}

# DolarAPI Endpoints
echo "📊 DolarAPI Endpoints"
echo "---------------------"
test_endpoint "Dólares" "https://dolarapi.com/v1/dolares"
test_endpoint "Dólar Oficial" "https://dolarapi.com/v1/dolares/oficial"
test_endpoint "Dólar Blue" "https://dolarapi.com/v1/dolares/blue"
test_endpoint "Cotizaciones" "https://dolarapi.com/v1/cotizaciones"
echo ""

# ArgentinaData API - Política
echo "🏛️  ArgentinaData - Política"
echo "----------------------------"
test_endpoint "Senadores" "https://api.argentinadatos.com/v1/senado/senadores"
test_endpoint "Diputados" "https://api.argentinadatos.com/v1/diputados/diputados"
echo ""

# ArgentinaData API - Finanzas - Índices
echo "📈 ArgentinaData - Índices"
echo "--------------------------"
test_endpoint "Inflación" "https://api.argentinadatos.com/v1/finanzas/indices/inflacion"
test_endpoint "Inflación Interanual" "https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual"
test_endpoint "Índice UVA" "https://api.argentinadatos.com/v1/finanzas/indices/uva"
test_endpoint "Riesgo País" "https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais"
echo ""

# ArgentinaData API - Finanzas - Tasas
echo "💰 ArgentinaData - Tasas"
echo "------------------------"
test_endpoint "Tasa Plazo Fijo" "https://api.argentinadatos.com/v1/finanzas/tasas/plazoFijo"
test_endpoint "Tasa Depósitos 30 días" "https://api.argentinadatos.com/v1/finanzas/tasas/depositos30Dias"
echo ""

# ArgentinaData API - Finanzas - FCI
echo "💼 ArgentinaData - FCI"
echo "----------------------"
test_endpoint "FCI Mercado Dinero" "https://api.argentinadatos.com/v1/finanzas/fci/mercadoDinero/ultimo"
test_endpoint "FCI Renta Variable" "https://api.argentinadatos.com/v1/finanzas/fci/rentaVariable/ultimo"
test_endpoint "FCI Renta Fija" "https://api.argentinadatos.com/v1/finanzas/fci/rentaFija/ultimo"
test_endpoint "FCI Renta Mixta" "https://api.argentinadatos.com/v1/finanzas/fci/rentaMixta/ultimo"
test_endpoint "FCI Otros" "https://api.argentinadatos.com/v1/finanzas/fci/otros/ultimo"
echo ""

# ArgentinaData API - Eventos
echo "📅 ArgentinaData - Eventos"
echo "--------------------------"
test_endpoint "Feriados" "https://api.argentinadatos.com/v1/feriados"
echo ""

echo "================================="
echo "✅ Auditoría de endpoints completada"
