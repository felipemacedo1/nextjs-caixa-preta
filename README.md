# 🗃️ Caixa-Preta - microSaaS de Arquivos

Um sistema completo de gerenciamento de arquivos com autenticação Google, upload seguro para Supabase Storage e interface dark moderna.

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage (privado)
- **Auth**: NextAuth.js com Google OAuth

## ⚡ Setup Rápido

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie `.env.example` para `.env.local` e configure:

```bash
# Database (Supabase PostgreSQL URL)
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-aqui"

# Google OAuth (Console do Google)
GOOGLE_CLIENT_ID="seu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="seu-client-secret"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[project].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"
```

### 3. Configurar Supabase Storage

1. Acesse seu projeto Supabase
2. Vá em **Storage** → **Create Bucket**
3. Nome: `files`
4. **Público**: DESMARQUE (bucket privado)
5. Salve

### 4. Executar migrações do banco
```bash
npx prisma migrate dev --name init
```

### 5. Rodar o projeto
```bash
npm run dev
```

Acesse: http://localhost:3000

## 🔧 Configuração do Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto ou selecione existente
3. Ative a **Google+ API**
4. Vá em **Credenciais** → **Criar Credenciais** → **ID do cliente OAuth 2.0**
5. Tipo: **Aplicação Web**
6. **URIs de redirecionamento autorizados**:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://seu-dominio.vercel.app/api/auth/callback/google` (prod)

## 📦 Deploy na Vercel

1. Conecte seu repositório GitHub na Vercel
2. Configure as variáveis de ambiente no painel da Vercel
3. Atualize `NEXTAUTH_URL` para sua URL de produção
4. Atualize as URIs de redirecionamento no Google Console
5. Deploy automático! 🎉

## 🔒 Funcionalidades

- ✅ **Autenticação Google** (NextAuth.js)
- ✅ **Upload seguro** (PDF, JPG, PNG até 5MB)
- ✅ **Storage privado** (Supabase)
- ✅ **Links temporários** (60s de expiração)
- ✅ **Categorização** de arquivos
- ✅ **Interface dark** por padrão
- ✅ **Responsivo** (mobile-first)
- ✅ **Toast notifications**

## 📁 Estrutura do Projeto

```
├── app/
│   ├── api/              # API Routes
│   ├── dashboard/         # Dashboard protegido
│   └── globals.css        # Estilos globais
├── components/
│   ├── ui/               # Componentes shadcn/ui
│   └── dashboard.tsx     # Dashboard principal
├── lib/
│   ├── auth.ts           # Configuração NextAuth
│   ├── prisma.ts         # Cliente Prisma
│   └── supabase.ts       # Cliente Supabase
└── prisma/
    └── schema.prisma     # Schema do banco
```

## 🎯 Como Usar

1. **Login**: Clique em "Entrar com Google"
2. **Criar Categoria**: Sidebar → botão "+"
3. **Upload**: Botão "Upload" → selecione arquivo e categoria
4. **Download**: Clique no ícone de download ao lado do arquivo
5. **Navegação**: Use a sidebar para filtrar por categoria

## 🛡️ Segurança

- Bucket Supabase configurado como **privado**
- Links de download **expiram em 60 segundos**
- Usuários só acessam **seus próprios arquivos**
- Validação de **tipo e tamanho** de arquivo
- **Autenticação obrigatória** para todas as rotas

---

**Pronto para usar!** 🚀 Um microSaaS completo em poucos minutos.