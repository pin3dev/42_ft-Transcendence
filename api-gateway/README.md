# 📡 API Gateway

O `api-gateway` é o ponto de entrada centralizado para o sistema, responsável por rotear e consolidar requisições HTTP para os serviços internos. Ele também gerencia autenticação e autorização para proteger rotas privadas.

## ⚙️ Configurações Gerais

- **Porta:** 1025
- **Autenticação:** Baseada em JWT (JSON Web Tokens) com algoritmo RS256.
- **Chave Pública:** Restaurada no momento da inicialização a partir da variável de ambiente `PUBLIC_KEY_BASE64` e armazenada em `/app/keys/public.key`.

## 🔑 Autenticação JWT

- **Plugin Utilizado:** `@fastify/jwt`
- **Validação:**
  - Tokens inválidos ou expirados retornam erro `401 Unauthorized`.
  - Tokens associados a usuários excluídos também retornam erro `401 Unauthorized`.

## 🛣️ Rotas Disponíveis

### 🔐 Auth Service

| Tipo | Método | Rota | Descrição | Requisição | Resposta |
|:--:|:--:|:--:|:--:|:--:|:--:|
| 🌐 Pública | POST | `/auth/register` | Cria um novo usuário | Body: `{ "email": "usuario@email.com", "password": "senha123" }` | `201 Created` ou `400 Bad Request` |
| 🌐 Pública | POST | `/auth/login` | Autentica um usuário e inicia o 2FA | Body: `{ "email": "usuario@email.com", "password": "senha123" }` | `200 OK` com `{ user_id: number, status: string }` ou `401 Unauthorized` |
| 🌐 Pública | POST | `/auth/2fa` | Valida o código 2FA e emite token JWT | Body: `{ "user_id": 123, "otp": "123456" }` | `200 OK` com `{ jwt: string }` ou `400 Bad Request` |

### 👤 User Management

| Tipo | Método | Rota | Descrição | Requisição | Resposta |
|:--:|:--:|:--:|:--:|:--:|:--:|
| 🔐 Privada | GET | `/user/profile` | Retorna os dados do perfil do usuário autenticado | Header: `Authorization: Bearer <tokenJWT>` | `200 OK` com `{ user_id, email, ... }`, `403 Forbidden` ou `404 Not Found` |
| 🔐 Privada | PUT | `/user/profile` | Atualiza os dados do perfil do usuário | Header: `Authorization: Bearer <tokenJWT>`, Body: `{ "name": "string", "avatar_url": "string" }` | `200 OK` ou `404 Not Found` |
| 🔐 Privada | DELETE | `/user/profile` | Remove a conta do usuário autenticado | Header: `Authorization: Bearer <tokenJWT>` | `204 No Content` ou `404 Not Found` |
| 🔐 Privada | GET | `/user/friends` | Retorna lista de amigos do usuário autenticado | Header: `Authorization: Bearer <tokenJWT>` | `200 OK` com `{ friends: [...] }` ou `401 Unauthorized` |
| 🔐 Privada | POST | `/user/friends/send` | Envia solicitação de amizade | Header: `Authorization: Bearer <tokenJWT>`, Body: `{ "target_id": "string" }` | `201 Created` ou `400 Bad Request` |
| 🔐 Privada | POST | `/user/friends/accept` | Aceita solicitação de amizade recebida | Header: `Authorization: Bearer <tokenJWT>`, Body: `{ "sender_id": "string" }` | `200 OK` ou `400 Bad Request` |
| 🔐 Privada | DELETE | `/user/friends/remove` | Remove amizade existente | Header: `Authorization: Bearer <tokenJWT>`, Body: `{ "target_id": "string" }` | `200 OK` ou `400 Bad Request` |
| 🔐 Privada | POST | `/user/friends/reject` | Rejeita solicitação de amizade recebida | Header: `Authorization: Bearer <tokenJWT>`, Body: `{ "sender_id": "string" }` | `200 OK` ou `400 Bad Request` |

## 🚀 Inicialização do Serviço

O serviço é inicializado por meio do script `entrypoint.sh`, que realiza as seguintes ações:

1. Restaura a chave pública a partir da variável de ambiente `PUBLIC_KEY_BASE64`.
2. Salva a chave pública no diretório `/app/keys/public.key`.
3. Inicia o servidor Fastify no endereço `0.0.0.0:1025`.

### Comandos Úteis

- **Construir a imagem Docker e Iniciar o serviço:**
  ```sh
  make
  ```

- **Acessar logs do serviço:**
  ```sh
  make status api-gateway
  ```

