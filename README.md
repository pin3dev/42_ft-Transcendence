# 42-Transcendence  

Galera,  
Abaixo está uma sugestão de padronização para o projeto.  
Fiquem à vontade para seguir como preferirem, é apenas para ajudar a manter tudo organizado e facilitar o trabalho em equipe. 🙂

---

## 📚 Sugestão de Branches

### Branches principais:
- **`main`** → Produção, sempre estável.
- **`develop`** → Integração principal entre os microsserviços.

### Branches secundárias:
- **`feat/*`** → Novas funcionalidades (por exemplo, `feature/login-service`).
- **`fix/*`** → Correções de bugs antes do release.
- **`hotfix/*`** → Correções rápidas direto na `main` (urgência).
- **`release/*`** → Preparação de versões (opcional, se quiser controle de releases).
- **`docs/*`** → Atualizações de documentação (ex: `docs/update-readme`, `docs/api-docs-user-service`).
- **`style/*`** → Mudanças puramente de formatação (espaço, ponto e vírgula, indentação) sem alterar o código de lógica.
- **`refactor/*`** → Reescrever ou melhorar o código sem mudar o comportamento (melhorar performance, organizar, deixar mais legível).
- **`test/*`** → Adicionar ou corrigir testes automatizados.
- **`chore/*`** → Tarefas de manutenção que não afetam o código da aplicação (ex: atualizar dependências, configurar CI/CD, alterar arquivos de build).

---

## 🎯 Fluxo de trabalho sugerido

1. **Começar**:
   - Sempre crie branches **a partir de `develop`**.
2. **Desenvolvimento**:
   - Crie branches `feat/` para novas tarefas.
   - Se corrigir bugs, use `fix/`.
3. **Finalizar**:
   - Faça `merge request (pull request)` da sua `feat/*` para `develop`.
4. **Deploy**:
   - Quando estiver pronto para produção, faça merge de `develop` → `main`.
   - Se precisar corrigir algo urgente, crie `hotfix/*` saindo de `main`.

---

## 🛠️ Exemplo real

- Branch `feat/payment-service-api`
- Branch `feat/user-service-auth`
- Branch `fix/login-error`
- Branch `hotfix/fix-token-expiration`
- Branch `release/v1.0.0`

---

## 🔥 Dica de padrão de nome para commit

Para manter ainda mais organizado, pode usar um padrão de mensagem de commit, tipo:
```
[type]: descrição breve
[type] pode ser: feat, fix, chore, refactor, test, docs
```

Exemplo:
```
feat: criar endpoint de autenticação no serviço de usuários
fix: corrigir erro de autenticação expirada
```

---

## 🏗️ Resumindo

```plaintext
main         → produção
develop      → integração de todos os microsserviços
feature/*    → novas features
bugfix/*     → correções antes do release
hotfix/*     → correções críticas
release/*    → versões específicas (opcional)
```
