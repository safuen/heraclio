import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const projectRoot = process.cwd();
const workspaceRoot = path.resolve(projectRoot, "..");
const sourceRoot = path.join(workspaceRoot, "FichasNuevas");
const contentRoot = path.join(projectRoot, "content", "maquetas");
const imagesRoot = path.join(projectRoot, "public", "imagenes");

const skipFolders = new Set(["noticias-reconocimientos", "taller-y-exposiciones"]);

const folderTargetMap = {
  "3columnas": "tres-columnas-ciudad-rodrigo",
  "campanario-iglesia-pizarrales-salamanca": "campanario-iglesia-pizarrales",
  "fachada-colegio-arzobispo-fonseca": "fachada-colegio-fonseca",
  "fachada-convento-las-bernardas-salamanca": "portada-de-las-bernardas",
  "fachada-iglesia-san-pablo": "portada-iglesia-san-pablo",
  "iglesia-el-cubo-de-don-sancho": "iglesia-cubo-don-sancho",
  "maleta-de-madera-teatro": "teatro-maleta-madera",
  "portada-palacio-anaya": "fachada-palacio-anaya",
  "portales-plaza-san-roman": "portico-iglesia-san-roman",
  "ermita-buenamadre-salamanca": "ermita-nuestra-senora-remedios-buenamadre",
  "iglesia-buenamadre": "ermita-nuestra-senora-remedios-buenamadre",
  "ventana-del-santuario-de-ta-pinu-en-la-isla-de-soto-malta": "ventana-santuario-ta-pinu",
  "ventana-universidad-cuzco": "ventana-universidad-cusco",
  "portales-iglesia-dejaramillo-de-la fuente-burgos": "portales-iglesia-jaramillo-de-la-fuente",
  "fachada-san-benito-salamanca": "portada-iglesia-san-benito-salamanca",
  "casas-de-munecas": "casa-de-munecas",
  "juguetes-y-caballitos": "juguetilandia-de-alba",
  "otros-muebles-utiles": "muebles-y-utiles-de-madera",
  "portada-iglesia-san-martin": "puerta-romanica-san-martin",
  "ventana-abside-iglesia-san-pelayo-de-ayega-burgos": "ventana-abside-iglesia-san-pelayo-de-ayega",
  "ventana-iglesia-cristo-rey-de-pasto-colombia": "ventana-iglesia-cristo-rey-pasto",
  "ventana-iglesia-san-miguel-tubilla-del agua-burgos": "ventana-iglesia-san-miguel-tubilla-del-agua",
  "torre-del-clavero-salamanca": "torre-del-clavero-salamanca",
  "torre-reloj-boada": "torre-reloj-boada",
  "bueyes-san-isidro-santa-olalla": "bueyes-san-isidro-santa-olalla",
  "fachada-casa-de-perena-de-la-rivera": "fachada-casa-perena-de-la-ribera",
  "fachada-casa-maria-la-brava": "fachada-casa-dona-maria-la-brava",
  "ventanas-casa-de-las-muertes-salamanca": "ventana-casa-de-las-muertes",
};

