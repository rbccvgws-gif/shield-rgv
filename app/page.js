'use client';
import { useState, useEffect } from 'react';

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
  }
];

const LOADING_TIPS_EN = [
  "Did you recognize the number? If not, be careful...",
  "If it was sent to multiple numbers, it's most likely fake...",
  "Scammers often try to rush or scare you...",
  "Never click links from unknown senders...",
  "Real government agencies don't ask for money via text..."
];

const LOADING_TIPS_ES = [
  "¿Reconoces el número? Si no, ten mucho cuidado...",
  "Si se envió a muchos números a la vez, seguro es falso...",
  "Las estafas siempre intentan asustarte o apurarte...",
  "Nunca hagas clic en enlaces de desconocidos...",
  "El gobierno nunca pide dinero por mensaje de texto..."
];

export default function Home() {
  const [lang, setLang] = useState('es');
  const [simpleMode, setSimpleMode] = useState(false); 
  const [showDetails, setShowDetails] = useState(false); 
  
  const [message, setMessage] = useState(PRESETS[0].text);
  const [claimLocation, setClaimLocation] = useState(PRESETS[0].entity);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const [tipIndex, setTipIndex] = useState(0);

  // CHANGED: Timer slowed down from 2500ms to 5000ms (5 seconds)
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setTipIndex((prev) => (prev + 1) % LOADING_TIPS_EN.length);
      }, 5000); 
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async () => {
    setLoading(true);
    setTipIndex(0); 
    setResult(null);
    setShowDetails(false); 
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, claimLocation }),
      });
      setResult(await res.json());
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <main className={`min-h-screen ${simpleMode ? 'bg-white text-black' : 'bg-slate-950 text-slate-100'} p-4 md:p-8 font-sans transition-colors duration-300`}>
      {/* HEADER */}
      <header className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 border-b border-slate-500 pb-4 gap-4">
        <div className="text-center md:text-left">
          <h1 className={`font-bold ${simpleMode ? 'text-5xl text-blue-700' : 'text-3xl text-emerald-400'}`}>
            🛡️ Escudo RGV
          </h1>
          {!simpleMode && (
            <p className="text-slate-400">
              {lang === 'en' ? 'Bilingual Community Shield' : 'Escudo Comunitario Bilingüe'}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setSimpleMode(!simpleMode)} 
            className={`px-4 py-3 rounded-lg font-bold border-2 ${simpleMode ? 'bg-yellow-300 border-black text-xl' : 'bg-slate-800 border-slate-700 text-sm'}`}
          >
            {simpleMode ? '👓 Normal Mode' : '👓 Texto Grande'}
          </button>
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'es' : 'en')} 
            className={`px-4 py-3 rounded-lg font-bold ${simpleMode ? 'bg-black text-white text-xl' : 'bg-slate-800 text-sm'}`}
          >
            {lang === 'en' ? '🇲🇽 ESPAÑOL' : '🇺🇸 ENGLISH'}
          </button>
        </div>
      </header>

      <div className={`max-w-4xl mx-auto grid ${simpleMode ? 'grid-cols-1' : 'md:grid-cols-2'} gap-8`}>
        
        {/* LEFT SIDE: INPUT */}
        <div className={`${simpleMode ? 'bg-gray-100 border-4 border-black p-8' : 'bg-slate-900 border-slate-800 p-6'} rounded-xl border`}>
          <h2 className={`${simpleMode ? 'text-3xl font-black mb-6' : 'text-lg font-bold mb-4'}`}>
            {lang === 'en' ? '1. Put the message here:' : '1. Pon el mensaje aquí:'}
          </h2>
          
          {!simpleMode && (
            <div className="flex flex-col gap-2 mb-6">
              {PRESETS.map((preset, i) => (
                <button key={i} onClick={() => { setMessage(preset.text); setClaimLocation(preset.entity); }} className="text-left text-sm bg-slate-800 p-2 rounded text-cyan-300 hover:bg-slate-700">
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          <textarea 
            rows={4} 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            className={`w-full p-4 rounded mb-4 border focus:outline-none ${simpleMode ? 'bg-white text-3xl border-black text-black' : 'bg-slate-950 text-sm border-slate-700 text-white focus:border-cyan-500'}`} 
          />
          
          {!simpleMode && (
             <input type="text" value={claimLocation} onChange={e => setClaimLocation(e.target.value)} placeholder="Claimed Entity..." className="w-full bg-slate-950 p-3 rounded text-sm mb-4 border border-slate-700 focus:outline-none focus:border-cyan-500" />
          )}

          <button 
            onClick={handleAnalyze} 
            disabled={loading} 
            className={`w-full font-black py-4 rounded-lg transition-all ${
              simpleMode 
                ? 'bg-blue-600 hover:bg-blue-500 text-white text-3xl border-b-8 border-blue-800 active:border-b-0 mt-4' 
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-lg shadow-lg'
            }`}
          >
            {loading 
              ? '⏳ ...' 
              : (lang === 'en' ? '🛡️ CHECK MESSAGE' : '🛡️ REVISAR MENSAJE')
            }
          </button>

          {loading && (
            <div className={`mt-6 p-4 rounded-xl text-center font-bold animate-pulse ${simpleMode ? 'bg-yellow-200 text-black text-2xl border-2 border-black' : 'bg-slate-800 text-cyan-300 text-sm'}`}>
              💡 {lang === 'en' ? LOADING_TIPS_EN[tipIndex] : LOADING_TIPS_ES[tipIndex]}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: RESULTS */}
        <div>
          {result?.analysis && (
            <div className="space-y-6">
              
              {/* BIG BINARY WARNING (Only in Simple Mode) */}
              {simpleMode && (
                <div className={`p-8 rounded-2xl border-8 text-center shadow-xl ${result.analysis.risk_score > 50 ? 'bg-red-100 border-red-600' : 'bg-green-100 border-green-600'}`}>
                  <h2 className="text-6xl font-black mb-6">
                    {result.analysis.risk_score > 50 
                      ? (lang === 'en' ? '❌ FAKE!' : '❌ ¡FALSO!') 
                      : (lang === 'en' ? '✅ SAFE' : '✅ SEGURO')}
                  </h2>
                  
                  {result.analysis.risk_score > 50 && (
                    <p className="text-3xl font-bold text-black bg-yellow-300 inline-block p-4 border-4 border-black mb-6">
                      {lang === 'en' ? 'DO NOT CLICK ANYTHING.' : 'NO HAGAS CLIC EN NADA.'}
                    </p>
                  )}

                  {/* "WANT TO KNOW WHY?" BUTTON */}
                  {!showDetails && (
                    <button 
                      onClick={() => setShowDetails(true)} 
                      className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-2xl py-4 rounded-xl border-b-4 border-slate-900 transition-all"
                    >
                      {lang === 'en' ? '🔍 Want to know why?' : '🔍 ¿Quieres saber por qué?'}
                    </button>
                  )}
                </div>
              )}

              {/* DETAILED RESULTS (Always shown in Standard Mode, or if showDetails is true in Simple Mode) */}
              {(!simpleMode || showDetails) && (
                <div className="space-y-6 animate-fade-in-up">
                  {/* Verdict & Explanation */}
                  <div className={`bg-slate-900 p-6 rounded-xl border shadow-lg ${
                    result.analysis.risk_score > 60 ? 'border-red-500/40' : 
                    result.analysis.risk_score > 20 ? 'border-yellow-500/40' : 
                    'border-emerald-500/40'
                  }`}>
                    <h2 className={`text-2xl font-bold ${
                      result.analysis.risk_score > 60 ? 'text-red-400' : 
                      result.analysis.risk_score > 20 ? 'text-yellow-400' : 
                      'text-emerald-400'
                    }`}>
                      {lang === 'en' ? result.analysis.verdict_en : result.analysis.verdict_es} (Score: {result.analysis.risk_score})
                    </h2>
                    <p className="mt-4 text-slate-200 text-lg leading-relaxed">
                      {lang === 'en' ? result.analysis.explanation_en : result.analysis.explanation_es}
                    </p>
                  </div>
                  
                  {/* SerpApi Evidence */}
                  <div className="bg-slate-900 p-6 rounded-xl border border-cyan-500/30 shadow-lg">
                    <h3 className="font-bold text-cyan-400 text-lg">🌐 SerpApi Live Evidence</h3>
                    <p className="mt-2 text-slate-300 leading-relaxed">{result.localMapsVerification}</p>
                  </div>
                  
                  {/* Dynamic Action Box: Family Alert OR Suggested Reply */}
                  {result.analysis.risk_score > 50 && result.analysis.family_group_chat_card ? (
                    <div className="bg-indigo-950 p-6 rounded-xl border border-indigo-500/40 shadow-lg animate-fade-in-up">
                      <h3 className="font-bold text-indigo-300 text-lg">💙 Family Group Chat Alert</h3>
                      <p className="text-xs text-indigo-200 mt-1 mb-3">
                        {lang === 'en' ? 'Share this to protect your relatives:' : 'Comparte esto para proteger a tus familiares:'}
                      </p>
                      <p className="whitespace-pre-line text-slate-200 leading-relaxed p-4 bg-indigo-900/50 rounded-lg border border-indigo-800">
                        {result.analysis.family_group_chat_card}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-emerald-950 p-6 rounded-xl border border-emerald-500/40 shadow-lg animate-fade-in-up">
                      <h3 className="font-bold text-emerald-300 text-lg">
                        💬 {lang === 'en' ? 'Suggested Action' : 'Acción Sugerida'}
                      </h3>
                      <p className="mt-3 text-slate-200 leading-relaxed p-4 bg-emerald-900/50 rounded-lg border border-emerald-800 font-medium text-lg">
                        {lang === 'en' ? result.analysis.suggested_reply_en : result.analysis.suggested_reply_es}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

