export type BuildingCategory = "religioso" | "civil" | "detalle" | "costumbrista";

export interface ImageSourceVariant {
  src: string;
  width: number;
}

export interface ImageAsset {
  src: string;
  alt: string;
  optimizedSources: ImageSourceVariant[];
}

export interface MaquetaFrontmatter {
  title: string;
  slug?: string;
  summary: string;
  municipality: string;
  province: string;
  buildingType: string;
  category: BuildingCategory;
  featured?: boolean;
  yearCreated?: number;
  dimensions?: string;
  scale?: string;
  materials?: string[];
  constructionTime?: string;
  tags?: string[];
  heroImage?: string;
  gallery?: string[];
  originalImage?: string;
  originalImageSource?: string;
  originalImageCaption?: string;
  originalStillExists?: boolean;
  mapQuery?: string;
  originalBuildingHistory?: string;
  sourceFolder?: string;
  legacySourceFolder?: string;
  legacySourceSubfolder?: string;
  legacySourceFolders?: string[];
}

export interface Maqueta extends MaquetaFrontmatter {
  slug: string;
  body: string;
  html: string;
  readingTimeText: string;
  galleryImages: ImageAsset[];
  coverImage?: ImageAsset;
  comparisonImage?: ImageAsset;
}

export interface BiographyFrontmatter {
  title: string;
  summary: string;
  birthplace?: string;
  yearOfBirth?: number;
  milestones?: string[];
  techniques?: string[];
  materials?: string[];
  process?: string[];
}

export interface Biography extends BiographyFrontmatter {
  body: string;
  html: string;
}

export interface CatalogueOptions {
  municipalities: string[];
  buildingTypes: string[];
  years: string[];
  provinces: string[];
}

export interface SiteStats {
  total: number;
  municipalities: number;
  religious: number;
  civil: number;
}