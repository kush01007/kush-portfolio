import { ArrowUpRight, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { profile } from "../data/portfolioData";

const Contact = () => {
  const email = "kushtech123@gmail.com";
  const linkedin = "https://www.linkedin.com/in/kush-gupta-b99a90395";
  const github = profile.github || "https://github.com/kush01007";

  const contactLinks = [
    {
      label: "Email Me",
      href: `mailto:${email}`,
      icon: Mail,
      external: false,
    },
    {
      label: "LinkedIn",
      href: linkedin,
      icon: FaLinkedin,
      external: true,
    },
    {
      label: "GitHub",
      href: github,
      icon: FaGithub,
      external: true,
    },
  ];

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#05080D] px-6 py-8 sm:px-8 lg:px-16 xl:px-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="pointer-events-none absolute left-[-10%] top-1/2 h-[260px] w-[420px] -translate-y-1/2 rounded-full bg-[#17365f]/18 blur-[110px]" />
      <div className="pointer-events-none absolute right-[-8%] top-1/2 h-[260px] w-[420px] -translate-y-1/2 rounded-full bg-[#9DB7D5]/8 blur-[120px]" />

      <div className="relative z-10">
        <div className="overflow-hidden rounded-2xl border border-[#1F2937]/80 bg-[#080D13]/75 px-5 py-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-7 sm:py-7 lg:min-h-[205px] lg:px-8 lg:py-8">
          <div className="grid h-full items-center gap-7 lg:grid-cols-[1fr_auto]">
            <div className="max-w-[620px]">
              <div className="inline-flex items-center gap-2.5 rounded-lg border border-[#1F2937]/90 bg-[#080D13]/90 px-3.5 py-2 text-[13px] text-white/80">
                <span className="h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_14px_rgba(34,197,94,0.75)]" />
                Available for Internship
              </div>

              <h2 className="mt-5 text-[28px] font-semibold leading-[1.12] tracking-[-0.04em] text-white sm:text-[34px] lg:text-[38px]">
                Let&apos;s Build Something
                <span className="block text-[#9DB7D5]">
                  Great Together
                </span>
              </h2>

              <p className="mt-4 max-w-[540px] text-[15px] leading-7 text-white/58 sm:text-base">
                I&apos;m currently open to frontend and full-stack internship
                opportunities. Let&apos;s connect if there&apos;s a role,
                project, or opportunity where I can contribute and learn.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:w-[580px]">
              {contactLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-md border border-[#263241] bg-[#0A1017] px-5 text-sm font-semibold text-white/82 transition hover:border-[#9DB7D5]/50 hover:bg-[#0F1722] hover:text-white"
                  >
                    <Icon size={17} strokeWidth={1.7} />
                    {link.label}
                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.8}
                      className="text-white/30 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#9DB7D5]"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;