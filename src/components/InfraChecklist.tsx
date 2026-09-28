import React, { useState, useMemo } from 'react';
import {
  FileText,
  ShieldCheck,
  Wifi,
  Wallet,
  CheckCircle2,
  Circle,
  Sparkles,
  AlertCircle,
  Share2,
  RotateCcw,
  CheckCheck,
  Search,
  ExternalLink,
  Info,
  Calendar,
  Smartphone,
  Luggage,
  Award,
  Coins,
} from 'lucide-react';
import { InfraCategory, InfraChecklistTask, StudentProfile } from '../types';
import { CurrencyExchangeWidget } from './CurrencyExchangeWidget';

export const DEFAULT_INFRA_TASKS: InfraChecklistTask[] = [
  // 1. VISTOS & DOCUMENTAÇÃO
  {
    id: 'visto-doc-identidade',
    category: 'vistos',
    title: 'Documento Oficial com Foto Atualizado',
    description: 'RG com menos de 10 anos de emissão, CNH Digital válida ou Passaporte em vigor.',
    requiredFor: 'Obrigatório para embarque aéreo e conferência na Capitania dos Portos / lanchas VIP.',
    tip: 'Tenha o documento físico em mãos e também cópia digital salva no celular.',
  },
  {
    id: 'visto-estudante-turismo',
    category: 'vistos',
    title: 'Comprovante Estudante / Intercâmbio & Visto',
    description: 'Carteirinha DNE/ISIC válida para meia-entrada em atrativos culturais, e visto/autorização de entrada para estrangeiros.',
    requiredFor: 'Descontos legais em passeios culturais e conformidade migratória da Polícia Federal.',
    tip: 'Estudantes garantem até 50% de desconto em memoriais e entradas de parques no RN.',
  },
  {
    id: 'visto-comprovante-voo',
    category: 'vistos',
    title: 'Bilhetes Aéreos & Check-in Antecipado (NAT)',
    description: 'Confirmação do voo de ida e volta para o Aeroporto Internacional de Natal (Aluízio Alves).',
    requiredFor: 'Sincronização com o horário do transfer receptivo do aeroporto para Ponta Negra/Via Costeira.',
    tip: 'Realize o check-in no app da cia aérea 48h antes e adicione o cartão de embarque à carteira digital.',
  },
  {
    id: 'visto-voucher-hotel',
    category: 'vistos',
    title: 'Vouchers de Hospedagem & Contrato de Locação',
    description: 'Confirmação da reserva do hotel, resort ou pousada em Ponta Negra com endereço completo.',
    requiredFor: 'Necessário para definir o ponto de coleta porta a porta dos buggies e vans.',
    tip: 'Informe à recepção do hotel que você fará passeios matinais para anteciparem seu café se necessário.',
  },

  // 2. SEGURO & SAÚDE
  {
    id: 'seguro-viagem-nacional',
    category: 'seguro',
    title: 'Seguro Viagem com Cobertura Médica Hospitalar',
    description: 'Apólice de seguro viagem com telemedicina 24h, despesas médicas e translado de emergência.',
    requiredFor: 'Tranquilidade total contra imprevistos de saúde longe de casa.',
    tip: 'Muitos cartões de crédito Black/Infinite oferecem seguro viagem gratuito ao pagar a passagem.',
  },
  {
    id: 'seguro-esportes-aquaticos',
    category: 'seguro',
    title: 'Cobertura para Ecoturismo & Mergulho',
    description: 'Verificação de cláusula de cobertura para passeios em mar aberto, parrachos e trilhas 4x4.',
    requiredFor: 'Práticas de mergulho livre (snorkelling) e autônomo (cilindro) nos corais de Maracajaú.',
    tip: 'A frota da Natal Vip Turismo possui seguro de responsabilidade civil para passageiros, mas o seguro individual complementa.',
  },
  {
    id: 'seguro-farmacia-remedios',
    category: 'seguro',
    title: 'Farmácia Pessoal & Remédio para Enjoo',
    description: 'Kit com Dramin/Vonau para navegação de lancha, analgésicos, protetor solar FPS 50+ e repelente.',
    requiredFor: 'Garantir bem-estar nos trajetos de lancha rápida até os parrachos a 7km da costa.',
    tip: 'Tome o comprimido contra enjoo 40 minutos antes do embarque na marina.',
  },
  {
    id: 'seguro-contatos-emergencia',
    category: 'seguro',
    title: 'Contatos de Emergência & SOS Cadastrados',
    description: 'Telefone 0800 do seguro saúde, contato do Consultor Marcelo VIP e familiares adicionados aos favoritos.',
    requiredFor: 'Acionamento ágil em qualquer situação fora do hotel.',
    tip: 'Salve o WhatsApp da Natal Vip Turismo (+55 84 98825-6545) com estrela de favorito.',
  },

  // 3. CONECTIVIDADE & TECNOLOGIA
  {
    id: 'conectividade-esim',
    category: 'conectividade',
    title: 'Chip 4G/5G Local ou eSIM Ativo',
    description: 'Plano de telefonia móvel com dados de alta velocidade compatível com as operadoras Claro, Vivo ou TIM.',
    requiredFor: 'Comunicação direta com o bugueiro no dia do passeio e localização via GPS.',
    tip: 'Claro e Vivo possuem a melhor cobertura nas dunas de Genipabu e praias do litoral sul.',
  },
  {
    id: 'conectividade-powerbank',
    category: 'conectividade',
    title: 'Power Bank (Bateria Portátil) Carregado',
    description: 'Carregador portátil de 10.000mAh a 20.000mAh com cabos compatíveis para celular e câmeras.',
    requiredFor: 'Roteiros de dia inteiro (8h às 17h) sem acesso a tomadas nas praias desertas.',
    tip: 'Lembre-se de levar o power bank na bagagem de mão, pois companhias aéreas proíbem no porão.',
  },
  {
    id: 'conectividade-app-mare',
    category: 'conectividade',
    title: 'Tábua de Maré & Vouchers Salvos Offline',
    description: 'Download em PDF dos vouchers e print dos horários de maré baixa dos dias da sua estadia.',
    requiredFor: 'Acesso às informações mesmo em pontos isolados sem sinal nas falésias e lagoas.',
    tip: 'Você pode consultar a tábua de maré interativa 2026 diretamente no nosso site a qualquer hora.',
  },
  {
    id: 'conectividade-capa-impermeavel',
    category: 'conectividade',
    title: 'Bolsa Estanque Impermeável para Celular',
    description: 'Capa transparente certificada IPX8 com cordão para fotos subaquáticas e proteção contra areia.',
    requiredFor: 'Proteger smartphones durante a subida nos corais e travessias de balsa e buggy.',
    tip: 'Faça o teste do papel toalha dentro da capa na pia do hotel antes de entrar na água salgada.',
  },

  // 4. FINANÇAS & PAGAMENTOS
  {
    id: 'financas-pix-banco',
    category: 'financas',
    title: 'PIX e Apps Bancários Habilitados',
    description: 'Biometria e limite diário de PIX configurados no celular para pagamentos rápidos no RN.',
    requiredFor: 'Quitação com desconto exclusivo à vista de passeios, refeições e consumações à beira-mar.',
    tip: 'Praticamente 99% das barracas e lanchonetes de praia em Natal aceitam PIX instantâneo.',
  },
  {
    id: 'financas-cartao-aviso',
    category: 'financas',
    title: 'Aviso Viagem nos Cartões de Crédito',
    description: 'Notificação de viagem nacional ou internacional no app do banco para evitar bloqueios automáticos.',
    requiredFor: 'Parcelamento em até 12x de passeios e pagamento de despesas de hotel sem constrangimento.',
    tip: 'Habilite a aproximação (contactless) e leve ao menos dois cartões de bandeiras diferentes (Visa/Master).',
  },
  {
    id: 'financas-dinheiro-especie',
    category: 'financas',
    title: 'Dinheiro em Espécie Trocado (R$ 150 a R$ 300)',
    description: 'Cédulas de R$ 10, R$ 20 e R$ 50 para pequenas despesas locais.',
    requiredFor: 'Taxas de preservação ambiental locais, balsas rurais, cocos na praia e gorjetas a guias.',
    tip: 'Nem todas as balsas manuais ou ambulantes de artesanato têm sinal de maquininha de cartão estável.',
  },
  {
    id: 'financas-orcamento-alimentacao',
    category: 'financas',
    title: 'Orçamento Planejado para Gastronomia e Extras',
    description: 'Previsão de R$ 100 a R$ 180/dia por pessoa para almoços de frutos do mar e bebidas refrescantes.',
    requiredFor: 'Aproveitar os melhores restaurantes de Natal (Camarões Potiguar, Tábua de Carne e Na Fogueira).',
    tip: 'Os pratos de camarão e peixe grelhado em Natal são muito bem servidos e normalmente alimentam 2 a 3 pessoas.',
  },
  {
    id: 'financas-cambio-moeda',
    category: 'financas',
    title: 'Câmbio de Moeda & Cartão Internacional (USD / EUR)',
    description: 'Cartão internacional de débito multimoeda (Wise, Nomad ou Revolut) ou troca prévia de Dólar/Euro para Real.',
    requiredFor: 'Indispensável para turistas estrangeiros realizarem pagamentos sem taxas abusivas de conversão em Natal RN.',
    tip: 'Consulte o widget de Cotação Cambial VIP logo acima para simular e conferir cotações em tempo real do Dólar e Euro.',
  },
];

