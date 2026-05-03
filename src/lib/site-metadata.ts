import type { Metadata } from "next";

const siteName = "AI Learning OS";
const siteUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

type CreatePageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: CreatePageMetadataOptions): Metadata {
  const url = path === "/" ? siteUrl : new URL(path, siteUrl).toString();

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url,
      siteName,
      locale: "en_MY",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "AI Learning OS tuition platform preview",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: ["/twitter-image"],
    },
  };
}
