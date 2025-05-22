# 📬 Event Bus

O `event-bus` é um serviço interno que atua como barramento de eventos para os microsserviços da aplicação. Ele permite a comunicação assíncrona entre serviços através de mensagens publicadas e escutadas via Redis (pub/sub).

> ℹ️ Este serviço **não possui rotas HTTP públicas** e **não deve ser acessado diretamente**. Sua função é exclusivamente facilitar a comunicação entre os microsserviços de forma desacoplada.

---

## 🔧 Como funciona

- Os microsserviços (como `auth-service`, `user-management`) **publicam eventos** no Redis utilizando a função `publishEvent` (por exemplo, `user.registered`, `user.deleted`, etc.).
- O `event-bus` **ouve canais de eventos** relevantes através da função `subscribeToEvent` e os **redistribui** aos serviços interessados.
- Ele atua como um **roteador de mensagens internas**, garantindo que eventos sejam propagados corretamente entre os serviços.

---

## 📡 Comunicação entre microsserviços

Exemplos de eventos tratados:

| Evento | Emissor | Destinatário(s) | Descrição |
|:--:|:--:|:--:|:--:|
| `user.registered` | auth-service | user-mgmt | Após novo registro, sinaliza criação de perfil |
| `user.deleted` | user-mgmt  | auth-service  | Remoção de dados do usuário |

---

## 🔁 Funções Disponíveis

### 1. **Publicar Eventos**

A função `publishEvent` é usada para publicar eventos em um canal específico no Redis.

```javascript
const { publishEvent } = require("./pckg/redis/modules.js");

publishEvent("user.registered", {
  user_id: 123,
  email: "usuario@email.com"
}, "auth-service");
```

### 2. **Assinar Eventos**

A função `subscribeToEvent` é usada para escutar eventos de um canal específico no Redis.

```javascript
const { subscribeToEvent } = require("./pckg/redis/modules.js");

subscribeToEvent("user.registered", (event) => {
  console.log("Evento recebido:", event);
});
```

### 3. **Gerenciar Cache**

O `event-bus` também fornece funções para gerenciar cache no Redis:

- **`setCache`**: Define um valor no cache com ou sem TTL.
  ```javascript
  const { setCache } = require("./pckg/redis/modules.js");

  setCache("user:123", { name: "John Doe" }, 3600); // TTL de 1 hora
  ```

- **`getCache`**: Recupera um valor do cache.
  ```javascript
  const { getCache } = require("./pckg/redis/modules.js");

  const user = await getCache("user:123");
  console.log(user);
  ```

- **`deleteCache`**: Remove um valor do cache.
  ```javascript
  const { deleteCache } = require("./pckg/redis/modules.js");

  deleteCache("user:123");
  ```

---

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

## 📁 Estrutura do Projeto

```bash
packages/
├── redis/
│    ├── cache/            # Funções de cache no Redis
│    │    ├── cache.js            # Exporta funções de cache
│    │    ├── setCache.js         # Define valores no cache
│    │    ├── getCache.js         # Recupera valores do cache
│    │    └── deleteCache.js      # Remove valores do cache
│    ├── events/           # Funções de eventos no Redis
│    │    ├── events.js           # Exporta funções de eventos
│    │    ├── publishEvent.js     # Publica eventos
│    │    ├── subscribeToEvent.js # Assina eventos
│    │    └── eventsHelper.js     # Helper para eventos
│    └── modules.js        # Exporta todos os módulos
└── ...
```

---

## 🗂️ Configuração de Volumes no Docker Compose

O cache e os eventos do Redis são gerenciados por meio de um volume compartilhado configurado no `docker-compose.yml`:

### Cache
O volume `event-data` é usado para armazenar os dados do cache do Redis:

```yaml
volumes:
  event-data:
    name: event-data
```

Este volume é montado no container do `event-bus` para garantir que os dados do cache sejam persistidos:

```yaml
services:
  event-bus:
    build:
      context: ./event-bus
    container_name: event-bus
    networks:
      - internal_network
    expose:
      - "6379"
    volumes:
      - event-data:/data
```

### Eventos
Os eventos publicados e assinados não são armazenados diretamente no Redis. Em vez disso, as funções padrão para eventos e cache são compartilhadas entre os serviços por meio do volume:

```yaml
volumes:
  - ./pckg/redis:/app/pckg/redis:ro
```

Isso permite que todos os serviços (`api-gateway`, `auth-service`, `user-mgmt`) utilizem as mesmas funções para publicar e assinar eventos, garantindo consistência e reutilização de código.

> **Nota:** Certifique-se de que o volume `event-data` e o volume compartilhado `./pckg/redis` estejam configurados corretamente para evitar problemas de sincronização.
