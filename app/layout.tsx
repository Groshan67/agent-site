import type { Metadata } from "next";
import { IBM_Plex_Mono, Press_Start_2P, Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm',
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: "swap",
});

const vazirmatn = Vazirmatn({
  weight: '200',
  subsets: ['arabic', 'latin'],
  variable: '--font-vazirmatn',
});


export const metadata: Metadata = {
  title: "Ghasem Roshan — Signal | AI & Open Source Radar",
  description:
    "Daily radar and analysis on the latest developments in AI and open-source software. Access a curated public prompt library and insights assisted by an autonomous agent.",
  keywords: [
    "AI",
    "Artificial Intelligence",
    "Open Source",
    "Machine Learning",
    "LLM",
    "Prompt Engineering",
    "Software Development",
    "Tech Radar",
    "Autonomous Agent",
    "Ghasem Roshan",
    "Signal",
    "Technology Trends",
    "Yahoo",
    "Chat",
    "Nostalgia",
  ],
  authors: [{ name: "Ghasem Roshan" }],
  creator: "Ghasem Roshan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourwebsite.com", // Replace with your actual URL
    title: "Ghasem Roshan — Signal | AI & Open Source Radar",
    description:
      "Stay ahead with daily insights into AI, open-source projects, and a growing public prompt library. Curated by Ghasem Roshan and an autonomous agent.",
    siteName: "Ghasem Roshan — Signal",
    // Add an Open Graph image URL here for social sharing
    // images: [{ url: 'https://yourwebsite.com/og-image.jpg', width: 1200, height: 630, alt: 'Signal by Ghasem Roshan' }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghasem Roshan — Signal | AI & Open Source Radar",
    description:
      "Daily radar on AI & open-source projects, plus a public prompt library. Curated in part by an autonomous agent.",
      creator: "@roshan_kasra", // Add your Twitter handle
     images: ['https://x.com/roshan_kasra/photo'], // Add a Twitter card image
  },
  // robots: {
  //   index: true,
  //   follow: true,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //     'max-video-preview': -1,
  //     'max-image-preview': 'large',
  //     'max-snippet': -1,
  //   },
  // },
};

export const yahooMessengerChatExport = [
  {
    "timestamp": "2007-10-27T14:32:01Z",
    "sender": "Ghasem Roshan",
    "message": "Hey, are you online?"
  },
  {
    "timestamp": "2007-10-27T14:32:15Z",
    "sender": "Friend",
    "message": "Yeah, what's up?"
  },
  {
    "timestamp": "2007-10-27T14:32:30Z",
    "sender": "Ghasem Roshan",
    "message": "Check out this new open-source project I found, it's called Linux."
  },
  {
    "timestamp": "2007-10-27T14:32:55Z",
    "sender": "Friend",
    "message": "Linux? Isn't that just for servers?"
  },
  {
    "timestamp": "2007-10-27T14:33:10Z",
    "sender": "Ghasem Roshan",
    "message": "Not anymore, it's getting better for desktops too. Pretty cool stuff."
  },
  {
    "timestamp": "2007-10-27T14:33:22Z",
    "sender": "Friend",
    "message": "Hmm, maybe I'll check it out later. Got to go, see ya!"
  },
  {
    "timestamp": "2007-10-27T14:33:30Z",
    "sender": "Ghasem Roshan",
    "message": "Sure, later!"
  }
];


export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ibmPlexMono.variable} ${pressStart2P.variable} ${vazirmatn.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
