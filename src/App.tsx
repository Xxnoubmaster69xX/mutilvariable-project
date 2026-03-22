import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Factory, Thermometer, Gauge, ArrowDown, Settings, Activity, Cpu, Zap, Maximize, Minimize, Play, Info, X, BookOpen, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import PrintView from './PrintView';

// Wiki Content Dictionary
const WIKI_CONTENT: Record<string, { title: string; content: string; icon: any; visual?: any }> = {
  'calculo-multivariable': {
    title: 'Cálculo Multivariable',
    content: 'Es la extensión del cálculo a funciones de más de una variable. Mientras el cálculo de una variable analiza líneas y curvas en 2D, el cálculo multivariable estudia superficies y volúmenes en 3D o más dimensiones.',
    icon: <Activity size={24} className="text-sky-400" />,
    visual: (
      <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-center">
        <svg viewBox="0 0 200 100" className="w-full h-32">
          {/* 3D Axes */}
          <line x1="80" y1="80" x2="160" y2="80" stroke="#475569" strokeWidth="2" />
          <line x1="80" y1="80" x2="80" y2="20" stroke="#475569" strokeWidth="2" />
          <line x1="80" y1="80" x2="100" y2="60" stroke="#475569" strokeWidth="2" />
          <text x="165" y="85" fill="#475569" fontSize="10">x</text>
          <text x="70" y="15" fill="#475569" fontSize="10">z</text>
          <text x="105" y="55" fill="#475569" fontSize="10">y</text>
          {/* Surface curve */}
          <path d="M 90 70 Q 120 20 155 55" fill="none" stroke="#38bdf8" strokeWidth="3" />
        </svg>
      </div>
    )
  },
  'derivada-parcial': {
    title: 'Derivada Parcial (∂)',
    content: 'Mide cómo cambia una función cuando variamos UNA sola de sus variables, manteniendo las demás constantes. Imagina caminar por la ladera de una montaña: la derivada parcial en X es tu pendiente si caminas directo al Este, ignorando el Norte.',
    icon: <Activity size={24} className="text-sky-400" />,
    visual: (
      <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700 flex justify-center">
        <svg width="150" height="100" viewBox="0 0 150 100">
          <path d="M 10 80 Q 75 20 140 80" fill="none" stroke="#38bdf8" strokeWidth="3" />
          <line x1="75" y1="50" x2="110" y2="30" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4" />
          <circle cx="75" cy="50" r="4" fill="#ef4444" />
        </svg>
      </div>
    )
  },
  'plano-tangente': {
    title: 'Plano Tangente',
    content: 'Es la aproximación lineal (plana) de una superficie curva en un punto específico. El diferencial total representa el cambio en la altura de este plano tangente, no de la superficie real.',
    icon: <Maximize size={24} className="text-emerald-400" />,
    visual: (
      <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700 flex justify-center">
        <svg width="150" height="100" viewBox="0 0 150 100">
          <ellipse cx="75" cy="60" rx="60" ry="30" fill="none" stroke="#64748b" strokeWidth="2" />
          <polygon points="30,50 100,20 120,50 50,80" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
          <circle cx="75" cy="50" r="4" fill="#ef4444" />
        </svg>
      </div>
    )
  },
  'gas-ideal': {
    title: 'Gas Ideal (PV = nRT)',
    content: 'Un modelo teórico donde las partículas de gas no interactúan entre sí y no ocupan volumen. Aunque no existe en la realidad, es una aproximación excelente para gases a altas temperaturas y bajas presiones.',
    icon: <Factory size={24} className="text-amber-400" />,
    visual: (
      <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700 flex justify-center items-center flex-col gap-4">
        <div className="text-2xl font-mono text-white box-glow px-4 py-2 rounded-lg border border-slate-600">PV = nRT</div>
        <div className="text-sm text-slate-400 text-center">
          P = Presión<br/>
          V = Volumen<br/>
          n = Moles (1 en nuestro caso)<br/>
          R = Constante (8.31 J/(mol·K))<br/>
          T = Temperatura (°K)
        </div>
      </div>
    )
  },
  'diferencial-total': {
    title: 'Diferencial Total (dz)',
    content: 'Es la suma de los cambios parciales. Representa el cambio total estimado de la función cuando TODAS sus variables cambian simultáneamente una cantidad infinitesimal.',
    icon: <Settings size={24} className="text-purple-400" />,
    visual: (
      <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
        <div className="font-mono text-center text-sm space-y-2">
          <div className="text-purple-400">dz = (∂z/∂x)dx + (∂z/∂y)dy</div>
          <div className="text-slate-500">↓</div>
          <div className="text-white">Cambio Total ≈ (Impacto X) + (Impacto Y)</div>
        </div>
      </div>
    )
  },
  'variacion': {
    title: 'Variación (Δ o d)',
    content: 'Representa el cambio en el valor de una variable. Si pasamos de 10 a 12, la variación es +2. En cálculo, "d" (diferencial) se usa para cambios infinitesimales (muy pequeños), mientras que "Δ" (delta) se usa para cambios macroscópicos.',
    icon: <ArrowDown size={24} className="text-emerald-400" />,
    visual: (
      <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700 flex justify-center">
        <div className="font-mono text-center space-y-2">
          <div className="text-slate-400">Valor Final - Valor Inicial</div>
          <div className="text-emerald-400 text-xl font-bold">Δx = x₂ - x₁</div>
        </div>
      </div>
    )
  },
  'presion': {
    title: 'Presión (P)',
    content: 'Fuerza que ejerce el gas sobre las paredes del recipiente por unidad de área. A nivel microscópico, es el resultado de millones de colisiones de las partículas del gas contra las paredes.',
    icon: <Gauge size={24} className="text-red-400" />,
    visual: (
      <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700 flex justify-center">
        <svg width="150" height="100" viewBox="0 0 150 100">
          <rect x="20" y="20" width="110" height="60" fill="none" stroke="#64748b" strokeWidth="2" />
          <circle cx="50" cy="50" r="4" fill="#ef4444" />
          <line x1="50" y1="50" x2="20" y2="40" stroke="#ef4444" strokeWidth="2" strokeDasharray="2" />
          <circle cx="90" cy="40" r="4" fill="#38bdf8" />
          <line x1="90" y1="40" x2="130" y2="30" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2" />
          <circle cx="70" cy="70" r="4" fill="#f59e0b" />
          <line x1="70" y1="70" x2="60" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2" />
        </svg>
      </div>
    )
  },
  'sistema-complejo': {
    title: 'Sistema Complejo',
    content: 'Un sistema donde múltiples variables interactúan entre sí. En termodinámica, cambiar la temperatura puede afectar el volumen y la presión simultáneamente, haciendo imposible analizar una variable ignorando las demás.',
    icon: <Cpu size={24} className="text-slate-400" />,
    visual: (
      <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700 flex justify-center">
        <svg width="150" height="100" viewBox="0 0 150 100">
          <circle cx="75" cy="50" r="30" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4" className="animate-spin-slow" />
          <circle cx="75" cy="50" r="15" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4" className="animate-spin-slow-reverse" />
          <circle cx="75" cy="50" r="4" fill="#f59e0b" />
          <path d="M 45 50 L 20 50 M 105 50 L 130 50 M 75 20 L 75 10 M 75 80 L 75 90" stroke="#ef4444" strokeWidth="2" />
        </svg>
      </div>
    )
  },
  'referencias': {
    title: 'Referencias y Bibliografía',
    content: '1. Stewart, J. (2012). Cálculo de varias variables. Cengage Learning.\n\n2. Larson, R., & Edwards, B. H. (2010). Cálculo 2 de varias variables. McGraw-Hill.\n\n3. Termodinámica: Ley de los gases ideales y sus aplicaciones en ingeniería.',
    icon: <BookOpen size={24} className="text-slate-400" />,
    visual: (
      <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700 text-center">
        <div className="text-sm text-slate-500 mb-2">Proyecto Universitario</div>
        <div className="text-xs text-slate-600 font-mono">Presentación Interactiva v2.0</div>
      </div>
    )
  }
};

