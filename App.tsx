import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Gamepad2, 
  Award, 
  Volume2, 
  Play, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  HelpCircle, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  Info,
  ChevronRight,
  BookMarked,
  Layers,
  Heart,
  VolumeX,
  Languages
} from "lucide-react";

import { 
  GrammarSections, 
  VerbsDetailData, 
  UsefulCommands, 
  MistakesAvoid, 
  SpanishPronouns, 
  ReflexiveVerbsList 
} from "./theoryData";

import { 
  Game1Questions, 
  Game2Questions, 
  Game3Questions, 
  Game4Questions, 
  Game5Questions, 
  Game6Cards 
} from "./gamesData";

// Native Castilian/Spanish Text to Speech
const speakSpanish = (text: string, isMuted: boolean) => {
  if (isMuted) return;
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[¡!¿?]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "es-ES";
    
    // Find natural Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(v => v.lang.startsWith("es"));
    if (esVoice) utterance.voice = esVoice;
    
    utterance.rate = 0.85; // slightly slower for educational clarity
    window.speechSynthesis.speak(utterance);
  }
};

// Pure Offline Synthesizer for Retro Arcade Sound Effects
const playSoundEffect = (type: "correct" | "incorrect" | "click" | "fanfare" | "flip", isMuted: boolean) => {
  if (isMuted) return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    if (type === "correct") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === "incorrect") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "flip") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.setValueAtTime(450, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "fanfare") {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // Arpeggio C4-E4-G4-C5-E5
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        g.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.2);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(ctx.currentTime + idx * 0.08);
        o.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    }
  } catch (err) {
    console.warn("Sound Context not initialized.", err);
  }
};