const titleOverrides = {
  "tres-columnas-ciudad-rodrigo": "Tres columnas de Ciudad Rodrigo",
  "animales-con-pinas": "Animales con piñas",
  "aperos-de-labranza": "Aperos de labranza",
  "bueyes-san-isidro-santa-olalla": "Bueyes de San Isidro en Santa Olalla",
  "carro-con-bueyes": "Carro con bueyes",
  "casa-de-munecas": "Casa de muñecas",
  "coches-y-motos-antiguos": "Coches y motos antiguos",
  "colegio-huerfanos-salamanca": "Antiguo Colegio de Huérfanos",
  "fachada-casa-perena-de-la-ribera": "Fachada de una casa de Pereña de la Ribera",
  "fachada-casa-dona-maria-la-brava": "Fachada de la Casa de Doña María la Brava",
  "fachada-iglesia-cuerva-toledo": "Fachada de la iglesia de Cuerva",
  "fachada-iglesia-san-martin": "Fachada renacentista de la iglesia de San Martín",
  "iglesia-boada": "Iglesia de Boada",
  "iglesia-san-marcos-salamanca": "Iglesia de San Marcos",
  "juego-de-la-rana": "Juego de la rana",
  "juguetilandia-de-alba": "Juguetilandia de Alba",
  "maleta-madera-lago": "Maleta de madera con lago y cisnes",
  "muebles-y-utiles-de-madera": "Muebles y útiles de madera",
  "palacio-monterrey": "Palacio de Monterrey",
  "portada-capilla-iglesia-fuentiduena": "Portada de la capilla de la iglesia de Fuentidueña",
  "portada-casa-maldonados": "Portada de la Casa de los Maldonados",
  "portada-convento-san-juan-fuentiduena": "Portada del convento de San Juan de Fuentidueña",
  "portada-iglesia-san-benito-salamanca": "Portada de la iglesia de San Benito",
  "portada-iglesia-san-miguel-penaranda-de-bracamonte": "Portada de la iglesia de San Miguel de Peñaranda de Bracamonte",
  "portales-iglesia-jaramillo-de-la-fuente": "Portales de la iglesia de Jaramillo de la Fuente",
  "puerta-escuelas-menores-salamanca": "Puerta de las Escuelas Menores",
  "torre-del-clavero-salamanca": "Torre del Clavero",
  "torre-reloj-boada": "Reloj de Boada",
  "veleta": "Veleta",
  "ventana-abside-iglesia-san-pelayo-de-ayega": "Ventana del ábside de la iglesia de San Pelayo de Ayega",
  "ventana-casa-de-las-conchas": "Ventana de la Casa de las Conchas",
  "ventana-con-visillos": "Ventana con visillos",
  "ventana-iglesia-convento-clarisas": "Ventana de la iglesia del convento de las Clarisas",
  "ventana-iglesia-cristo-rey-pasto": "Ventana de la iglesia de Cristo Rey de Pasto",
  "ventana-iglesia-san-juan-de-sahagun": "Ventana de la iglesia de San Juan de Sahagún",
  "ventana-iglesia-san-miguel-tubilla-del-agua": "Ventana de la iglesia de San Miguel de Tubilla del Agua",
  "ventana-palacio-de-abrantes": "Ventana gótica del Palacio de Abrantes",
  "ventana-san-martin-fuentiduena": "Ventana de la iglesia de San Martín de Fuentidueña",
  "ventana-santuario-ta-pinu": "Ventana del santuario de Ta' Pinu",
  "ventana-universidad-cusco": "Ventana de la Universidad de Cusco",
};

