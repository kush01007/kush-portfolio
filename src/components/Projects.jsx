import {
  ArrowUpRight,
  Code2,
  ExternalLink,
  ImageIcon,
  Package,
  ShoppingCart,
  Smartphone,
  User,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { projects } from "../data/portfolioData";

const featureIcons = {
  User,
  Package,
  ShoppingCart,
  Smartphone,
};

const isValidHref = (href) => {
  return href && !href.includes("add-") && href !== "#";
};

const ProjectImage = ({ project, featured = false }) => {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={`${project.title} preview`}
        className={`h-full w-full rounded-lg ${
          featured
            ? "object-cover bg-[#F8FAFC]"
            : "object-cover"
        }`}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-lg border border-[#1F2937]/80 bg-[#070B10] ${
        featured
          ? "min-h-[230px] lg:min-h-[270px]"
          : "min-h-[180px] sm:min-h-[210px]"
      }`}
    >
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#1F2937]/90 bg-[#0A1017] text-[#9DB7D5]">
          <ImageIcon size={22} strokeWidth={1.6} />
        </div>

        <p className="mt-3 text-sm font-medium text-white">{project.title}</p>

        <p className="mt-1 text-xs text-white/40">
          {featured ? "Featured Project Preview" : "Project Preview"}
        </p>
      </div>
    </div>
  );
};

const TechPill = ({ children }) => {
  return (
    <span className="rounded-md border border-[#1F2937]/90 bg-[#080D13]/90 px-2.5 py-1 text-[11px] font-medium text-white/62 transition hover:border-[#9DB7D5]/30 hover:text-white sm:text-xs">
      {children}
    </span>
  );
};

const ProjectButton = ({ href, children, type = "live" }) => {
  const active = isValidHref(href);

  const activeClass =
    type === "live"
      ? "border-[#9DB7D5]/50 bg-[#0B1118] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-[#9DB7D5]/80 hover:bg-[#0F1722]"
      : "border-[#263241] bg-[#0A1017] text-white/86 hover:border-[#9DB7D5]/45 hover:bg-[#0D141C]";

  return (
    <a
      href={active ? href : undefined}
      target={active ? "_blank" : undefined}
      rel={active ? "noreferrer" : undefined}
      aria-disabled={!active}
      onClick={(event) => {
        if (!active) event.preventDefault();
      }}
      className={`inline-flex h-12 min-w-[145px] items-center justify-center gap-2.5 rounded-md border px-5 text-sm font-semibold tracking-[-0.01em] transition ${
        active
          ? activeClass
          : "cursor-not-allowed border-[#1F2937]/70 bg-[#080D13]/50 text-white/30"
      }`}
    >
      {children}
      {type === "github" ? (
        <FaGithub size={15} />
      ) : (
        <ExternalLink size={15} strokeWidth={1.8} />
      )}
    </a>
  );
};

const ProjectMiniButton = ({ href, label, type = "live" }) => {
  if (!isValidHref(href)) return null;

  const liveClass =
    type === "live"
      ? "border-[#9DB7D5]/40 bg-[#0B1118] text-white/88 hover:border-[#9DB7D5]/70 hover:bg-[#0F1722]"
      : "border-[#263241] bg-[#0A1017] text-white/76 hover:border-[#9DB7D5]/45 hover:bg-[#0D141C] hover:text-white";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-xs font-semibold transition ${liveClass}`}
    >
      {type === "github" ? "GitHub" : "Live"}
      {type === "github" ? (
        <FaGithub size={13} />
      ) : (
        <ExternalLink size={13} strokeWidth={1.7} />
      )}
    </a>
  );
};

