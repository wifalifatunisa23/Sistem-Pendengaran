import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, Activity, Brain, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

// --- STYLING CONSTANTS (3D / Neo-brutalism aesthetics) ---
const styles = {
  cardBlue: "bg-blue-100 border-4 border-blue-400 rounded-2xl shadow-[6px_6px_0_0_#60a5fa] p-6 transition-transform hover:-translate-y-1",
  cardPink: "bg-pink-100 border-4 border-pink-400 rounded-2xl shadow-[6px_6px_0_0_#f472b6] p-6 transition-transform hover:-translate-y-1",
  cardYellow: "bg-yellow-100 border-4 border-yellow-400 rounded-2xl shadow-[6px_6px_0_0_#facc15] p-6 transition-transform hover:-translate-y-1",
  cardWhite: "bg-white border-4 border-gray-800 rounded-2xl shadow-[6px_6px_0_0_#1f2937] p-6",
  btnPrimary: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl border-4 border-gray-900 shadow-[4px_4px_0_0_#1f2937] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all flex items-center justify-center gap-2",
  btnSecondary: "bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-xl border-4 border-gray-900 shadow-[4px_4px_0_0_#1f2937] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all",
  navItem: (isActive) => `flex items-center gap-3 p-4 rounded-xl font-bold cursor-pointer transition-all ${isActive ? 'bg-gray-900 text-white shadow-lg scale-105' : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300'}`,
};

// --- DATA ---
const earParts = [
  { id: 'daun', name: 'Daun Telinga', fungsi: 'Menangkap gelombang suara dari lingkungan dan menyalurkannya ke dalam liang telinga.' },
  { id: 'liang', name: 'Liang Telinga', fungsi: 'Saluran yang membawa gelombang suara menuju gendang telinga, dilapisi rambut halus dan kelenjar.' },
  { id: 'gendang', name: 'Gendang Telinga (Timpani)', fungsi: 'Membran tipis yang bergetar saat terkena gelombang suara, mengubah energi akustik menjadi energi mekanik.' },
  { id: 'tulang', name: 'Tulang Pendengaran', fungsi: 'Terdiri dari Martil (Malleus), Landasan (Incus), dan Sanggurdi (Stapes). Berfungsi memperkuat dan meneruskan getaran ke telinga dalam.' },
  { id: 'koklea', name: 'Koklea (Rumah Siput)', fungsi: 'Berisi cairan dan sel rambut sensorik. Merespons getaran dan mengubahnya menjadi sinyal listrik.' },
  { id: 'saraf', name: 'Saraf Pendengaran', fungsi: 'Membawa sinyal listrik dari koklea ke otak untuk diolah menjadi persepsi suara.' },
];

const simulationStages = [
  { 
    title: '1. Gelombang Sampai di Telinga', 
    bio: 'Daun telinga dan liang telinga menangkap serta menyalurkan bunyi dari luar masuk ke saluran pendengaran.', 
    fisika: 'Suara merambat sebagai gelombang mekanik (longitudinal) melalui medium udara.' 
  },
  { 
    title: '2. Gendang Telinga Bergetar', 
    bio: 'Membran timpani menerima perubahan tekanan udara dan mulai bergetar sesuai pola suara.', 
    fisika: 'Perubahan tekanan diubah menjadi getaran. Amplitudo suara memengaruhi kuatnya simpangan getaran mekanis ini.' 
  },
  { 
    title: '3. Tulang Pendengaran Bergerak', 
    bio: 'Tulang martil, landasan, dan sanggurdi bergerak berkesinambungan meneruskan getaran dari gendang.', 
    fisika: 'Terjadi gerak mekanis dan perpindahan energi. Prinsip tuas pada tulang memperkuat tekanan getaran.' 
  },
  { 
    title: '4. Koklea Merespons', 
    bio: 'Getaran dari sanggurdi menggerakkan cairan di dalam koklea, merangsang sel rambut sensorik (membran basilar).', 
    fisika: 'Gelombang mekanis menjalar dalam medium cair. Terdapat respons mekanis berbeda berdasarkan frekuensi gelombang.' 
  },
  { 
    title: '5. Transduksi Sinyal', 
    bio: 'Sinyal dari sel rambut diteruskan melalui saraf pendengaran ke jalur saraf menuju otak.', 
    fisika: 'Terjadi perubahan bentuk energi kinetik (mekanis) menjadi impuls listrik.' 
  },
  { 
    title: '6. Otak Mengolah Suara', 
    bio: 'Otak membantu kita mengenali suara, memahami perkataan, dan menentukan arah sumber suara.', 
    fisika: 'Informasi frekuensi, intensitas, dan waktu dari suara membantu sistem saraf membedakan bunyi.' 
  },
];

const quizQuestions = [
  {
    q: "Bagian telinga mana yang berfungsi mengubah gelombang suara (energi akustik) menjadi getaran mekanis?",
    options: ["Daun Telinga", "Gendang Telinga", "Koklea", "Saraf Pendengaran"],
    answer: 1,
    explanation: "Gendang telinga (membran timpani) menerima perubahan tekanan dari gelombang suara dan bergetar selaras dengan gelombang tersebut, mengubah energi suara menjadi energi mekanik."
  },
  {
    q: "Apa fungsi utama dari tulang pendengaran (martil, landasan, sanggurdi)?",
    options: ["Menangkap suara dari luar", "Menjaga keseimbangan tubuh", "Memperkuat getaran dari gendang telinga", "Menerjemahkan suara ke otak"],
    answer: 2,
    explanation: "Tulang pendengaran bekerja dengan prinsip tuas untuk memperkuat tekanan getaran dari gendang telinga sebelum diteruskan ke cairan di dalam koklea."
  },
  {
    q: "Di bagian manakah proses transduksi (perubahan getaran mekanis menjadi sinyal listrik) terjadi?",
    options: ["Liang Telinga", "Gendang Telinga", "Tulang Pendengaran", "Koklea"],
    answer: 3,
    explanation: "Di dalam koklea, getaran menggerakkan cairan yang merangsang sel rambut sensorik. Sel rambut inilah yang mengubah rangsangan mekanik menjadi sinyal listrik."
  },
  {
    q: "Dalam konsep fisika gelombang, apa yang menentukan tinggi rendahnya (pitch) suatu nada?",
    options: ["Amplitudo", "Kecepatan", "Frekuensi", "Intensitas"],
    answer: 2,
    explanation: "Frekuensi (jumlah getaran per detik) menentukan pitch. Frekuensi tinggi menghasilkan nada tinggi, frekuensi rendah menghasilkan nada rendah."
  },
  {
    q: "Jika sebuah gelombang suara memiliki frekuensi yang tinggi, maka gelombang tersebut memiliki...",
    options: ["Amplitudo yang besar", "Periode yang panjang", "Panjang gelombang yang besar", "Periode yang singkat"],
    answer: 3,
    explanation: "Periode (T) adalah kebalikan dari frekuensi (f), yaitu T = 1/f. Jadi, makin tinggi frekuensi, makin singkat periodenya."
  }
];

// --- COMPONENTS & ILLUSTRATIONS ---

const EarIllustration = ({ opacity = 1 }) => (
  <svg viewBox="0 0 1000 500" className="w-full h-full drop-shadow-xl absolute inset-0 pointer-events-none" style={{ opacity }}>
    {/* Background Glow */}
    <ellipse cx="500" cy="250" rx="400" ry="200" fill="#f8fafc" filter="blur(40px)" />
    
    {/* 1. Daun Telinga */}
    <path d="M 250,100 C 50,50 0,350 150,450 C 250,480 300,350 300,280 C 300,200 350,220 350,250" fill="#fce7f3" stroke="#fbcfe8" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* 2. Liang Telinga */}
    <path d="M 250,250 L 450,250" fill="none" stroke="#fce7f3" strokeWidth="80" strokeLinecap="round"/>
    <path d="M 250,250 L 450,250" fill="none" stroke="#fbcfe8" strokeWidth="80" strokeLinecap="round" strokeDasharray="10 30"/>
    
    {/* 3. Gendang Telinga */}
    <ellipse cx="450" cy="250" rx="12" ry="55" fill="#fcd34d" stroke="#fbbf24" strokeWidth="4"/>
    
    {/* 4. Tulang Pendengaran */}
    <path d="M 460,250 L 500,210 L 550,210 L 580,250" fill="none" stroke="#fef08a" strokeWidth="20" strokeLinejoin="round" strokeLinecap="round"/>
    <circle cx="550" cy="210" r="18" fill="#facc15" />
    
    {/* 5. Koklea */}
    <path d="M 590,250 C 590,120 730,120 730,250 C 730,340 620,340 620,250 C 620,190 680,190 680,250" fill="none" stroke="#d8b4fe" strokeWidth="35" strokeLinecap="round"/>
    <circle cx="650" cy="250" r="15" fill="#c084fc" />
    
    {/* 6. Saraf Pendengaran */}
    <path d="M 680,250 Q 750,250 850,250" fill="none" stroke="#fde047" strokeWidth="25" strokeLinecap="round"/>
    
    {/* 7. Otak (Korteks Auditori) */}
    <path d="M 820,250 C 820,80 1050,80 1050,250 C 1050,420 820,420 820,250 Z" fill="#fbcfe8" stroke="#f9a8d4" strokeWidth="8" opacity="0.9"/>
  </svg>
);

