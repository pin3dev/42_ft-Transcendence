# ⚠️ Auth-Service

### 🌳 Estrutura

    - INFRASTRUCTURE/

        - **Define serviço de hashing** (`bcryptHasher`) dentro da **infraestrutura**, responsável por proteger senhas de forma segura e reutilizável.</br>

        - **Cria conexão com o banco de dados** (`sqlite`) na camada de **infraestrutura**, garantindo persistência de dados e criação da tabela `users`.</br>

        - **Implementa o repositório real** (`userRepoSqlite`) dentro da infraestrutura, respeitando o contrato e conectando diretamente ao banco SQLite.</br>

    - DOMAIN/

        - **Define entidade de domínio** (`User`) para representar um usuário como parte da lógica de negócio, desacoplado do banco ou da tecnologia usada.</br>

        - **Cria o contrato (interface informal)** `userRepository.js` para definir o comportamento esperado de qualquer repositório de usuários (ex: `findByEmail`, `save`).</br>

    - SHARED/

        - **Define os SCHEMAS** de entrada e saída (`userSchemas.js`) com JSON Schema, usados na validação automática das requisições e respostas nas rotas.</br>

    - APPLICATION/

        - **Cria o CASO DE USO** (`registerUser`) na camada de aplicação, contendo a lógica de negócio: validar duplicidade, gerar hash, criar usuário.</br>

    - API/

        - **Cria HANDLER** (opcional) ou define função de rota para lidar com request/response, chamando os casos de uso com as dependências corretas.</br>

        - **Define as ROTAS** (`register.js`) que mapeiam os endpoints para funções de manipulação, aplicando validações e orquestrando os casos de uso.</br>

    - MAIN/

        - **Inicializa o SERVIDOR Fastify** (`server.js`), injeta dependências como repositório e hasher, e registra as rotas para ativar o serviço.</br>

---

### 💡 Conceito

```plaintext
📁 domain/         → O core do sistema (regras de negócio puras)
📁 application/    → Onde vivem os casos de uso (ações do sistema)
📁 infrastructure/ → O mundo real (DB, hashing, APIs externas)
📁 api/            → Interface HTTP (rotas, handlers, schemas)
📁 shared/         → Código genérico e reutilizável
📄 server.js       → Ponto de entrada do serviço
```

### 💻 Testes

Para iniciar o serviço:

```bash
cd auth-service 
npm install #necessário apenas a primeira vez, para instalar dependencias
node src/server.js
```

##### Teste de requisição HTTP pelo curl:
```bash
curl -X POST http://localhost:4000/register -H "Content-Type: application/json" -d '{"email": "teste@example.com", "password": "123456"}' 
```
#####  Test de requisição HTTP pelo Postman: 
- Url: `http://localhost:4000/register`
- Método: `POST`
- Body: raw/JSON

```json
{
  "email": "teste@example.com",
  "password": "123456"
}
```
---