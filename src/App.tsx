import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Printer, Factory, Thermometer, Gauge, ArrowDown, Settings, Activity, Cpu, Zap, Maximize, Minimize, Play } from 'lucide-react';
import PrintView from './PrintView';

export default function App() {
  const [vol, setVol] = useState(12);
  const [temp, setTemp] = useState(310);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const totalSlides = 9;
  
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

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlide(prev => {
          const next = Math.min(prev + 1, totalSlides - 1);
          slideRefs.current[next]?.scrollIntoView({ behavior: 'smooth' });
          return next;
        });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentSlide(prev => {
          const next = Math.max(prev - 1, 0);
          slideRefs.current[next]?.scrollIntoView({ behavior: 'smooth' });
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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

      {/* Interactive Presentation View */}
      <div className="no-print h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
        
        {/* =========================================================
            PRESENTER 1: INTRO & THEORY
            ========================================================= */}

        {/* SLIDE 1: HERO */}
        <section ref={el => slideRefs.current[0] = el} className="h-screen w-full snap-start relative flex flex-col items-center justify-center overflow-hidden bg-slate-950 blueprint-grid">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-900 via-slate-900 to-slate-950"></div>
          
          {/* Animated Background Gears */}
          <div className="absolute top-10 left-10 opacity-10 text-sky-500 animate-spin-slow">
            <Settings size={200} strokeWidth={1} />
          </div>
          <div className="absolute bottom-10 right-10 opacity-10 text-amber-500 animate-spin-slow-reverse">
            <Settings size={300} strokeWidth={1} />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="z-10 text-center px-4"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 mb-8 font-mono text-sm uppercase tracking-widest">
              <Activity size={16} /> Cálculo Multivariable
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter">
              DIFERENCIAL <br/> <span className="text-sky-500 text-glow-blue">TOTAL</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light">
              Analizando el caos en sistemas complejos.
            </p>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-24 text-slate-500 flex flex-col items-center gap-2"
            >
              <span className="font-mono text-sm uppercase tracking-widest">Desliza para iniciar</span>
              <ArrowDown />
            </motion.div>
          </motion.div>
        </section>

        {/* SLIDE 2: THE CONCEPT */}
        <section ref={el => slideRefs.current[1] = el} className="h-screen w-full snap-start relative flex flex-col items-center justify-center bg-slate-900 px-4 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid-dense opacity-5"></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl w-full z-10"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-12 text-center">
              ¿QUÉ ES ESTA <span className="text-amber-500 text-glow">HERRAMIENTA</span>?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-950/80 border border-slate-800 p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20"><Cpu size={48} /></div>
                <h3 className="text-2xl font-bold mb-4 text-slate-300">El Problema Real</h3>
                <p className="text-lg text-slate-400 leading-relaxed">
                  En ingeniería, rara vez se altera una sola variable de forma aislada. Si calientas un gas y al mismo tiempo expandes su tanque... ¿qué le pasa a la presión? Todo interactúa simultáneamente.
                </p>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 p-8 rounded-2xl box-glow-blue relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20 text-sky-500"><Zap size={48} /></div>
                <h3 className="text-2xl font-bold mb-4 text-sky-400">La Solución</h3>
                <p className="text-lg text-slate-300 leading-relaxed">
                  El <strong>Diferencial Total</strong>. En lugar de recalcular toda la función desde cero, utiliza las tasas de cambio instantáneo (derivadas parciales) para estimar el impacto total de forma rápida y precisa.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SLIDE 3: THE FORMULA */}
        <section ref={el => slideRefs.current[2] = el} className="h-screen w-full snap-start relative flex flex-col items-center justify-center bg-slate-950 px-4 blueprint-grid">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl w-full text-center"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 text-slate-400 mb-8 font-mono text-sm uppercase tracking-widest">
              Anatomía de la Ecuación
            </div>
            
            <div className="bg-slate-900 border border-slate-700 p-12 rounded-3xl box-glow relative overflow-hidden">
              {/* Decorative SVG lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                <path d="M 0 50 Q 150 50 150 150 T 300 150" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 5" />
                <path d="M 100 200 L 400 200" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 5" />
              </svg>

              <div className="font-mono text-4xl md:text-6xl text-slate-200 relative z-10 flex flex-wrap justify-center items-center gap-4">
                <span>dz</span>
                <span className="text-slate-500">=</span>
                <span className="text-sky-400 relative group">
                  (∂z/∂x)
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-800 px-2 py-1 rounded">Sensibilidad a X</span>
                </span>
                <span className="text-slate-300">dx</span>
                <span className="text-slate-500">+</span>
                <span className="text-amber-400 relative group">
                  (∂z/∂y)
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-800 px-2 py-1 rounded">Sensibilidad a Y</span>
                </span>
                <span className="text-slate-300">dy</span>
              </div>
            </div>
            <p className="mt-8 text-xl text-slate-400 font-light">
              La suma de los impactos individuales de cada variable.
            </p>
          </motion.div>
        </section>

        {/* =========================================================
            PRESENTER 2: THE PROBLEM & SIMULATION
            ========================================================= */}

        {/* SLIDE 4: THE SCENARIO */}
        <section ref={el => slideRefs.current[3] = el} className="h-screen w-full snap-start relative flex flex-col items-center justify-center bg-slate-900 px-4">
          <div className="absolute inset-0 blueprint-grid opacity-10"></div>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="max-w-5xl w-full z-10"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 uppercase text-left border-l-8 border-sky-500 pl-6">
              Caso de <br/><span className="text-sky-500 text-glow-blue">Estudio</span>
            </h2>
            
            <div className="bg-slate-950 p-8 md:p-12 rounded-2xl border border-slate-800 font-mono text-lg md:text-2xl text-slate-300 leading-relaxed shadow-2xl">
              <p className="mb-6">
                <span className="text-sky-500">Misión:</span> La presión, volumen y temperatura de un mol de un gas ideal están relacionados mediante la ecuación:
              </p>
              <div className="text-center text-4xl md:text-6xl text-white my-10 py-8 bg-slate-900 rounded-xl border border-slate-700 box-glow">
                PV = 8.31T
              </div>
              <p>
                Estimar el cambio aproximado en la <span className="text-emerald-400">presión</span> si el <span className="text-sky-400">volumen</span> pasa de 12 a 12.3 litros y la <span className="text-red-400">temperatura</span> disminuye de 310 a 305 °K.
              </p>
            </div>
          </motion.div>
        </section>

        {/* SLIDE 5: INTERACTIVE TANK */}
        <section ref={el => slideRefs.current[4] = el} className="h-screen w-full snap-start relative flex flex-col items-center justify-center bg-slate-950 px-4 overflow-hidden">
          {/* Animated SVG Pipes Background */}
          <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" style={{ zIndex: 0 }}>
            <path d="M 0 200 L 200 200 L 200 400 L 400 400" fill="none" stroke="#38bdf8" strokeWidth="8" strokeDasharray="20 20" className="animate-flow" />
            <path d="M 1000 600 L 800 600 L 800 200 L 600 200" fill="none" stroke="#ef4444" strokeWidth="8" strokeDasharray="20 20" className="animate-flow" />
          </svg>

          <div className="max-w-6xl w-full z-10">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
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
        <section ref={el => slideRefs.current[5] = el} className="h-screen w-full snap-start relative flex flex-col items-center justify-center bg-slate-900 px-4 blueprint-grid-dense">
          <div className="max-w-4xl w-full">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center uppercase">
              Paso 1: <span className="text-sky-500 text-glow-blue">Los Incrementos</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8 font-mono">
              <motion.div 
                initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                className="bg-slate-950 p-8 rounded-2xl border-t-4 border-sky-500 shadow-xl"
              >
                <h3 className="text-slate-500 mb-6 text-xl border-b border-slate-800 pb-4">Variación de Volumen</h3>
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between"><span>V inicial:</span> <span className="text-white">12 L</span></div>
                  <div className="flex justify-between"><span>V final:</span> <span className="text-white">12.3 L</span></div>
                  <div className="flex justify-between pt-4 border-t border-slate-800 font-bold text-2xl">
                    <span>dV =</span> <span className="text-sky-400">+0.3 L</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                className="bg-slate-950 p-8 rounded-2xl border-t-4 border-red-500 shadow-xl"
              >
                <h3 className="text-slate-500 mb-6 text-xl border-b border-slate-800 pb-4">Variación de Temperatura</h3>
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
        <section ref={el => slideRefs.current[6] = el} className="h-screen w-full snap-start relative flex flex-col items-center justify-center bg-slate-950 px-4">
          <div className="max-w-5xl w-full">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center uppercase">
              Paso 2: <span className="text-amber-500 text-glow">Derivadas Parciales</span>
            </h2>

            <div className="bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-800 font-mono box-glow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={100} /></div>
              
              <div className="text-center mb-10 text-xl text-slate-400">
                Función Principal: <span className="text-white bg-slate-800 px-4 py-2 rounded-lg">P(V,T) = 8.31T / V</span>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <div className="text-sky-400 mb-4 text-lg">Sensibilidad al Volumen:</div>
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                    <div className="text-xl">∂P/∂V = -8.31T / V²</div>
                    <div className="text-slate-500">Evaluando (V=12, T=310):</div>
                    <div className="text-2xl text-white">= -8.31(310) / (12)²</div>
                    <div className="text-3xl font-bold text-sky-400 border-t border-slate-800 pt-4">≈ -17.8896</div>
                  </div>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                  <div className="text-red-400 mb-4 text-lg">Sensibilidad a la Temperatura:</div>
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                    <div className="text-xl">∂P/∂T = 8.31 / V</div>
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
        <section ref={el => slideRefs.current[7] = el} className="h-screen w-full snap-start relative flex flex-col items-center justify-center bg-slate-900 px-4 blueprint-grid">
          <div className="max-w-4xl w-full">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center uppercase">
              Paso 3: <span className="text-emerald-500 text-glow-emerald">El Ensamble</span>
            </h2>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }}
              className="bg-slate-950 p-10 md:p-16 rounded-3xl border-2 border-emerald-500/50 box-glow text-center font-mono"
            >
              <div className="text-2xl md:text-3xl text-slate-400 mb-8">
                dP = (∂P/∂V)<span className="text-sky-400">dV</span> + (∂P/∂T)<span className="text-red-400">dT</span>
              </div>
              
              <div className="text-xl md:text-2xl text-slate-300 mb-8 space-y-4">
                <div>dP = (-17.8896)(<span className="text-sky-400">0.3</span>) + (0.6925)(<span className="text-red-400">-5</span>)</div>
                <div className="text-slate-500">dP ≈ -5.36688 - 3.4625</div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-800">
                <div className="text-sm text-emerald-500 mb-2 uppercase tracking-widest">Resultado Final</div>
                <div className="text-6xl md:text-8xl font-bold text-emerald-400 text-glow-emerald">
                  -8.83 <span className="text-4xl text-emerald-600">kPa</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SLIDE 9: CONCLUSION */}
        <section ref={el => slideRefs.current[8] = el} className="h-screen w-full snap-start relative flex flex-col items-center justify-center bg-slate-950 px-4 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-900 border-2 border-slate-700 mb-8 box-glow">
              <Gauge className="text-amber-500" size={48} />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-12 uppercase tracking-tight">
              Interpretación <span className="text-amber-500">Física</span>
            </h2>
            
            <div className="text-xl md:text-2xl text-slate-300 space-y-8 leading-relaxed text-left bg-slate-900/80 backdrop-blur p-10 rounded-3xl border border-slate-800 shadow-2xl">
              <div className="flex gap-6 items-start">
                <div className="p-4 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/20"><Factory size={32} /></div>
                <div>
                  <strong className="text-sky-400 block mb-2">1. Expansión (Volumen +)</strong>
                  El gas se expande en un espacio mayor. Las partículas chocan menos contra las paredes. <span className="text-slate-500 font-mono text-sm ml-2 bg-slate-950 px-2 py-1 rounded">Presión ↓</span>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="p-4 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20"><Thermometer size={32} /></div>
                <div>
                  <strong className="text-red-400 block mb-2">2. Enfriamiento (Temperatura -)</strong>
                  Las partículas pierden energía cinética. Se mueven más lento y chocan con menor fuerza. <span className="text-slate-500 font-mono text-sm ml-2 bg-slate-950 px-2 py-1 rounded">Presión ↓</span>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-700 text-center">
                Ambos efectos se suman negativamente, resultando en una descompresión total de <strong className="text-emerald-400 text-3xl ml-2">-8.83 kPa</strong>.
              </div>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
}

