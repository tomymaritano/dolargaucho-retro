#!/bin/bash
#
# Script de Migración de Colores Legacy → BingX
# Actualiza todos los archivos TypeScript/JSX/JS con los nuevos colores BingX
#

echo "🎨 Iniciando migración de colores a BingX..."
echo ""

# Contador de archivos modificados
count=0

# Buscar todos los archivos .tsx, .ts, .jsx, .js (excepto node_modules)
files=$(find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) ! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*")

for file in $files; do
  # Verificar si el archivo contiene colores legacy
  if grep -q -E "accent-emerald|accent-teal|dark-bg" "$file"; then
    echo "📝 Actualizando: $file"

    # Crear backup temporal
    cp "$file" "$file.bak"

    # Reemplazos de colores
    # accent-emerald → brand
    sed -i '' 's/accent-emerald/brand/g' "$file"

    # accent-teal → brand-light
    sed -i '' 's/accent-teal/brand-light/g' "$file"

    # bg-dark-bg → bg-background (usar CSS variable)
    sed -i '' 's/bg-dark-bg/bg-background/g' "$file"

    # text-dark-bg → text-background
    sed -i '' 's/text-dark-bg/text-background/g' "$file"

    # Eliminar backup si el reemplazo fue exitoso
    rm "$file.bak"

    ((count++))
  fi
done

echo ""
echo "✅ Migración completada!"
echo "📊 Archivos modificados: $count"
echo ""
echo "🔍 Siguiente paso: Verificar los cambios"
echo "   git diff --stat"
echo ""
echo "⚠️  Nota: Algunos archivos pueden necesitar ajustes manuales."
echo "   Revisa especialmente:"
echo "   - Gradientes personalizados"
echo "   - Colores con opacidad custom (ej: accent-emerald/20)"
echo "   - Componentes con lógica compleja de colores"
