import {
  ArrowRight,
  Box,
  CalendarDays,
  Code2,
  Mail,
  Layers3,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
  profile,
  selectedWork,
  socials,
  stats,
} from "../data/portfolioData";

const Hero = () => {
  const github = socials.find((social) => social.label === "GitHub");
  const linkedin = socials.find((social) => social.label === "LinkedIn");
  const email = socials.find((social) => social.label === "Email");

  return (
    <section className="relative overflow-hidden bg-[#05080D] pt-14 sm:pt-16">
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:44px_44px]" />

      {/* Glows */}
      <div className="pointer-events-none absolute left-[-12%] top-[22%] h-[360px] w-[520px] rounded-full bg-[#17365f]/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-[15%] top-[28%] h-[300px] w-[300px] rounded-full bg-[#9DB7D5]/10 blur-[120px]" />

      {/* Orbit lines */}
      <div className="pointer-events-none absolute left-[-8%] top-[30%] hidden h-[420px] w-[620px] rounded-full border border-white/[0.04] lg:block" />
      <div className="pointer-events-none absolute left-[28%] top-[36%] hidden h-[360px] w-[480px] rounded-full border border-white/[0.035] lg:block" />

      {/* Stars */}
      <span className="absolute left-[39%] top-[28%] h-1.5 w-1.5 rounded-full bg-[#9DB7D5] shadow-[0_0_18px_4px_rgba(157,183,213,0.75)]" />
      <span className="absolute left-[43%] top-[34%] h-1 w-1 rounded-full bg-[#9DB7D5] shadow-[0_0_16px_3px_rgba(157,183,213,0.65)]" />
      <span className="absolute left-[2%] top-[58%] h-1 w-1 rounded-full bg-[#9DB7D5] shadow-[0_0_16px_3px_rgba(157,183,213,0.65)]" />

      <div className="relative z-10 mx-auto grid w-full items-center gap-12 px-6 py-10 sm:px-8 sm:py-12 lg:min-h-[610px] lg:grid-cols-[0.92fr_1.08fr] lg:px-16 lg:py-12 xl:px-20">
        {/* Left content */}
        <div className="max-w-[525px] lg:-translate-y-4">
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/[0.035] px-3.5 py-2 text-sm font-medium text-white shadow-[0_0_40px_rgba(157,183,213,0.08)]">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8] shadow-[0_0_16px_rgba(56,189,248,0.9)]" />
            {profile.status}
          </div>

          <h1 className="text-[76px] font-bold leading-[0.86] tracking-[-0.018em] text-white drop-shadow-[0_4px_0_rgba(157,183,213,0.28)] sm:text-[96px] lg:text-[104px]">
            {profile.name}
          </h1>

          <h2 className="mt-6 text-[23px] font-semibold leading-tight tracking-[-0.012em] text-[#AAB7C8] sm:text-[29px] lg:text-[31px]">
            {profile.role}
          </h2>

          <p className="mt-5 max-w-[520px] text-[15px] leading-[1.55] tracking-[-0.005em] text-white/65 sm:text-[17px]">
            {profile.shortIntro}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-[1.18fr_1fr_1fr]">
            <a
              href="#projects"
              className="group col-span-2 flex h-14 items-center justify-center gap-3.5 rounded-md border border-[#9DB7D5]/35 bg-[#0B1118]/70 px-4 text-[15px] font-medium text-white transition hover:border-[#9DB7D5] hover:bg-[#111827] sm:col-span-1"
            >
              <span className="whitespace-nowrap">View Projects</span>
              <ArrowRight
                size={20}
                className="transition group-hover:translate-x-1"
              />
            </a>

            <a
              href={github.href}
              target="_blank"
              rel="noreferrer"
              className="flex h-14 items-center justify-center gap-3.5 rounded-md border border-white/15 bg-white/[0.03] px-4 text-[15px] font-medium text-white transition hover:border-white/35 hover:bg-white/[0.06]"
            >
              <FaGithub size={21} />
              GitHub
            </a>

            <a
              href={linkedin.href}
              target="_blank"
              rel="noreferrer"
              className="flex h-14 items-center justify-center gap-3.5 rounded-md border border-white/15 bg-white/[0.03] px-4 text-[15px] font-medium text-white transition hover:border-white/35 hover:bg-white/[0.06]"
            >
              <FaLinkedin size={20} />
              LinkedIn
            </a>
          </div>

          <div className="mt-8 flex items-center justify-around text-white/55 sm:justify-start sm:gap-11">
            <a
              href={github.href}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[#9DB7D5]"
            >
              <FaGithub size={24} />
            </a>
            <a
              href={linkedin.href}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[#9DB7D5]"
            >
              <FaLinkedin size={23} />
            </a>
            <a
              href={email.href}
              className="transition hover:text-[#9DB7D5]"
            >
              <Mail size={24} />
            </a>
            <a href="#projects" className="transition hover:text-[#9DB7D5]">
              <Code2 size={25} />
            </a>
          </div>
        </div>

        {/* Right content */}
        <div className="grid gap-4 xl:grid-cols-[1.16fr_0.84fr]">
          {/* Selected Work */}
          <div className="flex flex-col rounded-xl border border-white/12 bg-[#0B1118]/75 p-5 shadow-[0_0_50px_rgba(0,0,0,0.35)] backdrop-blur-xl xl:aspect-[1.08/1]">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-semibold tracking-[-0.02em] text-white">
                Selected Work
              </h3>
              <Code2 size={19} className="text-[#9DB7D5]" />
            </div>

            <div className="grid flex-1 grid-rows-4 divide-y divide-white/10">
              {selectedWork.map((work) => (
                <a
                  key={work.number}
                  href={work.live}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative grid grid-cols-[48px_1fr_20px] items-center gap-3 px-1 py-3 transition-colors hover:bg-white/[0.015] xl:py-0"
                  style={{ "--work-index": Number(work.number) - 1 }}
                >
                  <span className="pointer-events-none absolute left-0 top-3 h-[calc(100%-24px)] w-px rounded-full bg-[#9DB7D5]/40 opacity-[calc(0.52-var(--work-index)*0.1)] shadow-[0_0_7px_rgba(157,183,213,0.28)]" />
                  <span className="pointer-events-none absolute left-0 top-3 h-px w-16 bg-gradient-to-r from-[#9DB7D5]/24 to-transparent opacity-[calc(0.42-var(--work-index)*0.08)]" />
                  <span className="pointer-events-none absolute left-0 top-3 h-[calc(100%-24px)] w-12 bg-[linear-gradient(90deg,rgba(157,183,213,0.035),transparent)] opacity-[calc(0.55-var(--work-index)*0.12)]" />
                  <span className="text-xl font-medium text-white">
                    {work.number}
                  </span>

                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-white">
                      {work.title}
                    </span>
                    <span className="mt-1 block text-xs text-white/55">
                      {work.type}
                    </span>
                  </span>

                  <ArrowRight
                    size={17}
                    className="text-white/65 transition group-hover:translate-x-1 group-hover:text-[#9DB7D5]"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:h-full xl:grid-cols-1 xl:grid-rows-2">
            <div className="rounded-xl border border-white/12 bg-[#0B1118]/75 p-4 backdrop-blur-xl lg:p-6">
              <div className="flex h-full items-center gap-3 lg:gap-5">
                <Layers3
                  size={58}
                  strokeWidth={1.35}
                  className="h-11 w-11 shrink-0 text-[#AFC9E8] lg:h-[58px] lg:w-[58px]"
                  style={{
                    filter:
                      "drop-shadow(0 0 4px rgba(157, 183, 213, 0.9)) drop-shadow(0 0 14px rgba(89, 145, 204, 0.7))",
                  }}
                />
        <div className="max-w-[525px]">
                  <h3 className="text-base font-semibold text-white lg:text-xl ">
                    {stats[0].title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/60 lg:mt-2 lg:text-sm">
                    {stats[0].description}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/12 bg-[#0B1118]/75 p-4 backdrop-blur-xl lg:p-6">
              <div className="flex h-full items-center gap-3 lg:gap-5">
                <Box
                  size={56}
                  strokeWidth={1.35}
                  className="h-11 w-11 shrink-0 text-[#AFC9E8] lg:h-14 lg:w-14"
                  style={{
                    filter:
                      "drop-shadow(0 0 4px rgba(157, 183, 213, 0.9)) drop-shadow(0 0 14px rgba(89, 145, 204, 0.7))",
                  }}
                />
                <div>
                  <h3 className="text-[28px] font-semibold leading-none text-white lg:text-[34px]">
                    {stats[1].value}
                  </h3>
                  <p className="mt-1 text-base font-medium text-white lg:mt-1.5 lg:text-xl">
                    {stats[1].title}
                  </p>
                  <p className="mt-1.5 text-xs text-white/60 lg:mt-2 lg:text-sm">
                    {stats[1].description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="rounded-xl border border-white/12 bg-[#0B1118]/75 px-4 py-5 backdrop-blur-xl sm:px-5 xl:col-span-2">
            <div className="flex items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <CalendarDays
                  size={30}
                  strokeWidth={1.5}
                  className="shrink-0 text-[#9DB7D5]"
                />
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {stats[2].title}
                  </h3>
                  <p className="mt-1 text-xs text-white/60">
                    {stats[2].description}
                  </p>
                </div>
              </div>

              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E] shadow-[0_0_18px_rgba(34,197,94,0.85)]" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
