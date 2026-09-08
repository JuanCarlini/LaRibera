import type { MetadataRoute } from "next";
import { sitio } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: sitio, changeFrequency: "monthly", priority: 1 }];
}
