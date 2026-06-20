export interface PhoneSpecs {
  cpu: string;
  screen: string;
  battery: string;
  camera: string;
  ram: number; // in GB
  storage: number; // in GB
}

export interface Phone {
  id: string;
  name: string;
  brand: string;
  price: number; // in MAD
  isNew: boolean;
  condition?: "كالجديد" | "ممتاز" | "جيد جداً" | "جيد"; 
  specs: PhoneSpecs;
  stock: number;
  isLimited: boolean;
  image: string;
  description: string;
}

export interface Order {
  id: string;
  customerName: string;
  phoneNum: string;
  whatsappNumber: string;
  city: string;
  address: string;
  phoneId: string;
  phoneName: string;
  phonePrice: number;
  deliveryFee: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  timestamp: string;
}

export interface SiteSettings {
  logoText: string;
  logoSubtext: string;
  whatsappContact: string; // The owner's WhatsApp number to receive orders
  email: string;
  instagramLink: string;
  facebookLink: string;
  showWhatsAppFloat: boolean; // Option to show floating whatsapp button
  googleMapsIframe: string;
  deliveryPrice: number;
  isDeliveryFree: boolean;
  primaryColor: string; // e.g. '#D4AF37' (Gold)
  accentColor: string; // e.g. '#1A1A1A' (Dark Charcoal)
  heroTitle: string;
  heroSub: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number; // 1-5
  text: string;
  phoneModel: string;
  city: string;
}