export default function App() {
  // Navigation & Preferences State
  const [activeTab, setActiveTab] = useState<"home" | "theory" | "games" | "playground" | "useful">("home");
  const [selectedGame, setSelectedGame] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Game Performance Tracker
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [completedGames, setCompletedGames] = useState<Set<number>>(new Set());

  // Game 1 State: Conjugation Builder
  const [g1Index, setG1Index] = useState<number>(0);
  const [g1Selected, setG1Selected] = useState<number | null>(null);
  const [g1Answered, setG1Answered] = useState<boolean>(false);

  // Game 2 State: Pronoun Placement
  const [g2Index, setG2Index] = useState<number>(0);
  const [g2Answered, setG2Answered] = useState<boolean>(false);
  const [g2Selected, setG2Selected] = useState<"before" | "after" | null>(null);

  // Game 3 State: Word Sorter
  const [g3Index, setG3Index] = useState<number>(0);
  const [g3Pool, setG3Pool] = useState<string[]>([]);
  const [g3Assembled, setG3Assembled] = useState<string[]>([]);
  const [g3Submitted, setG3Submitted] = useState<boolean>(false);
  const [g3IsCorrect, setG3IsCorrect] = useState<boolean | null>(null);

  // Game 4 State: Accent Explorer
  const [g4Index, setG4Index] = useState<number>(0);
  const [g4Selected, setG4Selected] = useState<number | null>(null);
  const [g4Answered, setG4Answered] = useState<boolean>(false);

  // Game 5 State: Situations Matcher
  const [g5Index, setG5Index] = useState<number>(0);
  const [g5Selected, setG5Selected] = useState<number | null>(null);
  const [g5Answered, setG5Answered] = useState<boolean>(false);

  // Game 6 State: Memorization Flashcards
  const [g6Index, setG6Index] = useState<number>(0);
  const [g6Flipped, setG6Flipped] = useState<boolean>(false);
  const [memorizedCards, setMemorizedCards] = useState<Set<number>>(new Set());

  // Conjugation Playground Interactive Builder
  const [playgroundVerb, setPlaygroundVerb] = useState<string>("levantarse");
  const [playgroundPolarity, setPlaygroundPolarity] = useState<"affirmative" | "negative">("affirmative");
  const [playgroundSubject, setPlaygroundSubject] = useState<string>("tú");

  // Load Voices on Startup
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Initialize Game 3 Word Pool
  useEffect(() => {
    if (Game3Questions[g3Index]) {
      // Shuffle the words
      const words = [...Game3Questions[g3Index].spanishWords];
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setG3Pool(shuffled);
      setG3Assembled([]);
      setG3Submitted(false);
      setG3IsCorrect(null);
    }
  }, [g3Index]);

  // Helper score updating
  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      playSoundEffect("correct", isMuted);
      setScore(prev => prev + 15);
      setStreak(prev => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
    } else {
      playSoundEffect("incorrect", isMuted);
      setStreak(0);
    }
  };

  // Skip and reset handlers
  const resetGame = (gameIdx: number) => {
    playSoundEffect("click", isMuted);
    if (gameIdx === 0) {
      setG1Index(0);
      setG1Selected(null);
      setG1Answered(false);
    } else if (gameIdx === 1) {
      setG2Index(0);
      setG2Answered(false);
      setG2Selected(null);
    } else if (gameIdx === 2) {
      setG3Index(0);
      setG3Assembled([]);
      setG3Submitted(false);
      setG3IsCorrect(null);
    } else if (gameIdx === 3) {
      setG4Index(0);
      setG4Selected(null);
      setG4Answered(false);
    } else if (gameIdx === 4) {
      setG5Index(0);
      setG5Selected(null);
      setG5Answered(false);
    } else if (gameIdx === 5) {
      setG6Index(0);
      setG6Flipped(false);
      setMemorizedCards(new Set());
    }
  };

  const markGameCompleted = (gameIdx: number) => {
    playSoundEffect("fanfare", isMuted);
    setCompletedGames(prev => {
      const next = new Set(prev);
      next.add(gameIdx);
      return next;
    });
    setScore(prev => prev + 100);
  };

  // Get current state of conjugated interactive word in Playground
  const getPlaygroundConjugation = () => {
    const verbData = VerbsDetailData.find(v => v.infinitive === playgroundVerb);
    if (!verbData) return { spanish: "", armenian: "" };
    
    const array = playgroundPolarity === "affirmative" ? verbData.afirmativo : verbData.negativo;
    const item = array.find(a => a.person.includes(playgroundSubject)) || array[0];
    return item;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-100 antialiased">
      {/* Top Header Bar */}
      <header id="app-header" className="sticky top-0 z-40 bg-blue-600 text-white shadow-lg px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white text-blue-600 flex items-center justify-center font-black text-lg shadow-md leading-none select-none">
            ESP
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-white leading-tight uppercase font-display">Imperativo con Verbos Reflexivos</h1>
            <p className="text-xs font-semibold text-blue-100">Հրամայական եղանակը վերադարձական բայերով</p>
          </div>
        </div>

        {/* Global Stats Counter */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="bg-blue-700/80 border border-blue-500/40 rounded-full px-4 py-1.5 flex items-center gap-1.5 text-xs font-bold text-white shadow-xs select-none">
            <Award className="w-4 h-4 text-amber-300" />
            <span>{score} XP</span>
          </div>

          <div className="bg-emerald-500/90 border border-emerald-400/30 rounded-full px-4 py-1.5 flex items-center gap-1.5 text-xs font-bold text-white shadow-xs select-none">
            <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span>Կրակ՝ {streak}</span>
          </div>

          <button 
            id="toggle-mute"
            onClick={() => {
              setIsMuted(!isMuted);
              playSoundEffect("click", !isMuted);
            }} 
            className="p-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white transition-colors"
            title={isMuted ? "Միացնել ձայնը" : "Անջատել ձայնը"}
          >
            {isMuted ? <VolumeX className="w-4.5 h-4.5 text-blue-300" /> : <Volume2 className="w-4.5 h-4.5 text-emerald-300 animate-bounce" />}
          </button>
        </div>
      </header>

      {/* Main Core Navigation Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 flex flex-col gap-4">
          <nav id="app-nav" className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-4 scrollbar-none">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 hidden lg:block">Բաժիններ</p>
            
            {[
              { id: "home", label: "Գլխավոր էջ", icon: Layers },
              { id: "theory", label: "Գրավոր տեսություն", icon: BookOpen },
              { id: "games", label: "Ինտերակտիվ 6 խաղեր", icon: Gamepad2 },
              { id: "playground", label: "Բայերի լաբորատորիա", icon: RefreshCw },
              { id: "useful", label: "Օգտակար արտահայտություններ", icon: BookMarked }
            ].map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-${tab.id}`}
                  onClick={() => { playSoundEffect("click", isMuted); setActiveTab(tab.id as any); }}
                  className={`w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all whitespace-nowrap border ${
                    isActive 
                      ? "bg-blue-50 text-blue-700 border-blue-100 shadow-3xs" 
                      : "text-slate-600 hover:bg-slate-50 border-transparent"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? "bg-blue-500" : "bg-slate-300"}`}></span>
                  <TabIcon className="w-4.5 h-4.5 opacity-80" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Today's Advice Card from design */}
          <div className="hidden lg:block bg-emerald-500 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">Օրվա խորհուրդ</span>
              <h3 className="font-bold text-sm mt-2">Օգտակար խորհուրդ</h3>
              <p className="text-xs leading-relaxed opacity-95 mt-1">Դրական հրամայականում դերանունը միշտ կպչում է բային վերջից:</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-400 rounded-full opacity-20"></div>
          </div>
        </aside>

        {/* Dynamic Display Area */}
        <main id="app-main-content" className="lg:col-span-9 flex flex-col gap-6">

          {/* TAB 1: HOME/DASHBOARD */}
          {activeTab === "home" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Premium Welcome Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white rounded-3xl p-6 md:p-8 shadow-lg">
                <div className="absolute right-0 bottom-0 opacity-15 translate-x-12 translate-y-12">
                  <Languages className="w-80 h-80" />
                </div>
                <div className="relative z-10 max-w-lg">
                  <span className="bg-white/20 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">¡Hola Estudiante!</span>
                  <h2 className="text-2xl md:text-3xl font-black mt-3 tracking-tight font-display">Սովորի՛ր Իսպաներենի Հրամայականը</h2>
                  <p className="mt-2 text-sm text-blue-50 leading-relaxed font-medium">
                    Բարի գալուստ վերադարձական բայերի հրամայական եղանակի (Imperativo con verbos reflexivos) ինտերակտիվ հարթակ։ Այստեղ կգտնես ամբողջական տեսությունը հայերեն բացատրություններով և 6 զվարճալի խաղեր քո գիտելիքները ամրապնդելու համար։
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button 
                      id="home-btn-games"
                      onClick={() => { playSoundEffect("click", isMuted); setActiveTab("games"); }}
                      className="bg-emerald-500 text-white hover:bg-emerald-600 shadow-md font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Gamepad2 className="w-4 h-4" />
                      <span>Խաղալ 6 խաղերը</span>
                    </button>
                    <button 
                      id="home-btn-theory"
                      onClick={() => { playSoundEffect("click", isMuted); setActiveTab("theory"); }}
                      className="bg-white/10 text-white border border-white/25 hover:bg-white/20 font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Կարդալ տեսությունը</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* General Interactive Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-2xs">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">{score}</div>
                    <div className="text-xs text-slate-500 font-bold">Ընդհանուր XP</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-2xs">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">{bestStreak}</div>
                    <div className="text-xs text-slate-500 font-bold">Լավագույն շարքը</div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-2xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900">{completedGames.size} / 6</div>
                    <div className="text-xs text-slate-500 font-bold">Ավարտված խաղեր</div>
                  </div>
                </div>
              </div>

              {/* Game Selection Map Quick Links */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-display">
                  <Gamepad2 className="w-5 h-5 text-blue-600" />
                  <span>Ընտրի՛ր 6 ինտերակտիվ խաղերից մեկը</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Յուրաքանչյուր խաղ մարզում է թեմայի որոշակի կանոն</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {[
                    "Խաղ 1: Կառուցիր Հրամայականը (Conjugation)",
                    "Խաղ 2: Դերանունի դիրքը (Placement)",
                    "Խաղ 3: Բառերի դասավորում (Word Sorter)",
                    "Խաղ 4: Շեշտադրման վարպետ (Accent Master)",
                    "Խաղ 5: Իրավիճակային համընկնում (Situations)",
                    "Խաղ 6: Ֆլեշ քարտեր և արտասանություն (Flashcards)"
                  ].map((title, idx) => (
                    <button
                      key={idx}
                      id={`game-quick-link-${idx}`}
                      onClick={() => {
                        playSoundEffect("click", isMuted);
                        setSelectedGame(idx);
                        setActiveTab("games");
                      }}
                      className="group border border-slate-200 bg-white hover:bg-blue-50/40 hover:border-blue-200 text-left p-4 rounded-xl flex items-center justify-between transition-all shadow-sm cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-sm font-bold text-slate-800 group-hover:text-blue-800 transition-colors block">{title}</span>
                          <span className="text-xs text-slate-400 font-semibold">
                            {completedGames.has(idx) ? "✅ Ավարտված է (+100 XP)" : "🎯 Խաղալ հիմա"}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Verb Showcase */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 font-display">Հիմնական վերադարձական բայերը իսպաներենում</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {ReflexiveVerbsList.map((v, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        playSoundEffect("flip", isMuted);
                        speakSpanish(v.verb, isMuted);
                      }}
                      className="p-3.5 bg-slate-50/50 hover:bg-blue-50/45 border border-slate-200 rounded-xl flex flex-col items-center text-center cursor-pointer hover:shadow-sm transition-all group"
                    >
                      <span className="text-sm font-bold text-blue-600 group-hover:scale-105 transition-transform">{v.verb}</span>
                      <span className="text-xs text-slate-500 font-bold mt-1">{v.armenian}</span>
                      <Volume2 className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 mt-2 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THEORY HANDBOOK */}
          {activeTab === "theory" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-display">
                  <BookOpen className="w-5.5 h-5.5 text-blue-600" />
                  <span>Իսպաներենի հրամայական եղանակի տեսությունը հայերենով</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-semibold">
                  Ուսումնասիրիր կանոնները, դերանունների տեղադրությունը և անկանոն ձևերը նախքան խաղերը սկսելը։
                </p>

                {/* Interactive Grammar Accordions */}
                <div className="mt-6 flex flex-col gap-4">
                  {GrammarSections.map((sec, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center text-xs font-bold shadow-3xs">
                          {idx + 1}
                        </span>
                        {sec.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-semibold mt-2 whitespace-pre-line pl-8">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Conjugation tables for 4 main verbs */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 font-display">Վերադարձական բայերի խոնարհման աղյուսակներ (Imperativo)</h3>
                <p className="text-xs text-slate-500 mt-1 font-semibold">
                  Սեղմի՛ր ցանկացած իսպաներեն բառի վրա՝ այն լսելու համար։
                </p>

                <div className="mt-6 flex flex-col gap-8">
                  {VerbsDetailData.map((verb, vIdx) => (
                    <div key={vIdx} className="border border-slate-200 rounded-2xl p-5 bg-white shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-150 pb-3">
                        <div>
                          <span className="text-lg font-black text-blue-600 capitalize font-display">{verb.infinitive}</span>
                          <span className="text-sm text-slate-500 font-bold ml-2">({verb.translation})</span>
                        </div>
                        {verb.isIrregular && (
                          <span className="bg-amber-500 text-white border-none rounded-full px-3 py-1 text-xs font-bold shadow-xs">
                            ⚠️ Անկանոն ({verb.irregularityNote})
                          </span>
                        )}
                      </div>

                      {/* Side-by-Side Tables: Positive vs Negative */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        
                        {/* Positive / Afirmativo Table */}
                        <div>
                          <h4 className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 w-fit shadow-3xs">
                            <span>Afirmativo (Դրական հրամայական)</span>
                          </h4>
                          <div className="overflow-x-auto mt-2">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                                  <th className="py-2">Անձ</th>
                                  <th className="py-2">Իսպաներեն</th>
                                  <th className="py-2">Հայերեն</th>
                                </tr>
                              </thead>
                              <tbody>
                                {verb.afirmativo.map((conj, cIdx) => (
                                  <tr key={cIdx} className="border-b border-slate-55 hover:bg-slate-50/50">
                                    <td className="py-2 text-xs font-semibold text-slate-500">{conj.person}</td>
                                    <td className="py-2">
                                      <button
                                        onClick={() => {
                                          playSoundEffect("flip", isMuted);
                                          speakSpanish(conj.spanish, isMuted);
                                        }}
                                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 text-left cursor-pointer"
                                      >
                                        <span>{conj.spanish}</span>
                                        <Volume2 className="w-3.5 h-3.5 text-slate-300" />
                                      </button>
                                    </td>
                                    <td className="py-2 text-xs font-semibold text-slate-600">{conj.armenian}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Negative / Negativo Table */}
                        <div>
                          <h4 className="text-xs font-bold text-red-700 bg-red-50 border border-red-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 w-fit shadow-3xs">
                            <span>Negativo (Ժխտական հրամայական)</span>
                          </h4>
                          <div className="overflow-x-auto mt-2">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                                  <th className="py-2">Անձ</th>
                                  <th className="py-2">Իսպաներեն</th>
                                  <th className="py-2">Հայերեն</th>
                                </tr>
                              </thead>
                              <tbody>
                                {verb.negativo.map((conj, cIdx) => (
                                  <tr key={cIdx} className="border-b border-slate-55 hover:bg-slate-50/50">
                                    <td className="py-2 text-xs font-semibold text-slate-500">{conj.person}</td>
                                    <td className="py-2">
                                      <button
                                        onClick={() => {
                                          playSoundEffect("flip", isMuted);
                                          speakSpanish(conj.spanish, isMuted);
                                        }}
                                        className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 text-left cursor-pointer"
                                      >
                                        <span>{conj.spanish}</span>
                                        <Volume2 className="w-3.5 h-3.5 text-slate-300" />
                                      </button>
                                    </td>
                                    <td className="py-2 text-xs font-semibold text-slate-600">{conj.armenian}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>

                      {/* Examples for this Verb */}
                      <div className="mt-4 bg-slate-50/80 rounded-2xl p-4 border border-slate-200 shadow-3xs">
                        <span className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-widest">Օրինակներ</span>
                        <div className="flex flex-col gap-1.5">
                          {verb.examples.map((ex, exIdx) => (
                            <div key={exIdx} className="flex items-start justify-between gap-4 text-xs font-semibold">
                              <span 
                                onClick={() => speakSpanish(ex.spanish, isMuted)}
                                className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                              >
                                {ex.spanish}
                               <Volume2 className="w-3.5 h-3.5 text-slate-300 hover:text-blue-500" />
                              </span>
                              <span className="text-slate-500 text-right">{ex.armenian}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Spanish Reading Material Section */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5 font-display">
                  <Languages className="w-5 h-5 text-blue-600" />
                  <span>Փոքր տեքստ ընթերցանության համար</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-semibold">Կարդա՛ և համեմատի՛ր հայերեն թարգմանության հետ։ Լսի՛ր ամբողջ տեքստի իսպաներեն արտասանությունը։</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="bg-blue-50/40 border border-blue-100 p-5 rounded-2xl">
                    <div className="flex items-center justify-between border-b border-blue-100 pb-2 mb-3">
                      <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">Español</span>
                      <button
                        onClick={() => {
                          playSoundEffect("click", isMuted);
                          speakSpanish("Levántate temprano y prepárate para el día. Dúchate, lávate la cara y cepíllate los dientes. Después, vístete y desayuna algo sano. No te olvides de tus documentos si vas de viaje. Si estás cansado, relájate un poco, pero no te acuestes demasiado tarde. Cuídate, organízate y no te preocupes por cosas pequeñas.", isMuted);
                        }}
                        className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-3xs"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Լսել տեքստը</span>
                      </button>
                    </div>
                    <p className="text-xs font-bold text-slate-800 leading-relaxed italic font-sans">
                      "Levántate temprano y prepárate para el día. Dúchate, lávate la cara y cepíllate los dientes. Después, vístete y desayuna algo sano. No te olvides de tus documentos si vas de viaje. Si estás cansado, relájate un poco, pero no te acuestes demasiado tarde. Cuídate, organízate y no te preocupes por things pequeñas."
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-200 pb-2 mb-3">Հայերեն</span>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      «Շուտ վեր կաց և պատրաստվիր օրվան։ Լոգանք ընդունիր, լվա դեմքդ և մաքրիր ատամներդ։ Հետո հագնվիր և առողջ բան նախաճաշիր։ Եթե ճանապարհորդում ես, մի մոռացիր փաստաթղթերդ։ Եթե հոգնած ես, մի քիչ հանգստացիր, բայց շատ ուշ մի պառկիր քնելու։ Հոգ տար քո մասին, կազմակերպվիր և մի անհանգստացիր փոքր բաների համար։»
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 6 INTERACTIVE GAMES */}
          {activeTab === "games" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              
              {/* Game Selector Tab bar */}
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs flex flex-col gap-3">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider pl-1 block">Խաղի ընտրություն</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Խաղ 1: Կառուցում",
                    "Խաղ 2: Դիրք",
                    "Խաղ 3: Բառադասում",
                    "Խաղ 4: Ակցենտներ",
                    "Խաղ 5: Իրավիճակներ",
                    "Խաղ 6: Քարտեր"
                  ].map((title, idx) => (
                    <button
                      key={idx}
                      id={`game-tab-btn-${idx}`}
                      onClick={() => {
                        playSoundEffect("click", isMuted);
                        setSelectedGame(idx);
                      }}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all border flex items-center gap-1.5 cursor-pointer ${
                        selectedGame === idx 
                          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/15" 
                          : "bg-slate-50 hover:bg-slate-100 border-slate-200/60 text-slate-600"
                      }`}
                    >
                      <span className="w-5 h-5 rounded-md bg-white/20 text-white flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{title}</span>
                      {completedGames.has(idx) && <span className="text-[10px]">✅</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* GAME 1: CONJUGATION BUILDER */}
              {selectedGame === 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Խաղ 1: Կառուցիր Հրամայականը</span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">Ընտրի՛ր ճիշտ վերադարձական հրամայական ձևը</h3>
                    </div>
                    <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                      Հարց՝ {g1Index + 1} / {Game1Questions.length}
                    </div>
                  </div>

                  {Game1Questions[g1Index] && (
                    <div className="flex flex-col gap-5">
                      <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Բայ՝</span>
                          <span className="text-sm font-extrabold text-blue-600 capitalize">
                            {Game1Questions[g1Index].infinitive}
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            ({Game1Questions[g1Index].translation})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <div className="text-xs font-semibold">
                            <span className="text-slate-400 mr-1">Անձ՝</span>
                            <span className="text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-md">{Game1Questions[g1Index].subject}</span>
                          </div>
                          <div className="text-xs font-semibold">
                            <span className="text-slate-400 mr-1">Տեսակ՝</span>
                            <span className={`px-2.5 py-1 rounded-md ${
                              Game1Questions[g1Index].polarity === "affirmative" 
                                ? "bg-green-50 text-green-700 border border-green-100" 
                                : "bg-red-50 text-red-700 border border-red-100"
                            }`}>
                              {Game1Questions[g1Index].polarity === "affirmative" ? "Դրական (+)" : "Ժխտական (-)"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Multiple choice options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Game1Questions[g1Index].options.map((option, idx) => {
                          const isSelected = g1Selected === idx;
                          const isCorrect = idx === Game1Questions[g1Index].correctIdx;
                          let btnStyle = "border-slate-200 hover:bg-slate-50 bg-white";
                          
                          if (g1Answered) {
                            if (isCorrect) btnStyle = "bg-green-50 border-green-400 text-green-800 shadow-xs";
                            else if (isSelected) btnStyle = "bg-red-50 border-red-400 text-red-800 shadow-xs";
                            else btnStyle = "opacity-50 border-slate-100 bg-white";
                          } else if (isSelected) {
                            btnStyle = "bg-blue-600 text-white border-blue-600 shadow-xs";
                          }

                          return (
                            <button
                              key={idx}
                              id={`g1-option-${idx}`}
                              disabled={g1Answered}
                              onClick={() => {
                                playSoundEffect("click", isMuted);
                                setG1Selected(idx);
                              }}
                              className={`p-4 rounded-xl border text-left text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                            >
                              <span>{option}</span>
                              <div className="flex items-center gap-1.5">
                                {g1Answered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                {g1Answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                                <Volume2 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    speakSpanish(option, isMuted);
                                  }} 
                                  className="w-4 h-4 text-slate-300 hover:text-blue-500 transition-colors" 
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      {g1Answered && (
                        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex gap-3 animate-slide-up">
                          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-1">Բացատրություն</span>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              {Game1Questions[g1Index].explanation}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bottom navigation buttons */}
                      <div className="flex justify-between items-center mt-4">
                        <button
                          id="g1-reset-btn"
                          onClick={() => resetGame(0)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Սկսել նորից</span>
                        </button>

                        {!g1Answered ? (
                          <button
                            id="g1-submit-btn"
                            disabled={g1Selected === null}
                            onClick={() => {
                              const correct = g1Selected === Game1Questions[g1Index].correctIdx;
                              setG1Answered(true);
                              handleAnswerSubmit(correct);
                              speakSpanish(Game1Questions[g1Index].options[Game1Questions[g1Index].correctIdx], isMuted);
                            }}
                            className="bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                            Ստուգել պատասխանը
                          </button>
                        ) : (
                          <button
                            id="g1-next-btn"
                            onClick={() => {
                              playSoundEffect("click", isMuted);
                              if (g1Index + 1 < Game1Questions.length) {
                                setG1Index(prev => prev + 1);
                                setG1Selected(null);
                                setG1Answered(false);
                              } else {
                                markGameCompleted(0);
                              }
                            }}
                            className="bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{g1Index + 1 < Game1Questions.length ? "Հաջորդ հարցը" : "Ավարտել խաղը (+100 XP)"}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* GAME 2: PRONOUN PLACEMENT */}
              {selectedGame === 1 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="bg-indigo-100 text-indigo-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Խաղ 2: Դերանունի դիրքը</span>
                      <h3 className="text-base font-bold text-slate-900 mt-1 font-display">Որտե՞ղ պետք է դրվի վերադարձական դերանունը</h3>
                    </div>
                    <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                      Հարց՝ {g2Index + 1} / {Game2Questions.length}
                    </div>
                  </div>

                  {Game2Questions[g2Index] && (
                    <div className="flex flex-col gap-5">
                      {/* Interactive visual layout testing position */}
                      <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col items-center justify-center gap-4 text-center border-b-4 border-indigo-500">
                        <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Նախադասություն</span>
                        
                        <div className="text-2xl font-black font-mono flex items-center gap-3 tracking-wide">
                          {Game2Questions[g2Index].sentence}
                        </div>

                        <p className="text-xs font-semibold text-slate-300 mt-1">
                          Թարգմանություն՝ {Game2Questions[g2Index].meaning}
                        </p>
                      </div>

                      {/* Position Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Game2Questions[g2Index].options.map((opt, idx) => {
                          const isSelected = g2Selected === opt.value;
                          const isCorrect = opt.value === Game2Questions[g2Index].correctValue;
                          let btnStyle = "border-slate-200 hover:bg-slate-50 bg-white";

                          if (g2Answered) {
                            if (isCorrect) btnStyle = "bg-green-50 border-green-400 text-green-800";
                            else if (isSelected) btnStyle = "bg-red-50 border-red-400 text-red-800";
                            else btnStyle = "opacity-50 border-slate-100 bg-white";
                          } else if (isSelected) {
                            btnStyle = "bg-indigo-600 text-white border-indigo-600 shadow-md";
                          }

                          return (
                            <button
                              key={idx}
                              id={`g2-option-${idx}`}
                              disabled={g2Answered}
                              onClick={() => {
                                playSoundEffect("click", isMuted);
                                setG2Selected(opt.value);
                              }}
                              className={`p-5 rounded-xl border text-center text-sm font-extrabold transition-all cursor-pointer ${btnStyle}`}
                            >
                              {opt.text}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Box */}
                      {g2Answered && (
                        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex gap-3 animate-slide-up">
                          <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-1">Կանոնի բացատրություն</span>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              {Game2Questions[g2Index].explanation}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bottom actions */}
                      <div className="flex justify-between items-center mt-4">
                        <button
                          id="g2-reset-btn"
                          onClick={() => resetGame(1)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Սկսել նորից</span>
                        </button>

                        {!g2Answered ? (
                          <button
                            id="g2-submit-btn"
                            disabled={g2Selected === null}
                            onClick={() => {
                              const correct = g2Selected === Game2Questions[g2Index].correctValue;
                              setG2Answered(true);
                              handleAnswerSubmit(correct);
                            }}
                            className="bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                            Ստուգել պատասխանը
                          </button>
                        ) : (
                          <button
                            id="g2-next-btn"
                            onClick={() => {
                              playSoundEffect("click", isMuted);
                              if (g2Index + 1 < Game2Questions.length) {
                                setG2Index(prev => prev + 1);
                                setG2Selected(null);
                                setG2Answered(false);
                              } else {
                                markGameCompleted(1);
                              }
                            }}
                            className="bg-blue-600 text-white hover:bg-blue-750 font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{g2Index + 1 < Game2Questions.length ? "Հաջորդ հարցը" : "Ավարտել խաղը (+100 XP)"}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* GAME 3: WORD SORTER PUZZLE */}
              {selectedGame === 2 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Խաղ 3: Բառերի դասավորում</span>
                      <h3 className="text-base font-bold text-slate-900 mt-1 font-display">Դասավորի՛ր բառերը ճիշտ իսպաներեն հաջորդականությամբ</h3>
                    </div>
                    <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                      Հարց՝ {g3Index + 1} / {Game3Questions.length}
                    </div>
                  </div>

                  {Game3Questions[g3Index] && (
                    <div className="flex flex-col gap-5">
                      <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl text-center">
                        <span className="text-xs font-black text-amber-600 uppercase tracking-widest block mb-2">Հայերեն միտքը</span>
                        <p className="text-base font-extrabold text-slate-800 leading-relaxed">
                          {Game3Questions[g3Index].armenian}
                        </p>
                      </div>

                      {/* Display Area of Selected/Assembled words */}
                      <div className="min-h-16 border-2 border-dashed border-slate-200 rounded-xl p-3 bg-slate-50 flex flex-wrap gap-2 items-center justify-center">
                        {g3Assembled.length === 0 ? (
                          <span className="text-xs text-slate-400 font-medium">Կտտացրու՛ ներքևի բառերի վրա այստեղ հավաքելու համար</span>
                        ) : (
                          g3Assembled.map((word, idx) => (
                            <button
                              key={idx}
                              id={`g3-assembled-word-${idx}`}
                              disabled={g3Submitted}
                              onClick={() => {
                                playSoundEffect("click", isMuted);
                                setG3Assembled(prev => prev.filter((_, i) => i !== idx));
                                setG3Pool(prev => [...prev, word]);
                              }}
                              className="px-3 py-2 bg-blue-600 text-white font-extrabold text-xs rounded-lg shadow-sm border border-blue-600/20 flex items-center gap-1.5 transition-all hover:bg-blue-700 disabled:opacity-80 cursor-pointer animate-scale-up"
                            >
                              <span>{word}</span>
                              {!g3Submitted && <span className="text-[10px] opacity-70">×</span>}
                            </button>
                          ))
                        )}
                      </div>

                      {/* Available Word Pool */}
                      <div className="flex flex-wrap gap-2 items-center justify-center p-2">
                        {g3Pool.map((word, idx) => (
                          <button
                            key={idx}
                            id={`g3-pool-word-${idx}`}
                            disabled={g3Submitted}
                            onClick={() => {
                                playSoundEffect("click", isMuted);
                                setG3Assembled(prev => [...prev, word]);
                                setG3Pool(prev => prev.filter((_, i) => i !== idx));
                            }}
                            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-xs rounded-lg shadow-2xs transition-all cursor-pointer"
                          >
                            {word}
                          </button>
                        ))}
                      </div>

                      {/* Feedback banner */}
                      {g3Submitted && (
                        <div className={`p-4 rounded-xl border flex items-center gap-3 animate-slide-up ${
                          g3IsCorrect 
                            ? "bg-green-50 border-green-200 text-green-800" 
                            : "bg-red-50 border-red-200 text-red-800"
                        }`}>
                          {g3IsCorrect ? <CheckCircle2 className="w-5.5 h-5.5 text-green-600 shrink-0" /> : <XCircle className="w-5.5 h-5.5 text-red-600 shrink-0" />}
                          <div>
                            <span className="text-xs font-black uppercase tracking-wider block">
                              {g3IsCorrect ? "Ճի՛շտ է" : "Սխալ է"}
                            </span>
                            <p className="text-xs font-semibold leading-relaxed mt-1">
                              Ճիշտ նախադասությունն է՝ <strong className="font-mono text-sm">{Game3Questions[g3Index].spanishWords.join(" ")}</strong>
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bottom navigation buttons */}
                      <div className="flex justify-between items-center mt-4">
                        <button
                          id="g3-reset-btn"
                          onClick={() => resetGame(2)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Սկսել նորից</span>
                        </button>

                        {!g3Submitted ? (
                          <button
                            id="g3-submit-btn"
                            disabled={g3Assembled.length === 0}
                            onClick={() => {
                              const assembledStr = g3Assembled.join(" ");
                              const correctStr = Game3Questions[g3Index].spanishWords.join(" ");
                              const correct = assembledStr === correctStr;
                              
                              setG3Submitted(true);
                              setG3IsCorrect(correct);
                              handleAnswerSubmit(correct);
                              speakSpanish(correctStr, isMuted);
                            }}
                            className="bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                            Ստուգել նախադասությունը
                          </button>
                        ) : (
                          <button
                            id="g3-next-btn"
                            onClick={() => {
                              playSoundEffect("click", isMuted);
                              if (g3Index + 1 < Game3Questions.length) {
                                setG3Index(prev => prev + 1);
                              } else {
                                markGameCompleted(2);
                              }
                            }}
                            className="bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>{g3Index + 1 < Game3Questions.length ? "Հաջորդ հարցը" : "Ավարտել խաղը (+100 XP)"}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* GAME 4: ACCENT EXPLORER */}
              {selectedGame === 3 && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs flex flex-col gap-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="bg-purple-100 text-purple-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Խաղ 4: Շեշտադրման վարպետ</span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">Ընտրի՛ր ճիշտ գրավոր շեշտով (ակցենտով) տարբերակը</h3>
                    </div>
                    <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                      Հարց՝ {g4Index + 1} / {Game4Questions.length}
                    </div>
                  </div>

                  {Game4Questions[g4Index] && (
                    <div className="flex flex-col gap-5">
                      <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                        <span className="text-xs text-slate-400 font-bold uppercase block tracking-wider">Խնդիր</span>
                        <p className="text-sm font-semibold text-slate-700 mt-1.5">
                          Պետք է կազմել <strong className="text-rose-600 capitalize">{Game4Questions[g4Index].verb}</strong> բայի դրական հրամայականը <strong className="text-indigo-600">{Game4Questions[g4Index].subject}</strong> անձի հետ։
                        </p>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {Game4Questions[g4Index].options.map((option, idx) => {
                          const isSelected = g4Selected === idx;
                          const isCorrect = idx === Game4Questions[g4Index].correctIdx;
                          let btnStyle = "border-slate-200 hover:bg-slate-50 bg-white";

                          if (g4Answered) {
                            if (isCorrect) btnStyle = "bg-green-50 border-green-400 text-green-800 shadow-2xs";
                            else if (isSelected) btnStyle = "bg-rose-50 border-rose-400 text-rose-800 shadow-2xs";
                            else btnStyle = "opacity-50 border-slate-100 bg-white";
                          } else if (isSelected) {
                            btnStyle = "bg-purple-600 text-white border-purple-600 shadow-2xs";
                          }

                          return (
                            <button
                              key={idx}
                              id={`g4-option-${idx}`}
                              disabled={g4Answered}
                              onClick={() => {
                                playSoundEffect("click", isMuted);
                                setG4Selected(idx);
                              }}
                              className={`p-5 rounded-xl border text-center font-mono text-base font-black tracking-wide transition-all ${btnStyle}`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      {/* Accent Explanation */}
                      {g4Answered && (
                        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex gap-3 animate-slide-up">
                          <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-1">Ինչու՞ է սա ճիշտ</span>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              {Game4Questions[g4Index].explanation}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bottom navigation buttons */}
                      <div className="flex justify-between items-center mt-4">
                        <button
                          id="g4-reset-btn"
                          onClick={() => resetGame(3)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Սկսել նորից</span>
                        </button>

                        {!g4Answered ? (
                          <button
                            id="g4-submit-btn"
                            disabled={g4Selected === null}
                            onClick={() => {
                              const correct = g4Selected === Game4Questions[g4Index].correctIdx;
                              setG4Answered(true);
                              handleAnswerSubmit(correct);
                              speakSpanish(Game4Questions[g4Index].options[Game4Questions[g4Index].correctIdx], isMuted);
                            }}
                            className="bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-xs"
                          >
                            Ստուգել ակցենտը
                          </button>
                        ) : (
                          <button
                            id="g4-next-btn"
                            onClick={() => {
                              playSoundEffect("click", isMuted);
                              if (g4Index + 1 < Game4Questions.length) {
                                setG4Index(prev => prev + 1);
                                setG4Selected(null);
                                setG4Answered(false);
                              } else {
                                markGameCompleted(3);
                              }
                            }}
                            className="bg-rose-500 text-white hover:bg-rose-600 font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <span>{g4Index + 1 < Game4Questions.length ? "Հաջորդ հարցը" : "Ավարտել խաղը (+100 XP)"}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* GAME 5: SITUATIONS MATCH */}
              {selectedGame === 4 && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs flex flex-col gap-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Խաղ 5: Իրավիճակային համապատասխանեցում</span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">Ընտրի՛ր իրավիճակին համապատասխանող իսպաներեն հրամանը</h3>
                    </div>
                    <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                      Հարց՝ {g5Index + 1} / {Game5Questions.length}
                    </div>
                  </div>

                  {Game5Questions[g5Index] && (
                    <div className="flex flex-col gap-5">
                      <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl">
                        <span className="text-xs text-rose-600 font-bold block uppercase tracking-wider mb-1">Իրավիճակ</span>
                        <p className="text-sm font-extrabold text-slate-800 leading-relaxed">
                          {Game5Questions[g5Index].situationArm}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 gap-3">
                        {Game5Questions[g5Index].options.map((option, idx) => {
                          const isSelected = g5Selected === idx;
                          const isCorrect = option === Game5Questions[g5Index].correctSpanish;
                          let btnStyle = "border-slate-200 hover:bg-slate-50 bg-white";

                          if (g5Answered) {
                            if (isCorrect) btnStyle = "bg-green-50 border-green-400 text-green-800 shadow-2xs";
                            else if (isSelected) btnStyle = "bg-rose-50 border-rose-400 text-rose-800 shadow-2xs";
                            else btnStyle = "opacity-50 border-slate-100 bg-white";
                          } else if (isSelected) {
                            btnStyle = "bg-rose-500 text-white border-rose-500 shadow-xs";
                          }

                          return (
                            <button
                              key={idx}
                              id={`g5-option-${idx}`}
                              disabled={g5Answered}
                              onClick={() => {
                                playSoundEffect("click", isMuted);
                                setG5Selected(idx);
                              }}
                              className={`p-4 rounded-xl border text-left text-sm font-extrabold transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{option}</span>
                              <Volume2 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  speakSpanish(option, isMuted);
                                }} 
                                className="w-4 h-4 text-slate-300 hover:text-rose-500 transition-colors" 
                              />
                            </button>
                          );
                        })}
                      </div>

                      {/* Correct details info block */}
                      {g5Answered && (
                        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex gap-3 animate-slide-up">
                          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-black text-slate-800 uppercase tracking-wider block mb-1">Թարգմանություն</span>
                            <p className="text-xs text-slate-600 leading-relaxed font-bold italic">
                              «{Game5Questions[g5Index].correctArm}»
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bottom navigation buttons */}
                      <div className="flex justify-between items-center mt-4">
                        <button
                          id="g5-reset-btn"
                          onClick={() => resetGame(4)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Սկսել նորից</span>
                        </button>

                        {!g5Answered ? (
                          <button
                            id="g5-submit-btn"
                            disabled={g5Selected === null}
                            onClick={() => {
                              const chosenOpt = Game5Questions[g5Index].options[g5Selected!];
                              const correct = chosenOpt === Game5Questions[g5Index].correctSpanish;
                              setG5Answered(true);
                              handleAnswerSubmit(correct);
                              speakSpanish(Game5Questions[g5Index].correctSpanish, isMuted);
                            }}
                            className="bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-xs"
                          >
                            Ստուգել պատասխանը
                          </button>
                        ) : (
                          <button
                            id="g5-next-btn"
                            onClick={() => {
                              playSoundEffect("click", isMuted);
                              if (g5Index + 1 < Game5Questions.length) {
                                setG5Index(prev => prev + 1);
                                setG5Selected(null);
                                setG5Answered(false);
                              } else {
                                markGameCompleted(4);
                              }
                            }}
                            className="bg-rose-500 text-white hover:bg-rose-600 font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                          >
                            <span>{g5Index + 1 < Game5Questions.length ? "Հաջորդ հարցը" : "Ավարտել խաղը (+100 XP)"}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* GAME 6: MEMORIZATION FLASHCARDS */}
              {selectedGame === 5 && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs flex flex-col gap-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="bg-indigo-100 text-indigo-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">Խաղ 6: Ֆլեշ քարտեր և արտասանություն</span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">Մարզի՛ր արտասանությունդ և անգիր արա արտահայտությունները</h3>
                    </div>
                    <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full">
                      Քարտ՝ {g6Index + 1} / {Game6Cards.length}
                    </div>
                  </div>

                  {Game6Cards[g6Index] && (
                    <div className="flex flex-col gap-6 items-center">
                      
                      {/* Premium Interactive 3D/2D Flipping Card */}
                      <div 
                        id="flashcard-container"
                        onClick={() => {
                          playSoundEffect("flip", isMuted);
                          setG6Flipped(!g6Flipped);
                          if (!g6Flipped) {
                            speakSpanish(Game6Cards[g6Index].spanish, isMuted);
                          }
                        }}
                        className={`w-full max-w-md h-64 border rounded-3xl cursor-pointer p-6 flex flex-col justify-between text-center transition-all duration-300 relative overflow-hidden select-none ${
                          g6Flipped 
                            ? "bg-slate-900 text-white border-slate-800 shadow-xl" 
                            : "bg-white text-slate-800 border-slate-200/80 shadow-md hover:border-rose-300"
                        }`}
                      >
                        {/* Upper Badge */}
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            g6Flipped ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-500"
                          }`}>
                            {Game6Cards[g6Index].category} ձև
                          </span>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            Game6Cards[g6Index].polarity === "affirmative" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-rose-100 text-rose-700"
                          }`}>
                            {Game6Cards[g6Index].polarity === "affirmative" ? "Դրական (+)" : "Ժխտական (-)"}
                          </span>
                        </div>

                        {/* Centered Main Content */}
                        <div className="my-auto flex flex-col items-center justify-center gap-3">
                          {!g6Flipped ? (
                            <>
                              <span className="text-3xl font-black font-mono tracking-wide text-rose-600 block">
                                {Game6Cards[g6Index].spanish}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                <volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                                Կտտացրու՛ թարգմանության և արտասանության համար
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-2xl font-extrabold text-amber-400 block leading-tight">
                                {Game6Cards[g6Index].armenian}
                              </span>
                              <p className="text-xs text-slate-300 leading-relaxed max-w-xs font-semibold">
                                {Game6Cards[g6Index].breakdown}
                              </p>
                            </>
                          )}
                        </div>

                        {/* Bottom Utility controls on card */}
                        <div className="flex items-center justify-between w-full">
                          <button
                            id="g6-speak-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              playSoundEffect("click", isMuted);
                              speakSpanish(Game6Cards[g6Index].spanish, isMuted);
                            }}
                            className={`p-2 rounded-xl flex items-center justify-center transition-colors ${
                              g6Flipped ? "bg-white/10 hover:bg-white/20 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            }`}
                            title="Արտասանել իսպաներեն"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          <span className={`text-[10px] font-bold ${g6Flipped ? "text-slate-500" : "text-slate-400"}`}>
                            Շրջելու համար կտտացրու՛ քարտին
                          </span>
                        </div>
                      </div>

                      {/* Memory Actions */}
                      <div className="flex items-center gap-3 w-full max-w-md">
                        <button
                          id="g6-mark-unread"
                          onClick={() => {
                            playSoundEffect("click", isMuted);
                            setMemorizedCards(prev => {
                              const next = new Set(prev);
                              next.delete(Game6Cards[g6Index].id);
                              return next;
                            });
                            // auto slide to next
                            if (g6Index + 1 < Game6Cards.length) {
                              setG6Index(prev => prev + 1);
                              setG6Flipped(false);
                            } else {
                              markGameCompleted(5);
                            }
                          }}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all"
                        >
                          🔄 Դեռ չեմ հիշել
                        </button>
                        
                        <button
                          id="g6-mark-memorized"
                          onClick={() => {
                            playSoundEffect("correct", isMuted);
                            setMemorizedCards(prev => {
                              const next = new Set(prev);
                              next.add(Game6Cards[g6Index].id);
                              return next;
                            });
                            setScore(prev => prev + 20);
                            
                            if (g6Index + 1 < Game6Cards.length) {
                              setG6Index(prev => prev + 1);
                              setG6Flipped(false);
                            } else {
                              markGameCompleted(5);
                            }
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition-all"
                        >
                          🔥 Հիշեցի՛ (+20 XP)
                        </button>
                      </div>

                      {/* Progress bar of card memory */}
                      <div className="w-full max-w-md">
                        <div className="flex justify-between text-[11px] text-slate-500 font-bold mb-1 pl-1">
                          <span>Հիշված քարտեր՝ {memorizedCards.size} / {Game6Cards.length}</span>
                          <span>{Math.round((memorizedCards.size / Game6Cards.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-green-500 h-full transition-all duration-300"
                            style={{ width: `${(memorizedCards.size / Game6Cards.length) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Reset game button */}
                      <button
                        id="g6-reset-btn"
                        onClick={() => resetGame(5)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1.5 mt-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Զրոյացնել հիշած քարտերը</span>
                      </button>

                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 4: CONJUGATION PLAYGROUND */}
          {activeTab === "playground" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="w-5.5 h-5.5 text-rose-500" />
                  <span>Բայերի ինտերակտիվ լաբորատորիա (Playground)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Փորձարկի՛ր տարբեր բայեր, դերանուններ ու տեսակներ և տես, թե ինչպես է դերանունը փոխում իր դիրքն ու ակցենտը իրական ժամանակում։
                </p>

                {/* Live Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {/* Select Verb */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">1. Ընտրի՛ր բայը</label>
                    <select
                      id="playground-verb-select"
                      value={playgroundVerb}
                      onChange={(e) => {
                        playSoundEffect("click", isMuted);
                        setPlaygroundVerb(e.target.value);
                      }}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                    >
                      {ReflexiveVerbsList.map((v, idx) => (
                        <option key={idx} value={v.verb}>
                          {v.verb} ({v.armenian})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Polarity */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">2. Տեսակը</label>
                    <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1">
                      <button
                        id="playground-polarity-aff"
                        onClick={() => {
                          playSoundEffect("click", isMuted);
                          setPlaygroundPolarity("affirmative");
                        }}
                        className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all ${
                          playgroundPolarity === "affirmative" 
                            ? "bg-white text-green-700 shadow-2xs" 
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Դրական (+)
                      </button>
                      <button
                        id="playground-polarity-neg"
                        onClick={() => {
                          playSoundEffect("click", isMuted);
                          setPlaygroundPolarity("negative");
                        }}
                        className={`flex-1 text-center py-1.5 text-xs font-bold rounded-lg transition-all ${
                          playgroundPolarity === "negative" 
                            ? "bg-white text-rose-700 shadow-2xs" 
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        Ժխտական (-)
                      </button>
                    </div>
                  </div>

                  {/* Select Subject pronoun */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">3. Անձը / Դերանունը</label>
                    <select
                      id="playground-subject-select"
                      value={playgroundSubject}
                      onChange={(e) => {
                        playSoundEffect("click", isMuted);
                        setPlaygroundSubject(e.target.value);
                      }}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="tú">tú (դու)</option>
                      <option value="usted">usted (Դուք - հարգալից)</option>
                      <option value="nosotros">nosotros (մենք)</option>
                      <option value="vosotros">vosotros (դուք - ընկերական)</option>
                      <option value="ustedes">ustedes (դուք - հոգնակի)</option>
                    </select>
                  </div>
                </div>

                {/* Displaying Live Interactive Results */}
                <div className="mt-8 bg-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden border-b-8 border-rose-500 shadow-lg">
                  <div className="absolute top-3 left-3 bg-white/10 text-white px-2.5 py-1 rounded-full text-[9px] font-black uppercase">
                    Արդյունք
                  </div>

                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mt-2">Իսպաներեն հրաման</span>
                  
                  <div className="text-3xl md:text-4xl font-black font-mono tracking-wider text-rose-400 mt-3 mb-2">
                    {getPlaygroundConjugation().spanish}
                  </div>

                  <span className="text-base font-bold text-slate-200 capitalize">
                    {getPlaygroundConjugation().armenian}
                  </span>

                  {/* Speak Button */}
                  <button
                    id="playground-speak-btn"
                    onClick={() => speakSpanish(getPlaygroundConjugation().spanish, isMuted)}
                    className="bg-white text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 mt-5 transition-transform hover:scale-105"
                  >
                    <Volume2 className="w-4.5 h-4.5 text-rose-500" />
                    <span>Արտասանել բառը</span>
                  </button>
                </div>
              </div>

              {/* General Interactive Help on Accentuation rules inside playground */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <Info className="w-4.5 h-4.5 text-indigo-500" />
                  <span>Շեշտի և ակցենտի կարևոր կանոնները</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                    <span className="text-xs font-black text-rose-600 uppercase block mb-1">Դրական ձևում</span>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Քանի որ դերանունը միանում է վերջից (օր.՝ <strong className="font-mono">levántate</strong>), բառը երկարում է, և շեշտն ընկնում է վերջից 3-րդ վանկի վրա (esdrújula)։ Այս դեպքում իսպաներենում **միշտ գրվում է** ակցենտի նշանը։
                    </p>
                  </div>

                  <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                    <span className="text-xs font-black text-indigo-600 uppercase block mb-1">Ժխտական ձևում</span>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Քանի որ դերանունը գրվում է առանձին (օր.՝ <strong className="font-mono">no te levantes</strong>), բայի երկարությունը չի փոխվում, և շեշտադրման լրացուցիչ նշան գրելու կարիք չկա։
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: USEFUL EXPRESSIONS */}
          {activeTab === "useful" && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Daily commands checklist */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BookMarked className="w-5.5 h-5.5 text-rose-500" />
                  <span>Ամենօրյա օգտակար հրամաններ</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Սովորի՛ր այս 15 հիմնական արտահայտությունները, որոնք անընդհատ օգտագործվում են առօրյա խոսակցական իսպաներենում։
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                  {UsefulCommands.map((item, idx) => (
                    <div 
                      key={idx}
                      id={`useful-command-item-${idx}`}
                      onClick={() => {
                        playSoundEffect("flip", isMuted);
                        speakSpanish(item.spanish, isMuted);
                      }}
                      className="p-3.5 bg-slate-50/50 hover:bg-rose-50/20 border border-slate-100 hover:border-rose-200 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-xs font-extrabold text-rose-600 block group-hover:underline">{item.spanish}</span>
                          <span className="text-[10px] text-slate-500 font-semibold">{item.armenian}</span>
                        </div>
                      </div>
                      <Volume2 className="w-4.5 h-4.5 text-slate-300 group-hover:text-rose-500 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Common mistakes explorer */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>Սխալներ, որոնք պետք է չանել (Common Mistakes)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Ուսումնասիրի՛ր այս հաճախակի հանդիպող սխալները, որպեսզի խուսափես դրանցից քո խոսքում։
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {MistakesAvoid.map((item, idx) => (
                    <div key={idx} className="border border-slate-100 rounded-xl p-4 bg-slate-50/40">
                      <div className="flex justify-between items-center text-xs font-bold border-b border-slate-100 pb-2 mb-2">
                        <span className="text-rose-600">❌ ՍԽԱԼ</span>
                        <span className="text-green-600">✅ ՃԻՇՏ</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-xs font-bold">
                        <span className="text-slate-400 line-through font-mono">{item.incorrect}</span>
                        <span 
                          onClick={() => speakSpanish(item.correct, isMuted)}
                          className="text-slate-800 font-mono hover:underline cursor-pointer flex items-center gap-1"
                        >
                          {item.correct}
                          <Volume2 className="w-3.5 h-3.5 text-slate-300" />
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold mt-2 block">
                        Թարգմանություն՝ {item.armenian}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Footer copyright */}
      <footer id="app-footer" className="bg-white border-t border-slate-100 py-6 mt-12 text-center text-xs font-medium text-slate-400">
        <p>© 2026 Իսպաներենի Հրամայական Եղանակի Ինտերակտիվ Ուսուցման Հարթակ (Հայալեզու Տարբերակ)</p>
        <p className="mt-1 text-[10px] text-slate-400">Նախագծված է որպես բացառիկ կրթական գործիք իսպաներեն սովորողների համար</p>
      </footer>
    </div>
  );
}
