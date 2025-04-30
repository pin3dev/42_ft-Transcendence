#!/bin/bash
set -e

echo "📝 Criando relatório de validação..."

# 🧪 Container de teste com imagem que já possui curl
docker run -d --name test_container --network internal_network curlimages/curl sleep infinity > /dev/null 2>&1
docker network connect external_network test_container > /dev/null 2>&1

# Cabeçalho do relatório
echo "| Serviço           | Porta | Status    | Dica                          |" > validation_report.md
echo "|:------------------|:------|:----------|:------------------------------|" >> validation_report.md

# Lista os serviços do docker-compose.yml
SERVICES=$(yq e '.services | keys | .[]' docker-compose.yml)

for service in $SERVICES; do
  echo "🔎 Verificando serviço: $service"

  # Tenta capturar a porta pelo expose
  EXPOSE_PORT=$(yq e ".services.\"$service\".expose[0]" docker-compose.yml)

  # Se não tiver expose, tenta ports
  if [ "$EXPOSE_PORT" == "null" ] || [ -z "$EXPOSE_PORT" ]; then
    EXPOSE_PORT=$(yq e ".services.\"$service\".ports[0]" docker-compose.yml | cut -d':' -f2)
  fi

  if [ "$EXPOSE_PORT" == "null" ] || [ -z "$EXPOSE_PORT" ]; then
    echo "❌ Serviço $service não declarou expose nem ports."
    echo "| $(printf '%-18s' $service) |   -   | ❌ Falhou | Adicione expose/ports    |" >> validation_report.md
    exit 1
  fi

  echo "🔍 DEBUG: Nome do serviço: '$service'"
  echo "🔍 DEBUG: Porta detectada: '$EXPOSE_PORT'"

  if [ "$service" == "api-gateway" ]; then
    echo "🌐 Testando /health do API Gateway via HTTP..."

    http_code=$(docker exec test_container curl -s -o /dev/null -w "%{http_code}" http://api-gateway:$EXPOSE_PORT/health)

    if [ "$http_code" -ne 200 ]; then
      echo "❌ /health retornou HTTP $http_code"
      echo "| api-gateway       | $EXPOSE_PORT | ❌ Falhou | /health não retornou 200 OK     |" >> validation_report.md
      exit 1
    else
      echo "✅ /health respondeu com 200 OK"
      echo "| api-gateway       | $EXPOSE_PORT | ✅ OK     | /health funcionando corretamente |" >> validation_report.md
    fi

    continue
  fi

  echo "🔌 Testando conexão TCP para $service:$EXPOSE_PORT"
  docker exec test_container sh -c "nc -z -w 5 $service $EXPOSE_PORT" > /dev/null 2>&1
  if [ $? -ne 0 ]; then
    echo "❌ Falha na conexão TCP para $service:$EXPOSE_PORT"
    echo "| $(printf '%-18s' $service) | $EXPOSE_PORT | ❌ Falhou | Corrija o serviço       |" >> validation_report.md
    exit 1
  else
    echo "✅ Conexão TCP OK para $service:$EXPOSE_PORT"
    echo "| $(printf '%-18s' $service) | $EXPOSE_PORT | ✅ OK     |                              |" >> validation_report.md
  fi
done

