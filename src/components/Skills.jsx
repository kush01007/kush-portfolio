import { Component, lazy, Suspense } from "react";
import {
  ArrowRight,
  Code2,
  Database,
  PenTool,
  Wrench,
} from "lucide-react";
import { FaGithub, FaNodeJs } from "react-icons/fa";
import {
  SiCss,
  SiExpress,
  SiFigma,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiMongodb,
  SiNetlify,
  SiPostman,
  SiReact,
  SiRedux,
  SiRender,
  SiTailwindcss,
  SiVercel,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { coreStack, skills, techOrbs } from "../data/portfolioData";

const GalaxyBaseScene = lazy(() => import("./GalaxyBaseScene"));

const GalaxyFallback = ({ loading = false }) => (
  <div
    className="flex h-[700px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#030609] px-5 text-center sm:h-[760px] lg:h-[calc(100svh-3rem)] lg:min-h-[700px] lg:max-h-[880px]"
    role="status"
    aria-live="polite"
  >
    <p className="text-sm font-medium text-white/80">
      {loading ? "Loading interactive technology galaxy..." : "3D galaxy unavailable"}
    </p>
    <p className="mt-2 text-xs leading-5 text-[#94A3B8]">
      {techOrbs.map((technology) => technology.displayName || technology.name).join(" / ")}
    </p>
  </div>
);

class GalaxyErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <GalaxyFallback />;
    return this.props.children;
  }
}

const categoryIcons = {
  Laptop: Code2,
  Database,
  Wrench,
  PenTool,
};

const coreIcons = {
  React: { component: SiReact, color: "text-[#7DD3FC]" },
  Node: { component: FaNodeJs, color: "text-[#7FC66A]" },
  Express: { component: SiExpress, color: "text-white/85" },
  MongoDB: { component: SiMongodb, color: "text-[#79C86B]" },
  Vercel: { component: SiVercel, color: "text-white" },
};

const skillIcons = {
  HTML: { component: SiHtml5, color: "text-[#E34F26]" },
  CSS: { component: SiCss, color: "text-[#1572B6]" },
  JavaScript: { component: SiJavascript, color: "text-[#F7DF1E]" },
  "React.js": { component: SiReact, color: "text-[#61DAFB]" },
  "Tailwind CSS": { component: SiTailwindcss, color: "text-[#06B6D4]" },
  Redux: { component: SiRedux, color: "text-[#764ABC]" },
  "Node.js": { component: FaNodeJs, color: "text-[#5FA04E]" },
  "Express.js": { component: SiExpress, color: "text-white/90" },
  MongoDB: { component: SiMongodb, color: "text-[#47A248]" },
  JWT: { component: SiJsonwebtokens, color: "text-[#D63AFF]" },
  Git: { component: SiGit, color: "text-[#F05032]" },
  GitHub: { component: FaGithub, color: "text-white" },
  "VS Code": { component: VscVscode, color: "text-[#23A8F2]" },
  Postman: { component: SiPostman, color: "text-[#FF6C37]" },
  Vercel: { component: SiVercel, color: "text-white" },
  Netlify: { component: SiNetlify, color: "text-[#00C7B7]" },
  Render: { component: SiRender, color: "text-[#46E3B7]" },
  Figma: { component: SiFigma, color: "text-[#F24E1E]" },
};

const Skills = () => {
  return (
    <section
      id="skills"
      className="relative overflow-hidden  border-white/10 bg-[#05080D] px-6 py-12 sm:px-8 lg:px-16 lg:py-14 xl:px-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(157,183,213,0.07)_1px,transparent_1px)] bg-[size:28px_28px] opacity-30" />
      <div className="pointer-events-none absolute left-[25%] top-[20%] h-72 w-72 rounded-full bg-[#17365F]/10 blur-[110px]" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#6AAEFF] shadow-[0_0_12px_rgba(106,174,255,0.75)]" />
          <h2 className="text-lg font-semibold text-white sm:text-xl">Skills</h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {skills.map((skill) => {
            const Icon = categoryIcons[skill.icon] || Code2;

            return (
              <article
                key={skill.title}
                className="flex flex-col rounded-xl border border-white/10 bg-[#0B1118]/70 p-5 shadow-[0_14px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-colors hover:border-[#9DB7D5]/25"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/[0.04] bg-[#0F1722] text-[#9DC9F3] shadow-[0_0_22px_rgba(157,183,213,0.08)]">
                    <Icon size={32} strokeWidth={1.5} />
                  </span>
                  <div className="pt-1">
                    <h3 className="text-base font-semibold text-white">
                      {skill.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {skill.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  {skill.items.map((item, index) => {
                    const iconData = skillIcons[item];
                    const ItemIcon = iconData?.component;
                    const isLastOddItem =
                      skill.items.length % 2 !== 0 &&
                      index === skill.items.length - 1;
                    const isWideItem = item.length > 15 || isLastOddItem;

                    return (
                      <span
                        key={item}
                        className={`inline-flex min-w-0 items-center gap-2.5 rounded-lg border border-white/10 bg-[#070C12]/70 px-3.5 py-2.5 text-[15px] font-medium text-white/70 transition-all duration-200 hover:border-[#9DB7D5]/40 hover:bg-[#9DB7D5]/[0.06] hover:text-white hover:shadow-[0_0_18px_rgba(157,183,213,0.08)] ${
                          isWideItem ? "col-span-2" : ""
                        }`}
                      >
                        {ItemIcon && (
                          <ItemIcon
                            size={19}
                            className={`shrink-0 ${iconData.color}`}
                          />
                        )}
                        {item}
                      </span>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-[#0B1118]/70 px-5 py-5 backdrop-blur-xl sm:px-7">
          <div className="flex items-center justify-center gap-4">
            <span className="h-2 w-2 rounded-full bg-[#6AAEFF] shadow-[0_0_10px_rgba(106,174,255,0.65)]" />
            <h3 className="text-base font-semibold text-white sm:text-lg">
              Core Stack
            </h3>
            <span className="h-2 w-2 rounded-full bg-[#6AAEFF] shadow-[0_0_10px_rgba(106,174,255,0.65)]" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0">
            {coreStack.map((technology, index) => {
              const iconData = coreIcons[technology.icon];
              const Icon = iconData.component;

              return (
                <div
                  key={technology.name}
                  className="relative flex items-center justify-center gap-3 rounded-lg bg-white/[0.015] px-3 py-3 lg:rounded-none lg:bg-transparent lg:px-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0F1722] shadow-[0_0_24px_rgba(157,183,213,0.08)]">
                    <Icon size={28} className={iconData.color} />
                  </span>
                  <span className="text-sm font-medium text-white/85">
                    {technology.name}
                  </span>
                  {index < coreStack.length - 1 && (
                    <ArrowRight
                      size={17}
                      className="absolute right-0 hidden translate-x-1/2 text-[#75B4F4] lg:block"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <GalaxyErrorBoundary>
            <Suspense fallback={<GalaxyFallback loading />}>
              <GalaxyBaseScene />
            </Suspense>
          </GalaxyErrorBoundary>
        </div>
      </div>
    </section>
  );
};

export default Skills;
