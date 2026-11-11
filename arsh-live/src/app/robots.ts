import type { MetadataRoute } from "next";
import { SITE } from "./site";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: ["/", "/download", "/try", "/u/"], disallow: ["/dashboard", "/admin", "/api/", "/overlay/"] }], sitemap: `${SITE.url()}/sitemap.xml` };
}