const metaOverrides = {
  "animales-con-pinas": {
    buildingType: "Pieza decorativa",
    category: "costumbrista",
    description: "La nueva carpeta reúne una pequeña serie de figuras y composiciones de madera con un enfoque lúdico y ornamental.",
  },
  "aperos-de-labranza": {
    buildingType: "Escena tradicional",
    category: "costumbrista",
    description: "La pieza agrupa aperos de labranza, útiles de trabajo y referencias al mundo rural vinculadas a la memoria agrícola castellana.",
  },
  "bueyes-san-isidro-santa-olalla": {
    municipality: "Santa Olalla de Yeltes",
    province: "Salamanca",
    buildingType: "Escena tradicional",
    category: "costumbrista",
    description: "La carpeta documenta una escena vinculada a San Isidro y al imaginario popular de Santa Olalla de Yeltes.",
  },
  "carro-con-bueyes": {
    buildingType: "Escena tradicional",
    category: "costumbrista",
    description: "La maqueta se centra en un carro con bueyes y prolonga la serie del autor dedicada a útiles, carros y escenas de trabajo tradicional.",
  },
  "casa-de-munecas": {
    buildingType: "Casa de muñecas",
    category: "costumbrista",
    description: "La nueva carpeta amplía la documentación visual de una casa de muñecas trabajada como pieza doméstica y decorativa en madera.",
  },
  "coches-y-motos-antiguos": {
    buildingType: "Colección temática",
    category: "costumbrista",
    description: "La serie reúne vehículos antiguos reproducidos en madera como parte del repertorio costumbrista y lúdico del autor.",
  },
  "colegio-huerfanos-salamanca": {
    municipality: "Salamanca",
    province: "Salamanca",
    buildingType: "Colegio histórico",
    category: "civil",
  },
  "fachada-casa-perena-de-la-ribera": {
    municipality: "Pereña de la Ribera",
    province: "Salamanca",
    buildingType: "Fachada histórica",
    category: "civil",
  },
  "fachada-casa-dona-maria-la-brava": {
    municipality: "Salamanca",
    province: "Salamanca",
    buildingType: "Fachada histórica",
    category: "civil",
  },
  "fachada-iglesia-cuerva-toledo": {
    municipality: "Cuerva",
    province: "Toledo",
    buildingType: "Fachada de iglesia",
    category: "religioso",
  },
  "fachada-iglesia-san-martin": {
    municipality: "Salamanca",
    province: "Salamanca",
    buildingType: "Fachada de iglesia",
    category: "religioso",
  },
  "iglesia-boada": {
    municipality: "Boada",
    province: "Salamanca",
    buildingType: "Iglesia",
    category: "religioso",
  },
  "iglesia-san-marcos-salamanca": {
    municipality: "Salamanca",
    province: "Salamanca",
    buildingType: "Iglesia",
    category: "religioso",
  },
  "juego-de-la-rana": {
    buildingType: "Juego tradicional",
    category: "costumbrista",
    description: "La ficha incorpora imágenes de una pieza vinculada al juego tradicional de la rana y un enlace documental de referencia.",
  },
  "juguetilandia-de-alba": {
    municipality: "Alba de Tormes",
    province: "Salamanca",
    buildingType: "Colección lúdica",
    category: "costumbrista",
    description: "La carpeta combina juguetes de madera, caballitos, pequeños vehículos y un vídeo enlazado que amplía la documentación audiovisual de la serie.",
  },
  "maleta-madera-lago": {
    buildingType: "Escena portátil",
    category: "costumbrista",
    description: "La pieza se resuelve como una escena portátil de madera en torno a un lago y motivos ornamentales relacionados.",
  },
  "muebles-y-utiles-de-madera": {
    buildingType: "Colección doméstica",
    category: "costumbrista",
    description: "La nueva carpeta agrupa revisteros, pequeños muebles, útiles domésticos y piezas decorativas trabajadas en miniatura.",
  },
  "palacio-monterrey": {
    municipality: "Salamanca",
    province: "Salamanca",
    buildingType: "Palacio histórico",
    category: "civil",
    description: "El dosier lo identifica con el Palacio de Monterrey, ejemplo del plateresco salmantino asociado a Rodrigo Gil de Hontañón y al linaje de los condes de Monterrey.",
  },
  "portada-capilla-iglesia-fuentiduena": {
    municipality: "Fuentidueña",
    province: "Segovia",
    buildingType: "Portada religiosa",
    category: "religioso",
  },
  "portada-casa-maldonados": {
    municipality: "Salamanca",
    province: "Salamanca",
    buildingType: "Portada civil",
    category: "civil",
  },
  "portada-convento-san-juan-fuentiduena": {
    municipality: "Fuentidueña",
    province: "Segovia",
    buildingType: "Portada conventual",
    category: "religioso",
  },
  "portada-iglesia-san-benito-salamanca": {
    municipality: "Salamanca",
    province: "Salamanca",
    buildingType: "Portada religiosa",
    category: "religioso",
  },
  "portada-iglesia-san-miguel-penaranda-de-bracamonte": {
    municipality: "Peñaranda de Bracamonte",
    province: "Salamanca",
    buildingType: "Portada religiosa",
    category: "religioso",
  },
  "portales-iglesia-jaramillo-de-la-fuente": {
    municipality: "Jaramillo de la Fuente",
    province: "Burgos",
    buildingType: "Portales de iglesia",
    category: "religioso",
  },
  "puerta-escuelas-menores-salamanca": {
    municipality: "Salamanca",
    province: "Salamanca",
    buildingType: "Puerta histórica",
    category: "civil",
  },
  "torre-del-clavero-salamanca": {
    municipality: "Salamanca",
    province: "Salamanca",
    buildingType: "Torre histórica",
    category: "civil",
  },
  "torre-reloj-boada": {
    municipality: "Boada",
    province: "Salamanca",
    buildingType: "Torre y reloj",
    category: "civil",
  },
  "veleta": {
    buildingType: "Pieza decorativa",
    category: "costumbrista",
  },
  "ventana-abside-iglesia-san-pelayo-de-ayega": {
    municipality: "Ayega",
    province: "Burgos",
    buildingType: "Ventana religiosa",
    category: "religioso",
  },
  "ventana-casa-de-las-conchas": {
    municipality: "Salamanca",
    province: "Salamanca",
    buildingType: "Detalle arquitectónico",
    category: "civil",
  },
  "ventana-con-visillos": {
    buildingType: "Detalle decorativo",
    category: "detalle",
  },
  "ventana-iglesia-convento-clarisas": {
    municipality: "Salamanca",
    province: "Salamanca",
    buildingType: "Ventana religiosa",
    category: "religioso",
  },
  "ventana-iglesia-cristo-rey-pasto": {
    municipality: "Pasto",
    province: "Colombia",
    buildingType: "Ventana religiosa",
    category: "religioso",
  },
  "ventana-iglesia-san-juan-de-sahagun": {
    municipality: "Salamanca",
    province: "Salamanca",
    buildingType: "Ventana religiosa",
    category: "religioso",
  },
  "ventana-iglesia-san-miguel-tubilla-del-agua": {
    municipality: "Tubilla del Agua",
    province: "Burgos",
    buildingType: "Ventana religiosa",
    category: "religioso",
  },
  "ventana-palacio-de-abrantes": {
    municipality: "Salamanca",
    province: "Salamanca",
    buildingType: "Ventana histórica",
    category: "civil",
  },
  "ventana-san-martin-fuentiduena": {
    municipality: "Fuentidueña",
    province: "Segovia",
    buildingType: "Ventana religiosa",
    category: "religioso",
  },
  "ventana-santuario-ta-pinu": {
    municipality: "Gozo",
    province: "Malta",
    buildingType: "Ventana religiosa",
    category: "religioso",
  },
  "ventana-universidad-cusco": {
    municipality: "Cusco",
    province: "Perú",
    buildingType: "Ventana histórica",
    category: "civil",
  },
  "plaza-mayor-la-fuente-de-san-esteban": {
    description: "El dosier la relaciona con el antiguo ayuntamiento y el reloj de la Plaza Mayor de La Fuente de San Esteban, pieza central del archivo local del autor.",
  },
};

