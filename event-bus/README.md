# 📬 Event Bus

O `event-bus` é um serviço interno que atua como barramento de eventos para os microsserviços da aplicação. Ele permite a comunicação assíncrona entre serviços através de mensagens publicadas e escutadas via Redis (pub/sub).

> ℹ️ Este serviço **não possui rotas HTTP públicas** e **não deve ser acessado diretamente**. Sua função é exclusivamente facilitar a comunicação entre os microsserviços de forma desacoplada.

---

## 🔧 Como funciona

- Os microsserviços (como `auth-service`, `user-management`) **publicam eventos** no Redis (por exemplo, `user.registered`, `auth.success`, etc.).
- O `event-bus` **ouve todos os canais de eventos** relevantes e os **redistribui** aos serviços interessados.
- Ele atua como um **roteador de mensagens internas**, garantindo que eventos sejam propagados corretamente entre os serviços.

---

## 🧱 Tecnologias Utilizadas

- **Node.js**
- **Redis** (pub/sub)
- **Docker** (via Docker Compose)

---

## 📡 Comunicação entre microsserviços

Exemplos de eventos tratados:

| Evento | Emissor | Destinatário(s) | Descrição |
|:--:|:--:|:--:|:--:|
| `user.registered` | auth-service | user-management | Após novo registro, sinaliza criação de perfil |
| `user.updated` | user-management  | auth-service (opcional)  | Atualização de dados do usuário |

---

<!--
## ⚙️ Configuração

O serviço utiliza variáveis de ambiente para se conectar ao Redis:

```env
REDIS_HOST=redis
REDIS_PORT=6379
-->

## 🧪 Comandos para Teste

### Acessar CLI do Redis no container

```bash
docker exec -it event-bus redis-cli
```

### Monitorar todos os eventos em tempo real

```bash
> MONITOR
```

### Escutar manualmente um canal específico

```bash
> SUBSCRIBE user.registered
```

### Testar evento após `/auth/register`

1. Inicie o monitor:

```bash
docker exec -it event-bus redis-cli
> MONITOR
```

2. No Postman (ou cliente HTTP), faça um `POST /auth/register`.

3. Saída esperada no terminal:

```
1745978101.556454 [0 172.18.0.3:43398] "publish" "user.registered" "{\"event\":\"user.registered\",\"version\":\"1.0\",\"timestamp\":\"2025-04-30T01:55:01.555Z\",\"source\":\"auth-service\",\"data\":{\"userId\":X,\"email\":\"seuEmail@aqui.com\"}}"
```

---

## 🔁 Implementação do Redis em Serviços Internos

Para integrar serviços com o `event-bus` (publicar/assinar eventos):

### 1. Montar bind volume no `docker-compose.yml`

```yaml
volumes:
  - ./packages/event-bus:/app/packages/event-bus:ro
```

### 2. Importar os utilitários do `event-bus`

```js  
const { EventTypes, buildEvent, publishEvent, subscribeToEvent } = require("../../../packages/event-bus/src/index.js");
```  

### 3. Publicar e Assinar eventos

```js  
publishEvent(EventTypes.TYPE, {
    userId: user.id,
    email: user.email
  }, "issue-service");

subscribeToEvent(EventTypes.TYPE, (event) => {
  //...
});
```

---

## 📁 Estrutura do Projeto

```bash
packages/
├── event-bus/
│   ├── publisher.js        # Publica eventos no Redis
│   ├── subscriber.js       # Escuta eventos via Redis
│   ├── eventBuilder.js     # Cria estrutura padronizada de eventos
│   ├── eventTypes.js       # Define os tipos/canais de eventos disponíveis
│   └── index.js            # Exporta os módulos principais para uso externo
└── ...
```

---

> \[!NOTE]
> O `event-bus` deve estar sempre em execução no ambiente para garantir a propagação correta de eventos. Ele é a espinha dorsal da comunicação assíncrona entre os serviços.
