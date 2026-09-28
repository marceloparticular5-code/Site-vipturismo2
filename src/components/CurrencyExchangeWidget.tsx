import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowRightLeft,
  Coins,
  Globe2,
  Info,
  CreditCard,
  Building2,
  CheckCircle2,
  Calculator,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface CurrencyData {
  code: string;
  codein: string;
  name: string;
  high: string;
  low: string;
  varBid: string;
  pctChange: string;
  bid: string;
  ask: string;
  timestamp: string;
  create_date: string;
}

interface ExchangeRates {
  USDBRL: CurrencyData;
  EURBRL: CurrencyData;
}

// Resilient default rates for Natal RN foreign tourism
const FALLBACK_RATES: ExchangeRates = {
  USDBRL: {
    code: 'USD',
    codein: 'BRL',
    name: 'Dólar Americano/Real Brasileiro',
    high: '5.68',
    low: '5.60',
    varBid: '0.015',
    pctChange: '0.27',
    bid: '5.6520',
    ask: '5.6560',
    timestamp: String(Math.floor(Date.now() / 1000)),
    create_date: new Date().toISOString(),
  },
  EURBRL: {
    code: 'EUR',
    codein: 'BRL',
    name: 'Euro/Real Brasileiro',
    high: '6.18',
    low: '6.09',
    varBid: '0.022',
    pctChange: '0.36',
    bid: '6.1450',
    ask: '6.1490',
    timestamp: String(Math.floor(Date.now() / 1000)),
    create_date: new Date().toISOString(),
  },
};

interface CurrencyExchangeWidgetProps {
  className?: string;
}

