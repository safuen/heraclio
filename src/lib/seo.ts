import siteConfig from "@/site.config";
import type { Maqueta } from "@/lib/types";

export function absoluteUrl(pathname: string) {
  return new URL(pathname.replace(/^\/+/, ""), `${siteConfig.url}${siteConfig.repositoryPath}/`).toString();
}

export function buildPageTitle(title?: string) {
  if (!title || title === siteConfig.title) {
    return siteConfig.title;
  }

  return `${title} | ${siteConfig.shortTitle}`;
}

export function buildMaquetaDescription(maqueta: Maqueta) {
  return (
    maqueta.summary ||
    `${maqueta.title}, maqueta artesanal en madera vinculada a ${maqueta.municipality}, ${maqueta.province}.`
  );
}

export function buildCollectionSchema(total: number) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl("/catalogo"),
    about: {
      "@type": "Thing",
      name: "Maquetas artesanales de patrimonio histórico",
    },
    numberOfItems: total,
    publisher: {
      "@type": "Person",
      name: siteConfig.author,
    },
  };
}

export function buildMaquetaSchema(maqueta: Maqueta) {
  return {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    name: maqueta.title,
    description: buildMaquetaDescription(maqueta),
    url: absoluteUrl(`/maquetas/${maqueta.slug}`),
    artMedium: "Madera",
    creator: {
      "@type": "Person",
      name: siteConfig.author,
    },
    contentLocation: {
      "@type": "Place",
      name: `${maqueta.municipality}, ${maqueta.province}`,
    },
    image: [maqueta.coverImage?.src, maqueta.comparisonImage?.src]
      .filter(Boolean)
      .map((image) => absoluteUrl(image as string)),
    keywords: [maqueta.buildingType, maqueta.municipality, maqueta.province, ...(maqueta.tags ?? [])],
  };
}