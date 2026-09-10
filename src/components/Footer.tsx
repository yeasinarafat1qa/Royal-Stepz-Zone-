import React from 'react';
import {
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Clock,
  ArrowUp,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const whatsappNumber = '97455551234';
  const phoneNumber = '+974 5555 1234';
  const email = 'support@royalstepz.qa';

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="mt-16 border-t border-white/10 bg-zinc-950 text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="text-2xl font-black tracking-tight">
              <span className="text-amber-400">ROYAL</span>
              <span className="ml-1 text-white">STEPZ</span>
            </div>

            <div className="mt-1 text-[10px] font-semibold tracking-[0.3em] text-zinc-500">
              ZONE • QATAR
            </div>

            <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-400">
              Premium footwear for every step. Discover stylish,
              comfortable and quality footwear for your everyday
              journey.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white transition hover:-translate-y-1 hover:bg-emerald-500"
              >
                <MessageCircle size={18} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                onClick={(e) => e.preventDefault()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 transition hover:-translate-y-1 hover:bg-amber-400 hover:text-black"
              >
                <Instagram size={18} />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                onClick={(e) => e.preventDefault()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 transition hover:-translate-y-1 hover:bg-amber-400 hover:text-black"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth',
                    });
                  }}
                  className="text-zinc-400 transition hover:text-amber-400"
                >
                  Home
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => {
                    const shopSection =
                      document.getElementById('shop');

                    shopSection?.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  className="text-zinc-400 transition hover:text-amber-400"
                >
                  Shop
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth',
                    });
                  }}
                  className="text-zinc-400 transition hover:text-amber-400"
                >
                  Categories
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth',
                    });
                  }}
                  className="text-zinc-400 transition hover:text-amber-400"
                >
                  New Arrivals
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Customer Service
            </h3>

            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <span className="text-zinc-400">
                  Fast Delivery Across Qatar
                </span>
              </li>

              <li>
                <span className="text-zinc-400">
                  Cash on Delivery Available
                </span>
              </li>

              <li>
                <span className="text-zinc-400">
                  Quality Guaranteed
                </span>
              </li>

              <li>
                <span className="text-zinc-400">
                  WhatsApp Support
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-400"
                />

                <div>
                  <p className="text-sm font-medium text-white">
                    Doha, Qatar
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Delivery available across Qatar
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  size={18}
                  className="shrink-0 text-amber-400"
                />

                <a
                  href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                  className="text-sm text-zinc-400 transition hover:text-amber-400"
                >
                  {phoneNumber}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  size={18}
                  className="shrink-0 text-amber-400"
                />

                <a
                  href={`mailto:${email}`}
                  className="break-all text-sm text-zinc-400 transition hover:text-amber-400"
                >
                  {email}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Clock
                  size={18}
                  className="shrink-0 text-amber-400"
                />

                <span className="text-sm text-zinc-400">
                  Daily: 9:00 AM – 10:00 PM
                </span>
              </div>

              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500"
              >
                <MessageCircle size={17} />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="text-center text-xs text-zinc-500 md:text-left">
            © 2026 Royal Stepz Zone Qatar. All rights reserved.
          </div>

          <div className="flex items-center justify-center gap-5 text-xs text-zinc-500">
            <span>QAR</span>
            <span>•</span>
            <span>Qatar</span>
            <span>•</span>
            <span>Online Store</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="mx-auto flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-400 transition hover:border-amber-400 hover:text-amber-400 md:mx-0"
          >
            <ArrowUp size={14} />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};