// --- AUDIO SYNTHESIZER ---
const playSimulationSound = (step) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  const now = ctx.currentTime;
  
  // Karakteristik suara berdasarkan tahapan simulasi
  switch(step) {
    case 0: // Gelombang Udara (Angin/Low frequency)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
      osc.start(now);
      osc.stop(now + 1);
      break;
    case 1: // Gendang Telinga (Drum hit / membran)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    case 2: // Tulang Pendengaran (Mekanik / Ketukan tuas)
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.setValueAtTime(0, now + 0.1);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    case 3: // Koklea (Cairan / Frekuensi tinggi beresonansi)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.5);
      // Efek vibrato
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 8;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 50;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start(now);
      lfo.stop(now + 0.8);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      osc.start(now);
      osc.stop(now + 0.8);
      break;
    case 4: // Saraf (Impuls Listrik / Zap)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1500, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
      
      // Bip kedua beruntun
      setTimeout(() => {
        if(ctx.state === 'running') {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.type = 'sawtooth';
          osc2.frequency.setValueAtTime(2000, ctx.currentTime);
          osc2.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
          gain2.gain.setValueAtTime(0.2, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
          osc2.start(ctx.currentTime);
          osc2.stop(ctx.currentTime + 0.2);
        }
      }, 150);
      break;
    case 5: // Otak (Persepsi Suara / Chord Harmonis)
      const root = 440; // Nada A4
      [root, root * 1.25, root * 1.5].forEach((freq) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.2, now + 0.5);
        g.gain.exponentialRampToValueAtTime(0.01, now + 2);
        o.start(now);
        o.stop(now + 2);
      });
      break;
  }
};

