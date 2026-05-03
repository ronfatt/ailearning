import type { Metadata } from "next";
import { Geist_Mono, Inter, Sora } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

const bodySans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const displayHeading = Sora({
  variable: "--font-editorial-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI Learning OS | Smarter AI-powered tuition for Malaysia",
    template: "%s | AI Learning OS",
  },
  description:
    "AI-powered tuition platform for students, parents, tutors, and tuition centres with live classes, AI revision, homework tracking, and parent progress reports.",
  keywords: [
    "AI tuition platform",
    "online tuition Malaysia",
    "offline tuition management",
    "AI revision",
    "parent progress reports",
    "tuition centre software",
    "teacher-led tuition",
  ],
  applicationName: "AI Learning OS",
  authors: [{ name: "AI Learning OS" }],
  creator: "AI Learning OS",
  publisher: "AI Learning OS",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Learning OS | Smarter AI-powered tuition for Malaysia",
    description:
      "Live online and offline tuition with real teachers, AI revision, homework tracking, and clear parent progress reports.",
    url: siteUrl,
    siteName: "AI Learning OS",
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
    title: "AI Learning OS | Smarter AI-powered tuition for Malaysia",
    description:
      "Live classes, AI revision, parent reports, homework tracking, and tuition centre workflows in one learning platform.",
    images: ["/twitter-image"],
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodySans.variable} ${geistMono.variable} ${displayHeading.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
