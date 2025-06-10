#!/bin/bash

# Script para testar eventos de torneio via redis-cli
# Execute com: ./test-tournament-events.sh

echo "🧪 Iniciando testes de eventos de torneio..."

# Função para gerar timestamp ISO válido
get_timestamp() {
    date -u +"%Y-%m-%dT%H:%M:%S.000Z"
}

# Função para gerar timestamp do passado
get_past_timestamp() {
    local minutes_ago=$1
    date -u -d "${minutes_ago} minutes ago" +"%Y-%m-%dT%H:%M:%S.000Z" 2>/dev/null || date -u -v-${minutes_ago}M +"%Y-%m-%dT%H:%M:%S.000Z"
}

# Função para executar comando redis-cli no container
redis_publish() {
    local channel="$1"
    local event_json="$2"
    echo "📡 Publicando evento no canal: $channel"
    echo "📄 Payload: $event_json"
    docker exec event-bus redis-cli PUBLISH "$channel" "$event_json"
    echo ""
}

echo "==========================================="
echo "🏆 TESTE 1: TOURNAMENT_CREATED"
echo "==========================================="

# Evento: Tournament Created - TODOS os campos obrigatórios preenchidos
TOURNAMENT_EVENT=$(cat <<EOF
{
  "event": "tournament.created",
  "version": "1.0",
  "timestamp": "$(get_timestamp)",
  "source": "test-script",
  "data": {
    "id": "T1",
    "isPrivate": false,
    "ownerId": "1",
    "password": null,
    "started": "$(get_timestamp)",
    "createdAt": "$(get_timestamp)",
    "players": ["1", "2", "3", "4"]
  }
}
EOF
)

redis_publish "tournament.created" "$TOURNAMENT_EVENT"

sleep 2

echo "==========================================="
echo "🎮 TESTE 2: MATCH_FINISHED (Torneio)"
echo "==========================================="

# Evento: Match Finished - TODOS os campos obrigatórios preenchidos
STARTED_TIME=$(get_past_timestamp 5)
ENDED_TIME=$(get_timestamp)

MATCH_EVENT_1=$(cat <<EOF
{
  "event": "match.finished",
  "version": "1.0",
  "timestamp": "$ENDED_TIME",
  "source": "test-script",
  "data": {
    "id": "match-test-$(date +%s)-001",
    "tournamentId": "T2",
    "player1Id": "1",
    "player2Id": "2",
    "winnerId": "2",
    "score": "10-7",
    "startedAt": "$STARTED_TIME",
    "endedAt": "$ENDED_TIME"
  }
}
EOF
)

redis_publish "match.finished" "$MATCH_EVENT_1"

sleep 2

echo "==========================================="
echo "🎮 TESTE 3: MATCH_FINISHED (1v1)"
echo "==========================================="

# Evento: Match Finished (1v1 - tournamentId null mas todos outros campos preenchidos)
STARTED_TIME_2=$(get_past_timestamp 3)
ENDED_TIME_2=$(get_timestamp)

MATCH_EVENT_2=$(cat <<EOF
{
  "event": "match.finished",
  "version": "1.0",
  "timestamp": "$ENDED_TIME_2",
  "source": "test-script",
  "data": {
    "id": "M1",
    "tournamentId": null,
    "player1Id": "1",
    "player2Id": "3",
    "winnerId": "1",
    "score": "10-8",
    "startedAt": "$STARTED_TIME_2",
    "endedAt": "$ENDED_TIME_2"
  }
}
EOF
)

redis_publish "match.finished" "$MATCH_EVENT_2"

sleep 2

echo "==========================================="
echo "🏆 TESTE 4: TOURNAMENT_CREATED (Privado)"
echo "==========================================="

# Evento: Tournament Created (privado com senha - TODOS os campos preenchidos)
TOURNAMENT_PRIVATE_EVENT=$(cat <<EOF
{
  "event": "tournament.created",
  "version": "1.0",
  "timestamp": "$(get_timestamp)",
  "source": "test-script",
  "data": {
    "id": "T3",
    "isPrivate": true,
    "ownerId": "2",
    "password": "senha123",
    "started": "$(get_timestamp)",
    "createdAt": "$(get_timestamp)",
    "players": ["2", "4"]
  }
}
EOF
)

redis_publish "tournament.created" "$TOURNAMENT_PRIVATE_EVENT"

sleep 2

echo "==========================================="
echo "🎮 TESTE 5: Múltiplas partidas completas"
echo "==========================================="

