# 🔐 Auth Service

O `auth-service` é responsável pela autenticação de usuários no sistema. Ele realiza o registro, login com verificação de autenticação em dois fatores (2FA) e emissão de tokens JWT para acesso seguro às rotas protegidas.

> ℹ️ Este serviço **não é acessado diretamente pelo frontend**. Todas as requisições externas devem ser feitas por meio do [`api-gateway`](../api-gateway), que atua como ponto único de entrada do sistema.

---

## 📦 Funcionalidades

- Registro de novos usuários
- Login com validação de credenciais
- Verificação de 2FA
- Emissão de tokens JWT
- Integração com o sistema de eventos para sincronização de dados

---

## 🔗 Rotas (expostas via API Gateway)

As rotas abaixo são acessadas pelo frontend através do `api-gateway` na porta `1025`. Exemplo: `http://localhost:1025/auth/...`

### 🌐 Rotas Públicas

| Método | Rota             | Descrição                                     |
|--------|------------------|-----------------------------------------------|
| POST   | `/auth/register` | Criação de novo usuário                       |
| POST   | `/auth/login`    | Início do processo de login (retorna status de 2FA) |
| POST   | `/auth/2fa`      | Validação do código 2FA e emissão do token JWT |

### 📋 Detalhes das Rotas

#### 1. **Registro de Usuário**
- **Endpoint:** `POST /auth/register`
- **Body:**
  ```json
  {
    "email": "usuario@email.com",
    "password": "senha123"
  }
  ```
- **Resposta:**
  - `201 Created`: Usuário criado com sucesso.
    ```json
    {
      "user_id": 123,
      "message": "Usuário criado com sucesso",
      "qr_code": "otpauth://..."
    }
    ```
  - `400 Bad Request`: Dados inválidos.

#### 2. **Login de Usuário**
- **Endpoint:** `POST /auth/login`
- **Body:**
  ```json
  {
    "email": "usuario@email.com",
    "password": "senha123"
  }
  ```
- **Resposta:**
  - `200 OK`: Retorna status de 2FA necessário.
    ```json
    {
      "user_id": 123,
      "status": "2FA_REQUIRED",
      "message": "Autenticação de dois fatores necessária",
      "qr_code": "otpauth://..."
    }
    ```
  - `401 Unauthorized`: Credenciais inválidas.

#### 3. **Verificação de 2FA**
- **Endpoint:** `POST /auth/2fa`
- **Body:**
  ```json
  {
    "user_id": 123,
    "otp": "123456"
  }
  ```
- **Resposta:**
  - `200 OK`: Retorna token JWT para acesso.
    ```json
    {
      "user_id": 123,
      "jwt": "<JWT>",
      "message": "2FA verificado com sucesso"
    }
    ```
  - `401 Unauthorized`: Código inválido ou 2FA não configurado.

---

## ⚙️ Configuração

Este serviço espera que algumas variáveis de ambiente estejam configuradas, especialmente se usado com Docker Compose:

```env
JWT_PRIVATE_KEY_BASE64=<chave_privada_em_base64>
JWT_PUBLIC_KEY_BASE64=<chave_publica_em_base64>
```

---

## 🚀 Inicialização do Serviço

O serviço é inicializado por meio do script `entrypoint.sh`, que realiza as seguintes ações:

1. Restaura as chaves RSA a partir das variáveis de ambiente `JWT_PRIVATE_KEY_BASE64` e `JWT_PUBLIC_KEY_BASE64`.
2. Salva as chaves no diretório `/app/keys`.
3. Inicia o servidor na porta `4000`.

> **Nota:** Certifique-se de que as chaves RSA estejam disponíveis no caminho correto ou configure as variáveis de ambiente adequadamente.