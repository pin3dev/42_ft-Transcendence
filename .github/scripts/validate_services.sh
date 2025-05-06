# #!/bin/bash
# set -e
# set +x

# echo "📝 Criando relatório de validação..."

# docker run -d --name test_container --network internal_network busybox tail -f /dev/null > /dev/null 2>&1
# docker network connect external_network test_container > /dev/null 2>&1

# echo "| Serviço           | Porta | Status    | Dica                          |" > validation_report.md
# echo "|:------------------|:------|:----------|:------------------------------|" >> validation_report.md

# SERVICES=$(yq e '.services | keys | .[]' docker-compose.yml)

# for service in $SERVICES; do
#   echo "🔎 Verificando serviço: $service"

#   EXPOSE_PORT=$(yq e ".services.\"$service\".expose[0]" docker-compose.yml)

#   if [ "$EXPOSE_PORT" == "null" ] || [ -z "$EXPOSE_PORT" ]; then
#     EXPOSE_PORT=$(yq e ".services.\"$service\".ports[0]" docker-compose.yml | cut -d':' -f2)
#   fi

#   if [ "$EXPOSE_PORT" == "null" ] || [ -z "$EXPOSE_PORT" ]; then
#     echo "❌ Serviço $service não declarou 'expose' nem 'ports'."
#     echo "💡 Dica: adicione expose: [\"PORTA\"] no docker-compose.yml"
#     echo "| $(printf '%-18s' $service) |   -   | ❌ Falhou | Adicione expose/ports    |" >> validation_report.md
#     exit 1
#   fi

#   echo "🔌 Testando conexão para $service:$EXPOSE_PORT"
#    docker exec test_container sh -c "nc -z -w 5 $service $EXPOSE_PORT" > /dev/null 2>&1
#    if [ $? -ne 0 ]; then
#      echo "❌ Falha na conexão TCP para $service:$EXPOSE_PORT"
#      echo "💡 Dica: verifique se o serviço $service está escutando corretamente."
#      echo "| $(printf '%-18s' $service) | $EXPOSE_PORT | ❌ Falhou | Corrija o serviço       |" >> validation_report.md
#      exit 1
#    else
#      echo "✅ Conexão OK para $service:$EXPOSE_PORT"
#      echo "| $(printf '%-18s' $service) | $EXPOSE_PORT | ✅ OK     |                              |" >> validation_report.md
#    fi
#  done
  

#!/bin/bash
set -e

echo "📝 Criando relatório de validação..."

# Inicia um container auxiliar na rede para testar conexões TCP
docker run -d --name test_container --network internal_network busybox tail -f /dev/null > /dev/null
docker network connect external_network test_container > /dev/null

echo "| Serviço           | Porta | Status    | Dica                          |" > validation_report.md
echo "|:------------------|:------|:----------|:------------------------------|" >> validation_report.md

SERVICES=$(yq e '.services | keys | .[]' docker-compose.yml)

MAX_RETRIES=10
WAIT_SECONDS=3
HAS_ERROR=0

for service in $SERVICES; do
  echo "🔎 Verificando serviço: $service"

  # Tenta extrair a porta exposta
  EXPOSE_PORT=$(yq e ".services.\"$service\".expose[0]" docker-compose.yml)
  if [ "$EXPOSE_PORT" == "null" ] || [ -z "$EXPOSE_PORT" ]; then
    PORT_RAW=$(yq e ".services.\"$service\".ports[0]" docker-compose.yml)
    EXPOSE_PORT=$(echo "$PORT_RAW" | awk -F ':' '{print $NF}')
  fi

  if [ "$EXPOSE_PORT" == "null" ] || [ -z "$EXPOSE_PORT" ]; then
    echo "❌ Serviço $service não declarou 'expose' nem 'ports'."
    echo "💡 Dica: adicione expose: [\"PORTA\"] no docker-compose.yml"
    echo "| $(printf '%-18s' $service) |   -   | ❌ Falhou | Adicione expose/ports    |" >> validation_report.md
    HAS_ERROR=1
    continue
  fi

  echo "⏱️ Aguardando $service:$EXPOSE_PORT estar disponível..."

  for attempt in $(seq 1 $MAX_RETRIES); do
    if docker exec test_container sh -c "nc -z -w 2 $service $EXPOSE_PORT" > /dev/null 2>&1; then
      echo "✅ Conexão OK para $service:$EXPOSE_PORT"
      echo "| $(printf '%-18s' $service) | $EXPOSE_PORT | ✅ OK     |                              |" >> validation_report.md
      break
    fi

    if [ "$attempt" -eq "$MAX_RETRIES" ]; then
      echo "❌ Falha na conexão TCP para $service:$EXPOSE_PORT"
      echo "💡 Dica: verifique se o serviço está escutando corretamente."
      echo "| $(printf '%-18s' $service) | $EXPOSE_PORT | ❌ Falhou | Serviço não responde         |" >> validation_report.md
      HAS_ERROR=1
    else
      echo "🔁 Tentativa $attempt falhou. Repetindo em $WAIT_SECONDS segundos..."
      sleep $WAIT_SECONDS
    fi
  done
done

# Finaliza
exit $HAS_ERROR