# Várias partidas para popular o histórico - TODOS os campos sempre preenchidos
for i in {3..6}; do
    PLAYER1="$((RANDOM % 4 + 1))"
    PLAYER2="$((RANDOM % 4 + 2))"
    WINNER=$([[ $((RANDOM % 2)) -eq 0 ]] && echo "$PLAYER1" || echo "$PLAYER2")
    SCORE1=$((RANDOM % 5 + 10))
    SCORE2=$((RANDOM % 8 + 5))
    TOURNAMENT_REF=$([[ $((RANDOM % 2)) -eq 0 ]] && echo '"tournament-test-001"' || echo 'null')
    
    # Gerar timestamps válidos
    MINUTES_AGO=$((RANDOM % 10 + 1))
    STARTED_TIME=$(get_past_timestamp $MINUTES_AGO)
    ENDED_TIME=$(get_timestamp)
    
    MATCH_EVENT=$(cat <<EOF
{
  "event": "match.finished",
  "version": "1.0",
  "timestamp": "$ENDED_TIME",
  "source": "test-script",
  "data": {
    "id": "M$i",
    "tournamentId": $TOURNAMENT_REF,
    "player1Id": "$PLAYER1",
    "player2Id": "$PLAYER2",
    "winnerId": "$WINNER",
    "score": "$SCORE1-$SCORE2",
    "startedAt": "$STARTED_TIME",
    "endedAt": "$ENDED_TIME"
  }
}
EOF
)

    echo "🎯 Gerando partida $i: $PLAYER1 vs $PLAYER2 (Vencedor: $WINNER) - Score: $SCORE1-$SCORE2"
    redis_publish "match.finished" "$MATCH_EVENT"
    sleep 1
done

echo "==========================================="
echo "🏆 TESTE 6: Torneio com quantidade mínima de players"
echo "==========================================="

# Teste com apenas 2 jogadores (MIN_PLAYERS)
TOURNAMENT_MIN_EVENT=$(cat <<EOF
{
  "event": "tournament.created",
  "version": "1.0",
  "timestamp": "$(get_timestamp)",
  "source": "test-script",
  "data": {
    "id": "T4",
    "isPrivate": false,
    "ownerId": "4",
    "password": null,
    "started": "$(get_timestamp)",
    "createdAt": "$(get_timestamp)",
    "players": ["4", "3"]
  }
}
EOF
)

redis_publish "tournament.created" "$TOURNAMENT_MIN_EVENT"

sleep 2

echo "==========================================="
echo "🎮 TESTE 7: Partidas adicionais para histórico completo"
echo "==========================================="

# Mais partidas com diferentes usuários para testar o histórico
USERS=("1" "2" "3" "4" "5" "6" "7" "8")

for i in {7..12}; do
    PLAYER1=${USERS[$((RANDOM % ${#USERS[@]}))]}
    PLAYER2=${USERS[$((RANDOM % ${#USERS[@]}))]}
    
    # Garantir que os jogadores sejam diferentes
    while [ "$PLAYER1" = "$PLAYER2" ]; do
        PLAYER2=${USERS[$((RANDOM % ${#USERS[@]}))]}
    done
    
    WINNER=$([[ $((RANDOM % 2)) -eq 0 ]] && echo "$PLAYER1" || echo "$PLAYER2")
    SCORE1=$((RANDOM % 8 + 10))
    SCORE2=$((RANDOM % 8 + 5))
    TOURNAMENT_REF=$([[ $((RANDOM % 3)) -eq 0 ]] && echo '"T'$((RANDOM % 3 + 1))'"' || echo 'null')
    
    # Gerar timestamps válidos e diferentes
    START_MINUTES_AGO=$((RANDOM % 60 + 10))
    END_MINUTES_AGO=$((RANDOM % 30 + 1))
    
    STARTED_TIME=$(get_past_timestamp $START_MINUTES_AGO)
    ENDED_TIME=$(get_past_timestamp $END_MINUTES_AGO)
    
    MATCH_EVENT=$(cat <<EOF
{
  "event": "match.finished",
  "version": "1.0",
  "timestamp": "$ENDED_TIME",
  "source": "test-script",
  "data": {
    "id": "M$i",
    "tournamentId": $TOURNAMENT_REF,
    "player1Id": "$PLAYER1",
    "player2Id": "$PLAYER2",
    "winnerId": "$WINNER",
    "score": "$SCORE1-$SCORE2",
    "startedAt": "$STARTED_TIME",
    "endedAt": "$ENDED_TIME"
  }
}
EOF
)

    echo "🎯 Partida adicional $i: $PLAYER1 vs $PLAYER2 (Vencedor: $WINNER) - Score: $SCORE1-$SCORE2"
    redis_publish "match.finished" "$MATCH_EVENT"
    sleep 0.5
done

echo "==========================================="
echo "✅ TESTES CONCLUÍDOS!"
echo "==========================================="
echo ""
echo "📊 Para verificar os resultados:"
echo "1. Verifique os logs do tournament-service:"
echo "   docker logs tournament-service"
echo ""
echo "2. Teste a API de histórico de partidas para diferentes usuários:"
echo "   curl http://localhost:443/tournament/matches/history/user-123"
echo "   curl http://localhost:443/tournament/matches/history/user-456"
echo "   curl http://localhost:443/tournament/matches/history/user-789"
echo ""
echo "3. Verifique o ranking atualizado:"
echo "   curl http://localhost:443/tournament/ranking/top"
echo ""
echo "4. Monitore eventos em tempo real:"
echo "   docker exec event-bus redis-cli MONITOR"
echo ""
echo "📈 Dados gerados:"
echo "   - 3 torneios criados (público, privado, mínimo)"
echo "   - ~12 partidas geradas"
echo "   - Histórico para múltiplos usuários"
echo "   - Rankings calculados automaticamente"