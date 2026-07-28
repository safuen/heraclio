import siteConfig from "@/site.config";

export function GET() {
  const sitemapPath = `${siteConfig.repositoryPath === "/" ? "" : siteConfig.repositoryPath}/sitemap-index.xml`;
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${siteConfig.url}${sitemapPath}`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}