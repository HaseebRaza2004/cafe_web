import React from "react";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Cafe Online",
  description:
    "Learn how we protect your data and privacy at our premium cafe.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "April 2026";

  return (
    <div className="min-h-screen mt-10 py-24 md:py-32 px-4 relative">
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center md:text-left border-b border-white/10 pb-8">
          <div className="flex flex-row items-center md:items-baseline gap-3 mb-2 justify-center md:justify-start">
            <ShieldCheck
              className="w-8 h-8 md:w-10 md:h-10 text-(--color-gold)"
              strokeWidth={1.5}
            />
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-wide text-white">
              Privacy <span className="text-(--color-gold)">Policy</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm md:text-base mt-4 md:mt-0">
            Last Updated:{" "}
            <span className="text-white font-medium">{lastUpdated}</span>
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-12 shadow-2xl text-gray-300 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {/* Introduction */}
          <section>
            <p className="leading-relaxed text-sm md:text-base text-gray-300">
              At <strong className="text-white font-medium">Cafe Online</strong>
              , we are deeply committed to protecting your privacy and ensuring
              a secure luxury dining experience. This Privacy Policy explains
              how we collect, use, and safeguard your information when you use
              our digital platform for food ordering and delivery.
            </p>
          </section>

          {/* What We Collect */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-(--color-gold)"></span>
              Information We Collect
            </h2>
            <p className="leading-relaxed text-sm md:text-base mb-4">
              To ensure seamless service from our kitchen to your door, we
              collect information that you provide directly to us when you:
            </p>
            <ul className="list-none space-y-3 text-sm md:text-base text-gray-400 ml-2 border-l-2 border-white/10 pl-4">
              <li>
                <strong className="text-white font-medium">
                  Identity & Contact Data:
                </strong>{" "}
                Name, phone number, and delivery address (provided during
                checkout).
              </li>
              <li>
                <strong className="text-white font-medium">Order Data:</strong>{" "}
                Details of the meals and deals you purchase, and special dietary
                instructions left in order notes.
              </li>
              <li>
                <strong className="text-white font-medium">
                  Technical Data:
                </strong>{" "}
                Essential cookies and local storage data used to maintain your
                cart session.
              </li>
            </ul>
            <p className="mt-4 text-xs md:text-sm italic text-gray-500">
              *Note: We do not process payments natively on our servers. All
              financial transactions are handled via secure, encrypted
              third-party payment gateways or via Cash on Delivery.
            </p>
          </section>

          {/* How We Use It */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-(--color-gold)"></span>
              How We Use Your Information
            </h2>
            <p className="leading-relaxed text-sm md:text-base mb-3">
              The information we collect is strictly used to enhance your
              experience:
            </p>
            <ul className="list-disc list-outside space-y-2 text-sm md:text-base text-gray-400 ml-6 marker:text-(--color-gold)">
              <li>To instantly process and fulfill your food orders.</li>
              <li>
                To provide real-time updates via our live{" "}
                <strong className="text-white">Order Tracker</strong> feature.
              </li>
              <li>To communicate with you regarding your delivery status.</li>
              <li>
                To analyze website traffic (via Google Analytics) to improve our
                menu and platform performance.
              </li>
              <li>
                To prevent fraudulent orders and ensure platform security.
              </li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-(--color-gold)"></span>
              Information Sharing & Disclosure
            </h2>
            <p className="leading-relaxed text-sm md:text-base">
              We value your trust.{" "}
              <strong className="text-(--color-gold)">
                We do not sell, trade, or rent your personal data to any third
                parties.
              </strong>{" "}
              Your data is only shared with trusted partners essential to our
              operations (e.g., our delivery riders to reach your location, and
              secure cloud providers hosting our platform). We may also disclose
              information if required to comply with strict legal obligations.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-(--color-gold)"></span>
              Data Security
            </h2>
            <p className="leading-relaxed text-sm md:text-base">
              We implement modern, robust technical security measures, including
              HTTPS encryption and secure database architectures, to protect
              your personal information against unauthorized access, alteration,
              or destruction. While we strive for 100% security, please note
              that no internet transmission is completely invulnerable.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-(--color-gold)"></span>
              Your Privacy Rights
            </h2>
            <p className="leading-relaxed text-sm md:text-base">
              You have the right to request access to the personal data we hold
              about you, ask for corrections, or request the deletion of your
              order history. To exercise these rights, simply reach out to our
              support team.
            </p>
          </section>

          {/* Contact Us */}
          <section className="bg-black/30 p-6 md:p-8 rounded-xl border border-white/5">
            <h2 className="text-xl font-bold text-white mb-3">
              Questions about your privacy?
            </h2>
            <p className="text-sm md:text-base text-gray-400 mb-4">
              If you have any concerns regarding how your data is handled, our
              dedicated support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm md:text-base">
              <a
                href="mailto:support@cafeonline.com"
                className="text-(--color-gold) hover:text-white transition-colors flex items-center gap-2"
              >
                ✉️ support@cafeonline.com
              </a>
              <span className="hidden sm:inline text-gray-600">|</span>
              <a
                href="tel:0300-1234567"
                className="text-(--color-gold) hover:text-white transition-colors flex items-center gap-2"
              >
                📞 0300-1234567
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
;