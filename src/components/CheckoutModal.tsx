import React, { useState } from "react";
import { Phone, SiteSettings, Order } from "../types";
import { X, Check, Shield, AlertCircle, ShoppingBag, Landmark, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface CheckoutModalProps {
  phone: Phone;
  settings: SiteSettings;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export default function CheckoutModal({ phone, settings, onClose, onOrderCompleted }: CheckoutModalProps) {
  // Steps: 1 = Form, 3 = Success Celebrate
  const [step, setStep] = useState<1 | 3>(1);

  // Form Fields
  const [name, setName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("الدار البيضاء");
  const [address, setAddress] = useState("");

  const [errorText, setErrorText] = useState("");

  const cities = ["الدار البيضاء", "الرباط", "مراكش", "طنجة", "فاس", "أغادير", "مكناس", "وجدة", "تطوان", "القنيطرة", "العيون", "بني ملال"];

  const deliveryPrice = settings.isDeliveryFree ? 0 : settings.deliveryPrice;
  const totalPrice = phone.price + deliveryPrice;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    if (!name.trim()) {
      setErrorText("الرجاء إدخال اسمك الكامل");
      return;
    }
    if (!phoneNum.trim() || phoneNum.length < 8) {
      setErrorText("الرجاء إدخال رقم هاتف صحيح (مثال: 0612345678)");
      return;
    }
    if (!whatsapp.trim() || whatsapp.length < 8) {
      setErrorText("الرجاء إدخال رقم هاتف واتساب صحيح (مثال: 0612345678)");
      return;
    }
    if (!address.trim()) {
      setErrorText("الرجاء تحديد العنوان بالتفصيل لتأكيد الشحن");
      return;
    }

    // Create new Order
    const newOrder: Order = {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      customerName: name,
      phoneNum: phoneNum,
      whatsappNumber: whatsapp,
      city: city,
      address: address,
      phoneId: phone.id,
      phoneName: phone.name,
      phonePrice: phone.price,
      deliveryFee: deliveryPrice,
      totalPrice: totalPrice,
      status: "pending",
      timestamp: new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" }) + " (توقيت المغرب)",
    };

    onOrderCompleted(newOrder);

    // Formulate WhatsApp message with double checking line endings & formatting
    const formattedPhonePrice = phone.price.toLocaleString();
    const formattedDeliveryPrice = deliveryPrice === 0 ? "مجاني" : `${deliveryPrice} د.م.`;
    const formattedTotalPrice = totalPrice.toLocaleString();

    const message = `السلام عليكم ورحمة الله، أود طلب الهاتف التالي من موقعكم الفاخر:

📱 الهاتف: ${phone.name}
💰 السعر: ${formattedPhonePrice} د.م.
🚚 مصاريف الشحن: ${formattedDeliveryPrice}
💵 الحساب الإجمالي: ${formattedTotalPrice} د.م.

معلومات الزبون للطلب والتسليم:
👤 الاسم الكامل: ${name}
📞 رقم الهاتف: ${phoneNum}
💬 رقم الواتساب: ${whatsapp}
🌐 المدينة: ${city}
📍 العنوان الكامل: ${address}

شكراً جزيلاً!`;

    const encodedText = encodeURIComponent(message);
    const cleanWhatsappContact = settings.whatsappContact.replace(/\+/g, "").replace(/\s/g, "");
    
    // Open WhatsApp Chat with the prepared message
    const whatsappUrl = `https://wa.me/${cleanWhatsappContact}?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");

    // Move to success screen
    setStep(3);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-stone-900 border border-amber-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <div className="p-5 border-b border-stone-800 flex justify-between items-center bg-stone-950/40 relative z-10">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <span>{step === 3 ? "تهانينا الحارة!" : "إتمام حجز الطلب الفاخر"}</span>
            </h3>
            <span className="text-xs text-stone-400">{phone.name}</span>
          </div>
          {step !== 3 && (
            <button
              onClick={onClose}
              className="p-1 px-2 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-grow relative z-10">
          {step === 1 && (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {errorText && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorText}</span>
                </div>
              )}

              {/* Order summary card banner */}
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-850 flex items-center gap-4">
                <img
                  src={phone.image}
                  alt={phone.name}
                  className="w-16 h-16 rounded-md object-cover border border-stone-800"
                />
                <div>
                  <h4 className="text-white text-sm font-bold">{phone.name}</h4>
                  <div className="flex gap-2 text-[10px] text-stone-500 mt-1">
                    <span>الرام: {phone.specs.ram} جيجا</span>
                    <span>التخزين: {phone.specs.storage} جيجا</span>
                    <span>الحالة: {phone.isNew ? "جديد" : phone.condition}</span>
                  </div>
                  <div className="text-amber-400 font-sans text-xs font-bold mt-1">
                    السعر الأساسي: {phone.price.toLocaleString()} د.م.
                  </div>
                </div>
              </div>

              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right" dir="rtl">
                <div className="text-right">
                  <label className="block text-xs font-semibold text-stone-400 mb-1.5">الاسم بالكامل للزبون *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: محمد العلوي"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 transition-colors rounded-lg py-2 px-3 text-sm text-stone-200 outline-none"
                  />
                </div>

                <div className="text-right">
                  <label className="block text-xs font-semibold text-stone-400 mb-1.5">رقم الهاتف للاتصال *</label>
                  <input
                    type="tel"
                    required
                    value={phoneNum}
                    onChange={(e) => setPhoneNum(e.target.value)}
                    placeholder="مثال: 0612345678"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 transition-colors rounded-lg py-2 px-3 text-sm text-stone-200 outline-none text-right"
                  />
                </div>

                <div className="text-right">
                  <label className="block text-xs font-semibold text-stone-400 mb-1.5">رقم هاتف الواتساب *</label>
                  <input
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="مثال: 0612345678"
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 transition-colors rounded-lg py-2 px-3 text-sm text-stone-200 outline-none text-right"
                  />
                </div>

                <div className="text-right">
                  <label className="block text-xs font-semibold text-stone-400 mb-1.5">المدينة المرغوبة للتوصيل *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 transition-colors rounded-lg py-2 px-3 text-sm text-stone-200 outline-none"
                  >
                    {cities.map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 text-right">
                  <label className="block text-xs font-semibold text-stone-400 mb-1.5">العنوان بالكامل والتفصيل للتسليم *</label>
                  <textarea
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="مثال: حي الرياض، شارع النخيل، عمارة 4، شقة 10، الرباط"
                    rows={2}
                    className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/60 transition-colors rounded-lg py-2 px-3 text-xs text-stone-200 outline-none resize-none text-right"
                  />
                </div>
              </div>

              {/* Payment Method Auto COD message */}
              <div className="p-3.5 rounded-xl border-2 border-amber-500/25 bg-amber-500/5 flex items-center gap-3" dir="rtl">
                <div className="p-2 rounded-lg bg-amber-500 text-stone-950">
                  <Landmark className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white">طريقة الدفع: الدفع نقداً عند الاستلام (COD)</div>
                  <p className="text-[10px] text-stone-400">ستدفع لمندوب التوصيل بعد فحص ومراجعة هاتفك بالكامل والتأكد من جودته.</p>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="border-t border-stone-850 pt-4 space-y-2 text-xs" dir="rtl">
                <div className="flex justify-between text-stone-500">
                  <span>سعر الهاتف الفرعي</span>
                  <span className="font-mono">{phone.price.toLocaleString()} د.م.</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>تكلفة شحن أمان (لكل المغرب)</span>
                  {deliveryPrice === 0 ? (
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded-full">
                      مجاني تماماً
                    </span>
                  ) : (
                    <span className="font-mono">{deliveryPrice} د.م.</span>
                  )}
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-stone-800 pt-2 text-white">
                  <span>الإجمالي الفعلي المطلوب</span>
                  <span className="font-sans text-amber-400 text-base font-black">{totalPrice.toLocaleString()} د.م.</span>
                </div>
              </div>

              {/* Action purchase */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>إرسال الطلب عبر الواتساب فوراً</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="py-10 text-center space-y-6">
              <div className="w-20 h-20 bg-amber-500 text-stone-950 rounded-full flex items-center justify-center mx-auto border-4 border-stone-900 shadow-2xl scale-110">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-black text-amber-400">لقد تم تسجيل وتوجيه طلبك بنجاح ممتاز!</h4>
                <p className="text-stone-300 text-xs max-w-md mx-auto leading-relaxed">
                  شكراً لثقتكم الغالية في <span className="font-extrabold text-amber-400">{settings.logoText}</span>. قمنا بحجز هاتفك الذكي {phone.name} بنجاح.
                </p>
                <p className="text-[11px] text-stone-400 max-w-sm mx-auto leading-relaxed mt-2 p-3 bg-stone-950 rounded-xl border border-stone-850">
                  يرجى متابعة المحادثة عبر <span className="text-emerald-400 font-bold">الواتساب</span> لإرسال تفاصيل التوصيل ليتسنى لنا شحن الهاتف لك بأقرب وقت.
                </p>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 text-xs transition-colors"
              >
                تصفح العروض الفاخرة الأخرى
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
