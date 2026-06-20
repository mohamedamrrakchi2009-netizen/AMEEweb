import React, { useState } from "react";
import { Phone } from "../types";
import { Sliders, Search, Sparkles, Check, ShoppingBag, Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SmartMatchProps {
  phones: Phone[];
  onSelectPhone: (phone: Phone) => void;
  onBuyPhone: (phone: Phone) => void;
  primaryColor: string;
}

export default function SmartMatch({ phones, onSelectPhone, onBuyPhone, primaryColor }: SmartMatchProps) {
  const [budget, setBudget] = useState<number>(10000);
  const [minRam, setMinRam] = useState<number>(0); // 0 means any
  const [minStorage, setMinStorage] = useState<number>(0); // 0 means any
  const [brand, setBrand] = useState<string>("جميع الماركات");
  const [usage, setUsage] = useState<string>("all"); // gaming, photography, battery, balanced, all
  const [showResults, setShowResults] = useState(false);

  const brands = ["جميع الماركات", ...Array.from(new Set(phones.map((p) => p.brand)))];

  // Calculate matching score for each phone
  const getMatchScore = (phone: Phone) => {
    let score = 100;

    // Budget check
    if (phone.price > budget) {
      const excess = phone.price - budget;
      const penalty = Math.min(60, (excess / budget) * 100);
      score -= penalty; // Deduct score if over budget
    } else {
      // Under budget is good, closer to budget is also fine, but if it is way under, it is a great deal
      const savings = budget - phone.price;
      const benefit = Math.min(10, (savings / budget) * 50);
      score += benefit;
    }

    // RAM check
    if (minRam > 0) {
      if (phone.specs.ram < minRam) {
        score -= 40;
      } else {
        score += (phone.specs.ram - minRam) * 2;
      }
    }

    // Storage check
    if (minStorage > 0) {
      if (phone.specs.storage < minStorage) {
        score -= 40;
      } else {
        score += (phone.specs.storage - minStorage) * 0.1;
      }
    }

    // Brand check
    if (brand !== "جميع الماركات" && phone.brand !== brand) {
      score -= 50;
    }

    // Usage scenario optimization check
    if (usage === "gaming") {
      if (phone.specs.ram >= 12 || phone.specs.cpu.toLowerCase().includes("snapdragon 8") || phone.specs.cpu.toLowerCase().includes("a17")) {
        score += 15;
      } else {
        score -= 15;
      }
    } else if (usage === "photography") {
      if (phone.specs.camera.includes("200") || phone.specs.camera.includes("48") || phone.specs.camera.toLowerCase().includes("hasselblad") || phone.specs.camera.includes("تقريب")) {
        score += 15;
      } else {
        score -= 10;
      }
    } else if (usage === "battery") {
      const batVal = parseInt(phone.specs.battery) || 4000;
      if (batVal >= 5000) {
        score += 15;
      } else {
        score -= 10;
      }
    }

    // Cap score between 0 and 100
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const matchedPhones = phones
    .map((phone) => ({
      phone,
      score: getMatchScore(phone),
    }))
    .filter((item) => item.score >= 50) // only show relevant options
    .sort((a, b) => b.score - a.score);

  return (
    <div className="bg-stone-900/60 backdrop-blur-md rounded-2xl p-6 border border-amber-500/20 max-w-4xl mx-auto gold-glow overflow-hidden relative">
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            تكنولوجيا الاختيار الذكي الفاخرة
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">العثور المخصص على هاتفك المثالي</h2>
          <p className="text-stone-400 text-sm mt-1 max-w-xl mx-auto">
            حدد خياراتك وميزانيتك المرغوبة وسيقوم خيارنا الذكي بتحليل معمارية المعالج والشاشات والبطاريات ليقترح الهاتف الأنسب لذوقك واحتياجك.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Controls Panel */}
          <div className="space-y-5 bg-stone-950/40 p-5 rounded-xl border border-stone-800">
            <div className="flex items-center gap-2 mb-2 text-stone-300 font-semibold border-b border-stone-800 pb-2">
              <Sliders className="w-4 h-4 text-amber-500" />
              <span>تخصيص المواصفات الذكية</span>
            </div>

            {/* Budget Slider */}
            <div>
              <div className="flex justify-between text-xs text-stone-400 mb-1">
                <span>الميزانية القصوى والملائمة</span>
                <span className="font-mono text-amber-400 font-bold">{budget.toLocaleString()} درهم مغربي</span>
              </div>
              <input
                type="range"
                min="2000"
                max="20000"
                step="500"
                value={budget}
                onChange={(e) => {
                  setBudget(Number(e.target.value));
                  setShowResults(true);
                }}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg outline-none"
              />
              <div className="flex justify-between text-[10px] text-stone-500 mt-1 font-mono">
                <span>2,000 د.م.</span>
                <span>10,000 د.م.</span>
                <span>20,000 د.م.</span>
              </div>
            </div>

            {/* Quick Budget Chips */}
            <div className="flex flex-wrap gap-1.5">
              {[4000, 7500, 11000, 15000].map((bVal) => (
                <button
                  key={bVal}
                  onClick={() => {
                    setBudget(bVal);
                    setShowResults(true);
                  }}
                  className={`text-xs px-2.5 py-1 rounded border transition-all ${
                    budget === bVal
                      ? "bg-amber-500 text-stone-950 border-amber-500 font-semibold"
                      : "bg-stone-900 text-stone-300 border-stone-800 hover:border-amber-500/40"
                  }`}
                >
                  حتى {bVal.toLocaleString()} د.م.
                </button>
              ))}
            </div>

            {/* RAM Select */}
            <div>
              <label className="block text-xs text-stone-400 mb-1.5">الحد الأدنى لرام الهاتف (RAM):</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 6, 8, 12].map((ramOption) => (
                  <button
                    key={ramOption}
                    onClick={() => {
                      setMinRam(ramOption);
                      setShowResults(true);
                    }}
                    className={`text-xs py-2 rounded-lg transition-all border ${
                      minRam === ramOption
                        ? "bg-amber-500/15 border-amber-500 text-amber-400 font-semibold"
                        : "bg-stone-900 border-stone-800 hover:border-stone-700 text-stone-300"
                    }`}
                  >
                    {ramOption === 0 ? "أي سعة" : `${ramOption} جيجا`}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage Select */}
            <div>
              <label className="block text-xs text-stone-400 mb-1.5">الحد الأدنى للمساحة التخزينية:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 128, 256, 512].map((storedOption) => (
                  <button
                    key={storedOption}
                    onClick={() => {
                      setMinStorage(storedOption);
                      setShowResults(true);
                    }}
                    className={`text-xs py-2 rounded-lg transition-all border ${
                      minStorage === storedOption
                        ? "bg-amber-500/15 border-amber-500 text-amber-400 font-semibold"
                        : "bg-stone-900 border-stone-800 hover:border-stone-700 text-stone-300"
                    }`}
                  >
                    {storedOption === 0 ? "أي سعة" : `${storedOption} جيجا`}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Dropdown */}
            <div>
              <label className="block text-xs text-stone-400 mb-1.5">الماركة المفضلة للهاتف:</label>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setShowResults(true);
                }}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg py-2 px-3 text-xs text-stone-200 outline-none focus:border-amber-500"
              >
                {brands.map((bName) => (
                  <option key={bName} value={bName}>
                    {bName}
                  </option>
                ))}
              </select>
            </div>

            {/* Primary usage */}
            <div>
              <label className="block text-xs text-stone-400 mb-1.5">الاستخدام الغالب للهاتف:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {[
                  { id: "all", label: "متوازن وعادي" },
                  { id: "photography", label: "كاميرا وتصوير" },
                  { id: "gaming", label: "ألعاب ثقيلة وسرعة" },
                  { id: "battery", label: "بطارية دائمية" },
                ].map((uOpt) => (
                  <button
                    key={uOpt.id}
                    onClick={() => {
                      setUsage(uOpt.id);
                      setShowResults(true);
                    }}
                    className={`text-[10px] py-1.5 px-2 rounded-lg transition-all border text-center ${
                      usage === uOpt.id
                        ? "bg-amber-500/15 border-amber-500 text-amber-400 font-medium"
                        : "bg-stone-900 border-stone-800 hover:border-stone-700 text-stone-300"
                    }`}
                  >
                    {uOpt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Matches Panel */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="text-xs text-stone-400">الترشيحات التنافسية الذكية</span>
              <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
                {matchedPhones.length} هواتف مناسبة
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
              {matchedPhones.length === 0 ? (
                <div className="text-center py-10 bg-stone-950/20 rounded-xl border border-dashed border-stone-800">
                  <p className="text-stone-500 text-xs text-center py-2">لا يوجد تطابق مثالي، حاول توسيع الميزانية أو تقليل الشروط الذكية.</p>
                </div>
              ) : (
                matchedPhones.map(({ phone, score }) => (
                  <motion.div
                    key={phone.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3.5 bg-stone-950/80 rounded-xl border border-stone-800/80 hover:border-amber-500/30 flex items-center gap-3 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-lg bg-stone-900 overflow-hidden relative border border-stone-800 flex-shrink-0">
                      <img
                        src={phone.image}
                        alt={phone.name}
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300";
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {!phone.isNew && (
                        <div className="absolute top-0 right-0 bg-amber-500 text-stone-950 text-[8px] px-1 font-bold rounded-bl">
                          مستعمل
                        </div>
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-white text-sm font-bold truncate group-hover:text-amber-400">{phone.name}</h4>
                        <span className="text-[10px] px-1.5 py-0.2 select-none rounded bg-stone-800 text-stone-400">
                          {phone.isNew ? "جديد" : phone.condition}
                        </span>
                      </div>

                      <p className="text-stone-400 text-[10px] truncate mt-0.5">
                        {phone.specs.cpu} • {phone.specs.storage} جيجا • {phone.specs.ram} جيجا رام
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-amber-400 text-xs font-black font-sans">{phone.price.toLocaleString()} د.م.</span>
                        {phone.stock > 0 && phone.stock <= 3 && (
                          <span className="text-[9px] text-rose-400 font-bold bg-rose-500/10 px-1 py-0.5 rounded animate-pulse">
                            متبقي {phone.stock} قطع فقط!
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 items-end flex-shrink-0">
                      {/* Matching Percentage Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          score >= 90
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : score >= 75
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-stone-800 text-stone-400"
                        }`}
                      >
                        {score}% تطابق
                      </span>

                      <div className="flex gap-1 mt-1">
                        <button
                          onClick={() => onSelectPhone(phone)}
                          title="تفاصيل"
                          className="p-1 px-1.5 rounded bg-stone-800/80 hover:bg-stone-700 text-stone-300 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onBuyPhone(phone)}
                          className="p-1 px-2.5 rounded text-[10px] bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 transition-transform active:scale-95 flex items-center gap-0.5"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          طلب
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