interface InfraChecklistProps {
  student: StudentProfile;
  onUpdateStudent: (updatedStudent: StudentProfile) => void;
  onOpenBooking?: () => void;
  className?: string;
}

export const InfraChecklist: React.FC<InfraChecklistProps> = ({
  student,
  onUpdateStudent,
  onOpenBooking,
  className = '',
}) => {
  const [activeCategory, setActiveCategory] = useState<InfraCategory | 'todos'>(
    student.lastActiveTab || 'todos'
  );
  const [filterStatus, setFilterStatus] = useState<'todos' | 'pendentes' | 'concluidos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(Boolean(student.notes));
  const [notesText, setNotesText] = useState(student.notes || '');

  const progress = student.checklistProgress || {};

  // Toggle a single task
  const handleToggleTask = (taskId: string) => {
    const nextProgress = {
      ...progress,
      [taskId]: !progress[taskId],
    };

    onUpdateStudent({
      ...student,
      checklistProgress: nextProgress,
      updatedAt: new Date().toISOString(),
    });
  };

  // Mark all current visible tasks
  const handleMarkAllVisible = (checked: boolean) => {
    const nextProgress = { ...progress };
    filteredTasks.forEach((task) => {
      nextProgress[task.id] = checked;
    });

    onUpdateStudent({
      ...student,
      checklistProgress: nextProgress,
      updatedAt: new Date().toISOString(),
    });
  };

  // Reset all tasks
  const handleResetChecklist = () => {
    if (window.confirm('Deseja reiniciar todo o checklist de infraestrutura?')) {
      onUpdateStudent({
        ...student,
        checklistProgress: {},
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Save notes
  const handleSaveNotes = () => {
    onUpdateStudent({
      ...student,
      notes: notesText,
      updatedAt: new Date().toISOString(),
    });
  };

  // Change active tab
  const handleCategoryChange = (cat: InfraCategory | 'todos') => {
    setActiveCategory(cat);
    onUpdateStudent({
      ...student,
      lastActiveTab: cat,
    });
  };

  // Total stats
  const totalTasksCount = DEFAULT_INFRA_TASKS.length;
  const completedTasksCount = DEFAULT_INFRA_TASKS.filter((t) => progress[t.id]).length;
  const percentCompleted = Math.round((completedTasksCount / totalTasksCount) * 100);

  // Category stats
  const categoryStats = useMemo(() => {
    const cats: InfraCategory[] = ['vistos', 'seguro', 'conectividade', 'financas'];
    const result: Record<InfraCategory, { total: number; done: number; percent: number }> = {
      vistos: { total: 0, done: 0, percent: 0 },
      seguro: { total: 0, done: 0, percent: 0 },
      conectividade: { total: 0, done: 0, percent: 0 },
      financas: { total: 0, done: 0, percent: 0 },
    };

    cats.forEach((cat) => {
      const items = DEFAULT_INFRA_TASKS.filter((t) => t.category === cat);
      const done = items.filter((t) => progress[t.id]).length;
      result[cat] = {
        total: items.length,
        done,
        percent: items.length > 0 ? Math.round((done / items.length) * 100) : 0,
      };
    });

    return result;
  }, [progress]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return DEFAULT_INFRA_TASKS.filter((task) => {
      // Category filter
      if (activeCategory !== 'todos' && task.category !== activeCategory) {
        return false;
      }

      // Status filter
      const isDone = Boolean(progress[task.id]);
      if (filterStatus === 'pendentes' && isDone) return false;
      if (filterStatus === 'concluidos' && !isDone) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = task.description.toLowerCase().includes(q);
        const matchesReq = task.requiredFor.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesReq) return false;
      }

      return true;
    });
  }, [activeCategory, filterStatus, searchQuery, progress]);

  // Category visual metadata
  const categoryConfig: Record<
    InfraCategory,
    { label: string; icon: React.FC<{ className?: string }>; color: string; bg: string }
  > = {
    vistos: {
      label: 'Vistos & Docs',
      icon: FileText,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/30',
    },
    seguro: {
      label: 'Seguro & Saúde',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
    },
    conectividade: {
      label: 'Conectividade',
      icon: Wifi,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/30',
    },
    financas: {
      label: 'Finanças & PIX',
      icon: Wallet,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
    },
  };

  return (
    <section
      id="infra-checklist"
      className={`py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20 ${className}`}
    >
      {/* Top Header Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0B172A] via-[#091527] to-[#050C16] border border-amber-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden mb-10">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
                <Luggage className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Planejamento de Viagem 2026</span>
              </div>

              <a
                href="#cambio-widget"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-bold transition-all"
              >
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>Câmbio USD / EUR ao Vivo</span>
              </a>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-['Cinzel',serif]">
              Checklist de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
                Infraestrutura
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Garanta que sua viagem para Natal ocorra sem qualquer atrito. Marque cada tarefa dos 4
              pilares essenciais: <strong>Vistos & Documentação</strong>, <strong>Seguro</strong>,{' '}
              <strong>Conectividade</strong> e <strong>Finanças</strong>. Seu progresso fica salvo
              automaticamente no seu perfil!
            </p>

            {student.name && (
              <div className="mt-3 text-xs text-amber-300/80 font-medium">
                Viajante / Estudante cadastrado: <strong className="text-amber-200">{student.name}</strong>
              </div>
            )}
          </div>

          {/* Progress Circular / Summary Box */}
          <div className="bg-[#050C16]/85 border border-amber-400/30 rounded-2xl p-5 sm:p-6 min-w-[280px] shadow-xl backdrop-blur-md shrink-0">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
                  Prontidão da Viagem
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-3xl font-black text-amber-400 font-mono">
                    {percentCompleted}%
                  </span>
                  <span className="text-xs text-slate-400">concluído</span>
                </div>
              </div>

              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-lg ${
                  percentCompleted === 100
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                    : 'bg-amber-400 text-slate-950 shadow-amber-500/20'
                }`}
              >
                {percentCompleted === 100 ? (
                  <Award className="w-6 h-6 animate-bounce" />
                ) : (
                  <Sparkles className="w-6 h-6" />
                )}
              </div>
            </div>

            {/* Linear Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${percentCompleted}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>
                <strong>{completedTasksCount}</strong> de {totalTasksCount} tarefas
              </span>
              <span className="font-semibold text-amber-300">
                {percentCompleted === 100 ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-black">
                    <CheckCheck className="w-3.5 h-3.5" /> 100% Pronto!
                  </span>
                ) : (
                  `${totalTasksCount - completedTasksCount} pendentes`
                )}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Pillars Quick Mini Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800/80">
          {(['vistos', 'seguro', 'conectividade', 'financas'] as InfraCategory[]).map((cat) => {
            const conf = categoryConfig[cat];
            const Icon = conf.icon;
            const stats = categoryStats[cat];
            const isDone = stats.done === stats.total;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer group ${
                  activeCategory === cat
                    ? 'bg-slate-800/90 border-amber-400/60 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${conf.bg} ${conf.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {stats.done}/{stats.total}
                  </span>
                </div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  {conf.label}
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1 mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isDone ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${stats.percent}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Currency Exchange & Quotes Widget for Foreign & Domestic Tourists */}
      <div id="cambio-widget" className="scroll-mt-28">
        <CurrencyExchangeWidget className="mb-10" />
      </div>

      {/* Control Bar: Categories, Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Category Pill Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-[#091527] border border-slate-800 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategoryChange('todos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'todos'
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Todas ({totalTasksCount})
          </button>
          {(['vistos', 'seguro', 'conectividade', 'financas'] as InfraCategory[]).map((cat) => {
            const conf = categoryConfig[cat];
            const Icon = conf.icon;
            const stats = categoryStats[cat];
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : conf.color}`} />
                <span>{conf.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-slate-950/20 text-slate-950 font-mono' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {stats.done}/{stats.total}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Search Bar */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar item ou requisito..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#091527] border border-slate-800 focus:border-amber-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>

          {/* Status Filter Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#091527] border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setFilterStatus('todos')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterStatus === 'todos'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('pendentes')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterStatus === 'pendentes'
                  ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pendentes
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('concluidos')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                filterStatus === 'concluidos'
                  ? 'bg-emerald-400/20 text-emerald-300 font-bold border border-emerald-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Concluídos
            </button>
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleResetChecklist}
            className="p-2 rounded-xl bg-[#091527] hover:bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-800 transition-colors"
            title="Reiniciar checklist"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task List Grid */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#091527]/70 border border-slate-800">
            <AlertCircle className="w-10 h-10 text-amber-400/60 mx-auto mb-3" />
            <h4 className="text-white font-bold text-base">Nenhum item encontrado</h4>
            <p className="text-slate-400 text-xs mt-1">
              Tente ajustar os filtros de categoria ou limpar a busca.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('todos');
                setFilterStatus('todos');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors"
            >
              Exibir todas as tarefas
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = Boolean(progress[task.id]);
            const conf = categoryConfig[task.category];
            const Icon = conf.icon;

            return (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-4 ${
                  isDone
                    ? 'bg-[#091527]/50 border-emerald-500/30 hover:border-emerald-400/60 opacity-90'
                    : 'bg-[#0B172A] border-slate-800 hover:border-amber-400/50 hover:bg-[#0D1C33] shadow-md'
                }`}
              >
                {/* Custom Checkbox */}
                <button
                  type="button"
                  aria-label={isDone ? `Desmarcar ${task.title}` : `Marcar ${task.title}`}
                  className={`mt-0.5 shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'border-2 border-slate-600 group-hover:border-amber-400 bg-slate-900'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span className="w-2 h-2 rounded-sm bg-transparent group-hover:bg-amber-400/40" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${conf.bg} ${conf.color}`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{conf.label}</span>
                    </span>

                    <h4
                      className={`text-sm sm:text-base font-bold transition-colors ${
                        isDone ? 'text-slate-400 line-through' : 'text-white group-hover:text-amber-300'
                      }`}
                    >
                      {task.title}
                    </h4>
                  </div>

                  <p
                    className={`text-xs leading-relaxed mt-1 ${
                      isDone ? 'text-slate-500' : 'text-slate-300'
                    }`}
                  >
                    {task.description}
                  </p>

                  {/* Why it is required */}
                  <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-amber-300/80 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                    <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-amber-200">Requisito:</strong> {task.requiredFor}
                    </span>
                  </div>

                  {/* Travel Tip */}
                  {task.tip && (
                    <div className="mt-1.5 text-[11px] text-slate-400 italic">
                      💡 <strong>Dica VIP:</strong> {task.tip}
                    </div>
                  )}
                </div>

                {/* Status Indicator Tag */}
                <div className="shrink-0 hidden sm:block">
                  {isDone ? (
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Concluído
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      Pendente
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Traveler Notes & Persistence Box */}
      <div className="mt-8 bg-gradient-to-br from-[#091527] to-[#070E1A] border border-slate-800 hover:border-amber-400/40 rounded-3xl p-6 transition-all">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Luggage className="w-4 h-4 text-amber-400" />
            <h4 className="text-white font-bold text-sm">
              Anotações & Observações da sua Infraestrutura
            </h4>
          </div>

          <button
            type="button"
            onClick={() => setShowNotesInput(!showNotesInput)}
            className="text-xs text-amber-300 hover:text-amber-200 underline font-semibold"
          >
            {showNotesInput ? 'Recolher notas' : 'Adicionar notas'}
          </button>
        </div>

        {showNotesInput ? (
          <div className="space-y-3">
            <textarea
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Ex: Número da apólice do seguro, operadora do eSIM (Vivo), voo de volta às 18h no dia 15..."
              rows={3}
              className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-amber-400 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Salvo com persistência no objeto student em App.tsx.
              </span>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-md cursor-pointer"
              >
                Salvar Anotações
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            {student.notes
              ? `Nota salva: "${student.notes}"`
              : 'Clique em "Adicionar notas" para registrar dados de voos, apólices ou lembretes.'}
          </p>
        )}
      </div>

      {/* Completion Banner CTA */}
      {percentCompleted === 100 && (
        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-emerald-900/40 to-slate-900 border border-emerald-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-white font-black text-lg">
                Parabéns! Sua infraestrutura de viagem está 100% pronta!
              </h4>
              <p className="text-emerald-300/90 text-xs mt-1">
                Documentação, seguro, conectividade e finanças organizados. Agora é só curtir as dunas
                e as águas cristalinas de Natal RN.
              </p>
            </div>
          </div>

          {onOpenBooking && (
            <button
              type="button"
              onClick={onOpenBooking}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all hover:scale-105 shrink-0 cursor-pointer"
            >
              Garantir Passeios VIP Agora
            </button>
          )}
        </div>
      )}
    </section>
  );
};
