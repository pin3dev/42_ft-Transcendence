# ============================ TARGETS DE FLUXO PADRÃO ============================

all: keys static-frontend build run

keys:
	[ -s .env ] || ./env_generator.sh

static-frontend:
	sudo docker compose -f docker-compose.yml --profile builder up --build frontend-builder
	sudo docker compose -f docker-compose.yml --profile builder down

build: static-frontend
	sudo docker compose -f docker-compose.yml build

run: build
	sudo docker compose -f docker-compose.yml up -d


# ============================ EXECUÇÃO INTERATIVA ============================

exec:
	$(eval service=$(filter-out $@,$(MAKECMDGOALS)))
	sudo docker compose -f docker-compose.yml exec $(service) bash

status:
	$(eval service=$(filter-out $@,$(MAKECMDGOALS)))
	sudo docker compose -f docker-compose.yml logs $(service)

# ============================ STOP E LIMPEZA ============================

stop:
	sudo docker compose -f docker-compose.yml down

iclean: stop
	sudo docker compose -f docker-compose.yml down --rmi all

vclean_all: iclean
	sudo docker compose -f docker-compose.yml down --rmi all -v

vclean: iclean
	sudo docker image rmi transcendence-api-gateway || true
	sudo docker image rmi transcendence-tournament-service || true
	sudo docker image rmi transcendence-auth-service || true
	sudo docker image rmi transcendence-user-mgmt || true
	sudo docker image rmi transcendence-game-server || true
	sudo docker image rmi transcendence-frontend-builder || true
	sudo docker image rmi transcendence-event-bus || true

fclean: vclean
	sudo docker system prune -af

destroy: vclean_all
	sudo docker system prune -af

# ============================ INSPEÇÃO DO DOCKER ============================

dls:
	sudo docker ps -a

vls:
	sudo docker volume ls

ils:
	sudo docker image ls

nls:
	sudo docker networks ls

# ============================ FULL REBUILD ============================

re: fclean all

.SILENT:
