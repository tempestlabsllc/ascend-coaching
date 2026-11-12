import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/coaching", "/results", "/shop", "/intake", "/book", "/privacy", "/terms", "/refunds"].map((p) => ({ url: `${site.url}${p}` }));
}
