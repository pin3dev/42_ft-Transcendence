#!/bin/bash

# Script simples para testes individuais de eventos
# Execute com: ./quick-test-events.sh [tipo]
# Tipos disponíveis: tournament, match, match1v1, all

EVENT_TYPE=${1:-"all"}

get_timestamp() {
    date -u +"%Y-%m-%dT%H:%M:%S.000Z"
}

get_past_timestamp() {
    local minutes_ago=$1
    date -u -d "${minutes_ago} minutes ago" +"%Y-%m-%dT%H:%M:%S.000Z" 2>/dev/null || date -u -v-${minutes_ago}M +"%Y-%m-%dT%H:%M:%S.000Z"
}

redis_publish() {
    local channel="$1"
    local event_json="$2"
    echo "📡 Enviando: $channel"
    docker exec event-bus redis-cli PUBLISH "$channel" "$event_json"
}

case $EVENT_TYPE in
    "tournament")
        echo "🏆 Criando torneio de teste..."
        TOURNAMENT_EVENT="{\"event\":\"tournament.created\",\"version\":\"1.0\",\"timestamp\":\"$(get_timestamp)\",\"source\":\"quick-test\",\"data\":{\"id\":\"quick-tournament-$(date +%s)\",\"isPrivate\":false,\"ownerId\":\"user-test\",\"password\":null,\"started\":\"$(get_timestamp)\",\"createdAt\":\"$(get_timestamp)\",\"players\":[\"user-test\",\"user-opponent\",\"user-extra1\",\"user-extra2\"]}}"
        redis_publish "tournament.created" "$TOURNAMENT_EVENT"
        ;;
    
    "match")
        echo "🎮 Criando partida de torneio..."
        STARTED_TIME=$(get_past_timestamp 2)
        ENDED_TIME=$(get_timestamp)
        MATCH_EVENT="{\"event\":\"match.finished\",\"version\":\"1.0\",\"timestamp\":\"$ENDED_TIME\",\"source\":\"quick-test\",\"data\":{\"id\":\"quick-match-$(date +%s)\",\"tournamentId\":\"tournament-123\",\"player1Id\":\"user-test\",\"player2Id\":\"user-opponent\",\"winnerId\":\"user-test\",\"score\":\"10-5\",\"startedAt\":\"$STARTED_TIME\",\"endedAt\":\"$ENDED_TIME\"}}"
        redis_publish "match.finished" "$MATCH_EVENT"
        ;;
    
    "match1v1")
        echo "🎯 Criando partida 1v1..."
        STARTED_TIME=$(get_past_timestamp 3)
        ENDED_TIME=$(get_timestamp)
        MATCH_EVENT="{\"event\":\"match.finished\",\"version\":\"1.0\",\"timestamp\":\"$ENDED_TIME\",\"source\":\"quick-test\",\"data\":{\"id\":\"quick-1v1-$(date +%s)\",\"tournamentId\":null,\"player1Id\":\"user-test\",\"player2Id\":\"user-opponent\",\"winnerId\":\"user-opponent\",\"score\":\"8-10\",\"startedAt\":\"$STARTED_TIME\",\"endedAt\":\"$ENDED_TIME\"}}"
        redis_publish "match.finished" "$MATCH_EVENT"
        ;;
    
    "tournament-private")
        echo "🔒 Criando torneio privado..."
        TOURNAMENT_PRIVATE="{\"event\":\"tournament.created\",\"version\":\"1.0\",\"timestamp\":\"$(get_timestamp)\",\"source\":\"quick-test\",\"data\":{\"id\":\"quick-private-$(date +%s)\",\"isPrivate\":true,\"ownerId\":\"user-test\",\"password\":\"secret123\",\"started\":\"$(get_timestamp)\",\"createdAt\":\"$(get_timestamp)\",\"players\":[\"user-test\",\"user-friend\"]}}"
        redis_publish "tournament.created" "$TOURNAMENT_PRIVATE"
        ;;
    
    "batch")
        echo "🚀 Criando lote de partidas..."
        for i in {1..5}; do
            PLAYER1="test-user-$i"
            PLAYER2="opponent-$i"
            WINNER=$([[ $((RANDOM % 2)) -eq 0 ]] && echo "$PLAYER1" || echo "$PLAYER2")
            SCORE1=$((RANDOM % 5 + 10))
            SCORE2=$((RANDOM % 5 + 5))
            
            # Gerar timestamps válidos
            START_MINUTES=$((i * 2))
            END_MINUTES=$i
            STARTED_TIME=$(get_past_timestamp $START_MINUTES)
            ENDED_TIME=$(get_past_timestamp $END_MINUTES)
            
            MATCH_BATCH="{\"event\":\"match.finished\",\"version\":\"1.0\",\"timestamp\":\"$ENDED_TIME\",\"source\":\"quick-test\",\"data\":{\"id\":\"batch-match-$i-$(date +%s)\",\"tournamentId\":null,\"player1Id\":\"$PLAYER1\",\"player2Id\":\"$PLAYER2\",\"winnerId\":\"$WINNER\",\"score\":\"$SCORE1-$SCORE2\",\"startedAt\":\"$STARTED_TIME\",\"endedAt\":\"$ENDED_TIME\"}}"
            
            echo "  🎯 Partida $i: $PLAYER1 vs $PLAYER2 (Vencedor: $WINNER)"
            redis_publish "match.finished" "$MATCH_BATCH"
            sleep 0.5
        done
        ;;
    
    "all"|*)
        echo "🚀 Executando todos os testes..."
        $0 tournament
        sleep 1
        $0 tournament-private
        sleep 1
        $0 match
        sleep 1
        $0 match1v1
        sleep 1
        $0 batch
        ;;
esac

echo "✅ Teste concluído! Verifique os logs: docker logs tournament-service"
echo "🔍 Para testar APIs:"
echo "   curl http://localhost:443/tournament/matches/history/user-test"
echo "   curl http://localhost:443/tournament/ranking/top"