> **Nota:** Certifique-se de que a chave pública esteja disponível no caminho correto ou configure a variável de ambiente `PUBLIC_KEY_BASE64` adequadamente.

## 📖 Guia para o Frontend

### Como Consumir as Rotas

#### 1. **Autenticação**
- **Registro:**
  - Endpoint: `POST /auth/register`
  - Body:
    ```json
    {
      "email": "usuario@email.com",
      "password": "senha123"
    }
    ```
  - Resposta:
    - `201 Created`: Usuário criado com sucesso.
    - `400 Bad Request`: Dados inválidos.

- **Login:**
  - Endpoint: `POST /auth/login`
  - Body:
    ```json
    {
      "email": "usuario@email.com",
      "password": "senha123"
    }
    ```
  - Resposta:
    - `200 OK`: Retorna `{ user_id: 123, status: "2FA_REQUIRED" }`.
    - `401 Unauthorized`: Credenciais inválidas.

- **Verificação 2FA:**
  - Endpoint: `POST /auth/2fa`
  - Body:
    ```json
    {
      "user_id": 123,
      "otp": "123456"
    }
    ```
  - Resposta:
    - `200 OK`: Retorna `{ jwt: "<JWT>" }`.
    - `400 Bad Request`: Código 2FA inválido.

#### 2. **Gestão de Usuários**
- **Obter Perfil do Usuário:**
  - Endpoint: `GET /user/profile`
  - Headers:
    ```json
    {
      "Authorization": "Bearer <tokenJWT>"
    }
    ```
  - Resposta:
    - `200 OK`: Retorna os dados do usuário autenticado.
    - `403 Forbidden`: Token inválido ou ausente.
    - `404 Not Found`: Usuário não encontrado.

- **Atualizar Perfil do Usuário:**
  - Endpoint: `PUT /user/profile`
  - Headers:
    ```json
    {
      "Authorization": "Bearer <tokenJWT>"
    }
    ```
  - Body:
    ```json
    {
      "name": "string",
      "avatar_url": "string"
    }
    ```
  - Resposta:
    - `200 OK`: Perfil atualizado com sucesso.
    - `404 Not Found`: Usuário não encontrado.

- **Excluir Conta do Usuário:**
  - Endpoint: `DELETE /user/profile`
  - Headers:
    ```json
    {
      "Authorization": "Bearer <tokenJWT>"
    }
    ```
  - Resposta:
    - `204 No Content`: Conta excluída com sucesso.
    - `404 Not Found`: Usuário não encontrado.

- **Gerenciar Amigos:**
  - **Listar Amigos:**
    - Endpoint: `GET /user/friends`
    - Headers:
      ```json
      {
        "Authorization": "Bearer <tokenJWT>"
      }
      ```
    - Resposta:
      - `200 OK`: Retorna lista de amigos.
      - `401 Unauthorized`: Token inválido ou ausente.

  - **Enviar Solicitação de Amizade:**
    - Endpoint: `POST /user/friends/send`
    - Headers:
      ```json
      {
        "Authorization": "Bearer <tokenJWT>"
      }
      ```
    - Body:
      ```json
      {
        "target_id": "string"
      }
      ```
    - Resposta:
      - `201 Created`: Solicitação enviada com sucesso.
      - `400 Bad Request`: Dados inválidos.

  - **Aceitar Solicitação de Amizade:**
    - Endpoint: `POST /user/friends/accept`
    - Headers:
      ```json
      {
        "Authorization": "Bearer <tokenJWT>"
      }
      ```
    - Body:
      ```json
      {
        "sender_id": "string"
      }
      ```
    - Resposta:
      - `200 OK`: Solicitação aceita com sucesso.
      - `400 Bad Request`: Dados inválidos.

  - **Remover Amizade:**
    - Endpoint: `DELETE /user/friends/remove`
    - Headers:
      ```json
      {
        "Authorization": "Bearer <tokenJWT>"
      }
      ```
    - Body:
      ```json
      {
        "target_id": "string"
      }
      ```
    - Resposta:
      - `200 OK`: Amizade removida com sucesso.
      - `400 Bad Request`: Dados inválidos.

  - **Rejeitar Solicitação de Amizade:**
    - Endpoint: `POST /user/friends/reject`
    - Headers:
      ```json
      {
        "Authorization": "Bearer <tokenJWT>"
      }
      ```
    - Body:
      ```json
      {
        "sender_id": "string"
      }
      ```
    - Resposta:
      - `200 OK`: Solicitação rejeitada com sucesso.
      - `400 Bad Request`: Dados inválidos.

