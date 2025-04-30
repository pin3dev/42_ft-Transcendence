# Comandos para teste

- Entrar no container:  
```bash
docker exec -it event-bus redis-cli
```  
- Monitorar eventos:  
```bash
> MONITOR
```  
- Rodar um subscriber manual:  
```bash
> SUBSCRIBE user-registered
```  

- Ver evento gerado pelo path /auth/register
```bash
docker exec -it event-bus redis-cli
> MONITOR
# OK
# vá em Postman e registre um novo usuário normalmente
# saída esperada:
# 1745978101.556454 [0 172.18.0.3:43398] "publish" "user.registered" "{\"event\":\"user.registered\",\"version\":\"1.0\",\"timestamp\":\"2025-04-30T01:55:01.555Z\",\"source\":\"auth-service\",\"data\":{\"userId\":X,\"email\":\"seuEmail@aqui.com\"}}"
```  

## Implementação do Redis em Serviços internos

1. Deve implementar o bind-mount no compose  
```YAML  
    volumes:
      - ./packages/event-bus:/app/packages/event-bus:ro 
```  
2. Importar Módulos exportados no packages do event-bus  
```js  
const { EventTypes, buildEvent, publishEvent, subscribeToEvent } = require("../../../packages/event-bus/src/index.js");
```  

3. Usa os módulos para publicar ou consumir do eventos do Redir  
```js  
publishEvent(EventTypes.TYPE, {
    userId: user.id,
    email: user.email
  }, "issue-service");

subscribeToEvent(EventTypes.TYPE, (event) => {
  //...
});
```  