export const CurrencyExchangeWidget: React.FC<CurrencyExchangeWidgetProps> = ({
  className = '',
}) => {
  const [rates, setRates] = useState<ExchangeRates>(FALLBACK_RATES);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Hoje');
  const [isLive, setIsLive] = useState<boolean>(false);

  // Conversion calculator state
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR'>('USD');
  const [foreignAmount, setForeignAmount] = useState<string>('100');
  const [brlAmount, setBrlAmount] = useState<string>('');
  const [direction, setDirection] = useState<'foreignToBrl' | 'brlToForeign'>('foreignToBrl');
  const [showTips, setShowTips] = useState<boolean>(false);

  // Fetch live exchange rates
  const fetchRates = async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.USDBRL && data.EURBRL) {
          setRates({
            USDBRL: data.USDBRL,
            EURBRL: data.EURBRL,
          });
          setIsLive(true);
          const now = new Date();
          setLastUpdated(
            now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          );
        }
      }
    } catch {
      // Fallback silently if offline or blocked
      setIsLive(false);
      setLastUpdated('Cotação de referência');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const activeRateData = selectedCurrency === 'USD' ? rates.USDBRL : rates.EURBRL;
  const currentRateNumber = parseFloat(activeRateData.bid) || (selectedCurrency === 'USD' ? 5.65 : 6.15);

  // Calculate live conversion
  const computedBrl = (parseFloat(foreignAmount) || 0) * currentRateNumber;
  const computedForeign = (parseFloat(brlAmount) || 0) / currentRateNumber;

  const handleForeignChange = (val: string) => {
    setForeignAmount(val);
    const num = parseFloat(val) || 0;
    setBrlAmount((num * currentRateNumber).toFixed(2));
    setDirection('foreignToBrl');
  };

  const handleBrlChange = (val: string) => {
    setBrlAmount(val);
    const num = parseFloat(val) || 0;
    setForeignAmount((num / currentRateNumber).toFixed(2));
    setDirection('brlToForeign');
  };

  const setPreset = (amount: number) => {
    setForeignAmount(amount.toString());
    setBrlAmount((amount * currentRateNumber).toFixed(2));
    setDirection('foreignToBrl');
  };

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const formatRate = (rateStr: string) => {
    const num = parseFloat(rateStr);
    return isNaN(num) ? '5.65' : num.toFixed(2).replace('.', ',');
  };

  const usdVariation = parseFloat(rates.USDBRL.pctChange) || 0;
  const eurVariation = parseFloat(rates.EURBRL.pctChange) || 0;

  return (
    <div
      className={`rounded-3xl bg-gradient-to-br from-[#0B172A] via-[#091527] to-[#050C16] border border-amber-500/30 p-5 sm:p-7 shadow-2xl relative overflow-hidden ${className}`}
    >
      {/* Background ambient decorative glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2 font-['Cinzel',serif]">
                Câmbio & Cotação VIP
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {isLive ? 'Tempo Real' : 'Referência'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cotação Dólar (USD) & Euro (EUR) para Real (BRL) para viajantes e turistas internacionais
            </p>
          </div>
        </div>

        {/* Action Button: Refresh */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 hidden md:inline">
            {lastUpdated && `Atualizado: ${lastUpdated}`}
          </span>
          <button
            type="button"
            onClick={fetchRates}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-all cursor-pointer disabled:opacity-50"
            title="Atualizar cotações cambiais"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Rates Cards + Converter */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Left Column: Live Exchange Cards (USD & EUR) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {/* USD Card */}
          <div
            onClick={() => setSelectedCurrency('USD')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
              selectedCurrency === 'USD'
                ? 'bg-[#0D1E38] border-amber-400 shadow-lg shadow-amber-500/10'
                : 'bg-[#091527]/80 border-slate-800 hover:border-slate-700 hover:bg-[#0B1A2F]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  $
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-white">Dólar Americano</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      USD / BRL
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Moeda dos Estados Unidos</span>
                </div>
              </div>

              {/* Variation Badge */}
              <div
                className={`flex items-center gap-0.5 text-xs font-mono font-bold px-2 py-0.5 rounded-lg ${
                  usdVariation >= 0
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                }`}
              >
                {usdVariation >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>{usdVariation >= 0 ? `+${usdVariation}%` : `${usdVariation}%`}</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-3 pt-3 border-t border-slate-800/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Cotação Comercial (1 USD)
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    R$ {formatRate(rates.USDBRL.bid)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">BRL</span>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400">
                <div>
                  Máx: <strong className="text-slate-300 font-mono">R$ {formatRate(rates.USDBRL.high)}</strong>
                </div>
                <div>
                  Mín: <strong className="text-slate-300 font-mono">R$ {formatRate(rates.USDBRL.low)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* EUR Card */}
          <div
            onClick={() => setSelectedCurrency('EUR')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
              selectedCurrency === 'EUR'
                ? 'bg-[#0D1E38] border-amber-400 shadow-lg shadow-amber-500/10'
                : 'bg-[#091527]/80 border-slate-800 hover:border-slate-700 hover:bg-[#0B1A2F]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
                  €
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-white">Euro Europeu</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      EUR / BRL
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Moeda da União Europeia</span>
                </div>
              </div>

              {/* Variation Badge */}
              <div
                className={`flex items-center gap-0.5 text-xs font-mono font-bold px-2 py-0.5 rounded-lg ${
                  eurVariation >= 0
                    ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                }`}
              >
                {eurVariation >= 0 ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>{eurVariation >= 0 ? `+${eurVariation}%` : `${eurVariation}%`}</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between mt-3 pt-3 border-t border-slate-800/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Cotação Comercial (1 EUR)
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                    R$ {formatRate(rates.EURBRL.bid)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">BRL</span>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400">
                <div>
                  Máx: <strong className="text-slate-300 font-mono">R$ {formatRate(rates.EURBRL.high)}</strong>
                </div>
                <div>
                  Mín: <strong className="text-slate-300 font-mono">R$ {formatRate(rates.EURBRL.low)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Cotação interbancária comercial. Em casas de câmbio físicas ou cartões, pode incidir
              spread cambial de 2% a 4% e IOF de 1,1% a 3,38%.
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Conversor & Presets */}
        <div className="lg:col-span-7 bg-[#091527] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-extrabold text-white">
                  Conversor Rápido de Viagem
                </h4>
              </div>

              {/* Currency Toggle Buttons */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedCurrency('USD')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCurrency === 'USD'
                      ? 'bg-amber-400 text-slate-950 font-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCurrency('EUR')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedCurrency === 'EUR'
                      ? 'bg-amber-400 text-slate-950 font-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EUR (€)
                </button>
              </div>
            </div>

            {/* Input Converter Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Foreign Currency Input */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-amber-400 transition-colors">
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Valor em {selectedCurrency === 'USD' ? 'Dólares (USD)' : 'Euros (EUR)'}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-amber-400">
                    {selectedCurrency === 'USD' ? '$' : '€'}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={foreignAmount}
                    onChange={(e) => handleForeignChange(e.target.value)}
                    placeholder="100"
                    className="w-full bg-transparent text-lg font-black text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* BRL Real Brasileiro Input */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-amber-400 transition-colors">
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Equivalente em Reais (BRL)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-emerald-400">R$</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={brlAmount || (parseFloat(foreignAmount) * currentRateNumber).toFixed(2)}
                    onChange={(e) => handleBrlChange(e.target.value)}
                    placeholder="565.00"
                    className="w-full bg-transparent text-lg font-black text-white focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Conversion Result Highlight */}
            <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent border border-amber-500/20 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">
                {selectedCurrency === 'USD' ? '$' : '€'}{' '}
                {parseFloat(foreignAmount) || 0} equivalem a aproximadamente:
              </span>
              <span className="text-base sm:text-lg font-black text-amber-300 font-mono">
                {formatBRL(computedBrl)}
              </span>
            </div>

            {/* Quick Tour Presets */}
            <div className="mt-3">
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                Valores frequentes em passeios de Natal VIP:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { val: 50, label: 'Alimentação / Praia' },
                  { val: 100, label: 'Mergulho Parrachos' },
                  { val: 250, label: 'Combo Buggy VIP' },
                  { val: 500, label: 'Roteiro Completo' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setPreset(item.val)}
                    className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/50 text-left transition-all cursor-pointer group"
                  >
                    <div className="text-xs font-black text-amber-300 group-hover:text-amber-200 font-mono">
                      {selectedCurrency === 'USD' ? `$${item.val}` : `€${item.val}`}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono font-bold mt-1">
                      ≈ {formatBRL(item.val * currentRateNumber)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Toggle Foreign Tourist Tips */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>
                {showTips
                  ? 'Ocultar dicas de câmbio para estrangeiros'
                  : 'Ver dicas de câmbio & cartões para estrangeiros no RN'}
              </span>
            </button>
            <span className="text-[10px] text-slate-500">Natal Vip Turismo Receptivo</span>
          </div>
        </div>
      </div>

      {/* Expandable Tourist Tips Accordion */}
      {showTips && (
        <div className="relative z-10 mt-5 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          {/* Tip 1 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <h5 className="text-xs font-extrabold text-white">Cartões Globais (Wise / Nomad)</h5>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Cartões de débito internacionais como Wise, Nomad ou Revolut possuem cotação comercial
              e IOF de apenas 1,1%. São aceitos em 99% das máquinas de cartão em Natal, Ponta Negra e Pipa.
            </p>
          </div>

          {/* Tip 2 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <h5 className="text-xs font-extrabold text-white">Casas de Câmbio em Natal</h5>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Para troca de papel moeda (cash): no Aeroporto de Natal (NAT), no Midway Mall (Av.
              Bernardo Vieira) ou em agências credenciadas na Av. Eng. Roberto Freire (Ponta Negra).
            </p>
          </div>

          {/* Tip 3 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <h5 className="text-xs font-extrabold text-white">Notas em Espécie na Praia</h5>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Traga notas em perfeito estado (sem rasgos ou carimbos). Tenha sempre R$ 100 a R$ 200
              em notas de Real trocadas para artesãos e balsas ecológicas que possam estar sem sinal de dados.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
