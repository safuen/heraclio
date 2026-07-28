import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { marked } from "marked";
import readingTime from "reading-time";

import type {
  Biography,
  BiographyFrontmatter,
  CatalogueOptions,
  ImageAsset,
  ImageSourceVariant,
  Maqueta,
  MaquetaFrontmatter,
  SiteStats,
} from "@/lib/types";

marked.setOptions({
  breaks: true,
  gfm: true,
});

const projectRoot = process.cwd();
const contentRoot = path.join(projectRoot, "content");
const maquetasRoot = path.join(contentRoot, "maquetas");
const biographyPath = path.join(contentRoot, "biografia", "heraclio-rodriguez-garcia.md");
const publicImagesRoot = path.join(projectRoot, "public", "imagenes");
const generatedManifestPath = path.join(projectRoot, "public", "generated", "manifest.json");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

interface ImageManifestEntry {
  fallback: string;
  sources: ImageSourceVariant[];
}

type ImageManifest = Record<string, ImageManifestEntry>;

let maquetasPromise: Promise<Maqueta[]> | null = null;
let biographyPromise: Promise<Biography> | null = null;
let manifestPromise: Promise<ImageManifest> | null = null;

function isImageFile(fileName: string) {
  return imageExtensions.has(path.extname(fileName).toLowerCase());
}

function sortNaturally(values: string[]) {
  return values.sort((left, right) => left.localeCompare(right, "es", { numeric: true, sensitivity: "base" }));
}

function asArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item));
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function ensureHtml(markdown: string) {
  return marked.parse(markdown) as string;
}

async function readManifest() {
  if (!manifestPromise) {
    manifestPromise = fs
      .readFile(generatedManifestPath, "utf8")
      .then((file) => JSON.parse(file) as ImageManifest)
      .catch(() => ({}));
  }

  return manifestPromise;
}

async function listImageFiles(folderPath: string) {
  try {
    const entries = await fs.readdir(folderPath, { withFileTypes: true });

    return sortNaturally(
      entries
        .filter((entry) => entry.isFile() && isImageFile(entry.name))
        .map((entry) => entry.name),
    );
  } catch {
    return [];
  }
}

function toPublicImagePath(slug: string, fileName: string) {
  if (fileName.startsWith("/")) {
    return fileName;
  }

  return `/imagenes/${slug}/${fileName}`;
}

function hasImageFile(fileName: string, availableFiles: string[]) {
  return availableFiles.some((available) => available.toLowerCase() === fileName.toLowerCase());
}

function buildImageAsset(
  title: string,
  slug: string,
  fileName: string,
  index: number,
  manifest: ImageManifest,
  kind: "gallery" | "cover" | "original",
) {
  const resolvedPath = toPublicImagePath(slug, fileName);
  const manifestKey = `${slug}/${path.basename(fileName)}`;
  const manifestEntry = manifest[manifestKey];

  let alt = `Maqueta de ${title}, vista ${index + 1}.`;

  if (kind === "original") {
    alt = `Fotografía del edificio original de ${title}.`;
  }

  return {
    src: manifestEntry?.fallback ?? resolvedPath,
    alt,
    optimizedSources: manifestEntry?.sources ?? [],
  } satisfies ImageAsset;
}

async function parseMaqueta(filePath: string) {
  const manifest = await readManifest();
  const fileContents = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as MaquetaFrontmatter;
  const slug = frontmatter.slug ?? path.basename(filePath, path.extname(filePath));
  const folderImages = await listImageFiles(path.join(publicImagesRoot, slug));
  const declaredGallery = asArray(frontmatter.gallery);
  const galleryFiles = (declaredGallery.length > 0 ? declaredGallery : folderImages).filter((fileName) => hasImageFile(fileName, folderImages));
  const originalFile = frontmatter.originalImage && hasImageFile(frontmatter.originalImage, folderImages) ? frontmatter.originalImage : undefined;
  const filteredGallery = galleryFiles.filter((fileName) => fileName !== originalFile);
  const galleryImages = filteredGallery.map((fileName, index) =>
    buildImageAsset(frontmatter.title, slug, fileName, index, manifest, "gallery"),
  );

  const declaredHero = frontmatter.heroImage && hasImageFile(frontmatter.heroImage, folderImages) ? frontmatter.heroImage : undefined;
  const coverFile = declaredHero ?? filteredGallery[0];
  const coverImage = coverFile
    ? buildImageAsset(frontmatter.title, slug, coverFile, 0, manifest, "cover")
    : undefined;

  const comparisonImage = originalFile
    ? buildImageAsset(frontmatter.title, slug, originalFile, 0, manifest, "original")
    : undefined;

  return {
    ...frontmatter,
    slug,
    body: content,
    html: ensureHtml(content),
    readingTimeText: readingTime(content).text,
    galleryImages,
    coverImage,
    comparisonImage,
    materials: asArray(frontmatter.materials),
    tags: asArray(frontmatter.tags),
  } satisfies Maqueta;
}

