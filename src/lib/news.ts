export interface NewsItem {
  slug: string;
  title: string;
  year: number;
  summary: string;
  note: string;
  image?: string;
  links?: Array<{
    label: string;
    href: string;
  }>;
}

export const newsItems: NewsItem[] = [
  {
    slug: "cabrillas-2026",
    title: "Exposicion de arquitectura en madera en Cabrillas",
    year: 2026,
    summary: "Material de difusion asociado a una exposicion de maquetas conservado en el archivo del proyecto.",
    note: "Entrada elaborada a partir de la documentacion local conservada para 2026.",
    image: "/noticias/cabrillas-2026/cartel-cabrillas-2026.png",
    links: [{ label: "Ver cartel", href: "/noticias/cabrillas-2026/cartel-cabrillas-2026.png" }],
  },
  {
    slug: "exposicion-arquitectura-madera-2026",
    title: "Exposicion de arquitectura en madera 2026",
    year: 2026,
    summary: "Carteleria de una actividad publica vinculada a la coleccion y a la difusion del trabajo artesanal.",
    note: "La referencia procede del archivo local de materiales graficos del proyecto.",
    image: "/noticias/exposicion-2026/cartel-exposicion-arquitectura-madera-2026.png",
    links: [{ label: "Ver cartel", href: "/noticias/exposicion-2026/cartel-exposicion-arquitectura-madera-2026.png" }],
  },
  {
    slug: "boada-2024",
    title: "Boada 2024",
    year: 2024,
    summary: "Archivo de documentacion y materiales de prensa relacionados con la presencia publica de las maquetas en Boada.",
    note: "La entrada resume materiales locales conservados en PDF, imagen y documentacion de apoyo.",
    image: "/noticias/boada-2024/cartel-maquetas-boada.jpeg",
    links: [
      { label: "Ver cartel", href: "/noticias/boada-2024/cartel-maquetas-boada.jpeg" },
      { label: "Abrir PDF", href: "/noticias/boada-2024/boada-agosto-2024.pdf" },
      { label: "Descargar DOCX", href: "/noticias/boada-2024/boada-2024.docx" },
    ],
  },
];