'use client';
import { useEffect, useState } from 'react'

const PRESETS = [
  {
    label: '📦 Fake CBP / Border Package Fee',
    entity: 'CBP Brownsville',
    text: 'AVISO CBP: Su paquete está retenido en el Puente Internacional de Brownsville. Pague $14.99 de aduana o será confiscado: http://cbp-pagos-express.com',
  },
  {
    label: '⚡ Fake Brownsville PUB Utility',
    entity: 'Brownsville Public Utilities Board',
    text: 'Brownsville PUB Notice: Electricity disconnection scheduled for TODAY at 5 PM. Pay $185 via Zelle immediately to avoid shutoff.',
  },
  {
    label: '💬 WhatsApp "Hola Tía" Scam',
    entity: '',
    text: 'Hola tía, mi celular se cayó al agua. Estoy en una emergencia en Matamoros, ¿me prestas $350 por transferencia urgente?',
  },
]

const LOADING_TIPS_EN = [
  'Did you recognize the number? If not, be careful...',
  "If it was sent to multiple numbers, it's most likely fake...",
  'Scammers often try to rush or scare you...',
  'Never click links from unknown senders...',
  "Real government agencies don't ask for money via text...",
]

const LOADING_TIPS_ES = [
  '¿Reconoces el número? Si no, ten mucho cuidado...',
  'Si se envió a muchos números a la vez, seguro es falso...',
  'Las estafas siempre intentan asustarte o apurarte...',
  'Nunca hagas clic en enlaces de desconocidos...',
  'El gobierno nunca pide dinero por mensaje de texto...',
]

type AnalysisResult = {
  analysis?: {
    risk_score: number
    verdict_en: string
    verdict_es: string
    explanation_en: string
    explanation_es: string
    family_group_chat_card?: string
    suggested_reply_en: string
    suggested_reply_es: string
  }
  localMapsVerification?: string
}

function ShieldMark({ large = false }: { large?: boolean }) {
  return (
    <div
      className={`${large ? 'h-16 w-14 text-2xl' : 'h-12 w-11 text-lg'} grid shrink-0 place-items-center [clip-path:polygon(50%_0,94%_15%,86%_70%,50%_100%,14%_70%,6%_15%)] bg-gradient-to-br from-emerald-300 to-cyan-400 font-black text-slate-950 drop-shadow-[0_0_14px_rgba(45,212,191,0.35)]`}
      aria-hidden="true"
    >
      E
    </div>
  )
}

