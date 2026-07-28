import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, "public", "imagenes");
const outputRoot = path.join(projectRoot, "public", "generated");
const manifestPath = path.join(outputRoot, "manifest.json");
const widths = [640, 960, 1280, 1600];
const formats = [
  { extension: "webp", options: { quality: 78 } },
  { extension: "avif", options: { quality: 62 } },
];
const fallbackQuality = 82;
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function isImageFile(fileName) {
  return imageExtensions.has(path.extname(fileName).toLowerCase());
}

async function ensureDirectory(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

async function shouldGenerate(sourceModifiedTime, outputPath) {
  try {
    const outputStat = await fs.stat(outputPath);
    return outputStat.mtimeMs < sourceModifiedTime;
  } catch {
    return true;
  }
}

async function listFilesRecursively(rootDirectory) {
  const result = [];
  const entries = await fs.readdir(rootDirectory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(rootDirectory, entry.name);
    if (entry.isDirectory()) {
      result.push(...(await listFilesRecursively(fullPath)));
      continue;
    }
    if (entry.isFile() && isImageFile(entry.name)) {
      result.push(fullPath);
    }
  }

  return result;
}

async function buildVariants(filePath) {
  const relativePath = path.relative(sourceRoot, filePath).replace(/\\/g, "/");
  const parsed = path.parse(relativePath);
  const outputDirectory = path.join(outputRoot, parsed.dir);
  const fallbackDirectory = path.join(outputRoot, parsed.dir);
  await ensureDirectory(outputDirectory);
  await ensureDirectory(fallbackDirectory);

  const image = sharp(filePath);
  const metadata = await image.metadata();
  const sourceStat = await fs.stat(filePath);
  const usableWidths = widths.filter((width) => !metadata.width || width < metadata.width).concat(metadata.width ?? widths.at(-1));
  const uniqueWidths = [...new Set(usableWidths)].filter(Boolean);
  const sources = [];
  let generated = 0;
  let reused = 0;

  for (const width of uniqueWidths) {
    for (const format of formats) {
      const fileName = `${parsed.name}-${width}.${format.extension}`;
      const outputPath = path.join(outputDirectory, fileName);
      if (await shouldGenerate(sourceStat.mtimeMs, outputPath)) {
        await sharp(filePath)
          .resize({ width, withoutEnlargement: true })
          .toFormat(format.extension, format.options)
          .toFile(outputPath);
        generated += 1;
      } else {
        reused += 1;
      }
      sources.push({ src: `/generated/${parsed.dir ? `${parsed.dir}/` : ""}${fileName}`.replace(/\/\//g, "/"), width });
    }
  }

  const fallbackName = `${parsed.name}-fallback.jpg`;
  const fallbackPath = path.join(fallbackDirectory, fallbackName);
  if (await shouldGenerate(sourceStat.mtimeMs, fallbackPath)) {
    await sharp(filePath)
      .resize({ width: uniqueWidths.at(-1), withoutEnlargement: true })
      .jpeg({ quality: fallbackQuality, mozjpeg: true })
      .toFile(fallbackPath);
    generated += 1;
  } else {
    reused += 1;
  }

  return {
    key: relativePath,
    value: {
      fallback: `/generated/${parsed.dir ? `${parsed.dir}/` : ""}${fallbackName}`.replace(/\/\//g, "/"),
      sources,
    },
    generated,
    reused,
  };
}

async function main() {
  await ensureDirectory(outputRoot);
  const files = await listFilesRecursively(sourceRoot).catch(() => []);
  const manifest = {};
  let generated = 0;
  let reused = 0;

  for (const filePath of files) {
    const result = await buildVariants(filePath);
    const { key, value } = result;
    manifest[key] = value;
    generated += result.generated;
    reused += result.reused;
  }

  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Optimización completada. Imágenes procesadas: ${files.length}. Variantes nuevas: ${generated}. Variantes reutilizadas: ${reused}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});