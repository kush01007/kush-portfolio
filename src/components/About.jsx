import {
  CalendarDays,
  Code2,
  Download,
  Globe2,
  GraduationCap,
  Mail,
  MapPin,
  Smartphone,
} from "lucide-react";
import { aboutFocus, profile } from "../data/portfolioData";

const focusIcons = {
  Smartphone,
  Globe2,
  Code2,
};

const About = () => {
  const profileDetails = [
    { label: "Experience", value: profile.experience, icon: CalendarDays },
    { label: "Education", value: profile.education, icon: GraduationCap },
    { label: "Location", value: profile.location, icon: MapPin },
    { label: "Email", value: profile.email, icon: Mail },
  ];

  const resumeAvailable = Boolean(profile.resume);
  const portraitImage = profile.portrait || "/about-profile.png";

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#05080D] px-6 py-8 sm:px-8 lg:px-16 lg:py-0 xl:px-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="relative z-10">
        <div className="grid gap-10 rounded-2xl border border-white/10 bg-[#080D13]/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:p-10">
          <div className="flex flex-col justify-center max-w-[530px]">
            <div className="inline-flex w-fit items-center gap-2.5 rounded-lg border border-white/10 bg-[#0B1118]/80 px-3.5 py-2 text-[13px] text-white/85">
              <span className="h-2 w-2 rounded-full bg-[#9DB7D5] shadow-[0_0_12px_rgba(157,183,213,0.8)]" />
              About Me
            </div>

            <h2 className="mt-5 text-[36px] font-semibold leading-[1.1] tracking-[-0.04em] text-white sm:text-[42px] lg:text-[46px]">
              Get to know me
              <span className="mt-1 block text-[#9DB7D5]">a little better</span>
            </h2>

            <span className="mt-6 h-px w-20 bg-gradient-to-r from-[#9DB7D5] to-transparent" />

            <p className="mt-5 text-[15px] leading-7 text-white/70 sm:text-base">
              {profile.about}
            </p>

            <p className="mt-4 text-[15px] leading-7 text-white/70 sm:text-base">
              {profile.aboutGrowth}
            </p>

            <a
              href={resumeAvailable ? profile.resume : undefined}
              download={resumeAvailable}
              aria-disabled={!resumeAvailable}
              onClick={(event) => {
                if (!resumeAvailable) event.preventDefault();
              }}
              className={`mt-6 inline-flex h-11 w-fit items-center justify-center gap-2.5 rounded-lg border px-5 text-sm font-medium transition-all ${
                resumeAvailable
                  ? "border-[#9DB7D5]/35 bg-[#0B1118] text-[#B8D6F5] hover:border-[#9DB7D5]/75 hover:bg-[#0F1722]"
                  : "cursor-not-allowed border-[#9DB7D5]/25 bg-[#0B1118] text-[#9DB7D5]/70"
              }`}
              title={
                resumeAvailable
                  ? "Download Resume"
                  : "Add resume path in portfolioData.js"
              }
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#9DB7D5]/30">
                <Code2 size={14} />
              </span>
              Download Resume
              <Download size={18} />
            </a>
          </div>

          <div className="relative min-h-[500px] overflow-hidden rounded-xl border border-white/10 bg-[#070C12]/80 sm:min-h-[590px] lg:min-h-[550px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(92,146,210,0.28),transparent_28%),radial-gradient(circle_at_50%_20%,rgba(157,183,213,0.12),transparent_34%),linear-gradient(180deg,rgba(8,14,21,0)_0%,rgba(8,14,21,0)_45%,rgba(8,14,21,0.92)_76%)]" />
            <div className="pointer-events-none absolute left-1/2 top-[27%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#24558E]/25 blur-[70px]" />
            <div className="pointer-events-none absolute left-1/2 top-[27%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9DB7D5]/10" />
            <div className="pointer-events-none absolute left-1/2 top-[27%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9DB7D5]/[0.07]" />
            <div className="pointer-events-none absolute left-1/2 top-[27%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9DB7D5]/[0.05]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(157,183,213,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(157,183,213,0.035)_1px,transparent_1px)] bg-[size:34px_34px]" />
            <span className="absolute left-[18%] top-[17%] h-1 w-1 rounded-full bg-[#9DB7D5] shadow-[0_0_10px_2px_rgba(157,183,213,0.75)]" />
            <span className="absolute right-[17%] top-[24%] h-1 w-1 rounded-full bg-[#9DB7D5] shadow-[0_0_10px_2px_rgba(157,183,213,0.75)]" />

            <img
              src={portraitImage}
              alt={`${profile.name} portrait`}
              className="absolute left-1/2 top-5 z-10 h-[235px] w-[min(82%,380px)] -translate-x-1/2 object-contain object-bottom opacity-95 drop-shadow-[0_28px_48px_rgba(0,0,0,0.62)] grayscale saturate-[0.72] contrast-125 brightness-[0.82] sm:top-6 sm:h-[260px] lg:top-6 lg:h-[275px]"
            />
            <div className="pointer-events-none absolute inset-x-0 top-[235px] z-20 h-36 bg-gradient-to-b from-transparent via-[#070C12]/35 to-[#070C12] sm:top-[260px] lg:top-[275px]" />

            <div className="absolute inset-x-4 bottom-4 z-30 rounded-xl border border-white/10 bg-[#080E15]/95 px-5 py-2 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:inset-x-5 sm:bottom-5 sm:px-6">
              <div className="divide-y divide-white/10">
                {profileDetails.map((detail) => {
                  const Icon = detail.icon;

                  return (
                    <div
                      key={detail.label}
                      className="flex items-center justify-between gap-4 py-3.5"
                    >
                      <span className="flex items-center gap-3 text-[15px] text-white/75">
                        <Icon
                          size={21}
                          strokeWidth={1.6}
                          className="shrink-0 text-[#9DB7D5]"
                        />
                        {detail.label}
                      </span>
                      <span className="text-right text-[15px] text-white/80">
                        {detail.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-[#080D13]/80 p-4 backdrop-blur-xl sm:p-5">
          <div className="flex items-center gap-2.5 text-xs font-medium text-white sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-[#9DB7D5]/70" />
            What I Focus On
          </div>

          <div className="mt-3 grid gap-2.5 sm:gap-3 lg:mt-4 lg:grid-cols-3">
            {aboutFocus.map((item) => {
              const Icon = focusIcons[item.icon] || Code2;

              return (
                <article
                  key={item.title}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#0B1118]/70 p-3 sm:p-4 lg:gap-4 lg:rounded-xl"
                >
                  <Icon
                    size={48}
                    strokeWidth={1.25}
                    className="h-8 w-8 shrink-0 text-[#9DB7D5] drop-shadow-[0_0_10px_rgba(157,183,213,0.2)] sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                  />
                  <div>
                    <h3 className="text-[13px] font-semibold text-white sm:text-sm lg:text-[15px]">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] leading-4 text-white/60 sm:text-xs sm:leading-5 lg:mt-1 lg:text-[13px]">
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
