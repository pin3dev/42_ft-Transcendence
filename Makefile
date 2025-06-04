all: keys build run

build:
	docker compose -f docker-compose.yml build

run: build
	docker compose -f docker-compose.yml up -d

exec:
	$(eval service=$(filter-out $@,$(MAKECMDGOALS)))
	docker compose -f docker-compose.yml exec $(service) bash

keys: 
	./gen-env.sh

status:
	$(eval service=$(filter-out $@,$(MAKECMDGOALS)))
	docker compose -f docker-compose.yml logs $(service)

stop:
	docker compose -f docker-compose.yml down

iclean: stop
	docker compose -f docker-compose.yml down --rmi all

vclean: iclean
	docker compose -f docker-compose.yml down --rmi all -v

fclean: vclean
	docker system prune -af

dls:
	docker ps -a

vls:
	docker volume ls

ils:
	docker image ls

nls:
	docker networks ls

re: fclean all

.SILENT:
