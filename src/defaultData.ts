import { Phone, SiteSettings, Testimonial } from "./types";

export const DEFAULT_PHONES: Phone[] = [
  {
    id: "iphone-15-pro-max-new",
    name: "Apple iPhone 15 Pro Max",
    brand: "Apple",
    price: 13490,
    isNew: true,
    specs: {
      cpu: "A17 Pro (3nm)",
      screen: "Super Retina XDR OLED 6.7 OLED 120Hz",
      battery: "4441 mAh (شحن سريع 25 واط)",
      camera: "كاميرا أساسية 48 ميجابكسل + 12 ميجابكسل تقريب بصري 5x + 12 ميجابكسل زاوية واسعة",
      ram: 8,
      storage: 256
    },
    stock: 5,
    isLimited: true,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    description: "الهاتف الرائد الأقوى من أبل بتصميم فاخر من التيتانيوم وقدرات تصوير سينمائية فائقة."
  },
  {
    id: "s24-ultra-new",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 12190,
    isNew: true,
    specs: {
      cpu: "Snapdragon 8 Gen 3 for Galaxy",
      screen: "Dynamic AMOLED 2X 6.8 بوصة 120Hz بدقة QHD+",
      battery: "5000 mAh (شحن سريع 45 واط)",
      camera: "كاميرا رباعية 200 + 50 + 10 + 12 ميجابكسل تقريب خارق 100x",
      ram: 12,
      storage: 512
    },
    stock: 3,
    isLimited: true,
    image: "https://images.unsplash.com/photo-1707151325178-5527f3d2fbc2?w=600&auto=format&fit=crop&q=80",
    description: "أقوى هاتف أندرويد مع قلم S-Pen مدمج وميزات الذكاء الاصطناعي Galaxy AI الثورية وهيكل تيتانيوم صلب."
  },
  {
    id: "iphone-14-pro-used",
    name: "Apple iPhone 14 Pro",
    brand: "Apple",
    price: 7900,
    isNew: false,
    condition: "كالجديد",
    specs: {
      cpu: "A16 Bionic (4nm)",
      screen: "Super Retina XDR OLED 6.1 بوصة 120Hz",
      battery: "3200 mAh (صحة البطارية 94%)",
      camera: "كاميرا ثلاثية 48 + 12 + 12 ميجابكسل مع مستشعر LiDAR",
      ram: 6,
      storage: 128
    },
    stock: 1,
    isLimited: true,
    image: "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=600&auto=format&fit=crop&q=80",
    description: "آيفون 14 برو مستعمل بحالة ممتازة جداً (شبه جديد)، خالي من الخدوش مع علبته الأصلية وشاحن سريع مدمج."
  },
  {
    id: "oneplus-12-new",
    name: "OnePlus 12",
    brand: "OnePlus",
    price: 8490,
    isNew: true,
    specs: {
      cpu: "Snapdragon 8 Gen 3",
      screen: "BOE X1 Curved AMOLED 6.82 بوصة 2K 120Hz",
      battery: "5400 mAh (شحن خارق 100 واط سلكي + 50 واط لاسلكي)",
      camera: "كاميرا ثلاثية Hasselblad بدقة 50 + 64 + 48 ميجابكسل",
      ram: 16,
      storage: 512
    },
    stock: 8,
    isLimited: false,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
    description: "السرعة الفائقة والشحن اللاسلكي السريع جداً مع شاشة منحنية مذهلة ونظام تبريد متطور للألعاب."
  },
  {
    id: "huawei-pura-70-new",
    name: "Huawei Pura 70 Ultra",
    brand: "Huawei",
    price: 11400,
    isNew: true,
    specs: {
      cpu: "Kirin 9010",
      screen: "OLED LTPO 6.8 بوصة 120Hz بزجاج Kunlun فائق المتانة",
      battery: "5200 mAh (شحن سلكي 100 واط + 80 واط لاسلكي)",
      camera: "كاميرا ميكانيكية منبثقة للعدسة الرئيسية 1 بوصة بدقة 50 ميجابكسل",
      ram: 16,
      storage: 512
    },
    stock: 2,
    isLimited: true,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    description: "أفضل كاميرا هاتف ذكي في العالم مع عدسة ميكانيكية مبتكرة تتحرك وتصميم جلدي منقوش فاخر."
  },
  {
    id: "s23-ultra-used",
    name: "Samsung Galaxy S23 Ultra",
    brand: "Samsung",
    price: 7450,
    isNew: false,
    condition: "ممتاز",
    specs: {
      cpu: "Snapdragon 8 Gen 2 for Galaxy",
      screen: "Dynamic AMOLED 2X 6.8 بوصة 120Hz",
      battery: "5000 mAh (صحة البطارية ممتازة 91%)",
      camera: "كاميرا رباعية 200 + 10 + 10 + 12 ميجابكسل مع تقريب بصري 10x",
      ram: 12,
      storage: 256
    },
    stock: 1,
    isLimited: true,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
    description: "جالكسي اس 23 الترا مستعمل بحالة بروفيسيونال خالية من العيوب، مثالي لمحبين التقاط الصور والإنتاجية العالية."
  }
];

export const DEFAULT_SETTINGS: SiteSettings = {
  logoText: "الأصيل فون",
  logoSubtext: "AL ASSIL PHONES",
  whatsappContact: "+212612345678",
  email: "contact@alassilphones.co.ma",
  instagramLink: "https://instagram.com/alassil_phones",
  facebookLink: "https://facebook.com/alassil_phones",
  showWhatsAppFloat: true,
  googleMapsIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106368.52844111304!2d-7.66939462719702!3d33.57224213190802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca%21!5e0!3m2!1sen!2sma!4v1700000000000!5m2!1sen!2sma",
  deliveryPrice: 35,
  isDeliveryFree: false,
  primaryColor: "#D4AF37", // Luxurious gold
  accentColor: "#0A0A0A", // Obsidian dark
  heroTitle: "اقتنِ الفخامة بأفضل الأسعار بالمغرب",
  heroSub: "مجموعة استثنائية من أرقى الهواتف الذكية الجديدة والمستعملة مع ضمان الأصيل والتوصيل السريع لكافة المدن المغربية"
};

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "ياسين الدكالي",
    rating: 5,
    text: "اشتريت آيفون 14 برو مستعمل والخدمة كانت غاية في الروعة. الهاتف كأنه جديد تمامًا ولم ألاحظ أي فرق، والتوصيل للرباط استغرق 24 ساعة فقط.",
    phoneModel: "iPhone 14 Pro",
    city: "الرباط"
  },
  {
    id: "2",
    name: "سارة الفاسي",
    rating: 5,
    text: "ميزة الاختيار الذكي ساعدتني بزاف في تحديد الهاتف المناسب لميزانيتي (سامسونج). الدعم الفني عبر الواتساب خلوق ومتعاون للغاية.",
    phoneModel: "Samsung Galaxy S24 Ultra",
    city: "فاس"
  },
  {
    id: "3",
    name: "أمين طنجاوي",
    rating: 5,
    text: "موقع محترف وتصميم راقي يستحق 5 نجوم. الشحن مجاني وسريع وأمان مطلق في الدفع عند الاستلام. أنصح بشدة بالتعامل معهم.",
    phoneModel: "OnePlus 12",
    city: "طنجة"
  }
];

export const BRANDS = [
  "جميع الماركات",
  "Apple",
  "Samsung",
  "Xiaomi",
  "Huawei",
  "OnePlus",
  "Google Pixel",
  "Oppo",
  "Realme",
  "Infinix"
];
