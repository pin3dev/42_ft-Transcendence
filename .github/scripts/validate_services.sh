#!/bin/bash
set -e
set +x

echo "📝 Criando relatório de validação..."

# Cria container de teste conectado às redes internas e externas
docker run -d --name test_container --network internal_network busybox tail -f /dev/null > /dev/null 2>&1
docker network connect external_network test_container > /dev/null 2>&1

# Cabeçalho do relatório
echo "| Serviço           | Porta | Status    | Dica                          |" > validation_report.md
echo "|:------------------|:------|:----------|:------------------------------|" >> validation_report.md

# Coleta os nomes dos serviços no docker-compose
SERVICES=$(yq e '.services | keys | .[]' docker-compose.yml)

# Loop de verificação de cada serviço
for service in $SERVICES; do
  echo "🔎 Verificando serviço: $service"

  EXPOSE_PORT=$(yq e ".services.\"$service\".expose[0]" docker-compose.yml)

  if [ "$EXPOSE_PORT" == "null" ] || [ -z "$EXPOSE_PORT" ]; then
    EXPOSE_PORT=$(yq e ".services.\"$service\".ports[0]" docker-compose.yml | cut -d':' -f2)
  fi

  if [ "$EXPOSE_PORT" == "null" ] || [ -z "$EXPOSE_PORT" ]; then
    echo "❌ Serviço $service não declarou 'expose' nem 'ports'."
    echo "💡 Dica: adicione expose: [\"PORTA\"] no docker-compose.yml"
    echo "| $(printf '%-18s' $service) |   -   | ❌ Falhou | Adicione expose/ports    |" >> validation_report.md
    exit 1
  fi

  # ✅ Verificação especial para o API Gateway via HTTP (não TCP)
  echo "🔍 DEBUG: Nome do serviço: '$service'"
  echo "🔍 DEBUG: Porta detectada: '$EXPOSE_PORT'"
  
  if [ "$service" == "api-gateway" ]; then
    echo "🌐 Testando /health do API Gateway via HTTP..."
    docker exec test_container sh -c "
      apk add --no-cache curl > /dev/null &&
      curl -sf http://api-gateway:3000/health
    "
    if [ $? -ne 0 ]; then
      echo "❌ Falha ao acessar /health no api-gateway"
      echo "| api-gateway       | $EXPOSE_PORT | ❌ Falhou | Verifique se a rota /health existe |" >> validation_report.md
      exit 1
    else
      echo "✅ Rota /health acessível!"
      echo "| api-gateway       | $EXPOSE_PORT | ✅ OK     | /health funcionando                |" >> validation_report.md
    fi

  else
    echo "🔌 Testando conexão TCP para $service:$EXPOSE_PORT"
    docker exec test_container sh -c "nc -z -w 5 $service $EXPOSE_PORT" > /dev/null 2>&1
    if [ $? -ne 0 ]; then
      echo "❌ Falha na conexão TCP para $service:$EXPOSE_PORT"
      echo "💡 Dica: verifique se o serviço $service está escutando corretamente."
      echo "| $(printf '%-18s' $service) | $EXPOSE_PORT | ❌ Falhou | Corrija o serviço       |" >> validation_report.md
      exit 1
    else
      echo "✅ Conexão TCP OK para $service:$EXPOSE_PORT"
      echo "| $(printf '%-18s' $service) | $EXPOSE_PORT | ✅ OK     |                              |" >> validation_report.md
    fi
  fi
done
