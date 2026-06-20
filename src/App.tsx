import React, { useState, useEffect } from "react";
import { Phone as PhoneType, Order, SiteSettings, Testimonial } from "./types";
import { DEFAULT_PHONES, DEFAULT_SETTINGS, DEFAULT_TESTIMONIALS, BRANDS } from "./defaultData";
import SmartMatch from "./components/SmartMatch";
import CheckoutModal from "./components/CheckoutModal";
import {
  Phone as PhoneIcon,
  Check,
  Search,
  Filter,
  Upload,
  X,
  Layers,
  Settings,
  CreditCard,
  ShoppingBag,
  TrendingUp,
  Plus,
  Trash2,
  Edit,
  User,
  DollarSign,
  MapPin,
  Mail,
  Star,
  Menu,
  Grid,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Sliders,
  Shield,
  Activity,
  Eye,
  Truck,
  PlusCircle,
  LogOut,
  Maximize2,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Instagram,
  Facebook
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 35, 
    scale: 0.94,
    filter: "blur(4px)"
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 14,
      mass: 0.9,
    },
  },
};

export default function App() {
  // Load initial data from localStorage if exists, else defaults
  const [phones, setPhones] = useState<PhoneType[]>(() => {
    const saved = localStorage.getItem("alassil_phones");
    return saved ? JSON.parse(saved) : DEFAULT_PHONES;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem("alassil_settings");
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("alassil_orders");
    return saved ? JSON.parse(saved) : [];
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem("alassil_testimonials");
    return saved ? JSON.parse(saved) : DEFAULT_TESTIMONIALS;
  });

  // Track state and save to localStorage on changes
  useEffect(() => {
    localStorage.setItem("alassil_phones", JSON.stringify(phones));
  }, [phones]);

  useEffect(() => {
    localStorage.setItem("alassil_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("alassil_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("alassil_testimonials", JSON.stringify(testimonials));
  }, [testimonials]);

  // Routing State
  // Home, Products, SmartMatch, Contacts/Reviews, Admin
  const [currentPath, setCurrentPath] = useState<"home" | "products" | "smart-match" | "testimonials" | "contact" | "admin">("home");

  // Admin secret protection screen
  const [adminCodeInput, setAdminCodeInput] = useState("");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminError, setAdminError] = useState("");

  // Store Front filters
  const [selectedBrand, setSelectedBrand] = useState("جميع الماركات");
  const [conditionFilter, setConditionFilter] = useState<"all" | "new" | "used">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<number>(25000); // Max starting price

  // Modals & triggers
  const [selectedPhone, setSelectedPhone] = useState<PhoneType | null>(null);
  const [cartPhone, setCartPhone] = useState<PhoneType | null>(null);

  // New Phone state for the Add Form inside Admin dashboard
  const [newPhoneName, setNewPhoneName] = useState("");
  const [newPhoneBrand, setNewPhoneBrand] = useState("Apple");
  const [newPhonePrice, setNewPhonePrice] = useState("");
  const [newPhoneIsNew, setNewPhoneIsNew] = useState(true);
  const [newPhoneCondition, setNewPhoneCondition] = useState<"كالجديد" | "ممتاز" | "جيد جداً" | "جيد">("كالجديد");
  const [newPhoneStock, setNewPhoneStock] = useState("5");
  const [newPhoneIsLimited, setNewPhoneIsLimited] = useState(true);
  const [newPhoneImage, setNewPhoneImage] = useState("");
  const [newPhoneDesc, setNewPhoneDesc] = useState("");
  const [imageUrlType, setImageUrlType] = useState<"url" | "file">("file");

  // Phone Specs state for Form
  const [specCpu, setSpecCpu] = useState("");
  const [specScreen, setSpecScreen] = useState("");
  const [specBattery, setSpecBattery] = useState("");
  const [specCamera, setSpecCamera] = useState("");
  const [specRam, setSpecRam] = useState("8");
  const [specStorage, setSpecStorage] = useState("256");

  // Admin Edit Settings States
  const [adminLogoText, setAdminLogoText] = useState(settings.logoText);
  const [adminLogoSubtext, setAdminLogoSubtext] = useState(settings.logoSubtext);
  const [adminWhatsapp, setAdminWhatsapp] = useState(settings.whatsappContact);
  const [adminEmail, setAdminEmail] = useState(settings.email);
  const [adminInstagram, setAdminInstagram] = useState(settings.instagramLink || "");
  const [adminFacebook, setAdminFacebook] = useState(settings.facebookLink || "");
  const [adminShowWhatsAppFloat, setAdminShowWhatsAppFloat] = useState(settings.showWhatsAppFloat !== false);
  const [adminMaps, setAdminMaps] = useState(settings.googleMapsIframe);
  const [adminDelPrice, setAdminDelPrice] = useState(settings.deliveryPrice);
  const [adminIsDelFree, setAdminIsDelFree] = useState(settings.isDeliveryFree);
  const [adminHeroTitle, setAdminHeroTitle] = useState(settings.heroTitle);
  const [adminHeroSub, setAdminHeroSub] = useState(settings.heroSub);
  const [adminPrimaryColor, setAdminPrimaryColor] = useState(settings.primaryColor);

  // Add testimonial state
  const [newTestName, setNewTestName] = useState("");
  const [newTestCity, setNewTestCity] = useState("");
  const [newTestModel, setNewTestModel] = useState("");
  const [newTestRating, setNewTestRating] = useState(5);
  const [newTestText, setNewTestText] = useState("");

  // Watch URL Hash parameter if user is exploring via '/admin' or '#admin'
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === "#admin" || window.location.pathname.endsWith("/admin")) {
        setCurrentPath("admin");
      }
    };
    window.addEventListener("hashchange", handleHash);
    handleHash();
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Update dynamic CSS custom variables on mount or settings change
  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", settings.primaryColor);
  }, [settings.primaryColor]);

  // Handle Moroccan Base64 Image Local Upload via File Reader
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhoneImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Brand New/Used Phone Function
  const handleAddPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPhoneName.trim() || !newPhonePrice || !newPhoneImage) {
      alert("الرجاء تعبئة الاسم والسعر وصورة الهاتف الذكي بالكامل");
      return;
    }

    const priceNum = parseFloat(newPhonePrice);
    const stockNum = parseInt(newPhoneStock) || 0;

    const addedPhone: PhoneType = {
      id: "PHONE-" + Math.floor(1000 + Math.random() * 9000),
      name: newPhoneName,
      brand: newPhoneBrand,
      price: priceNum,
      isNew: newPhoneIsNew,
      ...(newPhoneIsNew ? {} : { condition: newPhoneCondition }),
      stock: stockNum,
      isLimited: newPhoneIsLimited,
      image: newPhoneImage,
      description: newPhoneDesc || `${newPhoneName} هاتف ذكي مذهل بمواصفات عالية.`,
      specs: {
        cpu: specCpu || "معالج ثماني النواة قوي",
        screen: specScreen || "شاشة عالية الدقة أوليد",
        battery: specBattery || "بطارية تصمد طوال اليوم",
        camera: specCamera || "كاميرا دقيقة ومثالية للمشاهد",
        ram: parseInt(specRam) || 8,
        storage: parseInt(specStorage) || 256,
      },
    };

    setPhones((prev) => [addedPhone, ...prev]);

    // Reset fields
    setNewPhoneName("");
    setNewPhonePrice("");
    setNewPhoneStock("5");
    setNewPhoneDesc("");
    setSpecCpu("");
    setSpecScreen("");
    setSpecBattery("");
    setSpecCamera("");
    setNewPhoneImage("");
    alert("تمت إضافة الهاتف بنجاح تام وعرضه فوراً بالمتجر!");
  };

  // Delete Phone
  const deletePhone = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الهاتف نهائياً من المتجر؟")) {
      setPhones((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Complete settings update
  const saveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: SiteSettings = {
      logoText: adminLogoText,
      logoSubtext: adminLogoSubtext,
      whatsappContact: adminWhatsapp,
      email: adminEmail,
      instagramLink: adminInstagram,
      facebookLink: adminFacebook,
      showWhatsAppFloat: adminShowWhatsAppFloat,
      googleMapsIframe: adminMaps,
      deliveryPrice: Number(adminDelPrice),
      isDeliveryFree: adminIsDelFree,
      primaryColor: adminPrimaryColor,
      accentColor: "#0A0A0A",
      heroTitle: adminHeroTitle,
      heroSub: adminHeroSub,
    };
    setSettings(updatedSettings);
    alert("تم حفظ إعدادات وتخصيصات الموقع بنجاح مبهر!");
  };

  // Add Testimonial via admin handler
  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestName.trim() || !newTestText.trim()) {
      alert("الطلب غير مكتمل!");
      return;
    }
    const newT: Testimonial = {
      id: "TEST-" + Math.floor(100 + Math.random() * 900),
      name: newTestName,
      city: newTestCity || "الدار البيضاء",
      phoneModel: newTestModel || "آيفون فاخر",
      rating: newTestRating,
      text: newTestText,
    };
    setTestimonials((prev) => [newT, ...prev]);
    setNewTestName("");
    setNewTestCity("");
    setNewTestModel("");
    setNewTestText("");
    alert("تم إضافة رأي العميل الفخور بنجاح!");
  };

  // Delete Testimonial
  const deleteTestimonial = (id: string) => {
    if (confirm("حذف هذا الرأي؟")) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Unlock Admin Panel Authenticator
  const handleVerifyAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCodeInput === "15987") {
      setIsAdminAuthenticated(true);
      setAdminError("");
      // Sync form fields with settings on successful unlock
      setAdminLogoText(settings.logoText);
      setAdminLogoSubtext(settings.logoSubtext);
      setAdminWhatsapp(settings.whatsappContact);
      setAdminEmail(settings.email);
      setAdminInstagram(settings.instagramLink || "");
      setAdminFacebook(settings.facebookLink || "");
      setAdminShowWhatsAppFloat(settings.showWhatsAppFloat !== false);
      setAdminMaps(settings.googleMapsIframe);
      setAdminDelPrice(settings.deliveryPrice);
      setAdminIsDelFree(settings.isDeliveryFree);
      setAdminHeroTitle(settings.heroTitle);
      setAdminHeroSub(settings.heroSub);
      setAdminPrimaryColor(settings.primaryColor);
    } else {
      setAdminError("رمز المرور خاطئ! الرجاء إدخال الرمز السري المعتمد بشكل سليم وبدون مسافات.");
    }
  };

  // Update order delivery status
  const updateOrderStatus = (orderId: string, nextStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: nextStatus } : ord))
    );
  };

  // Delete individual order record
  const deleteOrder = (orderId: string) => {
    if (confirm("هل تريد إزالة سجل هذا الطلب نهائياً؟")) {
      setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    }
  };

  // Filter phones for customer storefront search
  const filteredPhones = phones.filter((p) => {
    const matchesBrand = selectedBrand === "جميع الماركات" || p.brand === selectedBrand;
    const matchesCondition =
      conditionFilter === "all" ||
      (conditionFilter === "new" && p.isNew) ||
      (conditionFilter === "used" && !p.isNew);
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specs.cpu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.price.toString().includes(searchQuery);
    const matchesPrice = p.price <= priceRange;

    return matchesBrand && matchesCondition && matchesQuery && matchesPrice;
  });

  return (
    <div
      className="min-h-screen text-stone-100 font-sans relative flex flex-col bg-stone-950/95"
      style={{
        "--primary-gradient": `linear-gradient(135deg, ${settings.primaryColor}, #1c1917)`,
        "--primary-glow": settings.primaryColor + "33",
      } as React.CSSProperties}
    >
      {/* GLOW DECORATIONS */}
      <div className="absolute top-0 right-[15%] w-[40vw] h-[40vw] bg-amber-500/[0.04] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[10%] w-[35vw] h-[35vw] bg-amber-400/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      {/* TOP NOTIFY BAR FOR FREE SHIPPING IF COMPATIBLE */}
      <div className="bg-stone-900 border-b border-stone-850 py-2.5 px-4 text-center select-none relative z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <Truck className="w-4 h-4 text-amber-500 animate-bounce" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-stone-300">
            {settings.isDeliveryFree
              ? "شحن سريع ومجاني بالكامل لكافة المدن والقرى المغربية اليوم!"
              : `توصيل سريع بموثوقية بـ ${settings.deliveryPrice} د.م. لجميع أنحاء المغرب، الدفع بعد المعاينة.`}
          </span>
          <span className="hidden md:inline text-[10px] text-amber-400 border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 rounded-full font-bold">
            مضمون الأصيل 100%
          </span>
        </div>
      </div>

      {/* MASTER ROYAL HEADER NAVIGATION BAR */}
      <header className="sticky top-0 z-30 bg-stone-950/90 backdrop-blur-md border-b border-stone-900 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo brand styling */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPath("home")}>
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center shadow-lg transform hover:rotate-6 transition-all duration-300"
              style={{
                background: `linear-gradient(225deg, ${settings.primaryColor}, #b45309)`,
              }}
            >
              <Award className="w-5 h-5 text-stone-950 font-black" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest text-white leading-tight flex items-center gap-1.5 font-mono">
                {settings.logoText}
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse"></span>
              </h1>
              <p className="text-[10px] text-stone-400 font-sans tracking-widest font-semibold mt-0.5">
                {settings.logoSubtext}
              </p>
            </div>
          </div>

          {/* Navigation Links inside top-bar */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentPath("home")}
              className={`text-xs px-3.5 py-2 rounded-lg font-bold transition-all ${
                currentPath === "home" ? "bg-amber-500/10 text-amber-400" : "text-stone-300 hover:text-white"
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => setCurrentPath("products")}
              className={`text-xs px-3.5 py-2 rounded-lg font-bold transition-all ${
                currentPath === "products" ? "bg-amber-500/10 text-amber-400" : "text-stone-300 hover:text-white"
              }`}
            >
              تصفح الهواتف
            </button>
            <button
              onClick={() => setCurrentPath("smart-match")}
              className={`text-xs px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1 ${
                currentPath === "smart-match" ? "bg-amber-500/10 text-amber-400" : "text-stone-300 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              الاختيار الذكي
            </button>
            <button
              onClick={() => setCurrentPath("testimonials")}
              className={`text-xs px-3.5 py-2 rounded-lg font-bold transition-all ${
                currentPath === "testimonials" ? "bg-amber-500/10 text-amber-400" : "text-stone-300 hover:text-white"
              }`}
            >
              آراء العملاء
            </button>
            <button
              onClick={() => setCurrentPath("contact")}
              className={`text-xs px-3.5 py-2 rounded-lg font-bold transition-all ${
                currentPath === "contact" ? "bg-amber-500/10 text-amber-400" : "text-stone-300 hover:text-white"
              }`}
            >
              موقعنا واتصال بنا
            </button>
          </nav>

          {/* Call / WhatsApp & Admin fast link */}
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${settings.whatsappContact}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-500/30 transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>واتساب المبيعات</span>
            </a>
          </div>
        </div>

        {/* MOBILE NAVIGATION TABS BAR (ELEGANT AND STICKY) */}
        <div className="md:hidden flex items-center justify-around border-t border-stone-900 bg-stone-950 py-2.5 px-2">
          <button
            onClick={() => setCurrentPath("home")}
            className={`text-[10px] flex flex-col items-center gap-1 transition-all ${
              currentPath === "home" ? "text-amber-400 font-extrabold" : "text-stone-500 hover:text-stone-300"
            }`}
          >
            <Grid className="w-4.5 h-4.5" />
            <span>الرئيسية</span>
          </button>
          <button
            onClick={() => setCurrentPath("products")}
            className={`text-[10px] flex flex-col items-center gap-1 transition-all ${
              currentPath === "products" ? "text-amber-400 font-extrabold" : "text-stone-500 hover:text-stone-300"
            }`}
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            <span>الهواتف</span>
          </button>
          <button
            onClick={() => setCurrentPath("smart-match")}
            className={`text-[10px] flex flex-col items-center gap-1 transition-all ${
              currentPath === "smart-match" ? "text-amber-400 font-extrabold" : "text-stone-500 hover:text-stone-300"
            }`}
          >
            <Sparkles className="w-4.5 h-4.5" />
            <span>خيار ذكي</span>
          </button>
          <button
            onClick={() => setCurrentPath("testimonials")}
            className={`text-[10px] flex flex-col items-center gap-1 transition-all ${
              currentPath === "testimonials" ? "text-amber-400 font-extrabold" : "text-stone-500 hover:text-stone-300"
            }`}
          >
            <Star className="w-4.5 h-4.5" />
            <span>الآراء</span>
          </button>
          <button
            onClick={() => setCurrentPath("contact")}
            className={`text-[10px] flex flex-col items-center gap-1 transition-all ${
              currentPath === "contact" ? "text-amber-400 font-extrabold" : "text-stone-500 hover:text-stone-300"
            }`}
          >
            <MapPin className="w-4.5 h-4.5" />
            <span>اتصال</span>
          </button>
        </div>
      </header>

      {/* CORE PAGES LAYOUT CONTAINER */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <AnimatePresence mode="wait">
          {/* 1. HOME SCREEN VIEW */}
          {currentPath === "home" && (
            <motion.div
              key="home-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* HERO CHAMPION SECTION */}
              <div className="rounded-3xl relative overflow-hidden bg-stone-900 border border-stone-800 p-8 md:p-12 lg:p-16 gold-glow transition-all">
                {/* Background graphic accents */}
                <div className="absolute -top-1/4 -right-1/4 w-2/3 h-2/3 bg-amber-500/[0.05] rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/[0.02] rounded-tr-3xl rounded-bl-3xl pointer-events-none"></div>

                <div className="relative z-10 max-w-3xl space-y-6">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold leading-none">
                    <Sparkles className="w-3.5 h-3.5" />
                    المتجر الأرقى والأكثر أماناً في المغرب
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                    {settings.heroTitle}
                  </h2>
                  <p className="text-stone-400 text-sm md:text-base leading-relaxed max-w-2xl">
                    {settings.heroSub}
                  </p>

                  <div className="flex flex-wrap gap-3 pt-4">
                    <button
                      onClick={() => setCurrentPath("products")}
                      className="bg-amber-500 text-stone-950 hover:bg-amber-400 font-extrabold px-6 py-3 rounded-xl text-xs transition-transform active:scale-95 shadow-lg shadow-amber-500/15 cursor-pointer"
                    >
                      تصفح الهواتف المتوفرة بالمعرض
                    </button>
                    <button
                      onClick={() => setCurrentPath("smart-match")}
                      className="bg-stone-950 text-amber-400 border border-amber-500/30 hover:bg-stone-900 font-bold px-6 py-3 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      مساعد الاختيار الذكي الموجه
                    </button>
                  </div>
                </div>
              </div>

              {/* BRAND SELECTOR HORIZONTAL RAIL */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4.5 h-4.5 text-amber-500" />
                    <span>تسوق حسب ماركتك المفضلة</span>
                  </h3>
                  <span className="text-[11px] text-stone-400 uppercase tracking-widest font-black">
                    جميع الخيارات حقيقية ومفحوصة
                  </span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                  {BRANDS.map((bName) => (
                    <button
                      key={bName}
                      onClick={() => {
                        setSelectedBrand(bName);
                        setCurrentPath("products");
                      }}
                      className={`text-xs px-5 py-3 rounded-xl border font-bold transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                        selectedBrand === bName
                          ? "bg-amber-500 text-stone-950 border-amber-500 shadow-md shadow-amber-500/10"
                          : "bg-stone-900 border-stone-850 text-stone-300 hover:border-amber-500/30 hover:text-amber-400"
                      }`}
                    >
                      {bName}
                    </button>
                  ))}
                </div>
              </div>

              {/* FEATURED SMART GRID SNEAK-PEEK (6 Flagship Phones maximum for homepage) */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-900 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-amber-500" />
                      <span>قائمتنا الحصرية (الجديدة والمستعملة)</span>
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      تفاصيل كاملة لكل جهاز بلمسة زر واحدة. نضمن لك جودة البطارية وصحة المعالجات.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setConditionFilter("all");
                      setSelectedBrand("جميع الماركات");
                      setCurrentPath("products");
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    <span>رؤية كل المعروض</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* Grid layout */}
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {phones.slice(0, 6).map((phone) => (
                    <motion.div
                      key={phone.id}
                      variants={cardVariants}
                      whileHover={{ 
                        y: -8,
                        borderColor: "rgba(245, 158, 11, 0.40)",
                        boxShadow: "0 15px 30px -10px rgba(245, 158, 11, 0.15)",
                      }}
                      className="bg-stone-900/60 border border-stone-850 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between group h-full relative"
                    >
                      {/* Limited quantity warning */}
                      {phone.isLimited && (
                        <div className="absolute top-3 left-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] px-2.5 py-1 rounded-full font-bold animate-pulse z-10">
                          {phone.stock > 0 ? `متبقي ${phone.stock} قطع!` : "كمية محدودة"}
                        </div>
                      )}

                      {/* Condition badge for Used phones */}
                      <div className="absolute top-3 right-3 z-10">
                        {phone.isNew ? (
                          <span className="bg-emerald-500 text-stone-950 font-sans text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                            جديد ومختوم
                          </span>
                        ) : (
                          <span className="bg-amber-500 text-stone-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                            مستعمل: {phone.condition}
                          </span>
                        )}
                      </div>

                      {/* Photo Phone */}
                      <div className="aspect-square bg-stone-950 rounded-xl overflow-hidden relative border border-stone-800 flex items-center justify-center p-2 mb-4 group cursor-pointer" onClick={() => setSelectedPhone(phone)}>
                        <img
                          src={phone.image}
                          alt={phone.name}
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400";
                          }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-stone-950/90 text-white text-xs font-bold border border-stone-800 px-4 py-2 rounded-xl flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-amber-500" />
                            شاهد تفاصيل العتاد بالكامل
                          </span>
                        </div>
                      </div>

                      {/* Specs Summary and price */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-[11px] text-stone-500 uppercase tracking-widest font-bold">
                            {phone.brand}
                          </p>
                          <h4 className="text-white text-sm font-extrabold truncate select-none mt-0.5 group-hover:text-amber-400">
                            {phone.name}
                          </h4>
                        </div>

                        {/* Basic specification chips preview */}
                        <div className="grid grid-cols-2 gap-1.5 bg-stone-950/40 p-2.5 rounded-xl border border-stone-850/80">
                          <div className="text-[10px] text-stone-400 truncate">
                            💾 {phone.specs.storage} جيجا مساحة
                          </div>
                          <div className="text-[10px] text-stone-400 truncate">
                            ⚡ {phone.specs.ram} جيجا رام
                          </div>
                        </div>

                        {/* Luxury Pricing displays */}
                        <div className="flex items-baseline justify-between border-t border-stone-850/80 pt-2.5 mt-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-stone-500">سعر التقسيط / الدفع الإجمالي</span>
                            <span className="text-amber-400 text-base font-black font-sans tracking-wide">
                              {phone.price.toLocaleString()} <span className="text-xs">د.م.</span>
                            </span>
                          </div>

                          <button
                            onClick={() => setCartPhone(phone)}
                            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-md shadow-amber-500/10 flex items-center gap-1 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>طلب سريع</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* DYNAMIC SHADOWED GOOGLE MAPS BLOCK */}
              <div className="p-6 bg-stone-900 border border-stone-850 rounded-2xl rounded-tr-none relative overflow-hidden gold-glow">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <span className="inline-block text-xs font-bold text-amber-500">المقر الرسمي والمعاينة</span>
                    <h3 className="text-xl font-bold text-white">زورونا في مركز المعرض بقلب المغرب</h3>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      نوفر لزبنائنا الكرام إمكانية تفقد الهواتف بأنفسهم، اختبار الكاميرات والأداء العام بالمقر الرئيسي. كما ننظم توصيلاً مجانياً سريعاً لكافة أرجاء المغرب بدقة متناهية تحت طائلة فاحصي الأجهزة والتحقق الإلكتروني.
                    </p>

                    <div className="space-y-2 text-xs text-stone-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4.5 h-4.5 text-amber-500" />
                        <span>شارع النخيل، الدار البيضاء، المغرب</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4.5 h-4.5 text-amber-500" />
                        <span>{settings.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* maps frame */}
                  <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden border border-stone-800 bg-stone-950">
                    <iframe
                      src={settings.googleMapsIframe}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Google Maps Location Al Assil"
                    ></iframe>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. ADVANCED INTERACTIVE CATALOGUE VIEW */}
          {currentPath === "products" && (
            <motion.div
              key="products-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="text-center md:text-right max-w-xl">
                <h2 className="text-2xl font-bold text-white">المعرض العام للهواتف الذكية</h2>
                <p className="text-xs text-stone-400 mt-1">
                  نوفر فلترة دقيقة حسب نوع الهاتف، جديدة كانت أو مستعملة بأسعار مغرية لا تضاهى.
                </p>
              </div>

              {/* SEARCH ENGINE + FILTER PANEL */}
              <div className="bg-stone-900 border border-stone-850 p-5 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Text search query */}
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث بالاسم أو السعر أو الماركة..."
                      className="w-full bg-stone-950/80 border border-stone-800 hover:border-stone-700/80 text-xs rounded-xl py-2.5 pr-9 pl-3 outline-none text-white focus:border-amber-500"
                    />
                  </div>

                  {/* Brand select */}
                  <div>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full bg-stone-950/80 border border-stone-800 text-xs rounded-xl py-2.5 px-3 outline-none text-white focus:border-amber-500"
                    >
                      {BRANDS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Condition Filter */}
                  <div className="grid grid-cols-3 gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
                    {[
                      { id: "all", label: "الكل" },
                      { id: "new", label: "جديد بحت" },
                      { id: "used", label: "مستعمل" },
                    ].map((cond) => (
                      <button
                        key={cond.id}
                        onClick={() => setConditionFilter(cond.id as any)}
                        className={`text-[10px] py-1.5 px-2 rounded-lg text-center font-bold transition-all ${
                          conditionFilter === cond.id
                            ? "bg-amber-500 text-stone-950 font-extrabold"
                            : "text-stone-400 hover:text-white"
                        }`}
                      >
                        {cond.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Ceiling Slide */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-850/80 pt-4">
                  <div className="flex items-center gap-2 text-xs text-stone-400 w-full sm:w-auto">
                    <span>السقف المالي المطلوب:</span>
                    <span className="font-mono text-amber-400 font-bold">{priceRange.toLocaleString()} د.م.</span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="22000"
                    step="500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full sm:max-w-md accent-amber-500 cursor-pointer h-1.5 bg-stone-950 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* PRODUCTS LIST GRID */}
              {filteredPhones.length === 0 ? (
                <div className="text-center py-20 bg-stone-900/40 rounded-2xl border border-stone-850">
                  <AlertCircle className="w-10 h-10 text-stone-500 mx-auto mb-3" />
                  <p className="text-stone-400 text-sm">لم يتم العثور على أي هواتف تطابق الفلاتر المحددة حالياً.</p>
                  <button
                    onClick={() => {
                      setSelectedBrand("جميع الماركات");
                      setConditionFilter("all");
                      setSearchQuery("");
                      setPriceRange(25000);
                    }}
                    className="mt-3 text-xs text-amber-500 hover:underline font-bold"
                  >
                    إعادة ضبط الفلاتر الأصلية
                  </button>
                </div>
              ) : (
                <motion.div 
                  key={`${selectedBrand}-${conditionFilter}-${priceRange}-${searchQuery}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredPhones.map((phone) => (
                    <motion.div
                      key={phone.id}
                      variants={cardVariants}
                      whileHover={{ 
                        y: -8,
                        borderColor: "rgba(245, 158, 11, 0.40)",
                        boxShadow: "0 15px 30px -10px rgba(245, 158, 11, 0.15)",
                      }}
                      className="bg-stone-900/60 border border-stone-850 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between group h-full relative"
                      layout
                    >
                      {/* Limited quantity warning */}
                      {phone.isLimited && (
                        <div className="absolute top-3 left-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] px-2.5 py-1 rounded-full font-bold animate-pulse z-10">
                          متبقي {phone.stock} قطع!
                        </div>
                      )}

                      {/* Condition badge */}
                      <div className="absolute top-3 right-3 z-10">
                        {phone.isNew ? (
                          <span className="bg-emerald-500 text-stone-950 font-sans text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                            جديد ومختوم
                          </span>
                        ) : (
                          <span className="bg-amber-500 text-stone-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                            مستعمل: {phone.condition}
                          </span>
                        )}
                      </div>

                      {/* Photo Phone */}
                      <div className="aspect-square bg-stone-950 rounded-xl overflow-hidden relative border border-stone-800 flex items-center justify-center p-2 mb-4 group cursor-pointer" onClick={() => setSelectedPhone(phone)}>
                        <img
                          src={phone.image}
                          alt={phone.name}
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400";
                          }}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-stone-950/90 text-white text-xs font-bold border border-stone-800 px-4 py-2 rounded-xl flex items-center gap-1">
                            <Maximize2 className="w-3.5 h-3.5 text-amber-500" />
                            شاهد عتاد الهاتف ومواصفاته
                          </span>
                        </div>
                      </div>

                      {/* Specs and pricing info */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-[11px] text-stone-500 uppercase tracking-widest font-bold">
                            {phone.brand}
                          </p>
                          <h4 className="text-white text-sm font-extrabold truncate mt-0.5 group-hover:text-amber-400">
                            {phone.name}
                          </h4>
                        </div>

                        {/* specification preview */}
                        <div className="grid grid-cols-2 gap-1.5 bg-stone-950/40 p-2.5 rounded-xl border border-stone-850/80">
                          <div className="text-[10px] text-stone-400 truncate">
                            💾 {phone.specs.storage} جيجا مساحة
                          </div>
                          <div className="text-[10px] text-stone-400 truncate">
                            ⚡ {phone.specs.ram} جيجا رام
                          </div>
                          <div className="text-[10px] text-stone-400 truncate col-span-2">
                            📱 {phone.specs.cpu}
                          </div>
                        </div>

                        <div className="flex items-baseline justify-between border-t border-stone-850/80 pt-2.5 mt-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-stone-500">الدفع عند معاينة الطلب</span>
                            <span className="text-amber-400 text-base font-black font-sans tracking-wide animate-pulse">
                              {phone.price.toLocaleString()} <span className="text-xs">د.م.</span>
                            </span>
                          </div>

                          <button
                            onClick={() => setCartPhone(phone)}
                            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all active:scale-95 shadow-md shadow-amber-500/10 flex items-center gap-1 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>طلب سريع</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* 3. SMART SEARCH ASSISTANT VIEW */}
          {currentPath === "smart-match" && (
            <motion.div
              key="smart-match-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <SmartMatch
                phones={phones}
                onSelectPhone={(ph) => setSelectedPhone(ph)}
                onBuyPhone={(ph) => setCartPhone(ph)}
                primaryColor={settings.primaryColor}
              />
            </motion.div>
          )}

          {/* 4. REVIEWS & TESTIMONIALS VIEW */}
          {currentPath === "testimonials" && (
            <motion.div
              key="testimonials-page"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center max-w-xl mx-auto space-y-2">
                <span className="inline-block text-xs font-bold text-amber-500">تقييمات وثقة متبادلة</span>
                <h2 className="text-2xl font-black text-white">آراء وتجارب عملائنا الأوفياء</h2>
                <p className="text-xs text-stone-400">
                  شهدائنا الأوفياء هم سر نجاحنا في المغرب، توصيل فوري ونزاهة تامة بالمعاينة.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((test) => (
                  <div
                    key={test.id}
                    className="bg-stone-900 border border-stone-850 p-5 rounded-2xl relative gold-glow flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Rating stars */}
                      <div className="flex gap-1">
                        {Array.from({ length: test.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                        ))}
                      </div>

                      <p className="text-stone-300 text-xs italic leading-relaxed">
                        &quot;{test.text}&quot;
                      </p>
                    </div>

                    <div className="border-t border-stone-850/80 pt-3 mt-4 flex justify-between items-center text-xs">
                      <div>
                        <h4 className="text-white font-bold">{test.name}</h4>
                        <span className="text-[10px] text-stone-500">المدينة: {test.city}</span>
                      </div>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-stone-950 text-stone-400">
                        {test.phoneModel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 5. CONTACT US & ABOUT US (GOOGLE MAPS SEAMLESS INTEGRATION) */}
          {currentPath === "contact" && (
            <motion.div
              key="contact-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h2 className="text-2xl font-black text-white">تواصل معنا وموقع المعرض</h2>
                <p className="text-xs text-stone-400">
                  فريقنا متوفر على مدار الساعة للإجابة عن أسئلتكم، تتبع طرودكم وصيانة الهواتف المغرب.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact options */}
                <div className="space-y-4">
                  <div className="p-5 bg-stone-900 border border-stone-850 rounded-2xl">
                    <h3 className="text-sm font-bold text-white mb-3">تفاصيل الإتصال الرسمية</h3>
                    <div className="space-y-3 text-xs text-stone-300">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-5 h-5 text-amber-500" />
                        <span>شارع النخيل، الدار البيضاء، المغرب</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-5 h-5 text-amber-500" />
                        <span>{settings.email}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <PhoneIcon className="w-5 h-5 text-amber-500" />
                        <span>{settings.whatsappContact}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-stone-900 border border-stone-850 rounded-2xl space-y-3">
                    <h3 className="text-sm font-bold text-white">ساعات العمل الرسمية بالمعرض</h3>
                    <div className="space-y-1.5 text-xs text-stone-400">
                      <p>• من الإثنين إلى السبت: 10:00 صباحاً - 9:00 مساءً</p>
                      <p>• الأحد: 2:00 زوالاً - 8:00 مساءً</p>
                    </div>
                  </div>
                </div>

                {/* Google Map */}
                <div className="bg-stone-900 border border-stone-850 rounded-2xl overflow-hidden h-72 md:h-96 relative gold-glow">
                  <iframe
                    src={settings.googleMapsIframe}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    title="Interactive Maps Morocco"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          )}

          {/* 6. MAJESTIC ADMIN DASHBOARD CONTROL CENTER */}
          {currentPath === "admin" && (
            <motion.div
              key="admin-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* LOCK Authenticator SCREEN */}
              {!isAdminAuthenticated ? (
                <div className="max-w-md mx-auto bg-stone-900 border border-amber-500/30 rounded-2xl p-6 text-center space-y-6 gold-glow mt-8">
                  <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
                    <Shield className="w-7 h-7" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">إثبات هوية المشرف ومسؤول النظام</h3>
                    <p className="text-xs text-stone-400">
                      يجب إدخال الرمز السري المرخص لك كمسؤول لتفحص حركات البيع، إدارة المنتجات وتعديل الإعدادات.
                    </p>
                  </div>

                  {adminError && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-2.5 rounded text-[11px]">
                      {adminError}
                    </div>
                  )}

                  <form onSubmit={handleVerifyAdmin} className="space-y-4 text-right">
                    <div>
                      <label className="block text-xs text-stone-400 mb-1">الرمز المرخص للأدمن *</label>
                      <input
                        type="password"
                        required
                        value={adminCodeInput}
                        onChange={(e) => setAdminCodeInput(e.target.value)}
                        placeholder="أدخل الرمز السري الفاخر..."
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 transition-colors text-center text-xs rounded-xl py-2.5 outline-none text-white tracking-widest font-bold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-500 text-stone-950 font-bold py-2.5 rounded-xl text-xs hover:bg-amber-400 active:scale-95 transition-transform cursor-pointer"
                    >
                      تسجيل الدخول الآمن
                    </button>
                  </form>
                </div>
              ) : (
                /* ACTUAL MANAGEMENT CENTER SYSTEM */
                <div className="space-y-8">
                  {/* ADMIN HEADER MODULE */}
                  <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-2xl"></div>
                    <div className="text-center md:text-right">
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <h2 className="text-xl font-bold text-white">لوحة تحكم المشرف (أدمن)</h2>
                        <span className="bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full text-[10px] border border-amber-500/20 font-bold">
                          نشط وسري
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1">
                        تحكم في كامل محتويات الموقع، استقبل الطلبيات وتعرف على أرقام هواتف العملاء بكل سهولة.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsAdminAuthenticated(false);
                          setAdminCodeInput("");
                        }}
                        className="bg-stone-950 border border-stone-850 text-stone-400 hover:text-rose-400 scale-95 transition-colors p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>تسجيل الخروج الآمن</span>
                      </button>
                    </div>
                  </div>

                  {/* HIGH-LEVEL STATS COUNTERS PANEL */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Stat 1 */}
                    <div className="bg-stone-900 border border-stone-850 p-4 rounded-xl flex items-center gap-3">
                      <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block">إجمالي طلبات الزبناء</span>
                        <span className="font-mono text-base font-black text-white">{orders.length}</span>
                      </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-stone-900 border border-stone-850 p-4 rounded-xl flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block">حجم المبيعات المقدر</span>
                        <span className="font-mono text-base font-black text-emerald-400">
                          {orders
                            .filter((or) => or.status !== "cancelled")
                            .reduce((sum, or) => sum + or.totalPrice, 0)
                            .toLocaleString()}{" "}
                          د.م.
                        </span>
                      </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-stone-900 border border-stone-850 p-4 rounded-xl flex items-center gap-3">
                      <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg">
                        <Grid className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block">هواتف متوفرة بالمتجر</span>
                        <span className="font-mono text-base font-black text-white">{phones.length}</span>
                      </div>
                    </div>

                    {/* Stat 4 */}
                    <div className="bg-stone-900 border border-stone-850 p-4 rounded-xl flex items-center gap-3">
                      <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-lg">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 block">آراء العملاء الحالية</span>
                        <span className="font-mono text-base font-black text-white">{testimonials.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* SPLIT SCREEN MANAGEMENT */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* TAB A: ADD & MANAGE PHONES */}
                    <div className="space-y-6 bg-stone-900 border border-stone-850 p-5 rounded-2xl">
                      <div className="border-b border-stone-800 pb-3 flex justify-between items-center">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <PlusCircle className="w-5 h-5 text-amber-500" />
                          <span>إضافة هاتف ذكي جديد للمعرض</span>
                        </h3>
                      </div>

                      <form onSubmit={handleAddPhoneSubmit} className="space-y-4 text-xs">
                        {/* Name + Brand */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-stone-400 mb-1">اسم الهاتف الكامل *</label>
                            <input
                              type="text"
                              required
                              value={newPhoneName}
                              onChange={(e) => setNewPhoneName(e.target.value)}
                              placeholder="مثال: iPhone 15 Pro Max"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 outline-none text-white focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-400 mb-1">ماركة الهاتف (الشركة المصنعة) *</label>
                            <select
                              value={newPhoneBrand}
                              onChange={(e) => setNewPhoneBrand(e.target.value)}
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 outline-none text-white focus:border-amber-500"
                            >
                              {BRANDS.filter((b) => b !== "جميع الماركات").map((b) => (
                                <option key={b} value={b}>
                                  {b}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Price, Stock, Limited, Condition */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-stone-400 mb-1">سعر البيع (بالدرهم المغربي) *</label>
                            <input
                              type="number"
                              required
                              value={newPhonePrice}
                              onChange={(e) => setNewPhonePrice(e.target.value)}
                              placeholder="مثال: 12500"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 outline-none text-white focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-400 mb-1">القطع المتوفرة بالمخزن *</label>
                            <input
                              type="number"
                              value={newPhoneStock}
                              onChange={(e) => setNewPhoneStock(e.target.value)}
                              placeholder="مثال: 5"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 outline-none text-white focus:border-amber-500"
                            />
                          </div>

                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-stone-400 mb-1">نوع الاستخدام بالمتجر *</label>
                            <select
                              value={newPhoneIsNew ? "new" : "used"}
                              onChange={(e) => setNewPhoneIsNew(e.target.value === "new")}
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 outline-none text-white focus:border-amber-500"
                            >
                              <option value="new">جديد ومختوم بالعلبة</option>
                              <option value="used">مستعمل مفحوص</option>
                            </select>
                          </div>
                        </div>

                        {/* Condition tag if used */}
                        {!newPhoneIsNew && (
                          <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-850">
                            <label className="block text-stone-400 mb-1">حالة الهاتف المستعمل الدقيقة *</label>
                            <select
                              value={newPhoneCondition}
                              onChange={(e) => setNewPhoneCondition(e.target.value as any)}
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg py-2 px-3 outline-none text-white focus:border-amber-500"
                            >
                              <option value="كالجديد">كالجديد (خالٍ من الخدوش - شبه مستعمل)</option>
                              <option value="ممتاز">ممتاز (حالة روعة مع علبة أصيلة)</option>
                              <option value="جيد جداً">جيد جداً (خدوش ميكرو ممتازة كلياً)</option>
                              <option value="جيد">جيد (طبيعي مستخدم بشكل لطيف)</option>
                            </select>
                          </div>
                        )}

                        {/* Limited tag checkbox */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="isLimited"
                            checked={newPhoneIsLimited}
                            onChange={(e) => setNewPhoneIsLimited(e.target.checked)}
                            className="w-4 h-4 accent-amber-500 rounded"
                          />
                          <label htmlFor="isLimited" className="text-stone-300 font-semibold cursor-pointer">
                            عرض كـ &quot;كمية محدودة&quot; أو &quot;قطع متبقية&quot; على الموقع لجذب الزبون
                          </label>
                        </div>

                        {/* Detailed Specs Header */}
                        <div className="border-t border-stone-850 pt-3 space-y-3">
                          <span className="font-bold text-stone-300 block">عتاد وتفاصيل الهاتف الفنية:</span>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-stone-400 mb-1">المعالج (CPU):</label>
                              <input
                                type="text"
                                value={specCpu}
                                onChange={(e) => setSpecCpu(e.target.value)}
                                placeholder="مثال: Snapdragon 8 Gen 3"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 outline-none text-white focus:border-amber-500"
                              />
                            </div>

                            <div>
                              <label className="block text-stone-400 mb-1">الشاشة (Display Screen):</label>
                              <input
                                type="text"
                                value={specScreen}
                                onChange={(e) => setSpecScreen(e.target.value)}
                                placeholder="مثال: Dynamic AMOLED 2X 120Hz"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 outline-none text-white focus:border-amber-500"
                              />
                            </div>

                            <div>
                              <label className="block text-stone-400 mb-1">البطارية وسرعة الشحن:</label>
                              <input
                                type="text"
                                value={specBattery}
                                onChange={(e) => setSpecBattery(e.target.value)}
                                placeholder="مثال: 5000 mAh (شحن سريع 45W)"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 outline-none text-white focus:border-amber-500"
                              />
                            </div>

                            <div>
                              <label className="block text-stone-400 mb-1">عدسات وحجرات الكاميرا الكلية:</label>
                              <input
                                type="text"
                                value={specCamera}
                                onChange={(e) => setSpecCamera(e.target.value)}
                                placeholder="مثال: ثنائية بدقة 50 ميجابكسل مع مثبت بصري"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 outline-none text-white focus:border-amber-500"
                              />
                            </div>

                            <div>
                              <label className="block text-stone-400 mb-1">الرام (RAM) بـ جيجا بايت:</label>
                              <input
                                type="number"
                                value={specRam}
                                onChange={(e) => setSpecRam(e.target.value)}
                                placeholder="8"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 outline-none text-white focus:border-amber-500"
                              />
                            </div>

                            <div>
                              <label className="block text-stone-400 mb-1">المساحة (Storage) بـ جيجا بايت:</label>
                              <input
                                type="number"
                                value={specStorage}
                                onChange={(e) => setSpecStorage(e.target.value)}
                                placeholder="256"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 outline-none text-white focus:border-amber-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Image Source Selection */}
                        <div className="space-y-2 border-t border-stone-850 pt-3">
                          <div className="flex justify-between items-center">
                            <label className="block text-stone-400">صورة تفصيلية للهاتف الذكي:</label>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setImageUrlType("file")}
                                className={`px-2 py-0.5 rounded text-[10px] ${
                                  imageUrlType === "file" ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-950 text-stone-400"
                                }`}
                              >
                                رفع ملف من جهازك
                              </button>
                              <button
                                type="button"
                                onClick={() => setImageUrlType("url")}
                                className={`px-2 py-0.5 rounded text-[10px] ${
                                  imageUrlType === "url" ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-950 text-stone-400"
                                }`}
                              >
                                رابط صورة جاهز (URL)
                              </button>
                            </div>
                          </div>

                          {imageUrlType === "file" ? (
                            <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 flex flex-col items-center justify-center gap-2 cursor-pointer relative hover:border-amber-500/40">
                              <Upload className="w-6 h-6 text-stone-500" />
                              <span className="text-stone-400 text-[10px] text-center">أفلت أو حدد صورة هاتف من ملفات حاسوبك / هاتفك</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              {newPhoneImage && (
                                <div className="mt-2 text-center text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>تم سحب وترميز الصورة من جهازك بنجاح!</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={newPhoneImage}
                              onChange={(e) => setNewPhoneImage(e.target.value)}
                              placeholder="أدخل رابط صورة مباشر كخدمة وسائط"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 outline-none text-white focus:border-amber-500"
                            />
                          )}

                          {newPhoneImage && (
                            <div className="mt-2 text-center">
                              <img
                                src={newPhoneImage}
                                alt="Pre-view"
                                className="w-20 h-20 rounded-lg object-cover mx-auto border border-stone-800"
                              />
                            </div>
                          )}
                        </div>

                        {/* Description field */}
                        <div>
                          <label className="block text-stone-400 mb-1">وصف موجز للمشترين (Description):</label>
                          <textarea
                            value={newPhoneDesc}
                            onChange={(e) => setNewPhoneDesc(e.target.value)}
                            placeholder="وصف حالة العلبة والملحقات أو الضمان المتبقي..."
                            rows={2}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl py-2 px-3 outline-none text-white focus:border-amber-500 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-black py-3 rounded-xl hover:from-amber-500 hover:to-amber-400 transition-colors cursor-pointer text-xs"
                        >
                          إضافة وحفظ الهاتف فوراً للبيع
                        </button>
                      </form>
                    </div>

                    {/* TAB B: CURRENT PHONE INVENTORY IN STORE */}
                    <div className="space-y-6 bg-stone-900 border border-stone-850 p-5 rounded-2xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="border-b border-stone-800 pb-2">
                          <h3 className="text-base font-bold text-white">إدارة الهواتف المضافة وتعديلها</h3>
                          <p className="text-[10px] text-stone-500">حذف أو مراقبة الأسعار وحالة المخازن الفورية بالمعصر.</p>
                        </div>

                        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 no-scrollbar text-xs">
                          {phones.map((phone) => (
                            <div
                              key={phone.id}
                              className="p-3 bg-stone-950 rounded-xl border border-stone-850 flex items-center justify-between gap-3 hover:border-amber-500/10 transition-all"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={phone.image}
                                  alt={phone.name}
                                  className="w-12 h-12 rounded object-cover border border-stone-850 flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <h4 className="font-extrabold text-white truncate text-xs">{phone.name}</h4>
                                  <span className="text-[10px] text-stone-500 block">
                                    الماركة: {phone.brand} • {phone.isNew ? "جديد ومختوم" : `مستعمل: ${phone.condition}`}
                                  </span>
                                  <span className="text-[10px] text-amber-500 font-bold">
                                    {phone.price.toLocaleString()} د.م.
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {/* quick price edit */}
                                <button
                                  onClick={() => {
                                    const nextP = prompt("أدخل السعر الجديد للهاتف بالدرهم المغربي:", phone.price.toString());
                                    if (nextP && !isNaN(Number(nextP))) {
                                      setPhones((prev) =>
                                        prev.map((item) =>
                                          item.id === phone.id ? { ...item, price: Number(nextP) } : item
                                        )
                                      );
                                    }
                                  }}
                                  className="p-1 px-2 hover:bg-stone-800 text-amber-400 rounded transition-colors"
                                  title="تعديل السعر"
                                >
                                  عدّل السعر
                                </button>

                                <button
                                  onClick={() => deletePhone(phone.id)}
                                  className="p-2 hover:bg-rose-500/10 text-stone-500 hover:text-rose-400 rounded-lg transition-colors"
                                  title="حذف الهاتف"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* INTERACTIVE E-COMMERCE ORDERS SYSTEM */}
                  <div className="bg-stone-900 border border-stone-850 p-5 rounded-2xl space-y-4">
                    <div className="border-b border-stone-800 pb-3 flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Activity className="w-5 h-5 text-amber-500" />
                          <span>إدارة طلبيات الهواتف النشطة (E-commerce Order Desk)</span>
                        </h3>
                        <p className="text-[10px] text-stone-500">
                          بمجرد وصول طلب الزبون والتحقق من هويته ورقم واتساب الخاص به يظهر في هذه القائمة لمتابعته.
                        </p>
                      </div>

                      <span className="bg-emerald-500/15 text-emerald-400 px-3 py-1 font-mono text-xs rounded-full border border-emerald-500/20 font-black">
                        {orders.length} طلبات
                      </span>
                    </div>

                    {orders.length === 0 ? (
                      <div className="text-center py-12 bg-stone-950/20 rounded-xl border border-dashed border-stone-800">
                        <p className="text-stone-500 text-xs">لا يوجد أي طلبيات مسجلة حالياً بالمتجر.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-right text-xs">
                          <thead>
                            <tr className="border-b border-stone-800 text-stone-400">
                              <th className="py-2.5 px-3">رقم الطلبية</th>
                              <th className="py-2.5 px-3">الزبون ورقم الهاتف</th>
                              <th className="py-2.5 px-3">الهاتف المطلوب</th>
                              <th className="py-2.5 px-3">مبلغ الطلب بالكامل</th>
                              <th className="py-2.5 px-3">طريقة الدفع وقنواتها</th>
                              <th className="py-2.5 px-3">حالة الشحن الكلية</th>
                              <th className="py-2.5 px-3 text-center">خدمة الإجراء والمتابعة</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-850">
                            {orders.map((ord) => (
                              <tr key={ord.id} className="hover:bg-stone-950/40 text-stone-200">
                                <td className="py-3 px-3 font-mono text-stone-400">{ord.id}</td>
                                <td className="py-3 px-3">
                                  <div className="font-bold text-white">{ord.customerName}</div>
                                  <div className="text-[10px] text-stone-500">{ord.timestamp}</div>
                                </td>
                                <td className="py-3 px-3">
                                  <span className="font-extrabold text-stone-200">{ord.phoneName}</span>
                                </td>
                                <td className="py-3 px-3 font-mono font-bold text-amber-400">
                                  {ord.totalPrice.toLocaleString()} د.م.
                                </td>
                                <td className="py-3 px-3">
                                  {ord.paymentMethod === "cod" ? (
                                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                      الدفع عند الاستلام
                                    </span>
                                  ) : (
                                    <div className="space-y-0.5">
                                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 block w-max">
                                        بطاقة دفع بنكية
                                      </span>
                                      <span className="text-[9px] text-stone-500 font-mono block">
                                        {ord.cardNumber}
                                      </span>
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-3">
                                  <select
                                    value={ord.status}
                                    onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                                    className={`text-[10px] py-1 px-2.5 rounded-full font-bold outline-none border ${
                                      ord.status === "pending"
                                        ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                                        : ord.status === "processing"
                                        ? "bg-blue-500/15 text-blue-400 border-blue-500/20"
                                        : ord.status === "shipped"
                                        ? "bg-purple-500/15 text-purple-400 border-purple-500/20"
                                        : ord.status === "delivered"
                                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                                        : "bg-rose-500/15 text-rose-400 border-rose-500/20"
                                    }`}
                                  >
                                    <option value="pending" className="bg-stone-900 text-stone-200">الطلب قيد الملاحظة</option>
                                    <option value="processing" className="bg-stone-900 text-stone-200">قيد التوضيب والتجهيز</option>
                                    <option value="shipped" className="bg-stone-900 text-stone-200">مبعوث مع المندوب</option>
                                    <option value="delivered" className="bg-stone-900 text-stone-200">تم التسليم والقبض</option>
                                    <option value="cancelled" className="bg-stone-900 text-stone-200">ملغي ومرفوض</option>
                                  </select>
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    {/* Direct click to chat client on whatsapp */}
                                    <a
                                      href={`https://wa.me/${ord.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                        `مرحباً زبوننا الكريم ${ord.customerName}، يسعد الأصيل فون التواصل معك لتأكيد تسليم هاتفك الذكي المحجوز والمميز ${ord.phoneName} بإجمالي ${ord.totalPrice} درهم وتوصيل سريع.`
                                      )}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      title="افتح محادثة واتساب"
                                      className="p-1 px-2.5 bg-emerald-500 text-stone-950 hover:bg-emerald-400 rounded-lg font-bold transition-all active:scale-95 flex items-center gap-0.5 text-[10px]"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      اتصل
                                    </a>

                                    <button
                                      onClick={() => deleteOrder(ord.id)}
                                      className="p-1 px-1.5 bg-stone-950 hover:bg-rose-500/25 border border-stone-850 hover:border-rose-500/40 text-stone-400 hover:text-rose-400 rounded transition-colors"
                                      title="حذف السجل"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* SITE THEME, COLOR CONFIG AND CUSTOM PAGES (ADD/REMOVE) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Panel 1: Site configuration (Colors, pricing, and maps) */}
                    <div className="bg-stone-900 border border-stone-850 p-5 rounded-2xl">
                      <div className="border-b border-stone-800 pb-3">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Settings className="w-5 h-5 text-amber-500" />
                          <span>تعديل اللوجو، الاسعار و سعر التوصيل وموقع قوقل ماب</span>
                        </h3>
                        <p className="text-[10px] text-stone-500">تحكم كامل بنصوص المتجر ومعلومات التواصل المغربية الرسمية.</p>
                      </div>

                      <form onSubmit={saveGeneralSettings} className="space-y-4 text-xs mt-4">
                        {/* Logo Text & Subtext */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-stone-400 mb-1">شعار المتجر النصي (الأصيل فون)</label>
                            <input
                              type="text"
                              value={adminLogoText}
                              onChange={(e) => setAdminLogoText(e.target.value)}
                              className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2 px-3 text-stone-200 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-400 mb-1">الترجمة الإنجليزية للوجو</label>
                            <input
                              type="text"
                              value={adminLogoSubtext}
                              onChange={(e) => setAdminLogoSubtext(e.target.value)}
                              className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2 px-3 text-stone-200 outline-none uppercase"
                            />
                          </div>
                        </div>

                        {/* Contacts (WhatsApp, Email) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-stone-400 mb-1">رقم واتساب المشرف للمبيعات المعاينة *</label>
                            <input
                              type="text"
                              value={adminWhatsapp}
                              onChange={(e) => setAdminWhatsapp(e.target.value)}
                              placeholder="+212612345678"
                              className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2 px-3 text-stone-200 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-400 mb-1">البريد الإلكتروني الرسمي للمتجر</label>
                            <input
                              type="email"
                              value={adminEmail}
                              onChange={(e) => setAdminEmail(e.target.value)}
                              className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2 px-3 text-stone-200 outline-none"
                            />
                          </div>
                        </div>

                        {/* Social Links (Instagram, Facebook) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-stone-400 mb-1">رابط حساب انستقرام</label>
                            <input
                              type="text"
                              value={adminInstagram}
                              onChange={(e) => setAdminInstagram(e.target.value)}
                              placeholder="https://instagram.com/alassil_phones"
                              className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2 px-3 text-stone-200 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-400 mb-1">رابط حساب فيسبوك</label>
                            <input
                              type="text"
                              value={adminFacebook}
                              onChange={(e) => setAdminFacebook(e.target.value)}
                              placeholder="https://facebook.com/alassil_phones"
                              className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2 px-3 text-stone-200 outline-none"
                            />
                          </div>
                        </div>

                        {/* WhatsApp Floating Toggle */}
                        <div className="p-3 bg-stone-950 rounded-xl border border-stone-850">
                          <label className="inline-flex items-center gap-2 cursor-pointer w-full text-right" dir="rtl">
                            <input
                              type="checkbox"
                              checked={adminShowWhatsAppFloat}
                              onChange={(e) => setAdminShowWhatsAppFloat(e.target.checked)}
                              className="w-4 h-4 accent-amber-500 rounded"
                            />
                            <span className="font-bold text-stone-300 text-[11px] mr-2">تفعيل وأظهار أيقونة واتساب العائمة أسفل الموقع للجميع</span>
                          </label>
                        </div>

                        {/* Delivery Control: price AND toggle isFree */}
                        <div className="p-3 bg-stone-950 rounded-xl border border-stone-850 space-y-3.5">
                          <label className="block text-stone-300 font-bold">إعدادات وضبط توصيل الشحن للعملاء بالمغرب:</label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-stone-400 mb-1">تكلفة الشحن بالدرهم (MAD)</label>
                              <input
                                type="number"
                                disabled={adminIsDelFree}
                                value={adminDelPrice}
                                onChange={(e) => setAdminDelPrice(Number(e.target.value))}
                                className="w-full bg-stone-900 border border-stone-800 rounded-lg py-2 px-3 text-stone-200 outline-none disabled:opacity-50"
                              />
                            </div>

                            <div className="flex flex-col justify-end">
                              <label className="inline-flex items-center gap-2 cursor-pointer p-2.5 bg-stone-900 rounded-lg border border-stone-800">
                                <input
                                  type="checkbox"
                                  checked={adminIsDelFree}
                                  onChange={(e) => setAdminIsDelFree(e.target.checked)}
                                  className="w-4 h-4 accent-amber-500 rounded"
                                />
                                <span className="font-bold text-emerald-400 text-[11px]">اجعله توصيلاً مجانياً بالكامل</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Slogan details */}
                        <div className="space-y-2">
                          <div>
                            <label className="block text-stone-400 mb-1">العنوان الرئيسي للهيرو (Hero Banner Titles)</label>
                            <input
                              type="text"
                              value={adminHeroTitle}
                              onChange={(e) => setAdminHeroTitle(e.target.value)}
                              className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2 px-3 text-stone-200 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-stone-400 mb-1">Subtitle الفرعي للوصف</label>
                            <textarea
                              value={adminHeroSub}
                              onChange={(e) => setAdminHeroSub(e.target.value)}
                              rows={2}
                              className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2 px-3 text-stone-200 outline-none resize-none"
                            />
                          </div>
                        </div>

                        {/* Color selection customization */}
                        <div className="bg-stone-950 p-3 rounded-xl border border-stone-850">
                          <label className="block text-stone-400 mb-1.5">اللون والطلة اللامعة للعلامة التجارية (Brand color)</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={adminPrimaryColor}
                              onChange={(e) => setAdminPrimaryColor(e.target.value)}
                              className="w-10 h-10 bg-stone-900 rounded cursor-pointer border-0"
                            />
                            <div className="text-[10px] text-stone-500">
                              <span>سيتحول اللون الرئيسي للموقع بالكامل فور الضغط كـ لون ذهبي، أخضر مغربي، أو فضي ملكي.</span>
                            </div>
                          </div>
                        </div>

                        {/* G Maps location */}
                        <div>
                          <label className="block text-stone-400 mb-1">رابط Google Map Iframe (مصدر الخريطة)</label>
                          <input
                            type="text"
                            value={adminMaps}
                            onChange={(e) => setAdminMaps(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-lg py-2 px-3 text-[10px] outline-none text-stone-400"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-lg bg-amber-500 text-stone-950 font-black hover:bg-amber-400 text-xs shadow cursor-pointer text-center"
                        >
                          حفظ تحديث تصاميم ونصوص الشحن الفوري
                        </button>
                      </form>
                    </div>

                    {/* Panel 2: Customer feedback (Testimonials Manager) */}
                    <div className="bg-stone-900 border border-stone-850 p-5 rounded-2xl flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="border-b border-stone-800 pb-2">
                          <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-500" />
                            <span>إدارة آراء العملاء والتسجيل الجديد للتقييمات</span>
                          </h3>
                          <p className="text-[10px] text-stone-500">إضافة حركات ثقة لتشجيع الزوار على طلب الهواتف.</p>
                        </div>

                        {/* List Testimonials with Delete option */}
                        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 no-scrollbar text-xs">
                          {testimonials.map((t) => (
                            <div
                              key={t.id}
                              className="p-2.5 bg-stone-950 rounded-xl border border-stone-850 flex justify-between items-center"
                            >
                              <div>
                                <span className="font-bold text-white block">{t.name} (مدينة {t.city})</span>
                                <span className="text-[10px] text-stone-500 block truncate max-w-sm">&quot;{t.text}&quot;</span>
                              </div>
                              <button
                                onClick={() => deleteTestimonial(t.id)}
                                className="p-1 px-2.5 bg-rose-500/10 text-rose-400 rounded hover:bg-rose-500/20"
                                type="button"
                              >
                                حذف
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Testimonial form */}
                        <form onSubmit={handleAddTestimonial} className="space-y-3 pt-3 border-t border-stone-800 text-xs text-right">
                          <p className="font-bold text-white">إضافة تقييم عميل جديد:</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-stone-400 mb-0.5">اسم العميل بالكامل</label>
                              <input
                                type="text"
                                required
                                value={newTestName}
                                onChange={(e) => setNewTestName(e.target.value)}
                                className="w-full bg-stone-950 border border-stone-800 rounded py-1.5 px-2.5 text-stone-200 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-stone-400 mb-0.5">المدينة</label>
                              <input
                                type="text"
                                value={newTestCity}
                                onChange={(e) => setNewTestCity(e.target.value)}
                                placeholder="مثال: الرباط"
                                className="w-full bg-stone-950 border border-stone-800 rounded py-1.5 px-2.5 text-stone-200 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-stone-400 mb-0.5">طراز الهاتف المستلم</label>
                              <input
                                type="text"
                                value={newTestModel}
                                onChange={(e) => setNewTestModel(e.target.value)}
                                placeholder="مثال: iPhone 15 Pro Max"
                                className="w-full bg-stone-950 border border-stone-800 rounded py-1.5 px-2.5 text-stone-200 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-stone-400 mb-0.5">التقييم بالنجوم (1 - 5)</label>
                              <input
                                type="number"
                                min={1}
                                max={5}
                                value={newTestRating}
                                onChange={(e) => setNewTestRating(Number(e.target.value))}
                                className="w-full bg-stone-950 border border-stone-800 rounded py-1.5 px-2.5 text-stone-200 outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-stone-400 mb-0.5">المحتوى النصي للرأي</label>
                            <textarea
                              required
                              value={newTestText}
                              onChange={(e) => setNewTestText(e.target.value)}
                              rows={2}
                              className="w-full bg-stone-950 border border-stone-800 rounded py-1.5 px-2.5 text-stone-200 outline-none resize-none"
                            />
                          </div>

                          <button
                            type="submit"
                            className="w-full py-2 bg-amber-500 text-stone-950 font-bold rounded-lg text-xs hover:bg-amber-400"
                          >
                            حفظ ونشر التقييم فوراً
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* LUXURY SLIDING OVER / DIALOG SPECIFICATION VIEW MODAL */}
      <AnimatePresence>
        {selectedPhone && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-stone-900 border border-amber-500/20 max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl relative gold-glow"
            >
              {/* Close Button overlay */}
              <button
                onClick={() => setSelectedPhone(null)}
                className="absolute top-3 left-3 bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-white p-2 rounded-full border border-stone-800 z-20 transition-all cursor-pointer"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full h-48 sm:h-56 bg-stone-950 relative border-b border-stone-850">
                <img
                  src={selectedPhone.image}
                  alt={selectedPhone.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {!selectedPhone.isNew && (
                  <span className="absolute bottom-3 right-3 bg-amber-500 text-stone-950 font-black text-[10px] px-3.5 py-1 rounded-full">
                    مستعمل: {selectedPhone.condition}
                  </span>
                )}
                {selectedPhone.isNew && (
                  <span className="absolute bottom-3 right-3 bg-emerald-500/90 text-stone-950 font-black text-[10px] px-3.5 py-1 rounded-full uppercase">
                    جديد ومختوم
                  </span>
                )}
              </div>

              {/* Specs detailed Grid */}
              <div className="p-6 space-y-4">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold">
                    {selectedPhone.brand}
                  </span>
                  <h3 className="text-white text-lg font-black">{selectedPhone.name}</h3>
                  <p className="text-stone-300 text-xs leading-relaxed mt-1">{selectedPhone.description}</p>
                </div>

                <div className="border-t border-stone-800 pt-3">
                  <span className="text-xs font-bold text-amber-400 block mb-2">
                    العتاد الفني والهندسة الإلكترونية للجهاز:
                  </span>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-850">
                      <span className="text-stone-500 block">الذاكرة العشوائية (RAM):</span>
                      <span className="text-white font-bold">{selectedPhone.specs.ram} جيجابايت</span>
                    </div>
                    <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-855">
                      <span className="text-stone-500 block">سعة التخزين الداخلية:</span>
                      <span className="text-white font-bold">{selectedPhone.specs.storage} جيجابايت</span>
                    </div>
                    <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-855">
                      <span className="text-stone-500 block">سعة البطارية:</span>
                      <span className="text-white font-bold">{selectedPhone.specs.battery}</span>
                    </div>
                    {selectedPhone.specs.camera && (
                      <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-855">
                        <span className="text-stone-500 block">الكاميرا الخلفية:</span>
                        <span className="text-white font-bold">{selectedPhone.specs.camera}</span>
                      </div>
                    )}
                    {selectedPhone.specs.screen && (
                      <div className="col-span-2 p-2.5 bg-stone-950 rounded-xl border border-stone-855">
                        <span className="text-stone-500 block">الشاشة والعرض:</span>
                        <span className="text-white font-bold">{selectedPhone.specs.screen}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Order Bar */}
                <div className="flex items-center justify-between border-t border-stone-800 pt-4 mt-4">
                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 block">التكلفة ا

�طلوبة</span>
                    <span className="text-amber-400 text-lg font-black font-sans">
                      {selectedPhone.price.toLocaleString()} <span className="text-xs">د.م.</span>
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPhone(null)}
                      className="px-4 py-2.5 rounded-xl border border-stone-800 text-xs font-bold text-stone-400 hover:text-white"
                    >
                      إلغاء المعاينة
                    </button>
                    <button
                      onClick={() => {
                        setCartPhone(selectedPhone);
                        setSelectedPhone(null);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1 transition-all shadow active:scale-95 cursor-pointer animate-pulse"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>اطلب الهاتف الآن</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHECKOUT MODAL TRIGGER IF COMPATIBLE */}
      <AnimatePresence>
        {cartPhone && (
          <CheckoutModal
            phone={cartPhone}
            settings={settings}
            onClose={() => setCartPhone(null)}
            onOrderCompleted={(newOrder) => {
              // Append order to active list of orders
              setOrders((prev) => [newOrder, ...prev]);

              // Automatically decrement stock by 1
              setPhones((prev) =>
                prev.map((ph) => {
                  if (ph.id === cartPhone.id) {
                    const nextStock = ph.stock > 0 ? ph.stock - 1 : 0;
                    return { ...ph, stock: nextStock };
                  }
                  return ph;
                })
              );
            }}
          />
        )}
      </AnimatePresence>

      {/* MAJESTIC LUXURY FOOTER BRAND SECTIONS */}
      <footer className="mt-16 bg-stone-950 text-stone-400 text-xs border-t border-stone-900 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1 */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-sm flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500 font-bold" />
              <span>{settings.logoText}</span>
            </h4>
            <p className="text-stone-400 leading-relaxed text-xs">
              منصتنا الفاخرة المعتمدة لبيع أرقى الهواتف الذكية الجديدة والمستعملة في المغرب مع فحص واختبار كامل لأصالة الأجهزة والبطاريات وتوصيل أمان مغربي مباشر.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-sm">أقسام وروابط سريعة</h4>
            <div className="grid grid-cols-2 gap-2 text-stone-300">
              <button onClick={() => setCurrentPath("home")} className="hover:text-amber-400 text-right">الرئيسية</button>
              <button onClick={() => setCurrentPath("products")} className="hover:text-amber-400 text-right">الهواتف</button>
              <button onClick={() => setCurrentPath("smart-match")} className="hover:text-amber-400 text-right">الاختيار الذكي</button>
              <button onClick={() => setCurrentPath("testimonials")} className="hover:text-amber-400 text-right">آراء الزبائن</button>
              <button onClick={() => setCurrentPath("contact")} className="hover:text-amber-400 text-right">موقع المعرض</button>
            </div>
          </div>

          {/* Col 3 */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-sm">تفاصيل الاتصال والدعم</h4>
            <div className="space-y-2 text-stone-300">
              <p>📍 المقر: شارع النخيل، الدار البيضاء، المغرب</p>
              <p>✉️ الإيميل: {settings.email}</p>
              <p>💬 واتساب المبيعات: {settings.whatsappContact}</p>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {settings.instagramLink && (
                <a
                  href={settings.instagramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-stone-900 hover:bg-amber-500 hover:text-stone-950 transition-colors border border-stone-800 text-stone-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebookLink && (
                <a
                  href={settings.facebookLink}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-stone-900 hover:bg-amber-500 hover:text-stone-950 transition-colors border border-stone-800 text-stone-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* copyright and credentials */}
        <div className="border-t border-stone-900 pt-6 text-center text-[10px] text-stone-500 max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} الأصيل فون المغرب. جميع حقوق التصاميم والعتاد محفوظة.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      {settings.showWhatsAppFloat && (
        <motion.a
          href={`https://wa.me/${settings.whatsappContact.replace(/\+/g, "").replace(/\s/g, "")}`}
          target="_blank"
          rel="noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 left-6 z-40 bg-emerald-500 text-white rounded-full p-4 shadow-2xl flex items-center justify-center border border-emerald-400/35 hover:brightness-110 transition-all cursor-pointer group"
          style={{ boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)" }}
        >
          <MessageSquare className="w-6 h-6 stroke-[2.5]" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap text-xs font-black mr-0 group-hover:mr-2 select-none" dir="rtl">
            تواصل معنا
          </span>
        </motion.a>
      )}
    </div>
  );
}
