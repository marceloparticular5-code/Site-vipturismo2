# Prompt Completo e Detalhado: Site de Agência de Turismo Moderna

> **Documento de Especificação & Engenharia de Prompts**
> Destinado para geração e evolução em ferramentas como Claude Code, Lovable, v0, Cursor e AI Studio.

---

## 1. Visão Geral do Projeto
Crie um site completo para uma agência de turismo receptivo e emissivo de alto padrão, moderno, responsivo e focado em alta conversão de vendas, com as seguintes características:

---

## 2. Design & UX
- **Visual Moderno & Clean**: Inspirado em plataformas líderes globais (Booking.com, Decolar, Airbnb Experiences), com paleta vibrante e sofisticada (tons de azul turquesa, verde tropical e dourado de luxo).
- **Hero Section com Busca Rápida**:
  - Filtro por destino, período (datas de check-in e check-out) e número de viajantes/hóspedes.
  - Gatilhos mentais visíveis de segurança, escassez e satisfação garantida.
- **Animações Suaves**: Transições fluidas em microinterações, dark mode nativo e arquitetura estritamente *mobile-first*.
- **Galeria de Destinos**: Fotos em alta definição com suporte a vídeos curtos, badges de categoria e destaques da tábua de maré.

---

## 3. Funcionalidades Principais
- **Catálogo de Pacotes Turísticos (Nacional/Internacional)**:
  - Filtros dinâmicos por faixa de preço, duração, categoria (mergulho, buggy, cultural, aventura) e região geográfica.
- **Página de Destino & Detalhes**:
  - Itinerário detalhado dia a dia, paradas fotográficas, equipamentos inclusos e orientações práticas.
  - **Mapa Interativo**: Pontos de partida, bases náuticas, recifes de corais, traçado de rotas terrestres e náuticas, com pop-ups e busca instantânea de pontos de interesse.
  - Avaliações e depoimentos reais verificados com pontuação de estrelas.
- **Motor de Busca e Apoio Hoteleiro**:
  - Recomendações de hotéis e resorts próximos das bases de embarque (Ponta Negra, Via Costeira).
- **Sistema de Reservas Online**:
  - Seleção de datas, horários favoráveis de maré baixa, número de passageiros e adicionais (GoPro subaquática, batismo de mergulho, transfer privativo).
- **Carrinho de Compras Multi-Pacote**:
  - Possibilidade de combinar múltiplos passeios com descontos progressivos em combo VIP.
- **Área "Monte Seu Pacote"**:
  - Roteiro flexível e personalizável (passeios + transfer + experiências exclusivas).
- **Sistema de Cupons & Promoções**:
  - Cupons de desconto por tempo limitado com cálculo instantâneo.

---

## 4. Autoatendimento VIP (Self-Service)
- **Área do Cliente**:
  - Histórico de reservas, status do pagamento, consulta por código ou e-mail, e download imediato de vouchers com QR Code.
- **Cancelamento & Remarcação Flexível**:
  - Regras de cancelamento claras com garantia contra imprevistos climáticos e condições da maré.
- **Central de Ajuda & FAQ Dinâmico**:
  - Dúvidas frequentes sobre tábua de maré, idade mínima para mergulho e pontos de encontro.
- **Notificações Automáticas**:
  - Confirmação imediata por e-mail com arquivo de calendário (`.ics`) e sincronização no Google Calendar.

---

## 5. Gateway de Pagamento & Checkout
- **Integração Multimeios**:
  - Suporte a PIX com desconto instantâneo, Cartão de Crédito em até 12x e Boleto Bancário.
- **One-Page Checkout**:
  - Etapa única e descomplicada, priorizando conversão rápida e campos essenciais.
- **Emissão Automática de Recibo/Comprovante**:
  - Vouchers nominais criptografados com validação por código localizador.

---

## 6. Chatbot com IA & Atendimento Pessoal
- **Assistente Virtual Flutuante 24/7**:
  - Botão redondo no canto inferior direito com selo "Online agora".
  - Paleta azul turquesa e dourado com animação suave e autoabertura após 8 segundos.
- **Fluxo Guiado com Botões Clicáveis**:
  1. *Boas-vindas*: Oferta dos melhores atrativos e alerta de poucas vagas.
  2. *Datas de Entrada e Saída*: Seletor intuitivo.
  3. *Número de Hóspedes*: Solo, Casal, Família ou Grupo VIP.
  4. *Motivo da Viagem*: Lazer, Família, Romance/Casal ou Trabalho.
  5. *Resumo com Gatilhos*: "Últimas vagas para essas datas com a maré ideal".
  6. *CTA Dourado*: "RESERVAR NO WHATSAPP" direcionado para atendimento humano com mensagem pré-formatada.
