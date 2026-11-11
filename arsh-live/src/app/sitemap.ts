import type { MetadataRoute } from "next";
import { SITE } from "./site";
export default function sitemap(): MetadataRoute.Sitemap {
  const u = SITE.url(), now = new Date();
  return [{ url: u + "/", lastModified: now, priority: 1 }, { url: u + "/download", lastModified: now, priority: .8 }, { url: u + "/try", lastModified: now, priority: .6 }, { url: u + "/login", lastModified: now, priority: .5 }];
}