// --- COMPONENTS ---

export default function HearLabApp() {
  const [activeView, setActiveView] = useState('beranda');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 flex flex-col md:flex-row overflow-hidden selection:bg-pink-300">
      
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-80 bg-white border-r-4 border-gray-200 p-6 flex flex-col gap-4 shadow-xl z-20 shrink-0 h-auto md:h-screen overflow-y-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-pink-400 p-3 rounded-2xl shadow-[4px_4px_0_0_#1f2937]">
            <Volume2 className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 leading-tight">HearLab</h1>
        </div>

        <div className="flex flex-col gap-3">
          <NavItem id="beranda" icon={<BookOpen />} label="Beranda" activeView={activeView} setView={setActiveView} />
          <NavItem id="anatomi" icon={<Brain />} label="Kenali Bagian Telinga" activeView={activeView} setView={setActiveView} />
          <NavItem id="simulasi" icon={<Play />} label="Simulasi Perjalanan" activeView={activeView} setView={setActiveView} />
          <NavItem id="fisika" icon={<Activity />} label="Lab Fisika" activeView={activeView} setView={setActiveView} />
          <NavItem id="kuis" icon={<CheckCircle />} label="Kuis & Evaluasi" activeView={activeView} setView={setActiveView} />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 h-auto md:h-screen overflow-y-auto bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=')]">
        <div className="max-w-6xl mx-auto h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeView === 'beranda' && <BerandaView setView={setActiveView} />}
          {activeView === 'anatomi' && <AnatomiView />}
          {activeView === 'simulasi' && <SimulasiView />}
          {activeView === 'fisika' && <FisikaView />}
          {activeView === 'kuis' && <KuisView />}
        </div>
      </main>
    </div>
  );
}

// Nav Item Component
const NavItem = ({ id, icon, label, activeView, setView }) => (
  <button onClick={() => setView(id)} className={styles.navItem(activeView === id)}>
    {React.cloneElement(icon, { size: 20 })}
    <span>{label}</span>
  </button>
);

// --- VIEWS ---

