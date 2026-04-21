import { HelpCircle, Utensils, Truck, CreditCard, Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: "FAQs | Luxury Cafe Online - Your Questions Answered",
  description:
    "Find answers to everything about ordering luxury meals, delivery timings (4PM - 2AM), payment methods, and real-time order tracking.",
  keywords: [
    "cafe faqs",
    "online food delivery",
    "order tracking",
    "payment methods",
  ],
};

const faqData = [
  {
    category: "Ordering & Tracking",
    icon: <Utensils className="w-5 h-5 text-(--color-gold)" />,
    questions: [
      {
        q: "How do I place an order?",
        a: "Browse our menu, select your favorite meals or deals, customize them in the modal, and add them to your cart. Once ready, click 'Checkout', provide your details, and confirm your order. It's that simple!",
      },
      {
        q: "Can I track my order in real-time?",
        a: "Yes! After placing an order, you will be redirected to the 'Order Success' page. You can also use our 'Order Tracker' pill on the homepage to see the current status—from preparation to your doorstep.",
      },
      {
        q: "Can I change or cancel my order after placing it?",
        a: "Since we start preparing your food immediately to ensure freshness, changes are only possible within 2 minutes of placing the order. Please call our support team at 0300-1234567 for urgent requests.",
      },
    ],
  },
  {
    category: "Delivery & Timings",
    icon: <Truck className="w-5 h-5 text-(--color-gold)" />,
    questions: [
      {
        q: "What are your delivery hours?",
        a: "We serve our premium meals daily from 4:00 PM to 2:00 AM. Perfect for evening cravings and late-night luxury dining.",
      },
      {
        q: "Which areas do you deliver to?",
        a: "We currently deliver to major areas in Karachi. You can select your specific area in the delivery selector within the cart to see the delivery charges and estimated time.",
      },
      {
        q: "How long does delivery take?",
        a: "Typically, orders reach our customers within 35-50 minutes, depending on your location and order complexity. We prioritize food temperature and quality above all.",
      },
    ],
  },
  {
    category: "Payments & Security",
    icon: <CreditCard className="w-5 h-5 text-(--color-gold)" />,
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Cash on Delivery (COD) and all major Credit/Debit cards (Visa, Mastercard) via our secure encrypted payment gateway.",
      },
      {
        q: "Is my payment information safe?",
        a: "Absolutely. We use industry-standard HTTPS encryption. Your card details are processed directly by our secure payment partners and are never stored on our servers.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen mt-10 py-24 md:py-32 px-4 relative">
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center md:text-left border-b border-white/10 pb-8">
          <div className="flex flex-row items-center md:items-baseline gap-3 mb-2 justify-center md:justify-start">
            <HelpCircle
              className="w-8 h-8 md:w-10 md:h-10 text-(--color-gold)"
              strokeWidth={1.5}
            />
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-wide text-white">
              General <span className="text-(--color-gold)">FAQs</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm md:text-base mt-4 md:mt-2">
            Have questions? We have the answers. Explore our frequently asked
            questions below.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {faqData.map((section, idx) => (
            <div key={idx} className="space-y-6">
              {/* Category Title */}
              <div className="flex items-center gap-3 border-l-2 border-(--color-gold) pl-4">
                {section.icon}
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider uppercase">
                  {section.category}
                </h2>
              </div>

              {/* Accordion List */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 md:p-4 shadow-2xl">
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((item, qIdx) => (
                    <AccordionItem
                      key={qIdx}
                      value={`item-${idx}-${qIdx}`}
                      className="border-none px-4"
                    >
                      <AccordionTrigger className="cursor-pointer text-left text-sm md:text-lg font-semibold text-gray-200 hover:text-(--color-gold) transition-colors py-5 hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-400 text-sm md:text-base leading-relaxed pb-5">
                        {item.a}
                      </AccordionContent>
                      {qIdx !== section.questions.length - 1 && (
                        <div className="h-px bg-white/5 w-full" />
                      )}
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-16 bg-black/30 p-8 rounded-2xl border border-white/5 text-center animate-in fade-in zoom-in duration-700 delay-300">
          <h3 className="text-xl font-bold text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-400 mb-6">
            Our dedicated support team is available from 4:00 PM to 2:00 AM.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="tel:0300-1234567"
              className="group flex items-center gap-3 bg-(--color-gold) text-black px-6 py-3 rounded-full font-bold hover:bg-(--color-gold-dark) transition-all"
            >
              <Clock className="w-5 h-5" />
              Call Us Now
            </a>
            <a
              href="mailto:support@cafeonline.com"
              className="text-gray-300 hover:text-(--color-gold) transition-colors underline underline-offset-4 decoration-white/20"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};