import {
  CalendarDays,
  Code2,
  Download,
  GraduationCap,
  Mail,
  MapPin,
} from "lucide-react";
import { profile } from "../data/portfolioData";

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
      className="relative overflow-hidden bg-[#05080D px-5 py-10 sm:px-8 lg:px-16 lg:py-5 xl:px-20"
    >
      <div className="pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1500px]">
        <div className="grid gap-8 rounded-2xl border border-white/10 bg-[#080D13]/80 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:p-10">
          <div className="flex max-w-[530px] flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2.5 rounded-lg border border-white/10 bg-[#0B1118]/80 px-3.5 py-2 text-[12px] text-white/85 sm:text-[13px] lg:mb-6 ">
              <span className="h-2 w-2 rounded-full bg-[#9DB7D5] shadow-[0_0_12px_rgba(157,183,213,0.8)]" />
              About Me
            </div>

            <h2 className="mt-5 text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-[42px] lg:text-[46px]">
              Get to know me
              <span className="mt-1 block text-[#9DB7D5]">
                a little better
              </span>
            </h2>

            <span className="mt-5 h-px w-16 bg-gradient-to-r from-[#9DB7D5] to-transparent sm:mt-6 sm:w-20" />

            <p className="mt-5 text-[14px] leading-6 text-white/70 sm:text-base sm:leading-7">
              {profile.about}
            </p>

            <p className="mt-4 text-[14px] leading-6 text-white/70 sm:text-base sm:leading-7">
              {profile.aboutGrowth}
            </p>

            <a
              href={resumeAvailable ? profile.resume : undefined}
              download={resumeAvailable}
              aria-disabled={!resumeAvailable}
              onClick={(event) => {
                if (!resumeAvailable) event.preventDefault();
              }}
              className={`mt-6 inline-flex h-11 w-fit items-center justify-center gap-2.5 rounded-lg border px-4 text-sm font-medium transition-all sm:px-5 ${
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
              <Download size={17} />
            </a>
          </div>

          <div className="relative min-h-[450px] overflow-hidden rounded-xl border border-white/10 bg-[#070C12]/80 sm:min-h-[590px] lg:min-h-[550px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(92,146,210,0.28),transparent_28%),radial-gradient(circle_at_50%_18%,rgba(157,183,213,0.12),transparent_34%),linear-gradient(180deg,rgba(8,14,21,0)_0%,rgba(8,14,21,0)_42%,rgba(8,14,21,0.92)_74%)] sm:bg-[radial-gradient(circle_at_50%_28%,rgba(92,146,210,0.28),transparent_28%),radial-gradient(circle_at_50%_20%,rgba(157,183,213,0.12),transparent_34%),linear-gradient(180deg,rgba(8,14,21,0)_0%,rgba(8,14,21,0)_45%,rgba(8,14,21,0.92)_76%)]" />

            <div className="pointer-events-none absolute left-1/2 top-[22%] h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#24558E]/25 blur-[70px] sm:top-[27%] sm:h-52 sm:w-52" />
            <div className="pointer-events-none absolute left-1/2 top-[22%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9DB7D5]/10 sm:top-[27%] sm:h-36 sm:w-36" />
            <div className="pointer-events-none absolute left-1/2 top-[22%] h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9DB7D5]/[0.07] sm:top-[27%] sm:h-56 sm:w-56" />
            <div className="pointer-events-none absolute left-1/2 top-[22%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#9DB7D5]/[0.05] sm:top-[27%] sm:h-72 sm:w-72" />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(157,183,213,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(157,183,213,0.035)_1px,transparent_1px)] bg-[size:34px_34px]" />

            <span className="absolute left-[18%] top-[15%] h-1 w-1 rounded-full bg-[#9DB7D5] shadow-[0_0_10px_2px_rgba(157,183,213,0.75)] sm:top-[17%]" />

            <span className="absolute right-[17%] top-[21%] h-1 w-1 rounded-full bg-[#9DB7D5] shadow-[0_0_10px_2px_rgba(157,183,213,0.75)] sm:top-[24%]" />

            <img
              src={portraitImage}
              alt={`${profile.name} portrait`}
              className="absolute left-1/2 top-0 z-10 h-[215px] w-[min(82%,340px)] -translate-x-1/2 object-contain object-bottom opacity-95 drop-shadow-[0_28px_48px_rgba(0,0,0,0.62)] grayscale saturate-[0.72] contrast-125 brightness-[0.82] sm:top-6 sm:h-[260px] sm:w-[min(82%,380px)] lg:top-6 lg:h-[275px]"
            />

            <div className="pointer-events-none absolute inset-x-0 top-[195px] z-20 h-32 bg-gradient-to-b from-transparent via-[#070C12]/35 to-[#070C12] sm:top-[260px] lg:top-[275px]" />

            <div className="absolute inset-x-3 bottom-3 z-30 rounded-xl border border-white/10 bg-[#080E15]/95 px-4 py-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:inset-x-5 sm:bottom-5 sm:px-6 sm:py-2">
              <div className="divide-y divide-white/10">
                {profileDetails.map((detail) => {
                  const Icon = detail.icon;
                  const isEmail = detail.label === "Email";

                  return (
                    <div
                      key={detail.label}
                      className="flex items-center justify-between gap-3 py-3 sm:gap-4 sm:py-3.5"
                    >
                      <span className="flex items-center gap-2.5 text-[13px] text-white/72 sm:gap-3 sm:text-[15px]">
                        <Icon
                          size={18}
                          strokeWidth={1.6}
                          className="shrink-0 text-[#9DB7D5] sm:size-[21px]"
                        />
                        {detail.label}
                      </span>

                      <span
                        className={`max-w-[150px] text-right leading-5 text-white/80 sm:max-w-[220px] sm:text-[15px] ${
                          isEmail
                            ? "text-[12px] tracking-[-0.02em]"
                            : "text-[13px]"
                        }`}
                      >
                        {detail.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;