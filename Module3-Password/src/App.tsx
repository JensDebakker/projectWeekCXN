import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ShieldAlert, ShieldCheck, Terminal, Trophy, User, Lock, AlertTriangle, Timer, ArrowRight, RefreshCw, Cpu, Activity, Zap, Eye, EyeOff, Search, FileText, CheckCircle2, Sparkles, BrainCircuit } from 'lucide-react';
import { analyzePassword, challenges, Challenge, PasswordAnalysis } from './utils/gameData';
import { GoogleGenAI } from "@google/genai";

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const PasswordBossBattle = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'interstitial' | 'ai_analysis' | 'end'>('start');
  const [userName, setUserName] = useState('');
  const [score, setScore] = useState(0);
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes for 20 questions
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);
  const [customPassword, setCustomPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);
  const [hackerProgress, setHackerProgress] = useState(0);

  // AI & Tracking State
  const [passwordHistory, setPasswordHistory] = useState<PasswordAnalysis[]>([]);
  const [performanceData, setPerformanceData] = useState<{ question: string; correct: boolean }[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [specialistImage, setSpecialistImage] = useState<string>('');

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('ai_analysis');
      generateAiAnalysis();
    }
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState === 'end') {
      fetchLeaderboard();
    }
  }, [gameState]);

  const fetchLeaderboard = () => {
    try {
      const stored = localStorage.getItem('siege_leaderboard');
      const data = stored ? JSON.parse(stored) : [];
      setLeaderboard(data);
    } catch (e) {
      console.error("Failed to fetch leaderboard", e);
    }
  };

  const submitScore = async () => {
    setIsAnalyzing(true);
    // Simulate deep scanning
    setTimeout(() => {
      try {
        const stored = localStorage.getItem('siege_leaderboard');
        let data = stored ? JSON.parse(stored) : [];
        data.push({ name: userName || 'Anoniem', score });
        data.sort((a: any, b: any) => b.score - a.score);
        data = data.slice(0, 10);
        localStorage.setItem('siege_leaderboard', JSON.stringify(data));
        
        setIsAnalyzing(false);
        setGameState('end');
      } catch (e) {
        console.error("Failed to submit score", e);
        setIsAnalyzing(false);
        setGameState('end');
      }
    }, 2000);
  };

  const generateAiAnalysis = async () => {
    setIsAnalyzing(true);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "undefined") {
      setAiSummary("AI-analyse is niet geconfigureerd voor dit station. Maar je hebt het geweldig gedaan!");
      setIsAnalyzing(false);
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const correctCount = performanceData.filter(p => p.correct).length;
      const avgEntropy = passwordHistory.length > 0 
        ? passwordHistory.reduce((acc, p) => acc + p.entropy, 0) / passwordHistory.length 
        : 0;
      
      const prompt = `Je bent een cybersecurity expert. Analyseer de prestaties van deze gebruiker in de 'ConXion Cipher Siege' training:
      - Naam: ${userName}
      - Score: ${score}
      - Vragen correct: ${correctCount} van de ${performanceData.length}
      - Gemiddelde wachtwoord entropie in tests: ${avgEntropy.toFixed(2)} bits
      - Fouten gemaakt in: ${performanceData.filter(p => !p.correct).map(p => p.question).join(', ')}

      Geef een korte, krachtige analyse (max 150 woorden) in het Nederlands. Wat doen ze goed? Waar moeten ze op letten? Eindig met een 'Cyber Security Level' (bijv. Novice, Guardian, Elite Sentinel).`;

      const textResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      setAiSummary(textResponse.text || 'Analyse voltooid.');

      const level = score > 2500 ? "Elite Sentinel" : score > 1500 ? "Guardian" : "Novice";
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A high-tech holographic cybersecurity badge for a ${level} specialist, neon emerald and obsidian colors, digital circuitry patterns, 3D render, cinematic lighting.` }],
        },
      });

      for (const part of imageResponse.candidates[0].content.parts) {
        if (part.inlineData) {
          setSpecialistImage(`data:image/png;base64,${part.inlineData.data}`);
        }
      }
    } catch (e) {
      console.error("AI Analysis failed", e);
      setAiSummary("De AI-analyse kon niet worden voltooid, maar je resultaten zijn opgeslagen.");
    }
    setIsAnalyzing(false);
  };


  const handleAnswer = (correct: boolean, feedbackText: string) => {
    setPerformanceData(prev => [...prev, { question: currentChallenge.question, correct }]);
    
    if (correct) {
      setScore(prev => prev + 150);
      setFeedback({ text: feedbackText, success: true });
    } else {
      setHackerProgress(prev => Math.min(prev + 10, 100));
      setFeedback({ text: feedbackText, success: false });
    }

    setTimeout(() => {
      setFeedback(null);
      const nextIdx = currentChallengeIdx + 1;
      
      if (nextIdx % 5 === 0 && nextIdx > 0 && nextIdx <= 20) {
        setGameState('interstitial');
      } else if (nextIdx < challenges.length) {
        setCurrentChallengeIdx(nextIdx);
      } else {
        setGameState('ai_analysis');
        generateAiAnalysis();
      }
    }, 3000);
  };

  const handleInterstitialSubmit = () => {
    const analysis = analyzePassword(customPassword);
    setPasswordHistory(prev => [...prev, analysis]);
    setScore(prev => prev + Math.floor(analysis.score * 2));
    
    setCustomPassword('');
    const nextIdx = currentChallengeIdx + 1;
    if (nextIdx < challenges.length) {
      setCurrentChallengeIdx(nextIdx);
      setGameState('playing');
    } else {
      setGameState('ai_analysis');
      generateAiAnalysis();
    }
  };

  const analysis = useMemo(() => analyzePassword(customPassword), [customPassword]);

  const currentChallenge = challenges[currentChallengeIdx];

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-zinc-100 selection:bg-emerald-500/30 hacker-grid relative overflow-hidden">
      <div className="scanline" />
      
      {/* Header - Hardware Style */}
      <header className="border-b border-emerald-500/20 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Cpu className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-widest uppercase font-mono leading-none">
              CONXION<span className="text-emerald-500">SIEGE</span> <span className="text-zinc-600">v2.1</span>
            </h1>
              <div className="flex gap-1 mt-1">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                <div className="w-1 h-1 bg-emerald-500/30 rounded-full" />
                <div className="w-1 h-1 bg-emerald-500/30 rounded-full" />
              </div>
            </div>
          </div>
          
          {gameState !== 'start' && (
            <div className="flex items-center gap-8 font-mono">
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Accumulated Score</div>
                <div className="text-2xl font-black text-emerald-400 tabular-nums">{score.toString().padStart(6, '0')}</div>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Session Timer</div>
                <div className={`text-2xl font-black tabular-nums ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-zinc-200'}`}>
                  00:{timeLeft.toString().padStart(2, '0')}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <AnimatePresence mode="wait">
          {gameState === 'start' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12 py-12"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em]">
                  <Zap className="w-3 h-3" /> System Authorization Required
                </div>
                <h2 className="text-7xl sm:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
                  CONXION <br />
                  <span className="text-emerald-500 italic">SIEGE</span>
                </h2>
                <p className="text-zinc-500 text-xl max-w-2xl font-medium leading-relaxed">
                  20 Uitdagingen. 4 Password Audits. 1 AI Analyse. Ben jij klaar voor de ultieme test?
                </p>
              </div>

              <div className="max-w-md space-y-4">
                <div className="group relative">
                  <div className="absolute -inset-0.5 bg-emerald-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                  <div className="relative flex items-center">
                    <User className="absolute left-5 w-5 h-5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Identificeer jezelf..."
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-emerald-500/50 transition-all font-mono text-lg"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setGameState('playing')}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-5 rounded-2xl transition-all transform hover:translate-y-[-2px] active:translate-y-[1px] flex items-center justify-center gap-3 text-lg shadow-[0_10px_20px_rgba(16,185,129,0.2)]"
                >
                  INITIALISEER PROTOCOL <ArrowRight className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12">
                {[
                  { label: "Entropie", value: "High" },
                  { label: "Encryptie", value: "AES-256" },
                  { label: "Status", value: "Active" },
                  { label: "Node", value: "0x7F" }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl">
                    <div className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold mb-1">{item.label}</div>
                    <div className="text-sm font-mono font-bold text-emerald-500/70">{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid lg:grid-cols-[1fr_320px] gap-8 items-start"
            >
              <div className="space-y-8">
                {/* Challenge Card */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-10 shadow-3xl backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700">
                    <Activity className="w-48 h-48" />
                  </div>
                  
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                        Challenge {currentChallengeIdx + 1} / 20
                      </div>
                      <div className="h-px flex-1 bg-zinc-800" />
                    </div>
                    
                    <h3 className="text-3xl sm:text-4xl font-black leading-[1.1] tracking-tight">
                      {currentChallenge.question}
                    </h3>

                    <div className="grid gap-4">
                      {currentChallenge.options.map((option, i) => (
                        <button
                          key={i}
                          disabled={!!feedback}
                          onClick={() => handleAnswer(option.correct, option.feedback)}
                          className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center justify-between group relative overflow-hidden
                            ${feedback 
                              ? option.correct 
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                                : 'bg-zinc-900/50 border-zinc-800 opacity-40'
                              : 'bg-zinc-800/30 border-zinc-800 hover:border-emerald-500/40 hover:bg-zinc-800/60'
                            }`}
                        >
                          <span className="font-bold text-lg relative z-10">{option.text}</span>
                          {!feedback && <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all relative z-10" />}
                          {feedback && option.correct && <ShieldCheck className="w-7 h-7 relative z-10" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Constant Feedback Section */}
                <AnimatePresence mode="wait">
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-8 rounded-3xl border-2 flex gap-6 ${
                        feedback.success 
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-100' 
                          : 'bg-red-500/5 border-red-500/20 text-red-100'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center ${
                        feedback.success ? 'bg-emerald-500/20' : 'bg-red-500/20'
                      }`}>
                        {feedback.success ? <ShieldCheck className="w-8 h-8 text-emerald-500" /> : <ShieldAlert className="w-8 h-8 text-red-500" />}
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-black uppercase tracking-[0.2em] opacity-50">
                          {feedback.success ? 'Analyse: Correct' : 'Analyse: Kritiek'}
                        </div>
                        <p className="text-lg font-medium leading-relaxed">{feedback.text}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sidebar Stats */}
              <aside className="space-y-6 sticky top-28">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3" /> Inbraak Risico
                      </span>
                      <span className="text-xs font-mono text-red-500 font-bold">{hackerProgress}%</span>
                    </div>
                    <div className="h-3 bg-black rounded-full overflow-hidden p-0.5 border border-zinc-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${hackerProgress}%` }}
                        className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                      />
                    </div>
                  </div>

                  <div className="h-px bg-zinc-800" />

                  <div className="space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Systeem Logboek</div>
                    <div className="space-y-2">
                      {challenges.slice(0, currentChallengeIdx + 1).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 text-[11px] font-mono">
                          <div className={`w-1.5 h-1.5 rounded-full ${i < currentChallengeIdx ? 'bg-emerald-500' : 'bg-emerald-500 animate-pulse'}`} />
                          <span className="opacity-50">MOD_{i+1}:</span>
                          <span className={i < currentChallengeIdx ? 'text-emerald-500/70' : 'text-white'}>
                            {i < currentChallengeIdx ? 'COMPLETED' : 'PROCESSING...'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
                  <p className="text-[10px] text-emerald-500/60 leading-relaxed font-medium">
                    TIP: Gebruik wachtzinnen van minimaal 4 willekeurige woorden voor maximale beveiliging.
                  </p>
                </div>
              </aside>
            </motion.div>
          )}

          {gameState === 'interstitial' && (
            <motion.div
              key="interstitial"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto space-y-10"
            >
              <div className="text-center space-y-4">
                <div className="inline-block px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  Checkpoint Audit
                </div>
                <h2 className="text-5xl font-black uppercase tracking-tighter">Test je Wachtwoord</h2>
                <p className="text-zinc-500 text-lg">Voer een nieuw, sterk wachtwoord in om extra punten te verdienen en je voortgang te beveiligen.</p>
              </div>

              <div className="bg-black border-2 border-emerald-500/20 rounded-[2.5rem] p-10 shadow-2xl space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.3em]">Terminal Input</label>
                    <button onClick={() => setShowPassword(!showPassword)} className="text-zinc-500 hover:text-emerald-500 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Typ een test-wachtwoord..."
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    className="w-full bg-zinc-900/40 border-2 border-zinc-800 rounded-2xl py-6 px-8 focus:outline-none focus:border-emerald-500/50 transition-all font-mono text-emerald-500 text-3xl tracking-wider"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-12">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-black text-zinc-600 tracking-widest block">Audit Resultaat</span>
                    <div className={`text-5xl font-black font-mono ${analysis.color}`}>{analysis.time}</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      <span>Entropie</span>
                      <span className="text-emerald-500">{Math.round(analysis.entropy)} bits</span>
                    </div>
                    <div className="h-3 bg-zinc-900/50 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                      <motion.div animate={{ width: `${Math.min((analysis.entropy / 128) * 100, 100)}%` }} className="h-full bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleInterstitialSubmit}
                  disabled={!customPassword}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-6 rounded-2xl transition-all flex items-center justify-center gap-4 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.2)]"
                >
                  BEVESTIG AUDIT <ArrowRight className="w-7 h-7" />
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'ai_analysis' && (
            <motion.div
              key="ai_analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl border-2 border-emerald-500/30 flex items-center justify-center mx-auto">
                  <BrainCircuit className="w-12 h-12 text-emerald-500" />
                </div>
                <h2 className="text-6xl font-black uppercase tracking-tighter">AI Specialist Analyse</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-8 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                    <div className="text-xs font-black uppercase tracking-widest text-emerald-500">Rapportage</div>
                    {isAnalyzing ? (
                      <div className="space-y-4">
                        <div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
                        <div className="h-4 bg-zinc-800 rounded w-full animate-pulse" />
                        <div className="h-4 bg-zinc-800 rounded w-5/6 animate-pulse" />
                      </div>
                    ) : (
                      <p className="text-lg leading-relaxed text-zinc-300 italic">"{aiSummary}"</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                      <div className="text-[10px] uppercase font-black text-zinc-500 mb-2">Gem. Entropie</div>
                      <div className="text-2xl font-black text-emerald-500">
                        {passwordHistory.length > 0 
                          ? (passwordHistory.reduce((acc, p) => acc + p.entropy, 0) / passwordHistory.length).toFixed(1) 
                          : '0'} bits
                      </div>
                    </div>
                    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                      <div className="text-[10px] uppercase font-black text-zinc-500 mb-2">Correcte Antwoorden</div>
                      <div className="text-2xl font-black text-emerald-500">
                        {performanceData.filter(p => p.correct).length} / 20
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-4 bg-emerald-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                  <div className="relative aspect-square bg-black border-2 border-emerald-500/30 rounded-[2.5rem] overflow-hidden flex items-center justify-center">
                    {isAnalyzing ? (
                      <div className="flex flex-col items-center gap-4">
                        <RefreshCw className="w-12 h-12 text-emerald-500 animate-spin" />
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Genereren Specialist Badge...</span>
                      </div>
                    ) : specialistImage ? (
                      <motion.img 
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={specialistImage} 
                        alt="Specialist Badge" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Trophy className="w-24 h-24 text-zinc-800" />
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={submitScore}
                disabled={isAnalyzing}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-6 rounded-2xl transition-all flex items-center justify-center gap-4 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.2)]"
              >
                SCORE OPSLAAN & VOLTOOIEN <Trophy className="w-7 h-7" />
              </button>
            </motion.div>
          )}

          {gameState === 'end' && (
            <motion.div
              key="end"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12 text-center py-12"
            >
              <div className="space-y-6">
                <div className="relative inline-block">
                  <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
                  <div className="relative w-24 h-24 bg-emerald-500/10 rounded-3xl border-2 border-emerald-500/30 flex items-center justify-center mx-auto">
                    <Trophy className="w-12 h-12 text-emerald-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-6xl font-black uppercase tracking-tighter">Audit Voltooid</h2>
                  <p className="text-zinc-500 text-xl font-medium">
                    Uitstekend werk, <span className="text-white">{userName || 'Agent'}</span>. Jouw security-inzicht is nu gecertificeerd.
                  </p>
                </div>
                <div className="text-8xl font-black text-emerald-500 tabular-nums">
                  {score} <span className="text-2xl text-zinc-700 tracking-widest uppercase">Punten</span>
                </div>
              </div>

              <div className="max-w-xl mx-auto bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                  <h3 className="font-black text-xs tracking-[0.3em] flex items-center gap-3">
                    <Activity className="w-4 h-4 text-emerald-500" /> HALL OF FAME
                  </h3>
                  <button onClick={fetchLeaderboard} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors">
                    <RefreshCw className="w-4 h-4 text-zinc-600" />
                  </button>
                </div>
                <div className="divide-y divide-zinc-800/50">
                  {leaderboard.map((entry, i) => (
                    <div key={i} className="px-8 py-5 flex justify-between items-center hover:bg-emerald-500/5 transition-colors group">
                      <div className="flex items-center gap-6">
                        <span className={`w-8 font-mono font-black text-lg ${i < 3 ? 'text-emerald-500' : 'text-zinc-700'}`}>
                          {(i + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="font-bold text-lg group-hover:text-emerald-400 transition-colors">{entry.name}</span>
                      </div>
                      <span className="font-mono font-black text-xl text-emerald-500">{entry.score}</span>
                    </div>
                  ))}
                  {leaderboard.length === 0 && (
                    <div className="p-12 text-zinc-600 text-sm italic font-medium">Nog geen data beschikbaar...</div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setGameState('start');
                  setScore(0);
                  setCurrentChallengeIdx(0);
                  setTimeLeft(60);
                  setHackerProgress(0);
                  setCustomPassword('');
                }}
                className="inline-flex items-center gap-3 text-zinc-500 hover:text-emerald-400 transition-all font-black uppercase tracking-[0.2em] text-xs"
              >
                <RefreshCw className="w-4 h-4" /> Start Nieuwe Sessie
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Decoration */}
      <footer className="max-w-5xl mx-auto px-6 py-16 border-t border-zinc-900/50 mt-20">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4 opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700 cursor-default">
            <Shield className="w-6 h-6 text-emerald-500" />
            <div className="h-4 w-px bg-zinc-800" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Cyber Experience Tour</span>
          </div>
          <div className="flex gap-12 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700">
            <span className="hover:text-emerald-500/50 transition-colors">Station 03</span>
            <span className="hover:text-emerald-500/50 transition-colors">Module 05</span>
            <span className="hover:text-emerald-500/50 transition-colors">Auth_Core</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PasswordBossBattle;
