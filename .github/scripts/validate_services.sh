#!/bin/bash
set -e
set +x

echo "📝 Criando relatório de validação..."

docker run -d --name test_container --network internal_network busybox tail -f /dev/null > /dev/null 2>&1
docker network connect external_network test_container > /dev/null 2>&1

echo "| Serviço           | Porta | Status    | Dica                          |" > validation_report.md
echo "|:------------------|:------|:----------|:------------------------------|" >> validation_report.md

SERVICES=$(yq e '.services | keys | .[]' docker-compose.yml)

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

  echo "🔌 Testando conexão para $service:$EXPOSE_PORT"
  docker exec test_container sh -c "nc -z -w 5 $service $EXPOSE_PORT" > /dev/null 2>&1
  if [ $? -ne 0 ]; then
    echo "❌ Falha na conexão TCP para $service:$EXPOSE_PORT"
    echo "💡 Dica: verifique se o serviço $service está escutando corretamente."
    echo "| $(printf '%-18s' $service) | $EXPOSE_PORT | ❌ Falhou | Corrija o serviço       |" >> validation_report.md
    exit 1
  else
    echo "✅ Conexão OK para $service:$EXPOSE_PORT"
    echo "| $(printf '%-18s' $service) | $EXPOSE_PORT | ✅ OK     |                              |" >> validation_report.md
  fi
done
