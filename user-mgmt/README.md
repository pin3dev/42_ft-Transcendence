# 👤 User Management Service

O `user-mgmt` é responsável pela gestão de perfis de usuários e amizades no sistema. Ele realiza operações de leitura, atualização e remoção de perfis, além de gerenciar relações de amizade entre usuários.

> ℹ️ Este serviço **não é acessado diretamente pelo frontend**. Todas as requisições externas devem ser feitas por meio do [`api-gateway`](../api-gateway), que atua como ponto único de entrada do sistema.

---

## 📦 Funcionalidades

- Consulta do perfil autenticado
- Atualização de dados de perfil (nome, avatar, etc.)
- Exclusão de conta
- Busca de perfis por nome
- Gerenciamento de amizades (enviar, aceitar, rejeitar, remover)
- Listagem de solicitações de amizade pendentes
- Integração com o `auth-service` e `event-bus` via eventos

---

## 🔗 Rotas (expostas via API Gateway)

As rotas abaixo são acessadas pelo frontend através do `api-gateway` na porta `1025`. Exemplo: `http://localhost:1025/user/...`

### 📋 Rotas de Perfil

| Tipo | Método | Rota             | Descrição                                   |
|:--:|:--:|:--:|:--:|
| 🔐 Privada | GET    | `/user/profile`     | Retorna os dados do perfil do usuário autenticado |
| 🔐 Privada | PATCH  | `/user/profile`     | Atualiza os dados do perfil do usuário             |
| 🔐 Privada | DELETE | `/user/profile`     | Remove a conta do usuário                          |
| 🔐 Privada | GET    | `/user/search`      | Busca perfis de usuário pelo nome                  |

#### Detalhes das Rotas de Perfil

- **GET /user/profile**
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <tokenJWT>"
    }
    ```
  - **Resposta:**
    - `200 OK`: Retorna os dados do perfil do usuário autenticado.
      ```json
      {
        "name": "string",
        "avatar_url": "string"
      }
      ```
    - `401 Unauthorized`: Token inválido ou ausente.
    - `404 Not Found`: Usuário não encontrado.

- **PATCH /user/profile**
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <tokenJWT>"
    }
    ```
  - **Body (form-data):**
    - `name`: string (obrigatório)
    - `avatar`: arquivo de imagem (opcional, JPEG/PNG até 2MB)
  - **Resposta:**
    - `200 OK`: Perfil atualizado com sucesso.
      ```json
      {
        "name": "string",
        "avatar_url": "string"
      }
      ```
    - `404 Not Found`: Usuário não encontrado.

- **DELETE /user/profile**
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <tokenJWT>"
    }
    ```
  - **Resposta:**
    - `204 No Content`: Conta excluída com sucesso.
    - `404 Not Found`: Usuário não encontrado.

- **GET /user/search**
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <tokenJWT>"
    }
    ```
  - **Query:**
    - `name`: string (mínimo 2 caracteres)
  - **Resposta:**
    - `200 OK`: Lista de perfis encontrados.
      ```json
      [
        {
          "user_id": "string",
          "name": "string",
          "avatar_url": "string"
        }
      ]
      ```
    - `400 Bad Request`: Query muito curta.

### 🤝 Rotas de Amizade

| Tipo | Método | Rota                      | Descrição                                   |
|:--:|:--:|:--:|:--:|
| 🔐 Privada | GET    | `/user/friends`           | Retorna lista de amigos do usuário autenticado |
| 🔐 Privada | GET    | `/user/friends/pending`   | Lista solicitações de amizade pendentes        |
| 🔐 Privada | POST   | `/user/friends/send`      | Envia solicitação de amizade para outro usuário |
| 🔐 Privada | POST   | `/user/friends/accept`    | Aceita solicitação de amizade recebida         |
| 🔐 Privada | POST   | `/user/friends/remove`    | Remove amizade existente                      |
| 🔐 Privada | DELETE | `/user/friends/reject`    | Rejeita solicitação de amizade recebida        |

#### Detalhes das Rotas de Amizade

- **GET /user/friends**
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <tokenJWT>"
    }
    ```
  - **Resposta:**
    - `200 OK`: Retorna a lista de amigos.
      ```json
      [
        {
          "user_id": "string",
          "name": "string",
          "avatar_url": "string",
          "since": "timestamp"
        }
      ]
      ```
    - `401 Unauthorized`: Token inválido ou ausente.

- **GET /user/friends/pending**
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <tokenJWT>"
    }
    ```
  - **Resposta:**
    - `200 OK`: Lista de solicitações de amizade pendentes.
      ```json
      [
        {
          "user_id": "string",
          "name": "string",
          "avatar_url": "string",
          "since": "timestamp"
        }
      ]
      ```

- **POST /user/friends/send**
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <tokenJWT>"
    }
    ```
  - **Body:**
    ```json
    {
      "target_id": "string"
    }
    ```
  - **Resposta:**
    - `201 Created`: Solicitação enviada com sucesso.
    - `400 Bad Request`: Dados inválidos.

- **POST /user/friends/accept**
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <tokenJWT>"
    }
    ```
  - **Body:**
    ```json
    {
      "sender_id": "string"
    }
    ```
  - **Resposta:**
    - `200 OK`: Solicitação aceita com sucesso.
    - `400 Bad Request`: Dados inválidos.

- **POST /user/friends/remove**
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <tokenJWT>"
    }
    ```
  - **Body:**
    ```json
    {
      "target_id": "string"
    }
    ```
  - **Resposta:**
    - `200 OK`: Amizade removida com sucesso.
    - `400 Bad Request`: Dados inválidos.

- **DELETE /user/friends/reject**
  - **Headers:**
    ```json
    {
      "Authorization": "Bearer <tokenJWT>"
    }
    ```
  - **Body:**
    ```json
    {
      "sender_id": "string"
    }
    ```
  - **Resposta:**
    - `200 OK`: Solicitação rejeitada com sucesso.
    - `400 Bad Request`: Dados inválidos.

---

## ⚙️ Configuração

Este serviço utiliza variáveis de ambiente para seu funcionamento adequado. Exemplo de configuração com Docker Compose:

```env
PORT=5000
REDIS_HOST=event-bus
REDIS_PORT=6379
```

---

## 🚀 Inicialização do Serviço

O serviço é inicializado por meio do script `server.js`, que configura o servidor Fastify e registra as rotas de perfil e amizade.

### Comandos Úteis

- **Construir a imagem Docker:**
  ```sh
  docker compose build user-mgmt
  ```

- **Iniciar o serviço:**
  ```sh
  docker compose up user-mgmt
  ```

- **Acessar logs do serviço:**
  ```sh
  docker compose logs user-mgmt
  ```

---

## 🛠️ Desenvolvimento

Durante o desenvolvimento, o serviço pode ser executado localmente com os seguintes comandos:

1. Instale as dependências:
   ```sh
   npm install
   ```

2. Inicie o servidor:
   ```sh
   npm start
   ```

3. Para desenvolvimento com recarregamento automático:
   ```sh
   npm run dev
   ```

> **Nota:** Certifique-se de que o Redis esteja em execução e configurado corretamente para o funcionamento do serviço.