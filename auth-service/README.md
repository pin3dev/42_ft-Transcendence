# 🔐 Auth Service

Este serviço é responsável pela autenticação de usuários no sistema. Ele realiza o registro, login com verificação de autenticação em dois fatores (2FA) e emissão de tokens JWT.

> ℹ️ Este serviço **não é acessado diretamente pelo frontend**. Todas as requisições externas devem ser feitas por meio do [`api-gateway`](../api-gateway), que atua como ponto único de entrada do sistema.

---

## 📦 Funcionalidades

- Registro de novos usuários
- Login com validação de credenciais
- Verificação de 2FA
- Emissão de tokens JWT

---

## 🔗 Rotas (expostas via API Gateway)

As rotas abaixo são acessadas pelo frontend através do `api-gateway` na porta `1025`. Exemplo: `http://localhost:1025/auth/...`

| Tipo       | Método | Rota               | Descrição                                     |
|------------|--------|--------------------|-----------------------------------------------|
| 🌐 Pública | POST   | `/auth/register`   | Criação de novo usuário                       |
| 🌐 Pública | POST   | `/auth/login`      | Início do processo de login (retorna status de 2FA) |
| 🌐 Pública | POST   | `/auth/2fa/verify` | Validação do código 2FA e emissão do token JWT |

> Veja a documentação do [`api-gateway`](../api-gateway/README.md) para detalhes completos dos requests/responses esperados.

---

<!--
## ⚙️ Configuração

Este serviço espera que algumas variáveis de ambiente estejam configuradas, especialmente se usado com Docker Compose:

```env
PORT=3001
JWT_SECRET=sua_chave_jwt_segura
REDIS_HOST=event-bus
REDIS_PORT=6379
-->