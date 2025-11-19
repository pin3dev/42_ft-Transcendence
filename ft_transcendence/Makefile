# ============================ TARGETS DE FLUXO PADRÃO ============================

all: keys static-frontend build run

keys:
	[ -s .env ] || ./env_generator.sh

static-frontend:
	docker compose -f docker-compose.yml --profile builder up --build frontend-builder
	docker compose -f docker-compose.yml --profile builder down

build: static-frontend
	docker compose -f docker-compose.yml build

run: build
	docker compose -f docker-compose.yml up -d


# ============================ EXECUÇÃO INTERATIVA ============================

exec:
	$(eval service=$(filter-out $@,$(MAKECMDGOALS)))
	docker compose -f docker-compose.yml exec $(service) sh

status:
	$(eval service=$(filter-out $@,$(MAKECMDGOALS)))
	docker compose -f docker-compose.yml logs $(service)

# ============================ STOP E LIMPEZA ============================

stop:
	docker compose -f docker-compose.yml down

iclean: stop
	docker compose -f docker-compose.yml down --rmi all

vclean: iclean
	docker compose -f docker-compose.yml down --rmi all -v

fclean: vclean
	docker system prune -af

# ============================ INSPEÇÃO DO DOCKER ============================

dls:
	docker ps -a

vls:
	docker volume ls

ils:
	docker image ls

nls:
	docker networks ls

# ============================ INSPEÇÃO DA NETWORK ============================

ip:
	@echo "🔍 Reading LOCAL_IP_BASE64 from .env..."
	@LOCAL_IP_BASE64=$$(grep '^LOCAL_IP_BASE64=' .env | cut -d '=' -f2); \
	DECODED_IP=$$(echo $$LOCAL_IP_BASE64 | base64 --decode); \
	echo "🌐 LOCAL_IP = $$DECODED_IP"

# ============================ MONITORING ============================

moni-up:
	docker compose -f monitoring/docker-compose.monitoring.yml up -d

moni-build:
	docker compose -f monitoring/docker-compose.monitoring.yml build

moni-stop:
	docker compose -f monitoring/docker-compose.monitoring.yml down

moni-clean:
	docker compose -f monitoring/docker-compose.monitoring.yml down --rmi all -v

# ============================ FULL REBUILD ============================

re: fclean all

.SILENT:
