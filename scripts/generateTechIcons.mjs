import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  siExpress,
  siGithub,
  siJavascript,
  siMongodb,
  siNodedotjs,
  siReact,
  siTailwindcss,
  siVercel,
} from "simple-icons";

const icons = [
  ["react", siReact],
  ["javascript", siJavascript],
  ["tailwind", siTailwindcss],
  ["node", siNodedotjs],
  ["express", siExpress],
  ["mongodb", siMongodb],
  ["github", siGithub],
  ["vercel", siVercel],
];

const outputDirectory = path.resolve("public", "tech-icons");
await mkdir(outputDirectory, { recursive: true });

await Promise.all(
  icons.map(async ([fileName, icon]) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="#D6E5F4" d="${icon.path}" />
      </svg>
    `;

    await writeFile(path.join(outputDirectory, `${fileName}.svg`), svg.trim());

    await sharp(Buffer.from(svg))
      .resize(384, 384, { fit: "contain" })
      .extend({
        top: 64,
        bottom: 64,
        left: 64,
        right: 64,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(path.join(outputDirectory, `${fileName}.png`));
  }),
);
