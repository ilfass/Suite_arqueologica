#!/bin/bash

# Script de migración usando curl
# Ejecuta SQL directamente en Supabase

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
SUPABASE_URL=${SUPABASE_URL:-"https://avpaiyyjixtdopbciedr.supabase.co"}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY:-"tu-anon-key-aqui"}

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}🔧 Script de Migración con cURL${NC}"
    echo ""
    echo "Uso:"
    echo "  ./scripts/migrate-with-curl.sh [opción]"
    echo ""
    echo "Opciones:"
    echo "  --help, -h     Mostrar esta ayuda"
    echo "  --dry-run      Mostrar SQL sin ejecutar"
    echo ""
    echo "Variables de entorno:"
    echo "  SUPABASE_URL        URL de tu proyecto Supabase"
    echo "  SUPABASE_ANON_KEY   Anon key de Supabase"
    echo ""
    echo "Ejemplo:"
    echo "  SUPABASE_ANON_KEY=tu-key ./scripts/migrate-with-curl.sh"
    echo ""
}

# Función para ejecutar SQL
execute_sql() {
    local sql="$1"
    local migration_name="$2"
    
    echo -e "${BLUE}📝 Ejecutando: ${migration_name}${NC}"
    
    # Crear archivo temporal con el SQL
    local temp_file=$(mktemp)
    echo "$sql" > "$temp_file"
    
    # Ejecutar con curl
    local response=$(curl -s -w "%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        -H "apikey: $SUPABASE_ANON_KEY" \
        -d "{\"sql\": $(cat "$temp_file" | jq -Rs .)}" \
        "$SUPABASE_URL/rest/v1/rpc/exec_sql")
    
    # Separar status code del response
    local status_code="${response: -3}"
    local response_body="${response%???}"
    
    # Limpiar archivo temporal
    rm "$temp_file"
    
    if [ "$status_code" = "200" ]; then
        echo -e "${GREEN}✅ Éxito: ${migration_name}${NC}"
        return 0
    else
        echo -e "${RED}❌ Error: ${migration_name}${NC}"
        echo -e "${RED}   Status: $status_code${NC}"
        echo -e "${RED}   Response: $response_body${NC}"
        return 1
    fi
}

# Función para mostrar SQL sin ejecutar
dry_run() {
    echo -e "${YELLOW}🔍 Modo dry-run: Mostrando SQL que se ejecutaría${NC}"
    echo ""
    
    local migrations_dir="database/migrations"
    
    if [ ! -d "$migrations_dir" ]; then
        echo -e "${RED}❌ Directorio de migraciones no encontrado: $migrations_dir${NC}"
        return 1
    fi
    
    for file in "$migrations_dir"/*.sql; do
        if [ -f "$file" ]; then
            echo -e "${BLUE}📄 $(basename "$file")${NC}"
            echo "---"
            cat "$file"
            echo ""
            echo "---"
            echo ""
        fi
    done
}

# Función principal
main() {
    echo -e "${BLUE}🚀 Iniciando migraciones de base de datos...${NC}"
    echo ""
    
    # Verificar configuración
    if [ "$SUPABASE_ANON_KEY" = "tu-anon-key-aqui" ]; then
        echo -e "${RED}❌ Error: Debes configurar SUPABASE_ANON_KEY${NC}"
        echo "   Ejemplo: SUPABASE_ANON_KEY=tu-key ./scripts/migrate-with-curl.sh"
        exit 1
    fi
    
    # Verificar que curl esté disponible
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}❌ Error: curl no está instalado${NC}"
        exit 1
    fi
    
    # Verificar que jq esté disponible
    if ! command -v jq &> /dev/null; then
        echo -e "${YELLOW}⚠️  Advertencia: jq no está instalado, instalando...${NC}"
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y jq
        elif command -v yum &> /dev/null; then
            sudo yum install -y jq
        else
            echo -e "${RED}❌ Error: No se pudo instalar jq automáticamente${NC}"
            echo "   Instala jq manualmente: https://stedolan.github.io/jq/download/"
            exit 1
        fi
    fi
    
    local migrations_dir="database/migrations"
    
    if [ ! -d "$migrations_dir" ]; then
        echo -e "${RED}❌ Directorio de migraciones no encontrado: $migrations_dir${NC}"
        echo "   Creando directorio..."
        mkdir -p "$migrations_dir"
        echo -e "${GREEN}✅ Directorio creado${NC}"
        echo "   Crea archivos .sql en $migrations_dir/"
        exit 1
    fi
    
    # Contar archivos de migración
    local migration_count=$(find "$migrations_dir" -name "*.sql" | wc -l)
    
    if [ "$migration_count" -eq 0 ]; then
        echo -e "${RED}❌ No se encontraron archivos de migración${NC}"
        echo "   Crea archivos .sql en $migrations_dir/"
        exit 1
    fi
    
    echo -e "${BLUE}📋 Encontradas $migration_count migraciones:${NC}"
    echo ""
    
    local success_count=0
    local error_count=0
    
    # Ejecutar cada migración
    for file in "$migrations_dir"/*.sql; do
        if [ -f "$file" ]; then
            local migration_name=$(basename "$file")
            local sql_content=$(cat "$file")
            
            if execute_sql "$sql_content" "$migration_name"; then
                ((success_count++))
            else
                ((error_count++))
            fi
            
            echo ""
        fi
    done
    
    # Resumen
    echo -e "${BLUE}📊 Resumen de migraciones:${NC}"
    echo -e "${GREEN}   ✅ Exitosas: $success_count${NC}"
    echo -e "${RED}   ❌ Errores: $error_count${NC}"
    echo -e "${BLUE}   📝 Total: $migration_count${NC}"
    
    if [ "$success_count" -gt 0 ]; then
        echo ""
        echo -e "${GREEN}🎉 ¡Migraciones completadas exitosamente!${NC}"
    else
        echo ""
        echo -e "${YELLOW}⚠️  No se pudieron aplicar las migraciones${NC}"
    fi
}

# Manejo de argumentos
case "${1:-}" in
    --help|-h)
        show_help
        ;;
    --dry-run)
        dry_run
        ;;
    "")
        main
        ;;
    *)
        echo -e "${RED}❌ Opción desconocida: $1${NC}"
        show_help
        exit 1
        ;;
esac 