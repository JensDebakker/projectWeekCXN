/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Search, 
  Mail, 
  Eye, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Notebook,
  User,
  Lock,
  ExternalLink,
  RefreshCcw,
  Settings
} from 'lucide-react';
import { GamePhase, SocialPost, CollectedInfo, ContentSegment } from './types';
import { SOCIAL_POSTS, PHISHING_STEPS } from './constants';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.INTRO);
  const [collectedInfo, setCollectedInfo] = useState<CollectedInfo[]>([]);
  const [facilitatorMode, setFacilitatorMode] = useState(false);
  const [score, setScore] = useState(0);
  const [phishingSelections, setPhishingSelections] = useState<Record<string, string>>({});
  const [currentPhishingStep, setCurrentPhishingStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState<{ text: string, x: number, y: number } | null>(null);

  const totalDangerousItems = useMemo(() => {
    return SOCIAL_POSTS.reduce((acc, post) => {
      return acc + post.content.filter(s => s.isDangerous).length;
    }, 0);
  }, []);

  const handleCollect = (segment: ContentSegment, e: React.MouseEvent) => {
    if (!segment.isDangerous || phase !== GamePhase.PHASE_1) return;
    
    const isAlreadyCollected = collectedInfo.some(info => info.text === segment.text);
    if (isAlreadyCollected) return;

    const newInfo: CollectedInfo = {
      id: Math.random().toString(36).substr(2, 9),
      text: segment.text,
      type: segment.type!,
      reason: segment.reason!
    };

    setCollectedInfo(prev => [...prev, newInfo]);
    setScore(prev => prev + 10);
    
    // Show feedback
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setShowTooltip({
      text: segment.reason!,
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });

    setTimeout(() => setShowTooltip(null), 3000);
  };

  const handleSafeClick = () => {
    if (phase !== GamePhase.PHASE_1) return;
    // Optional: feedback for safe text
  };

  const nextPhase = () => {
    if (phase === GamePhase.INTRO) setPhase(GamePhase.PHASE_1);
    else if (phase === GamePhase.PHASE_1) setPhase(GamePhase.PHASE_2);
    else if (phase === GamePhase.PHASE_2) setPhase(GamePhase.PHASE_3);
    else if (phase === GamePhase.PHASE_3) setPhase(GamePhase.SUMMARY);
  };

  const resetGame = () => {
    setPhase(GamePhase.INTRO);
    setCollectedInfo([]);
    setScore(0);
    setPhishingSelections({});
    setCurrentPhishingStep(0);
  };

  // Phase 1: OSINT Collector UI
  const renderPhase1 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto p-4 md:p-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-cyber-cyan flex items-center gap-2">
            <Search className="w-6 h-6" /> OSINT Collector
          </h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setFacilitatorMode(!facilitatorMode)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-colors ${facilitatorMode ? 'bg-cyber-cyan text-cyber-blue' : 'bg-slate-800 text-slate-400'}`}
            >
              <Settings className="w-3 h-3" /> Facilitator Mode
            </button>
            <div className="bg-slate-800 px-4 py-1 rounded-full text-sm font-mono">
              Score: <span className="text-cyber-cyan">{score}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {SOCIAL_POSTS.map((post) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="cyber-card p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-cyber-cyan/20 flex items-center justify-center text-cyber-cyan font-bold border border-cyber-cyan/30">
                  {post.avatar}
                </div>
                <div>
                  <div className="font-bold text-slate-100">{post.author}</div>
                  <div className="text-xs text-slate-500">{post.role} • {post.timestamp}</div>
                </div>
                <div className="ml-auto">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${post.platform === 'LinkedIn' ? 'border-blue-500 text-blue-400' : 'border-slate-500 text-slate-400'}`}>
                    {post.platform}
                  </span>
                </div>
              </div>
              <div className="text-slate-300 leading-relaxed text-lg">
                {post.content.map((segment, idx) => {
                  const isFound = collectedInfo.some(info => info.text === segment.text);
                  return (
                    <span 
                      key={idx}
                      onClick={(e) => segment.isDangerous ? handleCollect(segment, e) : handleSafeClick()}
                      className={`
                        inline-block rounded px-0.5
                        ${segment.isDangerous ? (isFound ? 'highlight-found' : (facilitatorMode ? 'highlight-dangerous bg-yellow-400/20' : 'cursor-pointer hover:bg-slate-800')) : ''}
                      `}
                    >
                      {segment.text}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-end mt-8">
          <button 
            onClick={nextPhase}
            className="cyber-button-primary flex items-center gap-2"
          >
            Naar Phishing Builder <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-8">
          <div className="cyber-card p-6 border-cyber-cyan/20">
            <h3 className="text-lg font-bold text-cyber-cyan flex items-center gap-2 mb-4">
              <Notebook className="w-5 h-5" /> Aanvallersnotities
            </h3>
            <p className="text-xs text-slate-500 mb-4 italic">
              Klik op gevaarlijke informatie in de posts om deze te verzamelen.
            </p>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {collectedInfo.length === 0 ? (
                <div className="text-center py-8 text-slate-600 border-2 border-dashed border-slate-800 rounded-lg">
                  Nog geen info verzameld...
                </div>
              ) : (
                collectedInfo.map((info) => (
                  <motion.div 
                    key={info.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-800/80 p-3 rounded-lg border-l-4 border-cyber-cyan"
                  >
                    <div className="text-xs font-bold text-cyber-cyan uppercase mb-1">{info.type}</div>
                    <div className="text-sm text-slate-200 font-medium">{info.text}</div>
                  </motion.div>
                ))
              )}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Gevonden items:</span>
                <span className="text-cyber-cyan font-bold">{collectedInfo.length} / {totalDangerousItems}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-cyber-cyan h-full transition-all duration-500" 
                  style={{ width: `${(collectedInfo.length / totalDangerousItems) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Phase 2: Phishing Builder UI
  const renderPhase2 = () => {
    const currentStep = PHISHING_STEPS[currentPhishingStep];
    const isLastStep = currentPhishingStep === PHISHING_STEPS.length - 1;

    const calculateCredibility = () => {
      let score = 40; // Base score
      Object.entries(phishingSelections).forEach(([stepId, value]) => {
        const step = PHISHING_STEPS.find(s => s.id === stepId);
        const option = step?.options.find(o => o.value === value);
        if (option?.isBest) score += 12;
      });
      return Math.min(score, 98);
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto p-4 md:p-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-cyber-cyan flex items-center gap-2">
            <Mail className="w-6 h-6" /> Spear-Phishing Builder
          </h2>
          
          <div className="cyber-card p-6">
            <div className="flex items-center gap-4 mb-6">
              {PHISHING_STEPS.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-colors ${idx <= currentPhishingStep ? 'bg-cyber-cyan' : 'bg-slate-800'}`}
                />
              ))}
            </div>

            <h3 className="text-xl font-bold mb-6 text-slate-100">{currentStep.title}</h3>
            
            <div className="space-y-3">
              {currentStep.options.map((option) => {
                const isAvailable = !option.requiredInfoType || collectedInfo.some(info => info.type === option.requiredInfoType);
                
                return (
                  <button
                    key={option.id}
                    disabled={!isAvailable}
                    onClick={() => {
                      if (isAvailable) {
                        setPhishingSelections(prev => ({ ...prev, [currentStep.id]: option.value }));
                        if (!isLastStep) setCurrentPhishingStep(prev => prev + 1);
                      }
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      !isAvailable 
                        ? 'bg-slate-900/30 border-slate-800 text-slate-600 cursor-not-allowed italic'
                        : phishingSelections[currentStep.id] === option.value 
                          ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan' 
                          : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{isAvailable ? option.label : "Niet gevonden."}</span>
                      {isAvailable && phishingSelections[currentStep.id] === option.value && <CheckCircle2 className="w-5 h-5" />}
                      {!isAvailable && <Lock className="w-4 h-4 opacity-30" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between mt-8">
              <button 
                disabled={currentPhishingStep === 0}
                onClick={() => setCurrentPhishingStep(prev => prev - 1)}
                className="text-slate-400 hover:text-slate-100 disabled:opacity-30 flex items-center gap-1"
              >
                Vorige stap
              </button>
              {isLastStep && phishingSelections[currentStep.id] && (
                <button 
                  onClick={nextPhase}
                  className="cyber-button-primary"
                >
                  Bekijk resultaat
                </button>
              )}
            </div>
          </div>

          <div className="cyber-card p-4 bg-slate-900/80 border-dashed border-slate-700">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Notebook className="w-3 h-3" /> Beschikbare OSINT
            </h4>
            <div className="flex flex-wrap gap-2">
              {collectedInfo.map(info => (
                <span key={info.id} className="text-[10px] bg-slate-800 text-cyber-cyan px-2 py-1 rounded border border-cyber-cyan/20">
                  {info.text}
                </span>
              ))}
              {collectedInfo.length === 0 && <span className="text-xs text-slate-600 italic">Geen info gevonden in fase 1</span>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-400 flex items-center gap-2">
            <Eye className="w-5 h-5" /> Live Preview
          </h3>
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden text-slate-800 min-h-[400px] flex flex-col">
            <div className="bg-slate-100 p-4 border-b border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-slate-400 w-16">Van:</span>
                <span className="text-sm font-mono text-blue-600">{phishingSelections.sender || '...'}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-slate-400 w-16">Aan:</span>
                <span className="text-sm font-medium">{phishingSelections.victim || '...'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 w-16">Onderwerp:</span>
                <span className="text-sm font-bold">{phishingSelections.subject || '...'}</span>
              </div>
            </div>
            <div className="p-8 flex-1 font-serif text-lg leading-relaxed">
              <p className="mb-4">{phishingSelections.greeting || '...'}</p>
              <p className="mb-8">{phishingSelections.content || '...'}</p>
              <div className="mt-auto pt-8 border-t border-slate-100 text-sm text-slate-400 italic">
                Klik hier om de bijlage te openen of de factuur te betalen.
              </div>
            </div>
            {isLastStep && phishingSelections.sender && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-cyber-blue p-6 border-t border-cyber-cyan/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm">Geloofwaardigheidsscore:</span>
                  <span className="text-cyber-cyan font-bold text-xl">{calculateCredibility()}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateCredibility()}%` }}
                    className="bg-cyber-cyan h-full shadow-[0_0_10px_rgba(100,255,218,0.5)]"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 italic">
                  Op basis van de gebruikte OSINT-data en contextuele relevantie.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Phase 3: The Reveal UI
  const renderPhase3 = () => {
    const calculateCredibility = () => {
      let score = 40; // Base score
      Object.entries(phishingSelections).forEach(([stepId, value]) => {
        const step = PHISHING_STEPS.find(s => s.id === stepId);
        const option = step?.options.find(o => o.value === value);
        if (option?.isBest) score += 12;
      });
      return Math.min(score, 98);
    };

    const credibility = calculateCredibility();

    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-4 rounded-full bg-red-500/20 text-red-500 mb-4">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-bold mb-4">De Onthulling</h2>
          <p className="text-xl text-slate-400">
            Dit is exact wat echte aanvallers doen met publieke informatie.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-cyber-cyan flex items-center gap-2">
              <Eye className="w-6 h-6" /> Waarom is dit zo gevaarlijk?
            </h3>
            <div className="space-y-4">
              <div className="cyber-card p-5 border-l-4 border-red-500">
                <h4 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Vertrouwen Misbruiken
                </h4>
                <p className="text-sm text-slate-300">
                  Door namen van collega's (Sarah) en leveranciers (Combell) te noemen, wekt de aanvaller direct vertrouwen. Het slachtoffer denkt dat de mail legitiem is omdat deze details "alleen intern bekend zouden zijn".
                </p>
              </div>
              <div className="cyber-card p-5 border-l-4 border-orange-500">
                <h4 className="font-bold text-orange-400 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Contextuele Relevantie
                </h4>
                <p className="text-sm text-slate-300">
                  Weten dat iemand op vakantie is, is goud waard. De aanvaller creëert urgentie ("Sarah is er niet, dus jij moet dit NU doen") waardoor het slachtoffer minder kritisch naar de mail kijkt.
                </p>
              </div>
              <div className="cyber-card p-5 border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Technische Blauwdruk
                </h4>
                <p className="text-sm text-slate-300">
                  Het noemen van specifieke software (Azure, Cisco VPN) helpt de aanvaller om de juiste malware of valse inlogpagina te bouwen die er exact zo uitziet als de tools die jij dagelijks gebruikt.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-cyber-cyan flex items-center gap-2">
              <Search className="w-6 h-6" /> Analyse van de Posts
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {SOCIAL_POSTS.map((post) => (
                <div key={post.id} className="cyber-card p-4 border-slate-800 bg-slate-900/30">
                  <div className="flex items-center gap-2 mb-3 opacity-50">
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                      {post.avatar}
                    </div>
                    <div className="text-xs font-bold text-slate-400">{post.author}</div>
                  </div>
                  <div className="text-slate-200 text-sm leading-relaxed">
                    {post.content.map((segment, idx) => (
                      <span 
                        key={idx}
                        className={`
                          inline-block rounded px-1 group relative
                          ${segment.isDangerous ? (segment.severity === 'red' ? 'highlight-red' : 'highlight-orange') : ''}
                        `}
                      >
                        {segment.text}
                        {segment.isDangerous && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                            <div className="text-xs font-bold text-cyber-cyan uppercase mb-1">Tip:</div>
                            <div className="text-sm text-slate-200">{segment.tip}</div>
                          </div>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 cyber-card border-cyber-cyan/30 bg-cyber-cyan/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold text-cyber-cyan mb-2">Resultaat</h3>
              <p className="text-slate-400 mb-4">
                Je hebt laten zien hoe effectief OSINT kan zijn voor een aanvaller.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-medium">OSINT Score:</span>
                  <span className="text-cyber-cyan font-bold text-2xl">{score} <span className="text-xs text-slate-600">punten</span></span>
                </div>
                <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-medium">Geloofwaardigheid:</span>
                  <span className="text-cyber-cyan font-bold text-2xl">{credibility}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                <h4 className="font-bold text-slate-200 mb-2">Persoonlijk Advies:</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {score > 80 
                    ? "Je hebt een uitstekend oog voor detail. Gebruik deze kennis om ook je eigen posts en die van je collega's kritisch te bekijken. Deel nooit specifieke versies van software of interne processen."
                    : "Je hebt de basis door, maar vergeet niet dat aanvallers ook zoeken naar 'zachte' info zoals vakanties of namen van collega's. Wees discreet over je afwezigheid op publieke profielen."}
                </p>
              </div>
              <button 
                onClick={resetGame}
                className="w-full cyber-button-secondary flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" /> Speel opnieuw
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderIntro = () => (
    <div className="max-w-4xl mx-auto text-center p-8 md:p-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex justify-center">
          <div className="relative">
            <Shield className="w-24 h-24 text-cyber-cyan" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-cyber-cyan/20 blur-2xl rounded-full"
            />
          </div>
        </div>
        
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
            OSINT <span className="text-cyber-cyan">OPERATIE</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Welkom bij Module 4. Kruip in de huid van een aanvaller en ontdek hoe jouw social media posts het startpunt zijn voor een gerichte cyberaanval op <span className="text-cyber-cyan font-bold">ConXioN</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="cyber-card p-6 border-slate-800">
            <Search className="w-8 h-8 text-cyber-cyan mb-4" />
            <h3 className="font-bold mb-2">1. Verzamel</h3>
            <p className="text-sm text-slate-500">Speur social media af naar namen, functies en gebruikte software.</p>
          </div>
          <div className="cyber-card p-6 border-slate-800">
            <Mail className="w-8 h-8 text-cyber-cyan mb-4" />
            <h3 className="font-bold mb-2">2. Bouw</h3>
            <p className="text-sm text-slate-500">Gebruik de gevonden info om een overtuigende phishingmail te maken.</p>
          </div>
          <div className="cyber-card p-6 border-slate-800">
            <Eye className="w-8 h-8 text-cyber-cyan mb-4" />
            <h3 className="font-bold mb-2">3. Leer</h3>
            <p className="text-sm text-slate-500">Ontdek hoe je jezelf en je bedrijf beter kunt beschermen online.</p>
          </div>
        </div>

        <button 
          onClick={nextPhase}
          className="cyber-button-primary text-xl px-12 py-4"
        >
          Start de Operatie
        </button>

        <div className="pt-8 text-slate-600 text-sm flex items-center justify-center gap-4">
          <span className="flex items-center gap-1"><User className="w-4 h-4" /> 2-4 spelers</span>
          <span className="flex items-center gap-1"><Lock className="w-4 h-4" /> Awareness Training</span>
          <span className="flex items-center gap-1"><ExternalLink className="w-4 h-4" /> ConXioN Waregem</span>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cyber-blue selection:bg-cyber-cyan/30 selection:text-cyber-cyan">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyber-cyan rounded flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyber-blue" />
            </div>
            <span className="font-black tracking-tighter text-xl">CONXION <span className="text-cyber-cyan">OSINT</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-500">
            <span className={phase === GamePhase.PHASE_1 ? 'text-cyber-cyan' : ''}>1. Collector</span>
            <ChevronRight className="w-3 h-3" />
            <span className={phase === GamePhase.PHASE_2 ? 'text-cyber-cyan' : ''}>2. Builder</span>
            <ChevronRight className="w-3 h-3" />
            <span className={phase === GamePhase.PHASE_3 ? 'text-cyber-cyan' : ''}>3. Reveal</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs font-mono text-slate-500 hidden sm:block">
              MODULE_04 // SOCIAL_MEDIA
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <AnimatePresence mode="wait">
          {phase === GamePhase.INTRO && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderIntro()}
            </motion.div>
          )}
          {phase === GamePhase.PHASE_1 && (
            <motion.div key="phase1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderPhase1()}
            </motion.div>
          )}
          {phase === GamePhase.PHASE_2 && (
            <motion.div key="phase2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderPhase2()}
            </motion.div>
          )}
          {phase === GamePhase.PHASE_3 && (
            <motion.div key="phase3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderPhase3()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Tooltip for Phase 1 */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ left: showTooltip.x, top: showTooltip.y }}
            className="fixed -translate-x-1/2 -translate-y-full z-[100] w-64 p-3 bg-cyber-cyan text-cyber-blue rounded-lg shadow-2xl pointer-events-none"
          >
            <div className="text-xs font-bold uppercase mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Gevaarlijk!
            </div>
            <div className="text-sm font-medium leading-tight">{showTooltip.text}</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-cyber-cyan" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-800 text-center text-slate-600 text-xs">
        <p>&copy; 2026 ConXioN Cybersecurity Awareness Experience Tour</p>
        <p className="mt-1 italic">"Beveiliging begint bij wat je deelt."</p>
      </footer>
    </div>
  );
}
