import type { MetadataRoute } from "next";

const siteUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

const publicRoutes = [
  "",
  "/how-it-works",
  "/pricing",
  "/contact",
  "/book-class",
  "/signup",
  "/login",
  "/tutor-apply",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return publicRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/book-class" || path === "/pricing" ? 0.9 : 0.7,
  }));
}
