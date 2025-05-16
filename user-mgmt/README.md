# 👤 User Management Service

Este serviço é responsável pela gestão de perfis de usuários no sistema. Ele realiza operações de leitura, atualização e remoção dos dados de perfil.

> ℹ️ Este serviço **não é acessado diretamente pelo frontend**. Todas as requisições externas devem ser feitas por meio do [`api-gateway`](../api-gateway), que atua como ponto único de entrada do sistema.

---

## 📦 Funcionalidades

- Consulta do perfil autenticado
- Atualização de dados de perfil (nome, avatar, etc.)
- Exclusão de conta
- Integração com o `auth-service` e `event-bus` via eventos

---

## 🔗 Rotas (expostas via API Gateway)

As rotas abaixo são acessadas pelo frontend através do `api-gateway` na porta `1025`. Exemplo: `http://localhost:1025/user/...`

| Tipo | Método | Rota | Descrição |
|:--:|:--:|:--:|:--:|
| 🔐 Privada | GET    | `/user/profile` | Retorna os dados do perfil do usuário autenticado   |
| 🔐 Privada | PUT    | `/user/profile` | Atualiza os dados do usuário (próprio ou admin)     |
| 🔐 Privada | DELETE | `/user/profile` | Remove a conta do usuário (próprio ou admin)        |
| 🔐 Privada | GET    | `/user/friends` | Retorna lista de amigos do usuário solicitante |
| 🔐 Privada | POST   | `/user/friends/send` | Envia solicitação de amizade para target_id |
| 🔐 Privada | POST   | `/user/friends/accept` | Aceita requisições que amizade recebidas pelo usuário |
| 🔐 Privada | POST   | `/user/friends/remove` | Remove amizade já estabelecida |
| 🔐 Privada | DELETE | `/user/friends/reject` | Rejeita requisições de amizade recebidas pelo usuário |

> Veja a documentação do [`api-gateway`](../api-gateway/README.md) para detalhes completos dos requests/responses esperados.

---
<!--

## ⚙️ Configuração

Este serviço utiliza variáveis de ambiente para seu funcionamento adequado (exemplo com Docker Compose):

```env
PORT=3002
JWT_SECRET=sua_chave_jwt_segura
REDIS_HOST=event-bus
REDIS_PORT=6379
MONGO_URI=mongodb://mongo:27017/user-db
-->