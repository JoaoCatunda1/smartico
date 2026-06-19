# 🤖 MARTI - Setup Completo

## 1️⃣ Configurar Supabase

### Criar Tabelas

Execute estes SQL no Supabase SQL Editor:

```sql
-- Tabela de mensagens MARTI
CREATE TABLE marti_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de uso diário
CREATE TABLE marti_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  message_count INT DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Atualizar tabela de usuários (se não tiver coluna 'plan')
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'premium';

-- Indexes para performance
CREATE INDEX idx_marti_messages_user_id ON marti_messages(user_id);
CREATE INDEX idx_marti_messages_created_at ON marti_messages(created_at);
CREATE INDEX idx_marti_usage_user_id ON marti_usage(user_id);
CREATE INDEX idx_marti_usage_date ON marti_usage(date);
```

### RLS (Segurança)

Ative Row Level Security:

```sql
-- Mensagens MARTI
ALTER TABLE marti_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem suas próprias mensagens"
  ON marti_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas mensagens"
  ON marti_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Uso diário
ALTER TABLE marti_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem seu uso"
  ON marti_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Sistema atualiza uso"
  ON marti_usage FOR ALL
  USING (auth.uid() = user_id);
```

---

## 2️⃣ Configurar Claude API

1. Vá em [https://console.anthropic.com](https://console.anthropic.com)
2. Crie uma API Key
3. Copie e salve em `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

---

## 3️⃣ Configurar Variáveis de Ambiente

### `.env.local` (Frontend)

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_CLAUDE_API_ENDPOINT=/api/claude
VITE_CLAUDE_API_KEY=sk-ant-xxxxx
```

### `.env` (Backend - Vercel/Node.js)

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...
```

---

## 4️⃣ Acessar MARTI

### Localhost
```bash
# Se usar Vite
npm run dev
# Abra http://localhost:5173/marti.html
```

### Produção (Vercel/Railway)
```
https://seu-dominio.com/marti.html
```

---

## 📊 Estrutura do Banco de Dados

### `marti_messages`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID único |
| user_id | UUID | Usuário que perguntou |
| user_message | TEXT | Pergunta do usuário |
| ai_response | TEXT | Resposta do MARTI |
| created_at | TIMESTAMP | Quando foi criado |

### `marti_usage`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID único |
| user_id | UUID | Usuário |
| date | DATE | Data (YYYY-MM-DD) |
| message_count | INT | Quantas mensagens usou |

---

## 🔐 Limites por Plano

| Plano | Limite | Reset |
|-------|--------|-------|
| Premium | 50/dia | 00:00 UTC |
| Smartico | 200/dia | 00:00 UTC |

---

## 🧪 Testar Localmente

1. **Sem autenticação** (demo mode):
   - MARTI funciona em modo demo
   - Não salva no banco de dados
   - Mostra aviso: "Usuário não autenticado"

2. **Com Supabase**:
   - Faça login com Supabase Auth
   - Tudo salva automaticamente
   - Limite funciona em tempo real

---

## 🐛 Troubleshooting

### "Erro ao conectar com banco de dados"
- ✅ Verificar VITE_SUPABASE_URL
- ✅ Verificar VITE_SUPABASE_ANON_KEY
- ✅ Verificar se Supabase está online

### "API Error: 401"
- ✅ Verificar ANTHROPIC_API_KEY
- ✅ Verificar se a chave está ativa
- ✅ Verificar se a chave tem crédito

### "Limite atingido"
- ✅ Normal! Reseta todo dia às 00:00 UTC
- ✅ Upgrade para Smartico para mais perguntas

---

## 📱 Integração no App

Para integrar MARTI no `app.html`:

```html
<!-- No app.html, adicione um botão/menu -->
<a href="/marti.html" class="menu-item">
  🤖 MARTI - Consultor IA
</a>

<!-- Ou embed em um iframe -->
<iframe src="/marti.html" width="100%" height="600"></iframe>
```

---

## 🚀 Deploy no Vercel

1. `git push` para GitHub
2. Conecte Vercel ao repositório
3. Configure variáveis de ambiente em Vercel
4. Deploy automático

```bash
vercel env add ANTHROPIC_API_KEY
```

---

**Pronto! MARTI está funcionando! 🎉**
