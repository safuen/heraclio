import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const templatePath = path.join(projectRoot, "content", "maquetas", "_plantilla.md");
const maquetasRoot = path.join(projectRoot, "content", "maquetas");
const publicImagesRoot = path.join(projectRoot, "public", "imagenes");

function readArgument(flag) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const slug = readArgument("--slug");
  const title = readArgument("--title") ?? "Nombre de la maqueta";
  const municipality = readArgument("--municipality") ?? "Municipio";
  const province = readArgument("--province") ?? "Provincia";
  const buildingType = readArgument("--type") ?? "Tipo de edificio";

  if (!slug) {
    console.error("Debe indicar un slug con --slug. Ejemplo: npm run create:maqueta -- --slug iglesia-san-martin");
    process.exitCode = 1;
    return;
  }

  const template = await fs.readFile(templatePath, "utf8");
  const fileContents = template
    .replaceAll("{{slug}}", slug)
    .replaceAll("{{title}}", title)
    .replaceAll("{{municipality}}", municipality)
    .replaceAll("{{province}}", province)
    .replaceAll("{{buildingType}}", buildingType);

  const targetMarkdown = path.join(maquetasRoot, `${slug}.md`);
  const targetImageFolder = path.join(publicImagesRoot, slug);

  await fs.writeFile(targetMarkdown, fileContents, { encoding: "utf8", flag: "wx" });
  await fs.mkdir(targetImageFolder, { recursive: true });

  console.log(`Creada la ficha ${slug} y la carpeta de imágenes correspondiente.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});