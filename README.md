
# Sistema de Gerenciamento de Usuários | Teste Técnico

[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Latest-38B2AC)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/React_Query-Latest-ff4154)](https://tanstack.com/query/latest)

## 📌 Sobre o Projeto

Este projeto é um sistema de gerenciamento de usuários com controle de acesso baseado em funções (RBAC), desenvolvido como parte de um teste técnico. A aplicação permite cadastrar, editar, visualizar e excluir usuários, com diferentes níveis de acesso (Admin, Gerente, Usuário Comum).

### 🚀 Features Implementadas

- ✅ Sistema completo de autenticação JWT
- ✅ Cadastro, edição, visualização e exclusão de usuários
- ✅ Controle de acesso baseado em funções (RBAC)
- ✅ Interface responsiva e intuitiva
- ✅ Feedback visual com mensagens de erro/sucesso
- ✅ Validação de formulários
- ✅ Proteção de rotas baseada em permissões
- ✅ Gerenciamento de estado com Context API
- ✅ Cache eficiente com React Query

### 🛠️ Tecnologias

- **React** com Hooks (ao invés de Next.js)
- **TypeScript**
- **Vite** como bundler
- **Tailwind CSS** para estilização
- **React Query** para gerenciamento de cache e requisições
- **Context API** para gerenciamento de estado
- **React Router DOM** para navegação
- **Shadcn/UI** para componentes de interface

### ⚙️ Observações sobre a Implementação

Este projeto foi implementado utilizando **React + Vite + Tailwind CSS** ao invés de Next.js conforme especificado originalmente. A decisão foi tomada para melhor adequação ao tempo disponível e para focar na implementação das funcionalidades principais de gerenciamento de usuários e controle de acesso.

### 📁 Estrutura do Monorepo

```
/
├── backend/           # Aplicação NestJS 
├── frontend/          # Aplicação React + Vite
└── package.json       # Configuração do monorepo
```

### 🚀 Como Executar

```bash
# Clonar o repositório
git clone [URL_DO_REPOSITÓRIO]

# Instalar todas as dependências (frontend e backend)
npm run install-all

# Para iniciar apenas o backend
npm run start:backend

# Para iniciar apenas o frontend
npm run start:frontend

# Para iniciar ambos simultaneamente
npm run start:all
```

### 👤 Autor

**José Roberto Ferreira Junior**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/josé-roberto-dev/)

---

Desenvolvido como parte de um teste técnico para desenvolvedor full-stack.