const Projects = () => {
  const featuredProject = projects.find((project) => project.featured);
  const moreProjects = projects.filter((project) => !project.featured);

  if (!featuredProject) return null;

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-[#05080D] px-5 py-8 sm:px-7 lg:px-10 xl:px-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />

      <div className="relative z-10">
        <div className="mb-5">
          <div className="inline-flex items-center gap-2.5 rounded-lg border border-[#1F2937]/90 bg-[#080D13]/90 px-3.5 py-2 text-[13px] text-white/85">
            <span className="h-2 w-2 rounded-full bg-[#9DB7D5] shadow-[0_0_12px_rgba(157,183,213,0.8)]" />
            Projects
          </div>
        </div>

        {/* Featured Project */}
        <div className="rounded-2xl border border-[#1F2937]/80 bg-[#080D13]/75 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-5 lg:min-h-[370px] lg:p-7">
          <h3 className="mb-5 text-base font-semibold tracking-[-0.02em] text-white sm:text-lg">
            Featured Project
          </h3>

          <div className="grid gap-6 lg:min-h-[285px] lg:grid-cols-[1.32fr_1fr_0.72fr] lg:items-center xl:grid-cols-[1.45fr_1fr_0.72fr]">
            <div className="overflow-hidden rounded-xl border border-[#1F2937]/80 bg-[#070B10] p-2">
              <div className="aspect-[1919/900] overflow-hidden rounded-lg bg-[#F8FAFC] ">
                <ProjectImage project={featuredProject} featured />
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#1F2937]/90 bg-[#080D13]/90 text-sm font-medium text-white/70">
                  {featuredProject.number}
                </span>

                <div>
                  <h3 className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-white sm:text-[34px]">
                    {featuredProject.title}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-[#9DB7D5]/80 sm:text-base">
                    {featuredProject.type}
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-white/58 sm:text-base">
                {featuredProject.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {featuredProject.tech.map((tech) => (
                  <TechPill key={tech}>{tech}</TechPill>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:gap-3">
                <ProjectButton href={featuredProject.live} type="live">
                  Live Site
                </ProjectButton>

                <ProjectButton href={featuredProject.github} type="github">
                  GitHub
                </ProjectButton>
              </div>
            </div>

            <div className="border-t border-[#1F2937]/80 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              <div className="grid gap-4">
                {featuredProject.features?.map((feature) => {
                  const Icon = featureIcons[feature.icon] || Code2;

                  return (
                    <div key={feature.title} className="flex gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#1F2937]/90 bg-[#080D13]/90 text-[#9DB7D5]/80">
                        <Icon size={18} strokeWidth={1.55} />
                      </span>

                      <div>
                        <h4 className="text-sm font-semibold text-white/90">
                          {feature.title}
                        </h4>

                        <p className="mt-1 text-xs leading-5 text-white/50">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* More Projects */}
        <div className="mt-6">
          <h3 className="mb-4 text-xl font-semibold tracking-[-0.03em] text-white">
            More Projects
          </h3>

          <div className="grid gap-3 lg:grid-cols-3 xl:gap-4">
            {moreProjects.map((project) => (
              <article
                key={project.number}
                className="group h-full rounded-xl border border-[#1F2937]/80 bg-[#080D13]/75 p-2.5 backdrop-blur-xl transition hover:border-[#9DB7D5]/25 hover:bg-[#0B1118]/85 sm:p-3"
              >
                <div className="flex flex-col lg:grid lg:grid-cols-[0.9fr_1.1fr] gap-4">
                  <div className="overflow-hidden rounded-lg border border-[#1F2937]/80 bg-[#070B10] p-1 order-last lg:order-1">
                    <div className="aspect-[1919/900] overflow-hidden rounded-md">
                      <ProjectImage project={project} />
                    </div>
                  </div>

                  <div className="min-w-0 order-first lg:order-2 lg:mt-3.5">
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#1F2937]/90 bg-[#080D13]/90 text-xs font-medium text-white/65">
                        {project.number}
                      </span>

                      <div className="min-w-0">
                        <h4 className="text-[17px] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-lg">
                          {project.title}
                        </h4>

                        <p className="mt-1 text-xs font-medium text-[#9DB7D5]/70 sm:text-sm">
                          {project.type}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-[12px] leading-5 text-white/52 sm:text-sm sm:leading-6">
                      {project.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.tech.slice(0, 3).map((tech) => (
                        <TechPill key={tech}>{tech}</TechPill>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        <ProjectMiniButton
                          href={project.live}
                          label={`${project.title} live site`}
                          type="live"
                        />

                        <ProjectMiniButton
                          href={project.github}
                          label={`${project.title} GitHub`}
                          type="github"
                        />
                      </div>

                      <ArrowUpRight
                        size={18}
                        className="text-white/25 transition group-hover:text-[#9DB7D5]"
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
