# 🌊 Natal Vip Turismo - Plataforma Oficial de Experiências VIP

Plataforma moderna de reservas de passeios náuticos, mergulho nos parrachos e roteiros em Natal/RN, com tábua de maré interativa 2026, Concierge Inteligente com IA Gemini, emissão digital de vouchers com QR Code, sistema de follow-up/CRM e conformidade com LGPD.

---

## 🚀 Como Integrar com GitHub e Fazer Deploy no Vercel

Este projeto já está **100% configurado** com arquitetura híbrida compatível tanto com **Vercel** (Frontend Vite em SPA + Serverless Functions na pasta `/api`) quanto com **Containers Node.js/Express** (`server.ts`).

### 1. Enviar para o GitHub
1. Inicialize o repositório Git (caso ainda não tenha feito):
   ```bash
   git init
   git add .
   git commit -m "feat: plataforma natal vip turismo pronta para github e vercel"
   ```
2. Crie um repositório no seu GitHub (ex: `natal-vip-turismo`).
3. Vincule a branch remota e envie:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/natal-vip-turismo.git
   git branch -M main
   git push -u origin main
   ```

### 2. Importar no Vercel
1. Acesse o [Vercel Dashboard](https://vercel.com) e clique em **"Add New Project"** -> **"Import Git Repository"**.
2. Selecione o repositório recém-criado no GitHub.
3. O Vercel detectará automaticamente o framework **Vite**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `vite build` (ou conforme `vercel.json`)
   - **Output Directory**: `dist`
4. Em **Environment Variables**, adicione a chave do Gemini (opcional, mas recomendada para o chatbot com IA):
   - `GEMINI_API_KEY` = *Sua chave de API do Google Gemini*
5. Clique em **Deploy**.

Em menos de 1 minuto seu site estará online com domínio HTTPS gratuito (ex: `https://natal-vip-turismo.vercel.app`).

---

## ⚙️ Arquitetura de Rotas e Endpoints no Vercel

O projeto conta com arquivo `vercel.json` e rotas serverless nativas para garantir funcionamento perfeito:

- **Frontend SPA**: Todas as rotas de navegação são reescritas para `/index.html` via `vercel.json`.
- **API Serverless Functions** (em `/api`):
  - `POST /api/chat`: Concierge Virtual Inteligente com Gemini Flash e respostas contextuais completas sobre maré, passeios e dicas gastronômicas.
  - `GET /api/health`: Health check da agência e status da integração com IA.
  - `POST /api/send-voucher`: Disparo de voucher para o cliente e central operacional (`reservas@natalvipturismo.com`).
  - `POST /api/leads`: Registro no CRM e follow-up de marketing.

---

## 💻 Desenvolvimento Local

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor local
npm run dev
# Acesse http://localhost:3000

# 3. Compilar projeto
npm run build
```

---

## 🛡️ Principais Funcionalidades

- **Tábua de Maré Inteligente 2026**: Recomendações em tempo real para os 365 dias do ano (Verde para piscinas naturais cristalinas, Amarelo para condições intermediárias e Vermelho com sugestões de buggy em Genipabu).
- **Checkout Seguro & Rápido**: Opções de PIX com 5% de desconto imediato ou Cartão de Crédito em até 12x sem juros (sem opção de pagamento no embarque).
- **Voucher Digital Instantâneo**: Geração automática com QR Code único e envio de cópia por e-mail.
- **Painel CRM de Leads**: Captura de leads por intenção de saída e recuperação de carrinho com disparo de mensagens prontas para WhatsApp.
- **Consentimento de Cookies LGPD**: Controle de tags e preferências para marketing e privacidade.