const fileOrder = [
  "slug",
  "title",
  "municipality",
  "province",
  "buildingType",
  "category",
  "summary",
  "featured",
  "yearCreated",
  "dimensions",
  "scale",
  "materials",
  "constructionTime",
  "tags",
  "heroImage",
  "gallery",
  "videos",
  "videoLinks",
  "originalImage",
  "originalImageSource",
  "originalImageCaption",
  "originalStillExists",
  "mapQuery",
  "originalBuildingHistory",
  "sourceFolder",
  "legacySourceFolders",
];

function normalizeValue(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function lowerFirst(value) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function humanizeSlug(slug) {
  const stopWords = new Set(["de", "del", "la", "las", "el", "los", "y", "en"]);

  return slug
    .split("-")
    .filter(Boolean)
    .map((word, index) => {
      if (index > 0 && stopWords.has(word)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function inferLocation(slug) {
  const checks = [
    ["salamanca", { municipality: "Salamanca", province: "Salamanca" }],
    ["ciudad-rodrigo", { municipality: "Ciudad Rodrigo", province: "Salamanca" }],
    ["la-fuente-de-san-esteban", { municipality: "La Fuente de San Esteban", province: "Salamanca" }],
    ["boada", { municipality: "Boada", province: "Salamanca" }],
    ["fuentiduena", { municipality: "Fuentidueña", province: "Segovia" }],
    ["cubo-don-sancho", { municipality: "El Cubo de Don Sancho", province: "Salamanca" }],
    ["tamames", { municipality: "Tamames", province: "Salamanca" }],
    ["villares-de-yeltes", { municipality: "Villares de Yeltes", province: "Salamanca" }],
    ["ituero-de-huebra", { municipality: "Ituero de Huebra", province: "Salamanca" }],
    ["ayega", { municipality: "Ayega", province: "Burgos" }],
    ["tubilla-del-agua", { municipality: "Tubilla del Agua", province: "Burgos" }],
    ["jaramillo", { municipality: "Jaramillo de la Fuente", province: "Burgos" }],
    ["cuerva", { municipality: "Cuerva", province: "Toledo" }],
    ["cusco", { municipality: "Cusco", province: "Perú" }],
    ["pasto", { municipality: "Pasto", province: "Colombia" }],
    ["ta-pinu", { municipality: "Gozo", province: "Malta" }],
    ["perena", { municipality: "Pereña de la Ribera", province: "Salamanca" }],
    ["buenamadre", { municipality: "Buenamadre", province: "Salamanca" }],
    ["penaranda-de-bracamonte", { municipality: "Peñaranda de Bracamonte", province: "Salamanca" }],
    ["santa-olalla", { municipality: "Santa Olalla de Yeltes", province: "Salamanca" }],
    ["monleon", { municipality: "Monleón", province: "Salamanca" }],
  ];

  for (const [fragment, location] of checks) {
    if (slug.includes(fragment)) {
      return location;
    }
  }

  return { municipality: "La Fuente de San Esteban", province: "Salamanca" };
}

function inferType(slug, title) {
  if (/^(iglesia|catedral|ermita)/.test(slug)) {
    return { buildingType: title.split(" ")[0], category: "religioso" };
  }

  if (/^(portada|portales|puerta|ventana|campanario|fachada|portico|torre|tres-columnas)/.test(slug)) {
    return { buildingType: "Detalle arquitectónico", category: "detalle" };
  }

  if (/^(plaza|ayuntamiento|casa|palacio|colegio|acueducto|castillo)/.test(slug)) {
    return { buildingType: "Edificio histórico", category: "civil" };
  }

  return { buildingType: "Escena tradicional", category: "costumbrista" };
}

function buildSummary(frontmatter) {
  if (frontmatter.summary) {
    return frontmatter.summary;
  }

  const plainTitle = lowerFirst(frontmatter.title);

  if (frontmatter.category === "detalle") {
    return `Detalle en madera de ${plainTitle}.`;
  }

  if (frontmatter.category === "costumbrista") {
    return `Pieza artesanal en madera dedicada a ${plainTitle}.`;
  }

  return `Maqueta en madera de ${plainTitle}.`;
}

function buildBody(frontmatter, description, hasOriginalImage) {
  const paragraphs = [
    `Ficha incorporada o revisada a partir del nuevo lote de imágenes clasificado en la carpeta ${frontmatter.sourceFolder ?? frontmatter.slug}.`,
    description ?? `La nueva documentación visual amplía el inventario público de ${frontmatter.title.toLowerCase()} y mejora la representación de la obra dentro del catálogo digital.`,
  ];

  if (hasOriginalImage) {
    paragraphs.push("La carpeta incluye además una imagen del original o del referente arquitectónico representado, de modo que la ficha pueda compararlo con la obra en madera.");
  }

  return `${paragraphs.join("\n\n")}\n`;
}

function orderFrontmatter(frontmatter) {
  const ordered = {};

  for (const key of fileOrder) {
    const value = frontmatter[key];
    if (value === undefined || value === null) {
      continue;
    }
    if (Array.isArray(value) && value.length === 0) {
      continue;
    }
    if (typeof value === "string" && value.trim() === "") {
      continue;
    }
    ordered[key] = value;
  }

  return ordered;
}

async function listFiles(folderPath) {
  try {
    const entries = await fs.readdir(folderPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
  } catch {
    return [];
  }
}

function isOriginalCandidate(fileName) {
  return /^original/i.test(fileName);
}

function isPlaceholderBody(body) {
  const normalized = body.replace(/\s+/g, " ").trim().toLowerCase();
  return normalized.startsWith("obra incluida en el inventario histórico") || normalized.includes("la documentación disponible en el archivo local no aporta");
}

async function ensureDir(folderPath) {
  await fs.mkdir(folderPath, { recursive: true });
}

async function copyFolderFiles(sourceFolderName, targetSlug) {
  const sourceFolder = path.join(sourceRoot, sourceFolderName);
  const targetFolder = path.join(imagesRoot, targetSlug);
  const files = await listFiles(sourceFolder);

  await ensureDir(targetFolder);

  for (const fileName of files) {
    await fs.copyFile(path.join(sourceFolder, fileName), path.join(targetFolder, fileName));
  }

  return files;
}

async function loadFolderDefinitions() {
  const entries = await fs.readdir(sourceRoot, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort((left, right) => left.localeCompare(right, "es", { sensitivity: "base" }));
}

async function upsertMaqueta(folderName) {
  const folderKey = normalizeValue(folderName);
  if (skipFolders.has(folderKey)) {
    return null;
  }

  const targetSlug = folderTargetMap[folderKey] ?? folderKey;
  const copiedFiles = await copyFolderFiles(folderName, targetSlug);
  const markdownPath = path.join(contentRoot, `${targetSlug}.md`);
  const currentExists = await fs.access(markdownPath).then(() => true).catch(() => false);
  const current = currentExists ? matter(await fs.readFile(markdownPath, "utf8")) : { data: {}, content: "" };
  const data = current.data ?? {};
  const override = metaOverrides[targetSlug] ?? {};
  const title = titleOverrides[targetSlug] ?? data.title ?? humanizeSlug(targetSlug);
  const location = { ...inferLocation(targetSlug), ...override };
  const inferredType = inferType(targetSlug, title);
  const targetFolder = path.join(imagesRoot, targetSlug);
  const mergedFiles = await listFiles(targetFolder);
  const originalImage = override.originalImage ?? mergedFiles.find((fileName) => isOriginalCandidate(fileName)) ?? data.originalImage;
  const frontmatter = {
    ...data,
    slug: targetSlug,
    title,
    municipality: override.municipality ?? data.municipality ?? location.municipality,
    province: override.province ?? data.province ?? location.province,
    buildingType: override.buildingType ?? data.buildingType ?? inferredType.buildingType,
    category: override.category ?? data.category ?? inferredType.category,
    summary: override.summary ?? data.summary,
    featured: data.featured ?? false,
    materials: data.materials ?? ["madera"],
    tags: data.tags ?? ["patrimonio"],
    sourceFolder: folderName,
    legacySourceFolders: data.legacySourceFolders ?? undefined,
    originalImage,
    originalStillExists: data.originalStillExists ?? Boolean(originalImage && (override.category ?? data.category ?? inferredType.category) !== "costumbrista"),
    mapQuery: override.mapQuery ?? data.mapQuery,
  };

  if (originalImage && !frontmatter.mapQuery && frontmatter.category !== "costumbrista") {
    frontmatter.mapQuery = `${frontmatter.title} ${frontmatter.municipality}`;
  }

  frontmatter.summary = buildSummary(frontmatter);

  const shouldReplaceBody = !current.content.trim() || isPlaceholderBody(current.content) || Boolean(override.description && !current.content.trim());
  const body = shouldReplaceBody ? buildBody(frontmatter, override.description, Boolean(originalImage)) : current.content;

  await fs.writeFile(markdownPath, matter.stringify(body, orderFrontmatter(frontmatter)), "utf8");

  return {
    folderName,
    targetSlug,
    created: !currentExists,
    copiedFiles: copiedFiles.length,
  };
}

async function main() {
  const folders = await loadFolderDefinitions();
  const results = [];

  for (const folderName of folders) {
    const result = await upsertMaqueta(folderName);
    if (result) {
      results.push(result);
    }
  }

  console.log(`Sincronizadas ${results.length} carpetas de FichasNuevas.`);
  for (const result of results) {
    const action = result.created ? "creada" : "actualizada";
    console.log(`- ${result.folderName} -> ${result.targetSlug} (${action}, ${result.copiedFiles} archivos copiados)`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});