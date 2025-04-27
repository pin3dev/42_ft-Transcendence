# 🌐 API Gateway

### 🌳 Estrutura

    - PLUGINS/

        - **Configura o CORS** (`cors.js`), permitindo que o frontend (SPA) se comunique com o backend sem bloqueio de origem cruzada.</br>

        - **Define middleware de autenticação** (`authMiddleware.js`) com JWT RS256 para proteger rotas privadas de forma reutilizável (futuramente).</br>

    - PROXY/

        - **Cria função genérica de proxy reverso** (`serviceProxy.js`), permitindo que o Gateway redirecione requisições para serviços como `user-service`, `presence-service`, etc.</br>

    - ROUTES/

        - **Define as rotas públicas** (`auth.js`) que são expostas diretamente para o frontend, e fazem ponte para os microsserviços.</br>

        - (Futuramente) **Define rotas privadas** com autenticação ativada e verificação de JWT.</br>

    - MAIN/

        - **Inicializa o SERVIDOR Fastify** (`server.js`), injeta plugins (CORS, Auth), registra rotas e configura redirecionamentos.</br>

---

### 💡 Conceito

```plaintext
📁 plugins/         → Plugins reutilizáveis (ex: CORS, autenticação JWT)
📁 proxy/           → Redirecionamento genérico para microsserviços
📁 routes/          → Rotas públicas e privadas
📄 server.js        → Ponto de entrada do serviço
```

---
<!--
### 🔁 Funcionalidade

- Atende requisições do frontend via `http://localhost:3000`.
- Encaminha chamadas como `/auth/register` para o `auth-service`.
- Já está preparado para:
  - Autenticação com JWT
  - Adição de novos serviços via proxy reverso
  - CORS controlado
  - Organização limpa e modular

-->

### 💻 Testes

##### Para iniciar o serviço

```bash
cd api-gateway
npm install  # necessário apenas na primeira vez
node src/server.js
```

>[!IMPORTANT] O gateway iniciará em: `http://localhost:3000`

---

##### TTeste de requisição HTTP pelo CURL

```bash
curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"email": "teste@example.com", "password": "123456"}'
```

---

#### Test de requisição HTTP pelo Postman

- URL: `http://localhost:3000/auth/register`
- Método: `POST`
- Headers: `Content-Type: application/json`
- Body (raw / JSON):
```json
{
  "email": "teste@example.com",
  "password": "123456"
}
```
---