export default function App() {
  const [lang, setLang] = useState('es')
  const [simpleMode, setSimpleMode] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const [message, setMessage] = useState(PRESETS[0].text)
  const [claimLocation, setClaimLocation] = useState(PRESETS[0].entity)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined
    if (loading) {
      interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % LOADING_TIPS_EN.length)
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [loading])

  const handleAnalyze = async () => {
    setLoading(true)
    setTipIndex(0)
    setResult(null)
    setShowDetails(false)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, claimLocation }),
      })
      setResult(await res.json())
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const isHighRisk = (result?.analysis?.risk_score ?? 0) > 50
  const score = result?.analysis?.risk_score ?? 0

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050b14] px-4 py-5 font-sans text-slate-100 selection:bg-emerald-300 selection:text-slate-950 md:px-8 md:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.025)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-6 border-b border-slate-800/80 pb-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <ShieldMark large={simpleMode} />
            <div>
              <div className="mb-1 flex items-center gap-3">
                <h1 className={`${simpleMode ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'} font-black tracking-[-0.04em] text-white`}>
                  Escudo <span className="text-emerald-300">RGV</span>
                </h1>
                <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300 sm:inline">
                  Community Defense
                </span>
              </div>
              {!simpleMode && (
                <p className="text-sm text-slate-400">
                  {lang === 'en' ? 'Bilingual Community Shield' : 'Escudo Comunitario Bilingüe'}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <button
              onClick={() => setSimpleMode(!simpleMode)}
              className={`${simpleMode ? 'bg-emerald-300 text-lg text-slate-950 shadow-[0_0_20px_rgba(110,231,183,0.2)]' : 'text-sm text-slate-300 hover:bg-slate-800 hover:text-white'} flex min-h-12 items-center gap-2 rounded-xl px-4 font-bold transition-all`}
            >
              <span aria-hidden="true">◉</span>
              {simpleMode ? 'Normal Mode' : 'Texto Grande'}
            </button>
            <button
              onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
              className={`${simpleMode ? 'text-lg' : 'text-sm'} min-h-12 rounded-xl border border-slate-700 bg-slate-800 px-4 font-bold text-cyan-300 transition-colors hover:border-cyan-400/50 hover:bg-slate-700`}
            >
              {lang === 'en' ? 'ESPAÑOL' : 'ENGLISH'}
            </button>
          </div>
        </header>

        <div className={`${simpleMode ? 'mx-auto max-w-4xl' : 'grid lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]'} gap-6`}>
          <section className={`${simpleMode ? 'rounded-[2rem] border-2 border-cyan-400/30 p-6 md:p-10' : 'rounded-3xl border border-slate-800 p-5 md:p-7'} relative overflow-hidden bg-slate-900/75 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl`}>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent" />
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                {!simpleMode && <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">Message scanner</p>}
                <h2 className={`${simpleMode ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'} font-black tracking-tight text-white`}>
                  {lang === 'en' ? 'Put the message here' : 'Pon el mensaje aquí'}
                </h2>
              </div>
              {!simpleMode && (
                <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs font-bold text-slate-400">
                  01 / INPUT
                </span>
              )}
            </div>

            {!simpleMode && (
              <div className="mb-5 grid gap-2 sm:grid-cols-3">
                {PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setMessage(preset.text)
                      setClaimLocation(preset.entity)
                    }}
                    className="group min-h-20 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-left text-xs font-semibold leading-relaxed text-slate-300 transition-all hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-400/5 hover:text-cyan-200"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              {lang === 'en' ? 'Suspicious message' : 'Mensaje sospechoso'}
            </label>
            <textarea
              rows={simpleMode ? 7 : 6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${simpleMode ? 'min-h-72 rounded-2xl p-6 text-2xl font-semibold leading-relaxed md:text-3xl' : 'min-h-40 rounded-xl p-4 text-sm leading-relaxed'} mb-4 w-full resize-none border border-slate-700 bg-slate-950/80 text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10`}
            />

            {!simpleMode && (
              <>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Claimed entity</label>
                <input
                  type="text"
                  value={claimLocation}
                  onChange={(e) => setClaimLocation(e.target.value)}
                  placeholder="Bank, agency, utility provider..."
                  className="mb-5 h-12 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
                />
              </>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`${simpleMode ? 'min-h-24 rounded-2xl text-3xl md:text-4xl' : 'min-h-14 rounded-xl text-base'} group flex w-full items-center justify-center gap-3 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 px-6 font-black tracking-tight text-slate-950 shadow-[0_12px_40px_rgba(45,212,191,0.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_50px_rgba(45,212,191,0.28)] disabled:cursor-wait disabled:opacity-70`}
            >
              {loading ? '⏳ ...' : lang === 'en' ? '🛡️ CHECK MESSAGE' : '🛡️ REVISAR MENSAJE'}
              {!loading && <span className="transition-transform group-hover:translate-x-1">→</span>}
            </button>

            {loading && (
              <div className={`${simpleMode ? 'mt-6 rounded-2xl p-6 text-2xl' : 'mt-5 rounded-xl p-4 text-sm'} border border-cyan-400/20 bg-cyan-400/5 text-center font-bold text-cyan-200`}>
                <span className="mr-2 text-cyan-300">◆</span>
                {lang === 'en' ? LOADING_TIPS_EN[tipIndex] : LOADING_TIPS_ES[tipIndex]}
              </div>
            )}
          </section>

          <section className={`${simpleMode ? 'mt-6' : ''}`}>
            {!result?.analysis && !loading && (
              <div className={`${simpleMode ? 'hidden' : 'flex'} min-h-[34rem] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/35 p-10 text-center`}>
                <div className="mb-5 grid h-20 w-20 place-items-center rounded-3xl border border-slate-700 bg-slate-900 text-3xl text-emerald-300 shadow-[0_0_40px_rgba(45,212,191,0.08)]">
                  ◇
                </div>
                <p className="font-bold text-slate-300">{lang === 'en' ? 'Your analysis will appear here' : 'Tu análisis aparecerá aquí'}</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
                  {lang === 'en' ? 'We check language patterns, urgency, links, and local context.' : 'Revisamos patrones, urgencia, enlaces y contexto local.'}
                </p>
              </div>
            )}

            {result?.analysis && (
              <div className="space-y-4">
                {simpleMode && (
                  <div className={`${isHighRisk ? 'border-rose-400/60 bg-rose-500/10 text-rose-300' : 'border-emerald-400/60 bg-emerald-400/10 text-emerald-300'} rounded-[2rem] border-2 p-7 text-center shadow-2xl backdrop-blur-xl md:p-10`}>
                    <div className="mb-5 text-6xl font-black md:text-8xl">
                      {isHighRisk ? (lang === 'en' ? '❌ FAKE!' : '❌ ¡FALSO!') : lang === 'en' ? '✅ SAFE' : '✅ SEGURO'}
                    </div>
                    {isHighRisk && (
                      <p className="mb-6 inline-block rounded-xl border border-amber-300/40 bg-amber-300 px-5 py-3 text-2xl font-black text-slate-950 md:text-3xl">
                        {lang === 'en' ? 'DO NOT CLICK ANYTHING.' : 'NO HAGAS CLIC EN NADA.'}
                      </p>
                    )}
                    {!showDetails && (
                      <button
                        onClick={() => setShowDetails(true)}
                        className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 py-5 text-2xl font-bold text-white transition-all hover:border-cyan-400/50 hover:bg-slate-800"
                      >
                        {lang === 'en' ? 'Want to know why?' : '¿Quieres saber por qué?'}
                      </button>
                    )}
                  </div>
                )}

                {(!simpleMode || showDetails) && (
                  <div className="space-y-4 animate-[fade-up_0.45s_ease-out]">
                    <article className={`${score > 60 ? 'border-rose-400/30' : score > 20 ? 'border-amber-300/30' : 'border-emerald-300/30'} overflow-hidden rounded-3xl border bg-slate-900/80 shadow-2xl shadow-black/20`}>
                      <div className="flex items-center justify-between gap-5 border-b border-slate-800 p-5 md:p-6">
                        <div>
                          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Risk assessment</p>
                          <h2 className={`${simpleMode ? 'text-3xl' : 'text-xl'} font-black ${score > 60 ? 'text-rose-300' : score > 20 ? 'text-amber-300' : 'text-emerald-300'}`}>
                            {lang === 'en' ? result.analysis.verdict_en : result.analysis.verdict_es}
                          </h2>
                        </div>
                        <div className="text-right">
                          <strong className={`${simpleMode ? 'text-6xl' : 'text-4xl'} font-black tracking-tighter text-white`}>{score}</strong>
                          <span className="text-sm text-slate-500">/100</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-slate-800">
                        <div
                          className={`${score > 60 ? 'bg-rose-400' : score > 20 ? 'bg-amber-300' : 'bg-emerald-300'} h-full`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <p className={`${simpleMode ? 'text-xl' : 'text-base'} p-5 leading-relaxed text-slate-300 md:p-6`}>
                        {lang === 'en' ? result.analysis.explanation_en : result.analysis.explanation_es}
                      </p>
                    </article>

                    <article className="rounded-3xl border border-cyan-400/20 bg-slate-900/80 p-5 shadow-xl md:p-6">
                      <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-cyan-300">Live evidence · SerpApi</p>
                      <p className={`${simpleMode ? 'text-xl' : 'text-sm'} leading-relaxed text-slate-300`}>{result.localMapsVerification}</p>
                    </article>

                    {isHighRisk && result.analysis.family_group_chat_card ? (
                      <article className="rounded-3xl border border-indigo-400/20 bg-indigo-500/10 p-5 shadow-xl md:p-6">
                        <h3 className={`${simpleMode ? 'text-2xl' : 'text-lg'} font-black text-indigo-200`}>Family Group Chat Alert</h3>
                        <p className="mb-4 mt-1 text-sm text-indigo-300/70">
                          {lang === 'en' ? 'Share this to protect your relatives:' : 'Comparte esto para proteger a tus familiares:'}
                        </p>
                        <p className={`${simpleMode ? 'text-xl' : 'text-sm'} whitespace-pre-line rounded-2xl border border-indigo-400/10 bg-slate-950/40 p-4 leading-relaxed text-slate-200`}>
                          {result.analysis.family_group_chat_card}
                        </p>
                      </article>
                    ) : (
                      <article className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-5 shadow-xl md:p-6">
                        <h3 className={`${simpleMode ? 'text-2xl' : 'text-lg'} font-black text-emerald-300`}>
                          {lang === 'en' ? 'Suggested Action' : 'Acción Sugerida'}
                        </h3>
                        <p className={`${simpleMode ? 'text-xl' : 'text-base'} mt-3 rounded-2xl border border-emerald-400/10 bg-slate-950/40 p-4 font-medium leading-relaxed text-slate-200`}>
                          {lang === 'en' ? result.analysis.suggested_reply_en : result.analysis.suggested_reply_es}
                        </p>
                      </article>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-800/80 pt-5 text-xs text-slate-500 sm:flex-row">
          <span>Escudo RGV · Rio Grande Valley</span>
          <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.8)]" /> Private analysis · No messages stored</span>
        </footer>
      </div>
    </main>
  )
}