export async function getAllMaquetas() {
  if (!maquetasPromise) {
    maquetasPromise = fs
      .readdir(maquetasRoot, { withFileTypes: true })
      .then((entries) =>
        entries
          .filter(
            (entry) =>
              entry.isFile() &&
              !entry.name.startsWith("_") &&
              [".md", ".mdx"].includes(path.extname(entry.name).toLowerCase()),
          )
          .map((entry) => path.join(maquetasRoot, entry.name)),
      )
      .then((files) => Promise.all(files.map((file) => parseMaqueta(file))))
      .then((items) =>
        items.sort((left, right) => {
          if (left.featured !== right.featured) {
            return left.featured ? -1 : 1;
          }

          if (left.yearCreated && right.yearCreated && left.yearCreated !== right.yearCreated) {
            return right.yearCreated - left.yearCreated;
          }

          return left.title.localeCompare(right.title, "es", { sensitivity: "base" });
        }),
      )
      .catch(() => []);
  }

  return maquetasPromise;
}

export async function getFeaturedMaquetas(limit = 6) {
  const maquetas = await getAllMaquetas();
  return maquetas.filter((maqueta) => maqueta.featured).slice(0, limit);
}

export async function getMaquetaBySlug(slug: string) {
  const maquetas = await getAllMaquetas();
  return maquetas.find((maqueta) => maqueta.slug === slug);
}

export async function getCatalogueOptions() {
  const maquetas = await getAllMaquetas();

  return {
    municipalities: sortNaturally([...new Set(maquetas.map((maqueta) => maqueta.municipality).filter(Boolean))]),
    buildingTypes: sortNaturally([...new Set(maquetas.map((maqueta) => maqueta.buildingType).filter(Boolean))]),
    years: sortNaturally(
      [...new Set(maquetas.map((maqueta) => maqueta.yearCreated).filter(Boolean).map((year) => String(year)))],
    ),
    provinces: sortNaturally([...new Set(maquetas.map((maqueta) => maqueta.province).filter(Boolean))]),
  } satisfies CatalogueOptions;
}

export async function getSiteStats() {
  const maquetas = await getAllMaquetas();

  return {
    total: maquetas.length,
    municipalities: new Set(maquetas.map((maqueta) => maqueta.municipality)).size,
    religious: maquetas.filter((maqueta) => maqueta.category === "religioso").length,
    civil: maquetas.filter((maqueta) => maqueta.category === "civil").length,
  } satisfies SiteStats;
}

export async function getBiography() {
  if (!biographyPromise) {
    biographyPromise = fs
      .readFile(biographyPath, "utf8")
      .then((fileContents) => {
        const { data, content } = matter(fileContents);
        const frontmatter = data as BiographyFrontmatter;

        return {
          ...frontmatter,
          milestones: asArray(frontmatter.milestones),
          techniques: asArray(frontmatter.techniques),
          materials: asArray(frontmatter.materials),
          process: asArray(frontmatter.process),
          body: content,
          html: ensureHtml(content),
        } satisfies Biography;
      })
      .catch(() => ({
        title: "Heraclio Rodríguez García",
        summary: "Biografía pendiente de completar.",
        milestones: [],
        techniques: [],
        materials: [],
        process: [],
        body: "",
        html: "",
      }));
  }

  return biographyPromise;
}