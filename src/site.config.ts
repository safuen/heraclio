const repositoryParts = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const owner = repositoryParts[0];
const repoName = repositoryParts[1];
const isUserPage = Boolean(owner && repoName && repoName.toLowerCase() === `${owner.toLowerCase()}.github.io`);
const repositoryPath = process.env.GITHUB_ACTIONS ? (isUserPage ? "/" : `/${repoName ?? "catalogo-heraclio"}`) : "/catalogo-heraclio";
const siteUrl = process.env.GITHUB_ACTIONS && owner ? `https://${owner}.github.io` : "https://usuario.github.io";

const siteConfig = {
  title: "Heraclio Rodríguez García | Maquetas de madera",
  description:
    "Catálogo digital de maquetas artesanales en madera inspiradas en iglesias, catedrales, conventos, ermitas y edificios históricos, con especial atención al patrimonio salmantino.",
  shortTitle: "Maquetas de madera",
  author: "Heraclio Rodríguez García",
  url: siteUrl,
  repositoryPath,
  locale: "es-ES",
  province: "Salamanca",
  social: {
    facebook: "https://www.facebook.com/heracliorg/",
    wixArchive: "https://safuen.wixsite.com/heraclio",
  },
} as const;

export default siteConfig;