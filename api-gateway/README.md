# 📡 API Gateway

Este serviço atua como ponto de entrada para o sistema baseado em microsserviços. Ele roteia e consolida requisições HTTP direcionadas aos serviços internos, facilitando a comunicação centralizada e segura.

## ⚙️ Configurações

Todas as requisições HTTP feitas pelo frontend para os serviços internos devem ser enviadas exclusivamente por meio do `api-gateway`. As rotas públicas estão disponíveis na porta `1025`. Para acessar rotas privadas, também pela porta `1025`, é obrigatório incluir um token JWT válido no cabeçalho da requisição.

## 🔗 Serviços Integrados

- **auth-service (Serviço de Autenticação)** – Responsável por login, registro, verificação de autenticação em dois fatores (2FA) e emissão de tokens JWT.  
- **user-management (Gestão de Usuários)** – Responsável pelo gerenciamento de perfis de usuários (CRUD).

## 🛣️ Rotas Disponíveis

Abaixo estão listadas todas as rotas disponíveis por meio do API Gateway, organizadas por serviço.

### 🔐 Auth Service

| Tipo | Método | Rota | Ação | Request | Response |
|:--:|:--:|:--:|:--:|:--:|:--:|
| 🌐 Pública | POST | `/auth/register` | Cria um novo usuário | Body: `{ "email": "usuario@email.com", "password": "senha123" }` | `201 Created` ou `400 Bad Request` |
| 🌐 Pública | POST | `/auth/login` | Autentica um usuário e inicia o 2FA | Body: `{ "email": "usuario@email.com", "password": "senha123" }` | `200 OK` com `{ status: string }` ou `401 Unauthorized` |
| 🌐 Pública | POST   | `/auth/2fa/verify` | Valida o código 2FA e emite token JWT | Body: `{ "userId": 123, "2faToken": "123456" }` | `200 OK` com `{ nomeUser: string }` ou `400 Bad Request` |

<!--
> 💡 *Sugestões de padronização futuras:*  
> - Padronizar nomes das rotas.  
> - Alterar o nome do campo `token` do corpo do 2FA para `2faToken`.
-->

---

### 👤 User Management

| Tipo | Método | Rota | Ação | Request | Response |
|:--:|:--:|:--:|:--:|:--:|:--:|
| 🔐 Privada | GET | `/user/me` | Retorna os dados do perfil do usuário autenticado | Header: `Authorization: Bearer <tokenJWT>` | `200 OK`, `403 Forbidden` ou `404 Not Found` |

---

> [!IMPORTANT]  
> O API Gateway é responsável apenas por rotear requisições e validar o token JWT. Toda lógica de autorização, permissões e regras de negócio é tratada individualmente por cada microsserviço.

> [!WARNING]  
> O serviço de eventos (**event-bus**) utiliza Redis para comunicação interna entre microsserviços e **não expõe endpoints públicos** via o API Gateway.

