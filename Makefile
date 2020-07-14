AUTH=docker-compose -f docker-compose.yml
ARGS=auth

stop:
	docker container stop $$(docker container ls -q)

stop-auth:
	$(AUTH) stop $$ARGS

remove-containers: stop-auth
	$(AUTH) rm -f $$ARGS

build:
	$(AUTH) build $(ARGS)

up:
	$(AUTH) up -d $$ARGS

restart:
	$(AUTH) restart $(ARGS)

watch:
	$(AUTH) logs -f --tail=100 $(ARGS)

bash:
	$(AUTH) exec $(ARGS) sh

container-ip:
	docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $$($(AUTH) ps -q $$ARGS)
