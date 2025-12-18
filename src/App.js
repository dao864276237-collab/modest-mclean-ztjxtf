import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RefreshCw,
  Share2,
  Heart,
  Save,
  History,
  Wine,
  Mic,
  ChevronRight,
  Check,
} from "lucide-react";

// --- 模拟数据 & 资源 ---

const COCKTAIL_TYPES = [
  {
    id: "midnight_cacao",
    name: "午夜可可·轻酿版",
    engName: "Midnight Cacao Mild",
    theme: "calm",
    colors: ["#3E2723", "#5D4037", "#8D6E63"],
    liquidColor: "bg-gradient-to-t from-stone-900 via-stone-800 to-amber-900",
    // 替换为稳定的雨声音效 (Google Sounds)
    musicUrl:
      "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg",
    quote: {
      text: "孤独不是被遗弃，而是终于拥有了自己。",
      eng: "Loneliness is not being abandoned, but finally owning yourself.",
    },
    recipe: {
      base: "Deep Liquor (深色基酒)",
      notes: {
        top: "迷迭香 · 柠檬皮",
        middle: "纯苦可可 · 烘焙麦芽",
        base: "陈皮 · 橡木苔",
      },
      intensity: "0.63 (中度酿制)",
      texture: "Tight (紧绷)",
    },
  },
  {
    id: "sunset_sparkle",
    name: "落日气泡·治愈版",
    engName: "Sunset Sparkle Healing",
    theme: "bright",
    colors: ["#FF6F00", "#FFA000", "#FFD54F"],
    liquidColor: "bg-gradient-to-t from-orange-600 via-amber-500 to-yellow-300",
    // 替换为稳定的流水/森林音效 (Google Sounds)
    musicUrl: "https://actions.google.com/sounds/v1/water/stream_flowing.ogg",
    quote: {
      text: "生活总会有裂缝，那是光照进来的地方。",
      eng: "There is a crack in everything, that's how the light gets in.",
    },
    recipe: {
      base: "Bright Gin (清透琴酒)",
      notes: {
        top: "甜橙 · 薄荷",
        middle: "接骨木花 · 蜂蜜",
        base: "香草 · 白麝香",
      },
      intensity: "0.42 (轻度微醺)",
      texture: "Flow (流动)",
    },
  },
];

// --- 注入自定义 CSS 动画 ---
const GlobalStyles = () => (
  <style>{`
    @keyframes wave {
      0% { transform: translateX(-50%); }
      100% { transform: translateX(0%); }
    }
    @keyframes bubble {
      0% { bottom: -10px; opacity: 0; transform: translateX(0); }
      50% { opacity: 0.8; }
      100% { bottom: 120%; opacity: 0; transform: translateX(10px); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse-glow {
      0%, 100% { transform: scale(1); opacity: 0.2; }
      50% { transform: scale(1.2); opacity: 0.4; }
    }
    .animate-wave { animation: wave 3s linear infinite; }
    .animate-bubble { animation: bubble 3s ease-in infinite; }
    .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
    .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-500 { animation-delay: 0.5s; }
  `}</style>
);

