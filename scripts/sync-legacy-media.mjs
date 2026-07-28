import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

const projectRoot = process.cwd();
const contentRoot = path.join(projectRoot, "content", "maquetas");
const legacyRoot = path.resolve(projectRoot, "..", "FOTOS");
const outputRoot = path.join(projectRoot, "public", "imagenes");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function isImageFile(fileName) {
  return imageExtensions.has(path.extname(fileName).toLowerCase());
}

async function ensureDirectory(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

async function copyDirectoryFiles(sourceRoot, targetRoot) {
  const entries = await fs.readdir(sourceRoot, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceRoot, entry.name);
    const targetPath = path.join(targetRoot, entry.name);

    if (entry.isDirectory()) {
      await copyDirectoryFiles(sourcePath, targetRoot);
      continue;
    }

    if (!entry.isFile() || !isImageFile(entry.name)) {
      continue;
    }

    try {
      await fs.access(targetPath);
    } catch {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

async function syncEntry(fileName) {
  const filePath = path.join(contentRoot, fileName);
  const rawFile = await fs.readFile(filePath, "utf8");
  const { data } = matter(rawFile);
  const slug = data.slug || path.basename(fileName, path.extname(fileName));
  const sourceFolders = Array.isArray(data.legacySourceFolders) ? data.legacySourceFolders : [];

  if (sourceFolders.length === 0) {
    return { slug, copied: 0 };
  }

  const targetFolder = path.join(outputRoot, slug);
  await ensureDirectory(targetFolder);
  const before = await fs.readdir(targetFolder).catch(() => []);

  for (const relativeFolder of sourceFolders) {
    const sourcePath = path.join(legacyRoot, relativeFolder);
    try {
      await fs.access(sourcePath);
      await copyDirectoryFiles(sourcePath, targetFolder);
    } catch {
      // Ignore missing folders so the script can be rerun while the archive is still being curated.
    }
  }

  const after = await fs.readdir(targetFolder).catch(() => []);
  return { slug, copied: Math.max(0, after.length - before.length) };
}

async function main() {
  await ensureDirectory(outputRoot);
  const entries = (await fs.readdir(contentRoot)).filter((name) => name.endsWith(".md") && !name.startsWith("_"));
  const results = [];

  for (const entry of entries) {
    results.push(await syncEntry(entry));
  }

  const copiedTotal = results.reduce((total, item) => total + item.copied, 0);
  console.log(`Sincronización completada. Archivos añadidos: ${copiedTotal}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});