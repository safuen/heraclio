import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import siteConfig from "./src/site.config";

export default defineConfig({
  site: siteConfig.url,
  base: process.env.GITHUB_ACTIONS ? siteConfig.repositoryPath : "/",
  output: "static",
  trailingSlash: "never",
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});