// --- 组件：动态调酒玻璃杯 (CSS版) ---
const DynamicGlass = ({ phase, data }) => {
  // phase: 'idle' | 'mixing' | 'reveal'

  // 计算液体高度
  let height = "10%";
  if (phase === "mixing") height = "70%";
  if (phase === "reveal") height = "85%";

  return (
    <div className="relative w-48 h-64 mx-auto perspective-1000">
      {/* 玻璃杯体 */}
      <div className="relative w-full h-full rounded-b-[4rem] border-l border-r border-b border-white/20 bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-sm overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.05)] ring-1 ring-white/10 transition-all duration-1000">
        {/* 玻璃高光 */}
        <div className="absolute top-0 right-4 w-2 h-full bg-gradient-to-b from-transparent via-white/10 to-transparent blur-sm z-20"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/5 blur-xl z-20"></div>

        {/* 液体容器 */}
        <div
          className={`absolute bottom-0 w-full z-10 transition-all duration-[2000ms] ease-in-out ${
            data ? data.liquidColor : "bg-slate-700"
          }`}
          style={{
            height: height,
            filter: phase === "mixing" ? "hue-rotate(90deg)" : "none",
          }}
        >
          {/* 液面波动 */}
          <div className="absolute -top-3 w-[200%] h-6 bg-inherit opacity-80 animate-wave rounded-[40%]"></div>
          <div
            className="absolute -top-2 w-[200%] h-6 bg-inherit opacity-50 animate-wave rounded-[35%]"
            style={{ animationDirection: "reverse", animationDuration: "4s" }}
          ></div>

          {/* 气泡粒子 (Mixing 时出现) */}
          {phase === "mixing" && (
            <>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white/30 rounded-full animate-bubble"
                  style={{
                    width: Math.random() * 6 + 2 + "px",
                    height: Math.random() * 6 + 2 + "px",
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${Math.random() * 2 + 2}s`,
                  }}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* 杯底阴影 */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/50 blur-md rounded-full"></div>
    </div>
  );
};

// --- 主应用 ---
const MoodBartender = () => {
  const [currentScreen, setCurrentScreen] = useState("mixing");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const audioRef = useRef(null);

  const startMixing = () => {
    setIsAnalyzing(true);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    setTimeout(() => {
      const randomDrink =
        COCKTAIL_TYPES[Math.floor(Math.random() * COCKTAIL_TYPES.length)];
      setResult(randomDrink);
      setIsAnalyzing(false);
      setCurrentScreen("reveal");
      playMusic(randomDrink.musicUrl);
    }, 4500);
  };

  const playMusic = (url) => {
    // 1. 如果有旧音频，先暂停并重置
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // 2. 创建新音频对象
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0; // 初始静音，用于淡入
    audioRef.current = audio;

    // 3. 添加错误监听
    audio.addEventListener("error", (e) => {
      console.error("音频加载失败:", e);
      // 可以选择在这里显示一个 Toast 提示用户音频不可用
    });

    // 4. 尝试播放 (处理 Promise 拒绝的情况)
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          // 音频淡入效果
          let vol = 0;
          const fadeIn = setInterval(() => {
            if (vol < 0.4) {
              vol += 0.05;
              // 确保音频对象没变且没有被暂停
              if (audioRef.current === audio && !audio.paused) {
                audio.volume = Math.min(vol, 0.4);
              } else {
                clearInterval(fadeIn);
              }
            } else {
              clearInterval(fadeIn);
            }
          }, 200);
        })
        .catch((error) => {
          console.warn("自动播放被阻止或源无效:", error);
          setIsPlaying(false);
        });
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // 重新播放时也要捕获错误
        audioRef.current.play().catch((e) => console.error("播放失败", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const reset = () => {
    setCurrentScreen("mixing");
    setResult(null);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const handleSave = () => showToast("已保存到你的情绪酒单");

  const handleShare = async () => {
    if (!result) return;
    const shareData = {
      title: "Mood Bartender",
      text: `【Mood Bartender】为你调制了一杯：${result.name}\n“${result.quote.text}”`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `${shareData.text} ${shareData.url}`
        );
        showToast("已复制分享链接与文案！");
      } catch (err) {
        showToast("无法复制，请截图分享");
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500/30 overflow-hidden relative">
      <GlobalStyles />

      {/* 背景氛围 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-900/20 rounded-full blur-[100px] animate-pulse-glow delay-500" />
      </div>

      {/* Toast 提示 */}
      {toast.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-stone-800/90 backdrop-blur-md border border-stone-700 px-6 py-3 rounded-full shadow-2xl flex items-center space-x-2 animate-fade-in">
          <Check size={16} className="text-green-400" />
          <span className="text-sm font-medium text-stone-200">
            {toast.message}
          </span>
        </div>
      )}

      {/* 界面 1: 主界面 */}
      {currentScreen === "mixing" && (
        <div className="flex flex-col h-screen px-6 py-8 relative z-10 animate-fade-in">
          <div className="flex justify-between items-center mb-12">
            <span className="text-xs font-serif tracking-[0.2em] text-stone-400">
              MOOD BARTENDER
            </span>
            <button className="p-2 rounded-full bg-stone-900/50 border border-white/5">
              <History size={18} className="text-stone-400" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center relative">
            {isAnalyzing && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse-glow" />
                <div className="w-48 h-48 bg-purple-500/10 rounded-full blur-2xl animate-pulse-glow delay-300" />
              </div>
            )}

            <DynamicGlass phase={isAnalyzing ? "mixing" : "idle"} data={null} />

            <div className="mt-8 text-center h-16">
              {isAnalyzing ? (
                <div className="animate-fade-in">
                  <p className="text-lg font-serif text-amber-100/90">
                    正在调和你的情绪基酒...
                  </p>
                  <p className="text-xs text-stone-500 mt-2 tracking-widest uppercase">
                    Analyzing EFI...
                  </p>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <p className="text-2xl font-serif text-stone-200">
                    今晚，想喝点什么？
                  </p>
                  <p className="text-sm text-stone-500 mt-2">
                    告诉我你的心情，为你调制专属风味
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 情绪条 */}
          <div className="mb-12">
            <div className="flex justify-between text-[10px] text-stone-500 uppercase tracking-widest mb-2">
              <span>Calm (内省)</span>
              <span>Bright (释放)</span>
            </div>
            <div className="h-1 bg-stone-800 rounded-full overflow-hidden relative">
              <div
                className={`absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent blur-sm -translate-x-1/2 transition-all duration-[3000ms] ${
                  isAnalyzing ? "left-[80%]" : "left-1/2"
                }`}
              />
              {isAnalyzing && (
                <div className="absolute h-full w-full bg-stone-700/30 animate-pulse" />
              )}
            </div>
          </div>

          {/* 按钮 */}
          <div className="mb-8">
            {!isAnalyzing ? (
              <button
                onClick={startMixing}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-amber-700 to-amber-900 text-amber-50 font-medium tracking-wide shadow-lg shadow-amber-900/20 active:scale-95 transition-transform flex items-center justify-center group"
              >
                <Mic className="w-5 h-5 mr-2 opacity-80" />
                <span>按住说话 / 开始调制</span>
                <ChevronRight className="w-4 h-4 ml-2 opacity-50 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button className="w-full py-5 rounded-2xl border border-stone-700 text-stone-400 font-medium tracking-wide flex items-center justify-center cursor-default">
                <span className="animate-pulse">感知中...</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 界面 2: 结果页 */}
      {currentScreen === "reveal" && result && (
        <div className="absolute inset-0 z-20 flex flex-col h-screen overflow-y-auto bg-stone-950 animate-fade-in">
          <div
            className={`absolute top-0 w-full h-1/2 ${result.liquidColor} opacity-10 blur-3xl pointer-events-none`}
          />

          <div className="flex justify-between items-center p-6 relative z-30">
            <button
              onClick={reset}
              className="text-stone-400 hover:text-white flex items-center text-sm"
            >
              <ChevronRight className="rotate-180 w-4 h-4 mr-1" /> 再调一杯
            </button>
            <button
              onClick={toggleMusic}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-100 hover:bg-white/20 transition-colors"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center px-6 pt-2 pb-10 relative z-10">
            <div className="text-center mb-8 animate-fade-in delay-200">
              <h1 className="text-4xl font-serif font-medium text-amber-50 mb-2 leading-tight">
                {result.name}
              </h1>
              <p className="text-sm font-serif italic text-amber-500/80 tracking-wide">
                {result.engName}
              </p>
            </div>

            <div className="mb-10 relative animate-fade-in delay-100">
              {isPlaying && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/5 animate-ping opacity-20" />
              )}
              <DynamicGlass phase="reveal" data={result} />
            </div>

            <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-fade-in delay-300">
              <div className="flex items-center space-x-2 mb-6">
                <Wine size={16} className="text-amber-500" />
                <span className="text-xs font-bold text-stone-300 uppercase tracking-widest">
                  Your Mood Recipe
                </span>
              </div>
              <div className="space-y-4 font-serif">
                <div className="flex justify-between items-start border-b border-white/5 pb-3">
                  <span className="text-stone-400 text-sm">基酒 Base</span>
                  <span className="text-stone-200 text-sm text-right">
                    {result.recipe.base}
                  </span>
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm pb-3 border-b border-white/5">
                  <span className="text-stone-400">前调</span>
                  <span className="text-stone-300 text-right">
                    {result.recipe.notes.top}
                  </span>
                  <span className="text-stone-400">中调</span>
                  <span className="text-stone-300 text-right">
                    {result.recipe.notes.middle}
                  </span>
                  <span className="text-stone-400">尾调</span>
                  <span className="text-stone-300 text-right">
                    {result.recipe.notes.base}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-stone-500 uppercase">
                      Concentration
                    </span>
                    <span className="text-stone-300 text-sm">
                      {result.recipe.intensity}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-stone-500 uppercase">
                      Texture
                    </span>
                    <span className="text-stone-300 text-sm">
                      {result.recipe.texture}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center max-w-xs animate-fade-in delay-500">
              <p className="text-stone-200 text-sm leading-relaxed mb-2">
                “{result.quote.text}”
              </p>
              <p className="text-stone-500 text-xs italic font-serif">
                {result.quote.eng}
              </p>
            </div>

            <div className="flex w-full max-w-sm gap-4 mt-10 animate-fade-in delay-500">
              <button
                onClick={handleSave}
                className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-colors backdrop-blur-md active:scale-95"
              >
                <Save size={20} className="text-stone-300" />
                <span className="text-[10px] text-stone-400">入库酒单</span>
              </button>
              <button
                onClick={handleShare}
                className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-colors backdrop-blur-md active:scale-95"
              >
                <Share2 size={20} className="text-stone-300" />
                <span className="text-[10px] text-stone-400">分享情绪</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodBartender;