function BerandaView({ setView }) {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 h-full py-10">
      <div className="flex-1 space-y-8">
        <div className="inline-block bg-yellow-200 text-yellow-900 font-bold px-4 py-2 rounded-full border-2 border-yellow-500 shadow-[2px_2px_0_0_#ca8a04]">
          Interaktif & Edukatif
        </div>
        <h2 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
          Simulasi Perjalanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500">Suara</span>
        </h2>
        <p className="text-xl text-gray-600 leading-relaxed font-medium">
          Pernahkah kamu bertanya bagaimana suara yang kamu dengar dapat dipahami oleh otak? Jelajahi perjalanan menakjubkan dari gelombang bunyi hingga menjadi persepsi di otak melalui simulasi interaktif ini.
        </p>
        <button onClick={() => setView('anatomi')} className={`${styles.btnPrimary} text-lg px-8 py-4`}>
          Mulai Belajar Sekarang <ArrowRight />
        </button>
      </div>
      <div className="flex-1 relative w-full flex justify-center">
        <div className="absolute inset-0 bg-blue-300 rounded-full blur-3xl opacity-30 -z-10 transform translate-x-10 translate-y-10"></div>
        {/* Ilustrasi Vektor Pengganti Gambar */}
        <div className="w-full max-w-md aspect-square bg-white rounded-3xl border-8 border-gray-900 shadow-[12px_12px_0_0_#f472b6] flex items-center justify-center p-8 rotate-[-2deg] transition-transform hover:rotate-0 duration-300 relative overflow-hidden">
          <Brain size={120} className="text-pink-300 absolute top-4 right-4 opacity-40 animate-pulse" />
          <Activity size={100} className="text-blue-300 absolute bottom-8 left-8 opacity-40" />
          <Volume2 size={160} className="text-gray-800 relative z-10 hover:scale-110 transition-transform cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

function AnatomiView() {
  const [selectedPart, setSelectedPart] = useState(null);

  // Posisi titik hotspot disesuaikan persentase dengan viewBox SVG (1000x500)
  const hotspots = [
    { id: 'daun', x: '15%', y: '45%', data: earParts[0] },
    { id: 'liang', x: '35%', y: '50%', data: earParts[1] },
    { id: 'gendang', x: '45%', y: '50%', data: earParts[2] },
    { id: 'tulang', x: '55%', y: '42%', data: earParts[3] },
    { id: 'koklea', x: '65%', y: '55%', data: earParts[4] },
    { id: 'saraf', x: '80%', y: '50%', data: earParts[5] },
  ];

  return (
    <div className="flex flex-col h-full gap-8">
      <div>
        <h2 className="text-4xl font-black text-gray-900">Kenali Bagian Telinga</h2>
        <p className="text-gray-600 mt-2 text-lg">Klik pada titik-titik di gambar anatomi untuk mempelajari fungsinya.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Area Visualisasi Gambar Interaktif */}
        <div className={`${styles.cardWhite} p-0 relative lg:w-2/3 h-[350px] md:h-[450px] bg-[#f8fafc] flex items-center justify-center overflow-hidden`}>
           
           {/* Menggunakan Ilustrasi Vektor bawaan sebagai ganti gambar */}
           <EarIllustration />
           
           {/* Titik Interaktif (Hotspots) di Atas Gambar */}
           {hotspots.map((spot, idx) => (
             <button 
               key={idx}
               onClick={() => setSelectedPart(spot.data)}
               className={`absolute w-8 h-8 md:w-10 md:h-10 -ml-4 -mt-4 rounded-full border-4 shadow-lg transform transition-all duration-300 z-10 flex items-center justify-center
                 ${selectedPart?.id === spot.id ? 'bg-pink-500 border-white scale-125' : 'bg-blue-500 border-white hover:bg-blue-400 hover:scale-110 animate-pulse'}`}
               style={{ left: spot.x, top: spot.y }}
             >
               <span className="text-white font-bold text-xs md:text-sm">{idx + 1}</span>
             </button>
           ))}
        </div>

        {/* Panel Informasi */}
        <div className="lg:w-1/3 flex flex-col">
          {selectedPart ? (
            <div className={`${styles.cardPink} h-full animate-in slide-in-from-right-8 flex flex-col justify-center`}>
              <h3 className="text-3xl font-black text-pink-900 mb-4 border-b-4 border-pink-300 pb-4">{selectedPart.name}</h3>
              <p className="text-pink-900 font-medium text-lg leading-relaxed">{selectedPart.fungsi}</p>
            </div>
          ) : (
            <div className={`${styles.cardBlue} h-full flex flex-col items-center justify-center text-center opacity-80`}>
              <Brain size={64} className="text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold text-blue-900 mb-2">Pilih Bagian</h3>
              <p className="text-blue-800 font-medium">Ketuk salah satu angka pada gambar anatomi untuk melihat detail fungsinya.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SimulasiView() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      // Mainkan suara saat pindah step otomatis
      playSimulationSound(step);
      interval = setInterval(() => {
        setStep((prev) => {
          if (prev < simulationStages.length - 1) {
            playSimulationSound(prev + 1);
            return prev + 1;
          }
          setIsPlaying(false);
          return prev;
        });
      }, 4000); // 4 detik per tahap
    }
    return () => clearInterval(interval);
  }, [isPlaying, step]);

  const handleNext = () => {
    const nextStep = Math.min(simulationStages.length - 1, step + 1);
    setStep(nextStep);
    playSimulationSound(nextStep);
  };
  const handlePrev = () => {
    const prevStep = Math.max(0, step - 1);
    setStep(prevStep);
    playSimulationSound(prevStep);
  };
  const handleReset = () => { setStep(0); setIsPlaying(false); playSimulationSound(0); };
  const handleStepClick = (index) => { setStep(index); setIsPlaying(false); playSimulationSound(index); };
  
  const togglePlay = () => {
    if (!isPlaying && step === simulationStages.length - 1) {
      // Jika di akhir dan di-play, reset ke awal
      setStep(0);
    } else if (!isPlaying) {
      playSimulationSound(step);
    }
    setIsPlaying(!isPlaying);
  };

  const currentStage = simulationStages[step];

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8">
      {/* Sidebar: Mode Belajar Mandiri (List Tahapan) */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Tahapan Simulasi</h2>
        <div className="flex flex-col gap-2 overflow-y-auto pr-2">
          {simulationStages.map((stage, idx) => (
            <button 
              key={idx}
              onClick={() => handleStepClick(idx)}
              className={`text-left p-4 rounded-xl border-4 transition-all ${
                step === idx 
                ? 'bg-blue-100 border-blue-500 shadow-[4px_4px_0_0_#3b82f6] translate-x-2' 
                : 'bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <span className="font-bold text-gray-800">{stage.title}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-xl text-sm text-yellow-800 font-medium flex items-start gap-3">
          <Volume2 size={24} className="shrink-0 mt-1"/>
          <span><strong>Aktifkan Suara!</strong> Setiap tahapan menghasilkan simulasi audio yang menggambarkan proses konversi getaran fisik menjadi sinyal biologis.</span>
        </div>
      </div>

      {/* Main Content Area: Interactive SVG Anatomy & Explanations */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        
        {/* Interactive SVG Container */}
        <div className={`${styles.cardWhite} relative flex flex-col overflow-hidden bg-[#f8fafc] border-slate-300 p-0`}>
          
          {/* Custom Animation Keyframes */}
          <style>{`
            @keyframes soundWaveMove {
              0% { transform: translateX(0) scale(0.8); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: translateX(120px) scale(1.2); opacity: 0; }
            }
            .animate-sound-waves { animation: soundWaveMove 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            @keyframes vibrateFast {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-2px) scale(1.02); }
              75% { transform: translateX(2px) scale(0.98); }
            }
            .animate-vibrate { animation: vibrateFast 0.1s linear infinite; }
            @keyframes rotateOscicle {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(15deg); }
            }
            .animate-tuas { animation: rotateOscicle 0.2s linear infinite; transform-origin: 50% 50%; }
            @keyframes liquidPulse {
              0%, 100% { fill: #c084fc; stroke-width: 4px; }
              50% { fill: #d8b4fe; stroke-width: 8px; stroke: #e9d5ff; }
            }
            .animate-liquid { animation: liquidPulse 0.5s ease-in-out infinite; }
            @keyframes dashMove {
              to { stroke-dashoffset: -20; }
            }
            .animate-nerve { animation: dashMove 0.5s linear infinite; stroke-dasharray: 10; stroke-dashoffset: 0; }
            @keyframes brainGlow {
              0%, 100% { filter: drop-shadow(0 0 10px rgba(236,72,153,0.5)); transform: scale(1); }
              50% { filter: drop-shadow(0 0 30px rgba(236,72,153,1)); transform: scale(1.02); }
            }
            .animate-brain { animation: brainGlow 1s ease-in-out infinite; transform-origin: center; }
          `}</style>

           <div className="absolute top-4 left-4 z-20 bg-white/95 text-gray-800 font-bold text-sm px-4 py-2 rounded-full border-2 border-gray-300 shadow-sm backdrop-blur-md">
             Tahap {step + 1}
           </div>
           
           {/* Visualisasi Berbasis Gambar dengan Animasi Overlay */}
           <div className="relative w-full h-[350px] md:h-[450px] bg-[#f8fafc] overflow-hidden z-10 p-4 flex items-center justify-center">
              
              {/* Ilustrasi Vektor Bawaan */}
              <EarIllustration opacity={0.8} />

              <svg viewBox="0 0 1000 500" className="w-full h-full drop-shadow-xl absolute inset-0 z-10 pointer-events-none">
                
                {/* 1. Daun Telinga & Liang (Telinga Luar) */}
                <g className={`transition-all duration-500 ${step === 0 ? 'opacity-100 scale-105' : 'opacity-0'}`} transform-origin="150 250">
                  <rect x="50" y="150" width="300" height="200" fill="#fca5a5" opacity="0.3" rx="50" />
                  <text x="100" y="460" className="font-bold text-xl fill-orange-800" opacity={step === 0 ? 1 : 0}>Daun & Liang Telinga</text>
                </g>

                {/* ANIMASI STEP 0: Gelombang Suara Masuk */}
                {(step === 0 || isPlaying) && (
                  <g className="animate-sound-waves" stroke="#3b82f6" fill="none" strokeWidth="8" strokeLinecap="round">
                    <path d="M 30,180 Q 70,250 30,320" />
                    <path d="M 60,160 Q 110,250 60,340" />
                    <path d="M 90,140 Q 150,250 90,360" />
                  </g>
                )}

                {/* 2. Gendang Telinga (Timpani) */}
                <g className={`transition-all duration-500 ${step === 1 ? 'opacity-100' : 'opacity-0'}`}>
                  <circle cx="450" cy="250" r="40" fill="#fbbf24" opacity="0.4" className={step === 1 ? "animate-vibrate" : ""} />
                  <text x="360" y="340" className="font-bold text-xl fill-yellow-700" opacity={step === 1 ? 1 : 0}>Gendang Telinga</text>
                </g>

                {/* 3. Tulang Pendengaran (Ossicles) */}
                <g className={`transition-all duration-500 ${step === 2 ? 'opacity-100' : 'opacity-0'}`} transform-origin="550 250">
                  <circle cx="550" cy="210" r="50" fill="#facc15" opacity="0.4" className={step === 2 ? "animate-tuas" : ""} />
                  <text x="480" y="150" className="font-bold text-xl fill-yellow-700" opacity={step === 2 ? 1 : 0}>Tulang Pendengaran</text>
                </g>

                {/* 4. Koklea (Rumah Siput) */}
                <g className={`transition-all duration-500 ${step === 3 ? 'opacity-100 scale-110' : 'opacity-0'}`} transform-origin="650 270">
                  <circle cx="650" cy="270" r="60" fill="#c084fc" opacity="0.4" className={step === 3 ? "animate-liquid" : ""} />
                  <text x="530" y="380" className="font-bold text-xl fill-purple-800" opacity={step === 3 ? 1 : 0}>Koklea (Cairan bergetar)</text>
                </g>

                {/* 5. Saraf Pendengaran */}
                <g className={`transition-all duration-500 ${step === 4 ? 'opacity-100' : 'opacity-0'}`}>
                  <rect x="700" y="220" width="150" height="60" fill="#eab308" opacity="0.4" rx="30" />
                  <text x="680" y="180" className="font-bold text-xl fill-yellow-600" opacity={step === 4 ? 1 : 0}>Saraf Pendengaran</text>
                </g>

                {/* 6. Otak */}
                <g className={`transition-all duration-500 ${step === 5 ? 'opacity-100' : 'opacity-0'}`} transform-origin="880 250">
                  <circle cx="900" cy="250" r="80" fill="#f472b6" opacity="0.4" className={step === 5 ? "animate-brain" : ""} />
                  <text x="850" y="250" className="font-black text-2xl fill-pink-700" opacity={step === 5 ? 1 : 0}>Korteks</text>
                  <text x="850" y="280" className="font-black text-2xl fill-pink-700" opacity={step === 5 ? 1 : 0}>Auditori</text>
                </g>

              </svg>
           </div>

           {/* Progress Bar & Controls Wrapper */}
           <div className="w-full bg-slate-800 p-4 z-20 border-t border-slate-700 mt-auto">
             <div className="flex items-center justify-between gap-4">
                <button onClick={handlePrev} disabled={step === 0} className="text-white hover:text-blue-400 disabled:opacity-30 transition-colors"><SkipBack size={24} /></button>
                
                <button onClick={togglePlay} className="bg-blue-500 hover:bg-blue-400 text-white rounded-full p-4 shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-transform active:scale-95 flex items-center justify-center">
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : (step === simulationStages.length -1 ? <RotateCcw size={24} /> : <Play size={24} fill="currentColor" />)}
                </button>

                <button onClick={handleNext} disabled={step === simulationStages.length - 1} className="text-white hover:text-blue-400 disabled:opacity-30 transition-colors"><SkipForward size={24} /></button>
                
                <div className="flex-1 ml-4 h-3 bg-slate-700 rounded-full overflow-hidden shadow-inner">
                   <div className="bg-gradient-to-r from-blue-400 to-pink-500 h-full transition-all duration-500" style={{ width: `${((step + 1) / simulationStages.length) * 100}%` }}></div>
                </div>
                <button onClick={handleReset} className="text-gray-400 hover:text-red-400 ml-2 transition-colors" title="Ulangi Simulasi"><RotateCcw size={20} /></button>
             </div>
           </div>
        </div>

        {/* Dynamic Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-pink-800 text-lg flex items-center gap-2 mb-2"><Brain size={18}/> Apa yang terjadi?</h4>
            <p className="text-pink-900 font-medium text-sm leading-relaxed">{currentStage.bio}</p>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 shadow-sm">
            <h4 className="font-bold text-blue-800 text-lg flex items-center gap-2 mb-2"><Activity size={18}/> Hubungan dengan Fisika</h4>
            <p className="text-blue-900 font-medium text-sm leading-relaxed">{currentStage.fisika}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

function FisikaView() {
  const [frequency, setFrequency] = useState(5);
  const [amplitude, setAmplitude] = useState(50);

  // Generate SVG Path for Sine Wave
  const generateWave = () => {
    let path = `M 0 150 `;
    for (let x = 0; x <= 800; x += 5) {
      // Scale frequency and amplitude for visual representation
      const y = 150 - (amplitude * Math.sin((x * frequency) / 200));
      path += `L ${x} ${y} `;
    }
    return path;
  };

  return (
    <div className="flex flex-col h-full gap-8">
      <div>
        <h2 className="text-4xl font-black text-gray-900">Laboratorium Fisika</h2>
        <p className="text-gray-600 mt-2 text-lg">Amati perubahan gelombang dengan mengatur frekuensi dan amplitudo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sliders & Controls */}
        <div className={`${styles.cardWhite} flex flex-col gap-6 lg:col-span-1`}>
          <div>
            <label className="block font-bold text-gray-700 mb-2 flex justify-between">
              <span>Frekuensi (f)</span>
              <span className="text-blue-600">{frequency} Hz</span>
            </label>
            <input 
              type="range" min="1" max="20" value={frequency} 
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">Makin tinggi frekuensi, gelombang makin rapat (nada makin tinggi).</p>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-2 flex justify-between">
              <span>Amplitudo (A)</span>
              <span className="text-pink-600">{amplitude}</span>
            </label>
            <input 
              type="range" min="10" max="100" value={amplitude} 
              onChange={(e) => setAmplitude(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <p className="text-sm text-gray-500 mt-1">Makin besar amplitudo, simpangan gelombang makin tinggi (suara makin keras).</p>
          </div>
        </div>

        {/* Wave Visualization */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl border-8 border-gray-200 shadow-xl overflow-hidden relative min-h-[300px] flex items-center justify-center">
           {/* Grid lines */}
           <div className="absolute inset-0 grid grid-cols-10 grid-rows-6 opacity-20 pointer-events-none">
              {[...Array(60)].map((_, i) => <div key={i} className="border border-blue-200"></div>)}
           </div>
           
           {/* Central Axis */}
           <div className="absolute w-full h-[2px] bg-blue-500/50 top-1/2 transform -translate-y-1/2"></div>
           
           <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
             <path 
               d={generateWave()} 
               fill="none" 
               stroke="url(#gradient)" 
               strokeWidth="6" 
               strokeLinecap="round"
               className="transition-all duration-75"
             />
             <defs>
               <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#60a5fa" />
                 <stop offset="50%" stopColor="#f472b6" />
                 <stop offset="100%" stopColor="#facc15" />
               </linearGradient>
             </defs>
           </svg>
        </div>

      </div>

      {/* Info Card */}
      <div className={styles.cardBlue}>
         <h4 className="font-bold text-2xl mb-4 text-blue-900">Konsep Fisika Pendengaran</h4>
         <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-white p-6 rounded-2xl border-4 border-blue-300 shadow-md text-center flex-shrink-0">
              <span className="text-3xl font-black font-mono text-gray-800">v = f × λ</span>
              <div className="mt-4 pt-4 border-t-2 border-gray-100">
                <span className="text-2xl font-black font-mono text-gray-800">T = 1 / f</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-900 font-medium bg-white/50 p-4 rounded-xl">
              <div>
                <p className="mb-2"><strong>v (Cepat rambat):</strong> Kecepatan gelombang bergerak melalui medium udara (sekitar 343 m/s).</p>
                <p className="mb-2"><strong>f (Frekuensi):</strong> Jumlah getaran per detik (Hz). Menentukan <em>pitch</em>/nada. Makin rapat siklus, nada makin tinggi.</p>
                <p><strong>λ (Lambda):</strong> Panjang gelombang. Jarak satu rapatan ke rapatan berikutnya.</p>
              </div>
              <div>
                <p className="mb-2"><strong>T (Periode):</strong> Waktu yang dibutuhkan untuk menempuh satu gelombang penuh.</p>
                <p className="mb-2"><strong>Amplitudo (A):</strong> Simpangan maksimum getaran. Memengaruhi keras-lemahnya bunyi, tapi bukan satu-satunya faktor.</p>
                <p><strong>Intensitas:</strong> Energi yang dipancarkan gelombang. Persepsi keras suara juga dipengaruhi jarak dan kondisi organ.</p>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function KuisView() {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    if (index === quizQuestions[currentQ].answer) {
      setScore(score + 1);
    }
  };

  const handleNextQ = () => {
    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (showResult) {
    return (
      <div className="flex flex-col h-full items-center justify-center max-w-2xl mx-auto text-center gap-8">
        <div className="bg-white p-12 rounded-3xl border-8 border-yellow-300 shadow-[12px_12px_0_0_#facc15] w-full">
           <h2 className="text-5xl font-black text-gray-900 mb-6">Hasil Kuis</h2>
           <div className="text-7xl mb-6">{score === quizQuestions.length ? '🏆' : '⭐'}</div>
           <p className="text-2xl font-bold text-gray-700">Skor Kamu: <span className="text-4xl text-blue-600">{score}</span> / {quizQuestions.length}</p>
           
           <div className="mt-8">
             <button onClick={resetQuiz} className={styles.btnPrimary + " mx-auto"}>
               Ulangi Kuis <RotateCcw size={20} />
             </button>
           </div>
        </div>
      </div>
    );
  }

  const q = quizQuestions[currentQ];

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto gap-8 py-8">
      <div>
        <h2 className="text-4xl font-black text-gray-900">Kuis & Evaluasi</h2>
        <div className="w-full bg-gray-200 h-3 rounded-full mt-6">
           <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{ width: `${((currentQ) / quizQuestions.length) * 100}%`}}></div>
        </div>
        <p className="text-right mt-2 font-bold text-gray-500">Pertanyaan {currentQ + 1} dari {quizQuestions.length}</p>
      </div>

      <div className={styles.cardWhite}>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 leading-relaxed">{q.q}</h3>
        
        <div className="flex flex-col gap-4">
          {q.options.map((opt, idx) => {
            let btnClass = "text-left p-4 rounded-xl border-4 font-bold transition-all text-lg ";
            if (!isAnswered) {
              btnClass += "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700";
            } else {
              if (idx === q.answer) {
                btnClass += "bg-green-100 border-green-500 text-green-800 shadow-[4px_4px_0_0_#22c55e]";
              } else if (idx === selectedOption) {
                btnClass += "bg-red-100 border-red-500 text-red-800 shadow-[4px_4px_0_0_#ef4444]";
              } else {
                btnClass += "bg-white border-gray-200 text-gray-400 opacity-50";
              }
            }

            return (
              <button key={idx} onClick={() => handleOptionClick(idx)} disabled={isAnswered} className={btnClass}>
                {opt}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-200 animate-in slide-in-from-top-4">
             <h4 className="font-bold text-blue-900 mb-2">Pembahasan:</h4>
             <p className="text-blue-800">{q.explanation}</p>
             
             <div className="mt-6 flex justify-end">
               <button onClick={handleNextQ} className={styles.btnPrimary}>
                 {currentQ === quizQuestions.length - 1 ? 'Lihat Hasil' : 'Selanjutnya'} <ArrowRight size={20} />
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}