- **Captura Automática de Leads**:
  - Registro de leads no CRM administrativo (Firestore/LocalStorage).

---

## 7. Sistema de Imagens (Upload Direto de Arquivos)
Substituição completa de inserção de links externos por gerenciamento nativo de uploads:

- **Upload Local com Drag & Drop**:
  - Seleção manual de arquivos e arrastar e soltar (drag-and-drop) direto do computador ou smartphone.
- **Múltiplos Arquivos Simultâneos**:
  - Envio de várias fotos de uma vez para montagem de galerias de roteiros.
- **Pré-visualização Instantânea**:
  - Miniaturas com indicação da foto principal, botão de visualização em tela cheia e exclusão individual.
- **Validação Rigorosa**:
  - Formatos aceitos: **JPG, JPEG, PNG e WEBP**.
  - Tamanho máximo configurado: **5 MB por arquivo**, com alertas claros na interface.
- **Compressão & Redimensionamento Automáticos**:
  - Processamento no cliente via Canvas HTML5 para no máximo **1200 px de largura**, otimizando a velocidade de carregamento.
- **Armazenamento no Servidor**:
  - Armazenamento em diretório estático seguro (`/public/uploads/`) através de endpoint dedicado (`POST /api/upload`) com geração automática de URLs internas.
- **Barra de Progresso em Tempo Real**:
  - Indicador visual animado (0% a 100%) reportando as etapas de validação, compressão e gravação no servidor.
- **Gestão no Painel Administrativo**:
  - Botão destacado **"Enviar arquivo(s)"**, definição de foto de capa, substituição e remoção com um clique.

---

## 8. Integração de Avaliações (Google + TripAdvisor) em Slide
Implemente uma seção de **carrossel/slide de avaliações** na home do site, exibindo os depoimentos reais dos clientes vindos do Google e do TripAdvisor:

- **Carrossel Automático (Autoplay)**:
  - Transição suave, pausa inteligente ao passar o mouse ou toque (*touch*), e setas/dots para navegação manual.
- **Estrutura dos Slides**:
  - Nome do cliente, foto/avatar (ou inicial estilizada), nota em estrelas (4 ou 5 estrelas), texto do depoimento e ícone da plataforma de origem (**Google Reviews** ou **TripAdvisor**).
- **Busca e Sincronização via API**:
  - **Google**: Google Places API (*Place Details* – campo `reviews`).
  - **TripAdvisor**: TripAdvisor Content API.
- **Atualização Periódica em Cache**:
  - Cache de 24 horas no servidor para otimização de requisições e evitar sobrecarga nas APIs.
- **Filtro de Qualidade**:
  - Exibição exclusiva de avaliações de **4 e 5 estrelas**.
- **Badge Consolidado de Prova Social**:
  - Nota média consolidada (ex: **4.9 ★**), volume total de avaliações e selo de *"Avaliação Verificada"*.
- **Ações de Conversão (CTAs)**:
  - *"Veja todas as avaliações no Google"*, *"Ver perfil no TripAdvisor"* e modal interativo *"Deixe sua avaliação"*.
- **Totalmente Responsivo**:
  - Carrossel horizontal multi-card no desktop e swipe fluido no mobile.
- **Fallback Resiliente**:
  - Exibição de avaliações auditadas e verificadas caso ocorra qualquer indisponibilidade temporária de rede ou APIs externas.

---

## 9. Painel Administrativo VIP
- **Dashboard de Gestão**:
  - Controle de passeios cadastrados, preços originais e promocionais, lotação de vagas e disponibilidade.
  - Tabela de reservas recebidas e lista de leads do chatbot para remarketing.
- **Sincronização em Nuvem**:
  - Banco de dados Firestore com suporte a fallback resiliente em cache local.

---

## 10. Stack Tecnológica Recomendada
- **Frontend**: React 19 / Next.js com Vite e Tailwind CSS 4.
- **Mapas**: Leaflet / OpenStreetMap com tiles CartoDB Voyager.
- **Backend**: Node.js / Express integrado.
- **Banco de Dados**: Firebase Firestore / PostgreSQL.
- **IA**: Google Gemini API (@google/genai).
- **Tipagem & Qualidade**: TypeScript estrito com ESLint e verificação contínua.