export default function App() {
  const [vol, setVol] = useState(12);
  const [temp, setTemp] = useState(310);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeWiki, setActiveWiki] = useState<string | null>(null);
  const [showMathDetails, setShowMathDetails] = useState(false);
  const [showIndex, setShowIndex] = useState(false);
  
  const totalSlides = 11;
  const SLIDE_STEPS = [3, 6, 6, 3, 2, 3, 3, 4, 4, 1, 1];
  const [rawSlideSteps, setRawSlideSteps] = useState<number[]>(Array(totalSlides).fill(0));
  
  // When not in fullscreen, show all steps (SLIDE_STEPS has the max steps for each slide)
  const slideSteps = isFullscreen ? rawSlideSteps : SLIDE_STEPS.map(max => max - 1);
  
  // Minigame state
  const [mgScore, setMgScore] = useState(0);
  const [mgQuestion, setMgQuestion] = useState(0);
  const [mgFeedback, setMgFeedback] = useState<{correct: boolean, text: string} | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);

  // Refs for keyboard navigation to avoid stale closures and re-binding
  const currentSlideRef = useRef(currentSlide);
  const activeWikiRef = useRef(activeWiki);
  const showIndexRef = useRef(showIndex);

  useEffect(() => { currentSlideRef.current = currentSlide; }, [currentSlide]);
  useEffect(() => { activeWikiRef.current = activeWiki; }, [activeWiki]);
  useEffect(() => { showIndexRef.current = showIndex; }, [showIndex]);
  
  const slideTitles = [
    "Inicio: Diferencial Total",
    "Concepto: El Problema y la Solución",
    "Fórmula: Anatomía de la Ecuación",
    "Caso de Estudio: Gas Ideal",
    "Simulador Termodinámico",
    "Cálculo Paso 1: Incrementos",
    "Cálculo Paso 2: Derivadas Parciales",
    "Cálculo Paso 3: El Ensamble",
    "Conclusión: Interpretación Física",
    "Escenarios Interactivos: Gráficas en Tiempo Real",
    "Mini-Juego: Intuición Termodinámica"
  ];
  
  // Calculate pressure P = 8.31T / V
  const pressure = (8.31 * temp) / vol;
  const initialPressure = (8.31 * 310) / 12;
  const pressureDiff = pressure - initialPressure;

  const handlePrint = () => {
    window.print();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      slideRefs.current[currentSlideRef.current]?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.exitFullscreen();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with input elements (like the range sliders)
      if (document.activeElement?.tagName === 'INPUT') {
        if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
          return;
        }
      }

      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        if (!document.fullscreenElement) {
          containerRef.current?.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
          });
          slideRefs.current[currentSlideRef.current]?.scrollIntoView({ behavior: 'smooth' });
        } else {
          document.exitFullscreen();
        }
        return;
      }

      const current = currentSlideRef.current;

      if (['ArrowRight', 'ArrowDown', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        
        // If a wiki is open, close it and DO NOT advance the step (3 clicks behavior)
        if (activeWikiRef.current) {
          setActiveWiki(null);
          return;
        }

        setRawSlideSteps(prev => {
          const newSteps = [...prev];
          if (newSteps[current] < SLIDE_STEPS[current] - 1) {
            newSteps[current]++;
            return newSteps;
          } else {
            const next = Math.min(current + 1, totalSlides - 1);
            if (next !== current) {
              slideRefs.current[next]?.scrollIntoView({ behavior: 'smooth' });
            }
            return prev;
          }
        });
      } else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        
        if (activeWikiRef.current) {
          setActiveWiki(null);
          return;
        }

        setRawSlideSteps(prev => {
          const newSteps = [...prev];
          if (newSteps[current] > 0) {
            newSteps[current]--;
            return newSteps;
          } else {
            const next = Math.max(current - 1, 0);
            if (next !== current) {
              slideRefs.current[next]?.scrollIntoView({ behavior: 'smooth' });
              newSteps[next] = SLIDE_STEPS[next] - 1;
            }
            return newSteps;
          }
        });
      } else if (e.key === 'Escape') {
        if (activeWikiRef.current) {
          setActiveWiki(null);
        } else if (showIndexRef.current) {
          setShowIndex(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [SLIDE_STEPS, totalSlides]);

  // Sync currentSlide with scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = slideRefs.current.findIndex((el) => el === entry.target);
            if (index !== -1) {
              setCurrentSlide(index);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => observer.disconnect();
  }, []);

  // Sync activeWiki with slideSteps
  useEffect(() => {
    const WIKI_SEQUENCE: Record<number, Record<number, string>> = {
      0: { 1: 'calculo-multivariable', 2: 'diferencial-total' },
      1: { 1: 'sistema-complejo', 3: 'diferencial-total', 4: 'derivada-parcial', 5: 'plano-tangente' },
      2: { 4: 'diferencial-total', 5: 'derivada-parcial' },
      3: { 1: 'gas-ideal' },
      4: { 1: 'presion' },
      5: { 1: 'variacion' },
      6: { 1: 'derivada-parcial' },
      7: { 1: 'diferencial-total' },
      8: { 3: 'gas-ideal' },
    };
    
    const expectedWiki = WIKI_SEQUENCE[currentSlide]?.[rawSlideSteps[currentSlide]];
    if (expectedWiki && isFullscreen) {
      setActiveWiki(expectedWiki);
    } else if (isFullscreen) {
      setActiveWiki(null);
    }
  }, [currentSlide, rawSlideSteps, isFullscreen]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      if (isFull) {
        setRawSlideSteps(Array(totalSlides).fill(0));
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const mgQuestions = [
    {
      q: "Si comprimimos el gas (V ↓) y lo calentamos (T ↑), ¿qué pasa con la presión?",
      options: ["Sube mucho", "Baja", "Se mantiene"],
      answer: 0,
      explanation: "Ambos efectos aumentan la presión. Menos volumen = más choques. Más temperatura = choques más fuertes."
    },
    {
      q: "Si expandimos el gas (V ↑) y lo enfriamos (T ↓), ¿qué pasa con la presión?",
      options: ["Sube", "Baja mucho", "Se mantiene"],
      answer: 1,
      explanation: "Ambos efectos reducen la presión. Más volumen = menos choques. Menos temperatura = choques más débiles."
    },
    {
      q: "Si expandimos el gas (V ↑) pero lo calentamos (T ↑), ¿qué pasa con la presión?",
      options: ["Sube", "Baja", "Depende de qué cambie más"],
      answer: 2,
      explanation: "Efectos opuestos. La expansión reduce la presión, pero el calentamiento la aumenta. El resultado final depende de las magnitudes (el Diferencial Total nos daría el valor exacto)."
    }
  ];

  const handleMgAnswer = (idx: number) => {
    if (mgFeedback) return; // Prevent multiple clicks
    if (idx === mgQuestions[mgQuestion].answer) {
      setMgScore(s => s + 1);
      setMgFeedback({ correct: true, text: "¡Correcto! " + mgQuestions[mgQuestion].explanation });
    } else {
      setMgFeedback({ correct: false, text: "Incorrecto. " + mgQuestions[mgQuestion].explanation });
    }
  };

  const nextMgQuestion = () => {
    setMgFeedback(null);
    if (mgQuestion < mgQuestions.length - 1) {
      setMgQuestion(q => q + 1);
    } else {
      setMgQuestion(99); // End of game
    }
  };

  return (
    <div ref={containerRef} className="bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30 relative">
      <PrintView />

      {/* Presentation Controls */}
      <div className="no-print fixed bottom-4 left-4 z-50 flex gap-3 opacity-30 hover:opacity-100 transition-opacity">
        <button 
          onClick={toggleFullscreen}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-sky-600/80 text-white hover:bg-sky-500 border border-sky-400/50 transition-all shadow-[0_0_15px_rgba(14,165,233,0.5)]"
          title="Iniciar Presentación"
        >
          {isFullscreen ? <Minimize size={20} /> : <Play size={20} />}
          <span className="font-mono text-sm uppercase tracking-wider hidden md:inline">
            {isFullscreen ? 'Salir' : 'Presentar'}
          </span>
        </button>
        <button 
          onClick={() => setShowIndex(!showIndex)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-600/50 transition-all shadow-lg"
          title="Índice de Diapositivas"
        >
          <BookOpen size={20} />
          <span className="font-mono text-sm uppercase tracking-wider hidden md:inline">
            Índice
          </span>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setActiveWiki('referencias'); }}
          className="wiki-link flex items-center gap-2 px-4 py-3 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-600/50 transition-all shadow-lg"
          title="Ver Referencias"
        >
          <Info size={20} />
          <span className="font-mono text-sm uppercase tracking-wider hidden md:inline">
            Referencias
          </span>
        </button>
      </div>

      {/* Discreet Print Button */}
      <button 
        onClick={handlePrint}
        className="no-print fixed bottom-4 right-4 z-50 p-3 rounded-full bg-slate-800/50 text-slate-500 hover:text-sky-400 hover:bg-slate-800 border border-slate-700/50 transition-all opacity-30 hover:opacity-100"
        title="Imprimir / Exportar a PDF (Ctrl+P)"
      >
        <Printer size={20} />
      </button>

      {/* Slide Indicator */}
      <div className="no-print fixed top-4 right-4 z-50 font-mono text-xs text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
        {currentSlide + 1} / {totalSlides}
      </div>

      {/* Wiki Panel Overlay */}
      <AnimatePresence>
        {activeWiki && WIKI_CONTENT[activeWiki] && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="no-print fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setActiveWiki(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                <div className="flex items-center gap-3">
                  {WIKI_CONTENT[activeWiki].icon}
                  <h3 className="font-bold text-lg text-white">{WIKI_CONTENT[activeWiki].title}</h3>
                </div>
                <button 
                  onClick={() => setActiveWiki(null)}
                  className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                  {WIKI_CONTENT[activeWiki].content}
                </p>
                {WIKI_CONTENT[activeWiki].visual}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Index Modal */}
      <AnimatePresence>
        {showIndex && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="no-print fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
            onClick={() => setShowIndex(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                <h2 className="text-2xl font-bold text-sky-400 flex items-center gap-2">
                  <BookOpen size={24} /> Índice de Contenidos
                </h2>
                <button onClick={() => setShowIndex(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid gap-2">
                {slideTitles.map((title, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      slideRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
                      setShowIndex(false);
                    }}
                    className={`flex items-center gap-4 p-4 rounded-xl text-left transition-all ${
                      currentSlide === index 
                        ? 'bg-sky-500/20 border border-sky-500/50 text-white' 
                        : 'bg-slate-950/50 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className={`font-mono text-sm w-8 h-8 rounded-full flex items-center justify-center ${
                      currentSlide === index ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-lg">{title}</span>
                    {currentSlide === index && <ChevronRight className="ml-auto text-sky-400" size={20} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Presentation View */}
      <div className="no-print h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth" onClick={(e) => {
        // Close wiki if clicking outside
        if (activeWiki && !(e.target as HTMLElement).closest('.wiki-link')) {
          setActiveWiki(null);
        }
      }}>
        
        {/* =========================================================
            PRESENTER 1: INTRO & THEORY
            ========================================================= */}

        {/* SLIDE 1: HERO */}
        <section ref={el => slideRefs.current[0] = el} className="min-h-screen py-20 w-full snap-start relative flex flex-col items-center justify-center overflow-hidden bg-slate-950 blueprint-grid">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-900 via-slate-900 to-slate-950"></div>
          
          {/* Animated Background Gears */}
          <div className="absolute top-10 left-10 opacity-10 text-sky-500 animate-spin-slow">
            <Settings size={200} className="stroke-1" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-10 text-amber-500 animate-spin-slow-reverse">
            <Settings size={300} className="stroke-1" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 text-center px-4"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveWiki('calculo-multivariable'); }}
              className="wiki-link inline-flex items-center gap-3 px-4 py-2 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 mb-8 font-mono text-sm uppercase tracking-widest hover:bg-sky-500/20 transition-colors cursor-pointer"
              title="¿Qué es el Cálculo Multivariable?"
            >
              <Activity size={16} /> Cálculo Multivariable <Info size={14} className="opacity-50" />
            </button>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter">
              DIFERENCIAL <br/> <span className="text-sky-500 text-glow-blue cursor-pointer wiki-link hover:text-sky-400 transition-colors" onClick={(e) => { e.stopPropagation(); setActiveWiki('diferencial-total'); }}>TOTAL <Info size={24} className="inline opacity-50 mb-4" /></span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light">
              Analizando el caos en sistemas complejos.
            </p>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-12 text-slate-500 flex flex-col items-center gap-2"
            >
              <span className="font-mono text-sm uppercase tracking-widest">Desliza para iniciar o presiona 'F'</span>
              <ArrowDown />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-16 text-slate-400 font-mono text-xs md:text-sm uppercase tracking-widest border-t border-slate-800 pt-8"
            >
              <div className="mb-2 text-sky-500 font-bold">Equipo 3</div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-6 justify-center">
                <span>David Eduardo Lara Flores</span>
                <span className="hidden md:inline">•</span>
                <span>Cindy Roselyn Herrera Rodriguez</span>
                <span className="hidden md:inline">•</span>
                <span>Brayan Elias Calzoncit Berlanga</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* SLIDE 2: THE CONCEPT */}
        <section ref={el => slideRefs.current[1] = el} className="min-h-screen py-20 w-full snap-start relative flex flex-col items-center justify-center bg-slate-900 px-4 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid-dense opacity-5"></div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl w-full z-10"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-12 text-center">
              ¿QUÉ ES ESTA <span className="text-amber-500 text-glow">HERRAMIENTA</span>?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                animate={{ opacity: slideSteps[1] >= 0 ? 1 : 0, x: slideSteps[1] >= 0 ? 0 : -30 }}
                transition={{ duration: 0.6 }}
                className="bg-slate-950/80 border border-slate-800 p-8 rounded-2xl relative overflow-hidden group hover:border-slate-600 transition-colors"
              >
                <button className="absolute top-4 right-4 text-slate-500 hover:text-white wiki-link transition-colors z-20 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); setActiveWiki('sistema-complejo'); }} title="¿Qué es un Sistema Complejo?">
                  <Info size={20} />
                </button>
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity"><Cpu size={48} /></div>
                <h3 className="text-2xl font-bold mb-4 text-slate-300">El Problema Real</h3>
                <p className="text-lg text-slate-400 leading-relaxed">
                  En ingeniería, rara vez se altera una sola variable de forma aislada. Si calientas un gas y al mismo tiempo expandes su tanque... ¿qué le pasa a la presión? Todo interactúa simultáneamente.
                </p>
              </motion.div>
              <motion.div 
                animate={{ opacity: slideSteps[1] >= 2 ? 1 : 0, x: slideSteps[1] >= 2 ? 0 : 30 }}
                transition={{ duration: 0.6 }}
                className="bg-slate-950/80 border border-slate-800 p-8 rounded-2xl box-glow-blue relative overflow-hidden group hover:border-sky-500/50 transition-colors"
              >
                <button className="absolute top-4 right-4 text-slate-500 hover:text-sky-400 wiki-link transition-colors z-20 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); setActiveWiki('diferencial-total'); }} title="¿Qué es el Diferencial Total?">
                  <Info size={20} />
                </button>
                <div className="absolute top-0 right-0 p-4 opacity-20 text-sky-500 group-hover:opacity-40 transition-opacity"><Zap size={48} /></div>
                <h3 className="text-2xl font-bold mb-4 text-sky-400">La Solución</h3>
                <p className="text-lg text-slate-300 leading-relaxed">
                  El <strong>Diferencial Total</strong>. En lugar de recalcular toda la función desde cero, utiliza las <button className="wiki-link text-sky-400 underline decoration-sky-400/30 underline-offset-4 hover:decoration-sky-400 transition-all" onClick={(e) => { e.stopPropagation(); setActiveWiki('derivada-parcial'); }}>derivadas parciales</button> para estimar el impacto total de forma rápida y precisa sobre un <button className="wiki-link text-emerald-400 underline decoration-emerald-400/30 underline-offset-4 hover:decoration-emerald-400 transition-all" onClick={(e) => { e.stopPropagation(); setActiveWiki('plano-tangente'); }}>plano tangente</button>.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* SLIDE 3: THE FORMULA */}
        <section ref={el => slideRefs.current[2] = el} className="min-h-screen py-20 w-full snap-start relative flex flex-col items-center justify-center bg-slate-950 px-4 blueprint-grid">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl w-full text-center"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 text-slate-400 mb-8 font-mono text-sm uppercase tracking-widest cursor-help" title="Haz clic en los elementos de la fórmula para más detalles">
              <BookOpen size={16} /> Anatomía Interactiva
            </div>
            
            <div className="bg-slate-900 border border-slate-700 p-12 rounded-3xl box-glow relative overflow-hidden">
              {/* Decorative SVG lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                <path d="M 0 50 Q 150 50 150 150 T 300 150" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 5" />
                <path d="M 100 200 L 400 200" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" />
              </svg>

              <div className="font-mono text-4xl md:text-6xl text-slate-200 relative z-10 flex flex-wrap justify-center items-center gap-4">
                <motion.button animate={{ opacity: slideSteps[2] >= 0 ? 1 : 0 }} className="wiki-link hover:text-purple-400 transition-colors relative group" onClick={(e) => { e.stopPropagation(); setActiveWiki('diferencial-total'); }}>
                  dz
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-800 px-2 py-1 rounded flex items-center gap-1"><Info size={12}/> Diferencial Total</span>
                </motion.button>
                <motion.span animate={{ opacity: slideSteps[2] >= 1 ? 1 : 0 }} className="text-slate-500">=</motion.span>
                <motion.button animate={{ opacity: slideSteps[2] >= 1 ? 1 : 0 }} className="wiki-link text-sky-400 relative group hover:text-sky-300 transition-colors" onClick={(e) => { e.stopPropagation(); setActiveWiki('derivada-parcial'); }}>
                  (∂z/∂x)
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-800 px-2 py-1 rounded flex items-center gap-1"><Info size={12}/> Sensibilidad a X</span>
                </motion.button>
                <motion.span animate={{ opacity: slideSteps[2] >= 1 ? 1 : 0 }} className="text-slate-300 cursor-help" title="Cambio infinitesimal en X">dx</motion.span>
                <motion.span animate={{ opacity: slideSteps[2] >= 2 ? 1 : 0 }} className="text-slate-500">+</motion.span>
                <motion.button animate={{ opacity: slideSteps[2] >= 2 ? 1 : 0 }} className="wiki-link text-amber-400 relative group hover:text-amber-300 transition-colors" onClick={(e) => { e.stopPropagation(); setActiveWiki('derivada-parcial'); }}>
                  (∂z/∂y)
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-800 px-2 py-1 rounded flex items-center gap-1"><Info size={12}/> Sensibilidad a Y</span>
                </motion.button>
                <motion.span animate={{ opacity: slideSteps[2] >= 2 ? 1 : 0 }} className="text-slate-300 cursor-help" title="Cambio infinitesimal en Y">dy</motion.span>
              </div>
            </div>
            <motion.p animate={{ opacity: slideSteps[2] >= 3 ? 1 : 0 }} className="mt-8 text-xl text-slate-400 font-light">
              La suma de los impactos individuales de cada variable. <br/>
              <span className="text-sm text-slate-500">(Toca los elementos para explorar la wiki)</span>
            </motion.p>
          </motion.div>
        </section>

        {/* =========================================================
            PRESENTER 2: THE PROBLEM & SIMULATION
            ========================================================= */}

        {/* SLIDE 4: THE SCENARIO */}
        <section ref={el => slideRefs.current[3] = el} className="min-h-screen py-20 w-full snap-start relative flex flex-col items-center justify-center bg-slate-900 px-4">
          <div className="absolute inset-0 blueprint-grid opacity-10"></div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl w-full z-10"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 uppercase text-left border-l-8 border-sky-500 pl-6">
              Caso de <br/><span className="text-sky-500 text-glow-blue">Estudio</span>
            </h2>
            
            <div className="bg-slate-950 p-8 md:p-12 rounded-2xl border border-slate-800 font-mono text-lg md:text-2xl text-slate-300 leading-relaxed shadow-2xl">
              <motion.div animate={{ opacity: slideSteps[3] >= 0 ? 1 : 0, y: slideSteps[3] >= 0 ? 0 : 20 }}>
                <p className="mb-6">
                  <span className="text-sky-500">Misión:</span> La presión, volumen y temperatura de un mol de un <button className="wiki-link text-amber-400 underline decoration-amber-400/30 underline-offset-4 hover:decoration-amber-400 transition-all" onClick={(e) => { e.stopPropagation(); setActiveWiki('gas-ideal'); }}>gas ideal <Info size={16} className="inline mb-1 opacity-50"/></button> están relacionados mediante la ecuación:
                </p>
                <div className="text-center text-4xl md:text-6xl text-white my-10 py-8 bg-slate-900 rounded-xl border border-slate-700 box-glow">
                  PV = 8.31T
                </div>
              </motion.div>
              <motion.p animate={{ opacity: slideSteps[3] >= 2 ? 1 : 0, y: slideSteps[3] >= 2 ? 0 : 20 }}>
                Estimar el cambio aproximado en la <span className="text-emerald-400">presión</span> si el <span className="text-sky-400">volumen</span> pasa de 12 a 12.3 litros y la <span className="text-red-400">temperatura</span> disminuye de 310 a 305 °K.
              </motion.p>
            </div>
          </motion.div>
        </section>

        {/* SLIDE 5: INTERACTIVE TANK */}
        <section ref={el => slideRefs.current[4] = el} className="min-h-screen py-20 w-full snap-start relative flex flex-col items-center justify-center bg-slate-950 px-4 overflow-hidden">
          {/* Animated SVG Pipes Background */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: 0 }}>
            <path d="M 0 200 L 200 200 L 200 400 L 400 400" fill="none" stroke="#38bdf8" strokeWidth="8" strokeDasharray="20 20" className="animate-flow" />
            <path d="M 1000 600 L 800 600 L 800 200 L 600 200" fill="none" stroke="#ef4444" strokeWidth="8" strokeDasharray="20 20" className="animate-flow" />
          </svg>

          <div className="max-w-6xl w-full z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 mb-4 font-mono text-sm uppercase tracking-widest">
                <Factory size={16} /> Panel de Control Industrial
              </div>
              <h2 className="text-4xl font-bold">SIMULADOR TERMODINÁMICO</h2>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8 items-center">
              {/* Controls */}
              <div className="space-y-8 bg-slate-900/90 backdrop-blur p-8 rounded-2xl border border-slate-700 shadow-2xl">
                <div>
                  <label className="flex justify-between text-sm font-mono text-sky-400 mb-4">
                    <span className="flex items-center gap-2"><Settings size={16}/> VÁLVULA DE VOLUMEN (V)</span>
                    <span className="text-lg">{vol.toFixed(2)} L</span>
                  </label>
                  <input 
                    type="range" min="10" max="15" step="0.1" 
                    value={vol} onChange={(e) => setVol(Number(e.target.value))}
                    className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                    <span>10 L</span>
                    <span className="text-sky-500">Objetivo: 12.3 L</span>
                    <span>15 L</span>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-800">
                  <label className="flex justify-between text-sm font-mono text-red-400 mb-4">
                    <span className="flex items-center gap-2"><Thermometer size={16}/> QUEMADOR (T)</span>
                    <span className="text-lg">{temp} °K</span>
                  </label>
                  <input 
                    type="range" min="280" max="340" step="1" 
                    value={temp} onChange={(e) => setTemp(Number(e.target.value))}
                    className="w-full accent-red-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                    <span>280 °K</span>
                    <span className="text-red-500">Objetivo: 305 °K</span>
                    <span>340 °K</span>
                  </div>
                </div>
              </div>

              {/* Visual Tank */}
              <div className="flex justify-center relative h-80">
                <div className="absolute inset-0 flex justify-center">
                  {/* Piston Rod */}
                  <motion.div 
                    className="w-4 bg-slate-600 absolute top-0"
                    animate={{ height: `${100 - (vol / 15) * 100}%` }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  />
                </div>
                <motion.div 
                  className="absolute bottom-12 w-56 bg-slate-800/80 backdrop-blur border-4 border-slate-500 rounded-t-sm rounded-b-3xl overflow-hidden flex items-end shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                  animate={{ height: `${(vol / 15) * 100}%` }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  {/* Gas inside */}
                  <motion.div 
                    className="w-full opacity-60 relative overflow-hidden"
                    animate={{ 
                      height: '100%',
                      backgroundColor: temp > 310 ? '#ef4444' : temp < 305 ? '#3b82f6' : '#f59e0b'
                    }}
                  >
                    {/* Bubbles/Particles */}
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)', backgroundSize: '20px 20px', backgroundPosition: '0 0' }}></div>
                  </motion.div>
                </motion.div>
                {/* Burner */}
                <motion.div 
                  className="absolute bottom-0 w-32 h-8 rounded-full blur-md"
                  animate={{ 
                    backgroundColor: temp > 310 ? '#ef4444' : temp < 305 ? '#3b82f6' : '#f59e0b',
                    scale: temp / 310,
                    opacity: temp / 340
                  }}
                />
                <div className="absolute -bottom-6 font-mono text-slate-400 bg-slate-900 px-4 py-1 rounded-full border border-slate-700">CÁMARA DE GAS</div>
              </div>

              {/* Output Gauge */}
              <div className="bg-slate-900/90 backdrop-blur p-8 rounded-2xl border border-slate-700 text-center relative overflow-hidden shadow-2xl">
                <button className="absolute top-4 right-4 text-slate-500 hover:text-white wiki-link transition-colors z-20" onClick={(e) => { e.stopPropagation(); setActiveWiki('presion'); }} title="¿Qué es la presión?">
                  <Info size={20} />
                </button>
                <div className={`absolute inset-0 opacity-10 ${pressureDiff < 0 ? 'bg-sky-500' : 'bg-red-500'}`}></div>
                <Gauge className={`mx-auto mb-6 ${pressureDiff < 0 ? 'text-sky-400' : 'text-red-400'}`} size={64} />
                <h3 className="text-sm font-mono text-slate-400 mb-2">PRESIÓN INTERNA (P)</h3>
                <div className="text-6xl font-bold font-mono mb-2 text-white">
                  {pressure.toFixed(2)}
                </div>
                <div className="text-slate-500 font-mono text-lg mb-6">kPa</div>
                
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-mono font-bold ${pressureDiff < 0 ? 'text-sky-400 bg-sky-400/10 border border-sky-400/30' : 'text-red-400 bg-red-400/10 border border-red-400/30'}`}>
                  Δ {pressureDiff > 0 ? '+' : ''}{pressureDiff.toFixed(2)} kPa
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            PRESENTER 3: MATH EXECUTION & CONCLUSION
            ========================================================= */}

        {/* SLIDE 6: STEP 1 - INCREMENTS */}
        <section ref={el => slideRefs.current[5] = el} className="min-h-screen py-20 w-full snap-start relative flex flex-col items-center justify-center bg-slate-900 px-4 blueprint-grid-dense">
          <div className="max-w-4xl w-full">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center uppercase relative">
              Paso 1: <span className="text-sky-500 text-glow-blue">Los Incrementos</span>
              <button className="absolute -top-4 -right-4 text-slate-500 hover:text-sky-400 wiki-link transition-colors" onClick={(e) => { e.stopPropagation(); setActiveWiki('gas-ideal'); }} title="Recordar fórmula">
                <Info size={20} />
              </button>
            </h2>

            <div className="grid md:grid-cols-2 gap-8 font-mono">
              <motion.div 
                animate={{ opacity: slideSteps[5] >= 0 ? 1 : 0, y: slideSteps[5] >= 0 ? 0 : 30 }}
                transition={{ duration: 0.6 }}
                className="bg-slate-950 p-8 rounded-2xl border-t-4 border-sky-500 shadow-xl relative"
              >
                <button className="absolute top-4 right-4 text-slate-500 hover:text-sky-400 wiki-link transition-colors" onClick={(e) => { e.stopPropagation(); setActiveWiki('variacion'); }} title="¿Qué es la variación?"><Info size={20}/></button>
                <h3 className="text-slate-500 mb-6 text-xl border-b border-slate-800 pb-4 pr-8">Variación de Volumen</h3>
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between"><span>V inicial:</span> <span className="text-white">12 L</span></div>
                  <div className="flex justify-between"><span>V final:</span> <span className="text-white">12.3 L</span></div>
                  <div className="flex justify-between pt-4 border-t border-slate-800 font-bold text-2xl">
                    <span>dV =</span> <span className="text-sky-400">+0.3 L</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ opacity: slideSteps[5] >= 2 ? 1 : 0, y: slideSteps[5] >= 2 ? 0 : 30 }}
                transition={{ duration: 0.6 }}
                className="bg-slate-950 p-8 rounded-2xl border-t-4 border-red-500 shadow-xl relative"
              >
                <button className="absolute top-4 right-4 text-slate-500 hover:text-red-400 wiki-link transition-colors" onClick={(e) => { e.stopPropagation(); setActiveWiki('variacion'); }} title="¿Qué es la variación?"><Info size={20}/></button>
                <h3 className="text-slate-500 mb-6 text-xl border-b border-slate-800 pb-4 pr-8">Variación de Temperatura</h3>
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between"><span>T inicial:</span> <span className="text-white">310 °K</span></div>
                  <div className="flex justify-between"><span>T final:</span> <span className="text-white">305 °K</span></div>
                  <div className="flex justify-between pt-4 border-t border-slate-800 font-bold text-2xl">
                    <span>dT =</span> <span className="text-red-400">-5 °K</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SLIDE 7: STEP 2 - DERIVATIVES */}
        <section ref={el => slideRefs.current[6] = el} className="min-h-screen py-20 w-full snap-start relative flex flex-col items-center justify-center bg-slate-950 px-4">
          <div className="max-w-5xl w-full">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center uppercase">
              Paso 2: <span className="text-amber-500 text-glow">Derivadas Parciales</span>
            </h2>

            <div className="bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-800 font-mono box-glow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={100} /></div>
              
              <div className="text-center mb-6 text-xl text-slate-400">
                Función Principal: <span className="text-white bg-slate-800 px-4 py-2 rounded-lg">P(V,T) = 8.31T / V</span>
              </div>

              <div className="flex justify-center mb-10">
                <button 
                  onClick={() => setShowMathDetails(!showMathDetails)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-600 shadow-lg"
                >
                  <Activity size={16} className={showMathDetails ? "text-amber-400" : "text-slate-400"} /> 
                  {showMathDetails ? 'Ocultar Desarrollo Matemático' : 'Ver Desarrollo Matemático'}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <motion.div 
                  animate={{ opacity: slideSteps[6] >= 0 ? 1 : 0, y: slideSteps[6] >= 0 ? 0 : 30 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-sky-400 mb-4 text-lg flex items-center gap-2">
                    <button className="wiki-link hover:text-sky-300 transition-colors" onClick={(e) => { e.stopPropagation(); setActiveWiki('derivada-parcial'); }} title="¿Qué es una derivada parcial?"><Info size={18}/></button>
                    Sensibilidad al Volumen:
                  </div>
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                    <div className="text-xl">∂P/∂V = -8.31T / V²</div>
                    
                    <AnimatePresence>
                      {showMathDetails && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="text-slate-400 text-sm my-4 border-l-2 border-sky-500/50 pl-4 py-2 bg-sky-500/5 rounded-r-lg">
                            <span className="text-sky-400 font-bold block mb-1">Regla de la potencia:</span>
                            Derivamos respecto a V, tratando a T como constante.<br/>
                            P = (8.31T) * V⁻¹<br/>
                            ∂P/∂V = (8.31T) * (-1 * V⁻²)
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="text-slate-500">Evaluando (V=12, T=310):</div>
                    <div className="text-2xl text-white">= -8.31(310) / (12)²</div>
                    <div className="text-3xl font-bold text-sky-400 border-t border-slate-800 pt-4">≈ -17.8896</div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ opacity: slideSteps[6] >= 2 ? 1 : 0, y: slideSteps[6] >= 2 ? 0 : 30 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-red-400 mb-4 text-lg flex items-center gap-2">
                    <button className="wiki-link hover:text-red-300 transition-colors" onClick={(e) => { e.stopPropagation(); setActiveWiki('derivada-parcial'); }} title="¿Qué es una derivada parcial?"><Info size={18}/></button>
                    Sensibilidad a la Temperatura:
                  </div>
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                    <div className="text-xl">∂P/∂T = 8.31 / V</div>
                    
                    <AnimatePresence>
                      {showMathDetails && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="text-slate-400 text-sm my-4 border-l-2 border-red-500/50 pl-4 py-2 bg-red-500/5 rounded-r-lg">
                            <span className="text-red-400 font-bold block mb-1">Derivada lineal:</span>
                            Derivamos respecto a T, tratando a V como constante.<br/>
                            P = (8.31 / V) * T<br/>
                            ∂P/∂T = (8.31 / V) * 1
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="text-slate-500">Evaluando (V=12):</div>
                    <div className="text-2xl text-white">= 8.31 / 12</div>
                    <div className="text-3xl font-bold text-red-400 border-t border-slate-800 pt-4">≈ 0.6925</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 8: STEP 3 - FINAL CALCULATION */}
        <section ref={el => slideRefs.current[7] = el} className="min-h-screen py-20 w-full snap-start relative flex flex-col items-center justify-center bg-slate-900 px-4 blueprint-grid">
          <div className="max-w-4xl w-full">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center uppercase">
              Paso 3: <span className="text-emerald-500 text-glow-emerald">El Ensamble</span>
            </h2>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-slate-950 p-10 md:p-16 rounded-3xl border-2 border-emerald-500/50 box-glow text-center font-mono relative"
            >
              <button className="absolute top-6 right-6 text-slate-500 hover:text-emerald-400 wiki-link transition-colors" onClick={(e) => { e.stopPropagation(); setActiveWiki('diferencial-total'); }} title="Repasar Diferencial Total">
                <Info size={24} />
              </button>
              
              <motion.div animate={{ opacity: slideSteps[7] >= 0 ? 1 : 0, y: slideSteps[7] >= 0 ? 0 : 20 }} className="text-2xl md:text-3xl text-slate-400 mb-8">
                dP = (∂P/∂V)<span className="text-sky-400">dV</span> + (∂P/∂T)<span className="text-red-400">dT</span>
              </motion.div>
              
              <motion.div animate={{ opacity: slideSteps[7] >= 2 ? 1 : 0, y: slideSteps[7] >= 2 ? 0 : 20 }} className="text-xl md:text-2xl text-slate-300 mb-8 space-y-4">
                <div>dP = (-17.8896)(<span className="text-sky-400">0.3</span>) + (0.6925)(<span className="text-red-400">-5</span>)</div>
                <div className="text-slate-500">dP ≈ -5.36688 - 3.4625</div>
              </motion.div>

              <motion.div animate={{ opacity: slideSteps[7] >= 3 ? 1 : 0, y: slideSteps[7] >= 3 ? 0 : 20 }} className="mt-12 pt-8 border-t border-slate-800">
                <div className="text-sm text-emerald-500 mb-2 uppercase tracking-widest">Resultado Final</div>
                <div className="text-6xl md:text-8xl font-bold text-emerald-400 text-glow-emerald">
                  -8.83 <span className="text-4xl text-emerald-600">kPa</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* SLIDE 9: CONCLUSION */}
        <section ref={el => slideRefs.current[8] = el} className="min-h-screen py-20 w-full snap-start relative flex flex-col items-center justify-center bg-slate-950 px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-900 border-2 border-slate-700 mb-8 box-glow cursor-pointer wiki-link hover:border-amber-500 transition-colors" onClick={(e) => { e.stopPropagation(); setActiveWiki('gas-ideal'); }} title="Ver modelo de Gas Ideal">
              <Gauge className="text-amber-500" size={48} />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-12 uppercase tracking-tight">
              Interpretación <span className="text-amber-500">Física</span>
            </h2>
            
            <div className="text-xl md:text-2xl text-slate-300 space-y-8 leading-relaxed text-left bg-slate-900/80 backdrop-blur p-10 rounded-3xl border border-slate-800 shadow-2xl">
              <motion.div 
                animate={{ opacity: slideSteps[8] >= 0 ? 1 : 0, y: slideSteps[8] >= 0 ? 0 : 20 }}
                transition={{ duration: 0.5 }}
                className="flex gap-6 items-start"
              >
                <div className="p-4 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/20"><Factory size={32} /></div>
                <div>
                  <strong className="text-sky-400 block mb-2">1. Expansión (Volumen +)</strong>
                  El gas se expande en un espacio mayor. Las partículas chocan menos contra las paredes. <span className="text-slate-500 font-mono text-sm ml-2 bg-slate-950 px-2 py-1 rounded">Presión ↓</span>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ opacity: slideSteps[8] >= 1 ? 1 : 0, y: slideSteps[8] >= 1 ? 0 : 20 }}
                transition={{ duration: 0.5 }}
                className="flex gap-6 items-start"
              >
                <div className="p-4 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20"><Thermometer size={32} /></div>
                <div>
                  <strong className="text-red-400 block mb-2">2. Enfriamiento (Temperatura -)</strong>
                  Las partículas pierden energía cinética. Se mueven más lento y chocan con menor fuerza. <span className="text-slate-500 font-mono text-sm ml-2 bg-slate-950 px-2 py-1 rounded">Presión ↓</span>
                </div>
              </motion.div>

              <motion.div 
                animate={{ opacity: slideSteps[8] >= 2 ? 1 : 0, scale: slideSteps[8] >= 2 ? 1 : 0.9 }}
                transition={{ duration: 0.5 }}
                className="pt-8 border-t border-slate-700 text-center"
              >
                Ambos efectos se suman negativamente, resultando en una descompresión total de <strong className="text-emerald-400 text-3xl ml-2">-8.83 kPa</strong>.
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* SLIDE 10: INTERACTIVE SCENARIOS (Replaces Team Slide) */}
        <section ref={el => slideRefs.current[9] = el} className="min-h-screen py-20 w-full snap-start relative flex flex-col items-center justify-center bg-slate-900 px-4 text-center blueprint-grid-dense">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl w-full bg-slate-950/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-widest text-sky-500 text-glow-blue">
              Escenarios Interactivos
            </h2>
            <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
              Observa cómo la presión responde en tiempo real a los cambios de volumen y temperatura. La curva muestra la relación inversamente proporcional entre Presión y Volumen (Ley de Boyle).
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2 h-80 bg-slate-900 rounded-xl border border-slate-700 p-4">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <LineChart
                    data={Array.from({ length: 20 }, (_, i) => {
                      const v = 8 + i * 0.5;
                      return {
                        volumen: v,
                        presion: Number(((8.31 * temp) / v).toFixed(2))
                      };
                    })}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="volumen" 
                      stroke="#94a3b8" 
                      label={{ value: 'Volumen (L)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} 
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      label={{ value: 'Presión (kPa)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                      itemStyle={{ color: '#38bdf8' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="presion" 
                      stroke="#38bdf8" 
                      strokeWidth={3} 
                      dot={false}
                      activeDot={{ r: 8, fill: '#38bdf8', stroke: '#0f172a', strokeWidth: 2 }}
                    />
                    <ReferenceDot 
                      x={vol} 
                      y={Number(pressure.toFixed(2))} 
                      r={6} 
                      fill="#ef4444" 
                      stroke="#0f172a" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-6 text-left">
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                  <h3 className="text-sky-400 font-mono text-sm mb-2">PUNTO ACTUAL</h3>
                  <div className="text-2xl font-bold text-white mb-1">V: {vol.toFixed(1)} L</div>
                  <div className="text-2xl font-bold text-white mb-1">T: {temp} °K</div>
                  <div className="text-3xl font-bold text-emerald-400 mt-4 pt-4 border-t border-slate-800">
                    P: {pressure.toFixed(2)} kPa
                  </div>
                </div>
                
                <div className="text-sm text-slate-500 font-mono">
                  <Info size={16} className="inline mr-2" />
                  El punto rojo indica el estado actual del sistema en la curva isotérmica.
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SLIDE 11: MINIGAME */}
        <section ref={el => slideRefs.current[10] = el} className="min-h-screen py-20 w-full snap-start relative flex flex-col items-center justify-center bg-slate-950 px-4 text-center blueprint-grid">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl w-full"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 uppercase tracking-tight text-amber-500 text-glow">
              Mini-Juego: Intuición
            </h2>
            
            <div className="bg-slate-900/80 backdrop-blur p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={100} /></div>
              
              {mgQuestion < mgQuestions.length ? (
                <>
                  <div className="text-slate-400 mb-4 font-mono">Pregunta {mgQuestion + 1} de {mgQuestions.length}</div>
                  <h3 className="text-2xl md:text-3xl text-white mb-8 font-medium leading-relaxed">
                    {mgQuestions[mgQuestion].q}
                  </h3>
                  
                  <div className="grid gap-4 mb-8">
                    {mgQuestions[mgQuestion].options.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleMgAnswer(idx)}
                        disabled={mgFeedback !== null}
                        className={`p-4 rounded-xl text-lg font-medium transition-all border ${
                          mgFeedback !== null && idx === mgQuestions[mgQuestion].answer
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                            : mgFeedback !== null && idx !== mgQuestions[mgQuestion].answer
                              ? 'bg-slate-800/50 border-slate-700 text-slate-500 opacity-50'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200 hover:border-sky-500/50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {mgFeedback && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`p-6 rounded-xl border mb-6 text-left ${mgFeedback.correct ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}
                      >
                        <div className="flex items-start gap-3">
                          {mgFeedback.correct ? <CheckCircle2 className="shrink-0 mt-1" /> : <XCircle className="shrink-0 mt-1" />}
                          <p>{mgFeedback.text}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {mgFeedback && (
                    <button 
                      onClick={nextMgQuestion}
                      className="px-8 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-full font-bold tracking-wider transition-colors shadow-lg shadow-sky-500/20"
                    >
                      {mgQuestion < mgQuestions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
                    </button>
                  )}
                </>
              ) : (
                <div className="py-12">
                  <h3 className="text-4xl font-bold text-white mb-4">¡Juego Terminado!</h3>
                  <div className="text-6xl font-black text-sky-400 mb-8 text-glow-blue">
                    {mgScore} / {mgQuestions.length}
                  </div>
                  <p className="text-xl text-slate-400 mb-8">
                    {mgScore === mgQuestions.length ? '¡Excelente intuición termodinámica!' : 'Sigue practicando para dominar el Diferencial Total.'}
                  </p>
                  <button 
                    onClick={() => { setMgQuestion(0); setMgScore(0); setMgFeedback(null); }}
                    className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-bold tracking-wider transition-colors border border-slate-600"
                  >
                    Jugar de Nuevo
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}

