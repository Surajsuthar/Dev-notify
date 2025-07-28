import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { PostHogProvider } from "@/components/providers/posthog-provider";

export const metadata: Metadata = {
  title: "DevNotify - Track GitHub Stars & Issues for Open Source Contributions",
  description: "Open source platform to track your starred GitHub repositories and issues. Stay updated on project changes and find contribution opportunities easily.",
  
  keywords: [
    "GitHub tracker",
    "open source contributions", 
    "repository monitoring",
    "issue tracker",
    "developer tools",
    "GitHub stars",
    "project tracking",
    "contribution finder"
  ],
  
  authors: [{ name: "Suraj" }],
  creator: "Suraj",
  publisher: "Suraj",
  
  robots: {
    index: true,       
    follow: true,     
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,      
      "max-image-preview": "large",
      "max-snippet": -1,      
    },
  },
  
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devnotify.in/",
    siteName: "DevNotify",
    title: "DevNotify - Track GitHub Stars & Issues for Open Source Contributions",
    description: "Open source platform to track your starred GitHub repositories and issues. Stay updated on project changes and find contribution opportunities easily.",
    images: [
      {
        url: "/landing.png",  
        width: 1200,      
        height: 630,
        alt: "DevNotify - GitHub Repository & Issue Tracker",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image", 
    title: "DevNotify - Track GitHub Stars & Issues",
    description: "Open source platform to track your starred GitHub repositories and issues for better contribution tracking.",
    images: ["/landing.png"],
    creator: "@Suraj_0067",  
  },
  
  metadataBase: new URL("https://devnotify.in/"),

  alternates: {
    canonical: "/",
  },
  
  category: "Developer Tools",
  classification: "Open Source Software",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />         
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />       
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <PostHogProvider>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
          <Toaster />
        </PostHogProvider>
      </body>
    </html>
  );
}