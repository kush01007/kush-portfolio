import { ArrowUp } from "lucide-react";
import { navLinks, profile } from "../data/portfolioData";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative overflow-hidden border-t border-[#1F2937]/80 bg-[#05080D] px-6 py-5 sm:px-8 lg:px-16 xl:px-20">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Left */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
          <a href="#" className="group flex items-center gap-3">
            <span className="text-[26px] font-semibold tracking-[-0.06em] text-[#9DB7D5] transition group-hover:text-white">
              {profile.logoText}
            </span>

            <span className="text-lg font-semibold tracking-[-0.03em] text-white">
              {profile.name}
            </span>
          </a>

          <p className="text-sm text-white/45">
            © {currentYear} {profile.name}. All rights reserved.
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-8">
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-white/50 transition hover:text-[#9DB7D5]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-[#263241] bg-[#0A1017] text-white/70 transition hover:border-[#9DB7D5]/45 hover:bg-[#0F1722] hover:text-white"
          >
            <ArrowUp size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;